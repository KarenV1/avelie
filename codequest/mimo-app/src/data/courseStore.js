// src/data/courseStore.js
// Fuente de verdad de los cursos en runtime.
// - Arranca con los JSON locales (fallback offline / Supabase sin migrar).
// - Carga los cursos publicados desde Supabase (courses → modules →
//   lessons → content_blocks) y los mapea EXACTAMENTE a la forma que las
//   pantallas ya consumen (units / items / steps), pisando al local por id.
// - Cachea el resultado mapeado en localStorage para abrir sin red.
// No importa contextos React: expone subscribe/getCourses estilo
// useSyncExternalStore (App.jsx conecta el re-render).
import { supabase } from '../lib/supabase.js'
import sqlBasico from './courses/sql-basico.json'
import sqlOracle from './courses/sql-oracle.json'

const CACHE_KEY = 'cq_remote_courses_v1'
const localCourses = [sqlBasico, sqlOracle]

// ── Mapeo Supabase → forma de la app ──────────────────────────────────────────

// content_block → step de StepRenderer
function mapBlockToStep(block) {
  const p = block.payload ?? {}
  switch (block.kind) {
    case 'texto':
      return { type: 'info', title: p.title, body: p.body }
    case 'ejemplo_sql':
    case 'ejemplo_codigo': // mismo contrato; kind propio por semántica en la base
      return {
        type: 'example',
        title: p.title ?? null,
        code: p.code,
        caption: p.caption ?? null,
        result: p.result ?? null,
      }
    case 'diagrama':
      return {
        type: 'diagram',
        title: p.title ?? null,
        component: p.component,
        props: p.props ?? {},
        caption: p.caption ?? null,
      }
    case 'quiz':
      return {
        type: p.variant ?? 'multiple_choice',
        prompt: p.prompt,
        code: p.code ?? null,
        table: p.table ?? null,
        options: p.options,
        correctIndex: p.correctIndex,
        feedback: p.feedback,
      }
    case 'resumen':
      return { type: 'summary', title: p.title, points: p.points }
    case 'laboratorio':
      // Mismo contrato que ejemplo_sql: code = comandos de terminal
      // (Windows y Linux), caption = qué observar, result opcional.
      // Kind propio en la base para darle UI dedicada más adelante.
      return {
        type: 'example',
        title: p.title ? `🧪 ${p.title}` : '🧪 Laboratorio',
        code: p.code,
        caption: p.caption ?? null,
        result: p.result ?? null,
      }
    case 'nota_etica':
      return {
        type: 'info',
        title: p.title ? `⚖️ ${p.title}` : '⚖️ Nota ética',
        body: p.body,
      }
    default:
      return null // 'ejercicio' se mapea a nivel de lesson (práctica)
  }
}

// lesson → item de la unidad ('leccion'/'examen' → block, 'practica' → practice)
function mapLesson(lesson) {
  const blocks = [...(lesson.content_blocks ?? [])].sort((a, b) => a.sort_order - b.sort_order)

  if (lesson.kind === 'practica') {
    const ejercicio = blocks.find((b) => b.kind === 'ejercicio')?.payload ?? {}
    return { type: 'practice', id: lesson.slug, title: lesson.title, xp: lesson.xp, ...ejercicio }
  }

  return {
    type: 'block',
    id: lesson.slug,
    title: lesson.title,
    kind: lesson.kind, // 'leccion' | 'examen' (disponible para UI futura)
    xp: lesson.xp,
    steps: blocks.map(mapBlockToStep).filter(Boolean),
  }
}

function mapCourse(course) {
  const modules = [...(course.modules ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return {
    id: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    icon: course.icon,
    accent: course.accent,
    language: course.language,
    units: modules.map((m) => ({
      id: m.slug,
      title: m.title,
      summary: m.summary,
      items: [...(m.lessons ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(mapLesson),
    })),
  }
}

// ── Estado del store ──────────────────────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed?.courses) ? parsed.courses : []
  } catch {
    return []
  }
}

let remoteCourses = readCache()
let mergedCourses = merge()
const listeners = new Set()

// El remoto pisa al local por id; los locales sin versión remota siguen visibles
function merge() {
  const byId = new Map(localCourses.map((c) => [c.id, c]))
  for (const course of remoteCourses) byId.set(course.id, course)
  return [...byId.values()]
}

function notify() {
  mergedCourses = merge()
  for (const fn of listeners) fn()
}

export function subscribeCourses(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Snapshot estable (misma referencia hasta el próximo notify) — apto para
// useSyncExternalStore sin bucles de render.
export function getCourses() {
  return mergedCourses
}

// ── Carga remota ──────────────────────────────────────────────────────────────

let loading = null

export function loadRemoteCourses() {
  loading ??= (async () => {
    // Desde la migración 007 el RLS deja leer la metadata de TODOS los
    // cursos (para que el catálogo muestre los "próximamente"); filtrar
    // los publicados es responsabilidad de cada query. Aquí solo queremos
    // cursos con contenido jugable:
    const { data, error } = await supabase
      .from('courses')
      .select(
        `slug, title, subtitle, description, icon, accent, language, sort_order,
         modules ( slug, title, summary, sort_order, is_published,
           lessons ( slug, title, kind, xp, sort_order,
             content_blocks ( sort_order, kind, payload ) ) )`,
      )
      .eq('is_published', true)

    if (error) {
      console.warn('No se pudieron cargar cursos desde Supabase:', error.message)
      return
    }
    if (!data || data.length === 0) return // aún sin contenido publicado

    remoteCourses = data
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapCourse)

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ fetchedAt: new Date().toISOString(), courses: remoteCourses }),
      )
    } catch {
      // cache llena o bloqueada: seguimos solo en memoria
    }

    notify()
  })().finally(() => {
    loading = null
  })
  return loading
}
