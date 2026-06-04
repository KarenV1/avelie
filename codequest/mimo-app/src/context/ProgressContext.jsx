// src/context/ProgressContext.jsx
// Estado global de progreso. Modo dual: localStorage siempre activo;
// Supabase activo cuando hay sesión (fire-and-forget en escrituras,
// merge al detectar login).
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  clearProgress,
  bumpStreak,
} from '../utils/storage.js'
import {
  syncCompleteItem,
  loadUserProgress,
  mergeProgress,
} from '../utils/supabaseProgress.js'
import { useAuth } from './AuthContext.jsx'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgress())
  const { user, loading: authLoading } = useAuth()

  // Ref para detectar el evento de login (null → objeto)
  // sin disparar la carga en cada re-render
  const prevUserIdRef = useRef(null)

  // ── Persistir localmente en cada cambio ─────────────────────────────────
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // ── Cargar desde Supabase al iniciar sesión ──────────────────────────────
  // Solo se dispara una vez por login, no en cada render.
  // El merge preserva el progreso local y suma el progreso remoto.
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      prevUserIdRef.current = null
      return
    }
    if (user.id === prevUserIdRef.current) return // ya cargamos este usuario

    prevUserIdRef.current = user.id

    loadUserProgress(user.id)
      .then((remote) => {
        if (!remote) return
        setProgress((prev) => mergeProgress(prev, remote))
      })
      .catch((err) => console.warn('No se pudo cargar progreso de Supabase:', err))
  }, [user, authLoading])

  // ── Marcar item completado ───────────────────────────────────────────────
  // Actualiza local siempre. Si hay sesión, también escribe a Supabase
  // en modo fire-and-forget (no bloquea la UI).
  function completeItem(courseId, itemId, xp = 0) {
    const alreadyDone = Boolean(progress.completed[courseId]?.[itemId])

    setProgress((prev) => {
      const courseDone = prev.completed[courseId] || {}
      if (courseDone[itemId]) return prev // no duplicar XP

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

    // Sync a Supabase solo si es una compleción nueva y hay sesión activa
    if (user && !alreadyDone) {
      syncCompleteItem(user.id, courseId, itemId, xp)
        .catch((err) => console.warn('Sync Supabase fallido:', err))
    }
  }

  function isCompleted(courseId, itemId) {
    return Boolean(progress.completed[courseId]?.[itemId])
  }

  function countCompleted(courseId, itemIds) {
    const done = progress.completed[courseId] || {}
    return itemIds.filter((id) => done[id]).length
  }

  // Persiste el conteo de errores de un bloque (para repaso posterior)
  function saveErrors(courseId, blockId, count) {
    if (count === 0) return
    setProgress((prev) => ({
      ...prev,
      errors: {
        ...(prev.errors || {}),
        [courseId]: {
          ...((prev.errors || {})[courseId] || {}),
          [blockId]: { count, lastWrongAt: new Date().toISOString() },
        },
      },
    }))
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
      saveErrors,
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
