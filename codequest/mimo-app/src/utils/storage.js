// src/utils/storage.js
// Capa fina sobre localStorage. Local-first: todo el progreso vive en el navegador.
// Centralizado aqui para que sea facil migrar a IndexedDB o a un backend mas adelante.

const KEY = 'codequest.progress.v1'

export const defaultProgress = {
  xp: 0,
  streak: { count: 0, lastActiveDate: null }, // lastActiveDate en formato YYYY-MM-DD
  completed: {}, // { [courseId]: { [itemId]: true } }
  errors: {},    // { [courseId]: { [blockId]: count } } — errores acumulados por bloque
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaultProgress }
    const parsed = JSON.parse(raw)
    // Merge defensivo por si la forma del objeto cambia entre versiones
    return {
      ...defaultProgress,
      ...parsed,
      streak: { ...defaultProgress.streak, ...(parsed.streak || {}) },
      completed: parsed.completed || {},
      errors: parsed.errors || {},
    }
  } catch (err) {
    console.warn('No se pudo leer el progreso, se reinicia.', err)
    return { ...defaultProgress }
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch (err) {
    console.warn('No se pudo guardar el progreso.', err)
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch (err) {
    console.warn('No se pudo borrar el progreso.', err)
  }
}

// ---- Utilidades de fecha para la racha ----

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(aISO, bISO) {
  const a = new Date(aISO + 'T00:00:00')
  const b = new Date(bISO + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

// Devuelve el nuevo objeto streak segun la fecha de hoy
export function bumpStreak(streak) {
  const today = todayISO()
  if (!streak.lastActiveDate) {
    return { count: 1, lastActiveDate: today }
  }
  const diff = daysBetween(streak.lastActiveDate, today)
  if (diff === 0) return streak // ya cuenta hoy
  if (diff === 1) return { count: streak.count + 1, lastActiveDate: today }
  return { count: 1, lastActiveDate: today } // se rompio la racha
}
