// src/data/catalogStore.js
// Catálogo con itinerario: rutas de aprendizaje (tracks), sus cursos
// (track_courses) y el encadenado entre cursos (course_prerequisites).
// Mismo patrón que courseStore.js: carga desde Supabase, caché en
// localStorage y snapshot estable para useSyncExternalStore.
// Si las tablas aún no existen o no hay red, el catálogo queda vacío
// y la app sigue funcionando como hasta ahora (tarjetas planas).
import { supabase } from '../lib/supabase.js'

const CACHE_KEY = 'cq_catalog_v1'

// Forma del snapshot:
// {
//   tracks: [{ id: slug, title, description, icon, accent,
//              courses: [{ id: slug, title, subtitle, icon, accent,
//                          categoria, nivel }] }],
//   prerequisites: { [courseSlug]: [prerequisiteSlug, …] },
// }
const EMPTY = { tracks: [], prerequisites: {} }

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed?.tracks) ? { tracks: parsed.tracks, prerequisites: parsed.prerequisites ?? {} } : EMPTY
  } catch {
    return EMPTY
  }
}

let catalog = readCache()
const listeners = new Set()

function notify() {
  for (const fn of listeners) fn()
}

export function subscribeCatalog(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getCatalog() {
  return catalog
}

function mapTrack(track) {
  return {
    id: track.slug,
    title: track.title,
    description: track.description,
    icon: track.icon,
    accent: track.accent,
    courses: [...(track.track_courses ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((tc) => tc.courses)
      .filter(Boolean)
      .map((c) => ({
        id: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        icon: c.icon,
        accent: c.accent,
        categoria: c.categoria,
        nivel: c.nivel,
      })),
  }
}

let loading = null

export function loadCatalog() {
  loading ??= (async () => {
    const [tracksRes, prereqRes] = await Promise.all([
      supabase
        .from('tracks')
        .select(
          `slug, title, description, icon, accent, sort_order,
           track_courses ( sort_order,
             courses ( slug, title, subtitle, icon, accent, categoria, nivel ) )`,
        ),
      supabase
        .from('course_prerequisites')
        .select(
          `course:courses!course_prerequisites_course_id_fkey ( slug ),
           prerequisite:courses!course_prerequisites_prerequisite_course_id_fkey ( slug )`,
        ),
    ])

    if (tracksRes.error) {
      console.warn('No se pudo cargar el catálogo desde Supabase:', tracksRes.error.message)
      return
    }

    const tracks = (tracksRes.data ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapTrack)

    const prerequisites = {}
    if (!prereqRes.error) {
      for (const row of prereqRes.data ?? []) {
        const curso = row.course?.slug
        const previo = row.prerequisite?.slug
        if (!curso || !previo) continue
        ;(prerequisites[curso] ??= []).push(previo)
      }
    }

    catalog = { tracks, prerequisites }

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ fetchedAt: new Date().toISOString(), ...catalog }),
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
