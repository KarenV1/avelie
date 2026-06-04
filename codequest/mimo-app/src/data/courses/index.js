// src/data/courses/index.js
// Registro central de cursos.
// Para AGREGAR UN CURSO NUEVO (Java, Python, APIs REST, Testing, Oracle):
//   1. Crea un archivo JSON en esta carpeta siguiendo el mismo modelo que sql-basico.json
//   2. Impórtalo aquí y añádelo al array `courses`.
// No hay que tocar ninguna pantalla: todas leen desde este registro.

import sqlBasico from './sql-basico.json'
// import javaBasico from './java-basico.json'  // <-- Fase 2

export const courses = [
  sqlBasico,
  // javaBasico,
]

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) || null
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
