// src/context/ProgressContext.jsx
// Estado global de progreso. Cualquier pantalla puede leer XP / racha / completados
// y marcar items como completados. Persiste automaticamente en localStorage.

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  clearProgress,
  bumpStreak,
} from '../utils/storage.js'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgress())

  // Persistir en cada cambio
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // Marca un item (bloque o practica) como completado. Solo otorga XP la primera vez.
  function completeItem(courseId, itemId, xp = 0) {
    setProgress((prev) => {
      const courseDone = prev.completed[courseId] || {}
      if (courseDone[itemId]) return prev // ya estaba completo: no duplicar XP

      return {
        ...prev,
        xp: prev.xp + xp,
        streak: bumpStreak(prev.streak),
        completed: {
          ...prev.completed,
          [courseId]: { ...courseDone, [itemId]: true },
        },
      }
    })
  }

  function isCompleted(courseId, itemId) {
    return Boolean(progress.completed[courseId]?.[itemId])
  }

  // Cuantos items de una lista estan completados (para barras de progreso)
  function countCompleted(courseId, itemIds) {
    const done = progress.completed[courseId] || {}
    return itemIds.filter((id) => done[id]).length
  }

  function resetProgress() {
    clearProgress()
    setProgress(loadProgress())
  }

  const value = useMemo(
    () => ({
      progress,
      completeItem,
      isCompleted,
      countCompleted,
      resetProgress,
    }),
    [progress],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
