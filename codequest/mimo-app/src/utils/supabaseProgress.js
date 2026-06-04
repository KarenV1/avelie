// src/utils/supabaseProgress.js
// Operaciones async de progreso contra Supabase.
// No importa contextos React — solo supabase client y datos de cursos.
import { supabase } from '../lib/supabase.js'
import { getCourse } from '../data/courses/index.js'

// Devuelve { unitId, itemType } buscando en el JSON de cursos.
// Así no necesitamos cambiar las firmas de completeItem en BlockScreen/PracticeScreen.
function findMeta(courseId, itemId) {
  const course = getCourse(courseId)
  if (!course) return { unitId: null, itemType: null }
  for (const unit of course.units) {
    const item = unit.items.find((i) => i.id === itemId)
    if (item) return { unitId: unit.id, itemType: item.type }
  }
  return { unitId: null, itemType: null }
}

// ── Escritura ─────────────────────────────────────────────────────────────────
// Upsert de un item completado. ignoreDuplicates: true evita sobreescribir
// completed_at si el item ya estaba registrado desde otro dispositivo.
export async function syncCompleteItem(userId, courseId, itemId, xp) {
  const { unitId, itemType } = findMeta(courseId, itemId)

  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id:      userId,
      course_id:    courseId,
      unit_id:      unitId,
      item_id:      itemId,
      item_type:    itemType,
      xp_earned:    xp,
      completed:    true,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict:       'user_id,course_id,item_id',
      ignoreDuplicates: true, // si ya existe, no sobreescribe — preserva completed_at original
    },
  )

  if (error) throw error
}

// ── Lectura ───────────────────────────────────────────────────────────────────
// Carga todo el progreso del usuario desde Supabase y lo convierte
// al mismo formato que usa ProgressContext localmente.
export async function loadUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('course_id, item_id, xp_earned')
    .eq('user_id', userId)

  if (error) {
    console.warn('Error cargando progreso desde Supabase:', error.message)
    return null
  }
  if (!data || data.length === 0) return { completed: {}, xp: 0 }

  const completed = {}
  let totalXP = 0

  for (const row of data) {
    if (!completed[row.course_id]) completed[row.course_id] = {}
    completed[row.course_id][row.item_id] = true
    totalXP += row.xp_earned ?? 0
  }

  return { completed, xp: totalXP }
}

// ── Merge ─────────────────────────────────────────────────────────────────────
// Función pura: combina progreso local con progreso de Supabase.
// - completed: unión de ambos (si está en cualquiera, se considera completado)
// - xp:        el mayor (preserva items completados sin sincronizar)
// - streak:    se mantiene el local (no sincronizado en 6D)
// - errors:    se mantienen los locales (6E lo gestiona)
export function mergeProgress(local, remote) {
  const allCourseIds = new Set([
    ...Object.keys(local.completed  || {}),
    ...Object.keys(remote.completed || {}),
  ])

  const mergedCompleted = {}
  for (const courseId of allCourseIds) {
    mergedCompleted[courseId] = {
      ...(local.completed[courseId]  || {}),
      ...(remote.completed[courseId] || {}),
    }
  }

  return {
    ...local,
    xp:        Math.max(local.xp || 0, remote.xp || 0),
    completed: mergedCompleted,
    // streak y errors no se tocan
  }
}
