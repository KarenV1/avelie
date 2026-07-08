// src/data/courses/index.js
// Registro central de cursos — misma API de siempre (courses, getCourse,
// getUnit, getItem, unitItemIds), pero ahora lee del courseStore:
// JSON locales como fallback + contenido real desde Supabase en runtime.
// Para AGREGAR UN CURSO NUEVO ya no se toca el frontend: se insertan sus
// filas en Supabase (courses → modules → lessons → content_blocks) con un
// seed como supabase/migrations/010_seed_sql_oracle_m01.sql.
import { getCourses, subscribeCourses } from '../courseStore.js'

// Binding vivo: se reasigna cuando llega contenido remoto. Las pantallas
// re-renderizan vía el useSyncExternalStore de App.jsx y releen este valor.
export let courses = getCourses()
subscribeCourses(() => {
  courses = getCourses()
})

export function getCourse(courseId) {
  return getCourses().find((c) => c.id === courseId) || null
}

export function getUnit(courseId, unitId) {
  const course = getCourse(courseId)
  return course ? course.units.find((u) => u.id === unitId) || null : null
}

export function getItem(courseId, unitId, itemId) {
  const unit = getUnit(courseId, unitId)
  return unit ? unit.items.find((i) => i.id === itemId) || null : null
}

// IDs de todos los items de una unidad (para calcular progreso)
export function unitItemIds(unit) {
  return unit.items.map((i) => i.id)
}
