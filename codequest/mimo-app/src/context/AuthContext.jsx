// src/context/AuthContext.jsx
// Estado de sesión Supabase. Provee: session, user, signIn, signUp, signOut.
// session === undefined  →  cargando (aún no sabemos si hay sesión)
// session === null       →  sin sesión (usuario no autenticado)
// session === objeto     →  sesión activa
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Leer sesión actual al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    // Escuchar cambios: login, logout, refresco de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ?? null
  }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return error
    // Anti-enumeración: con un email ya registrado Supabase responde "éxito"
    // con identities vacío y NO envía ningún correo. Sin esta detección la UI
    // mostraría "revisa tu correo" a alguien que ya tiene cuenta.
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return { message: 'User already registered' }
    }
    return null
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Envía el email de restablecimiento; el enlace regresa a /restablecer
  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer`,
    })
    return error ?? null
  }

  // Define la nueva contraseña (requiere la sesión de recuperación del enlace)
  async function updatePassword(password) {
    const { error } = await supabase.auth.updateUser({ password })
    return error ?? null
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading: session === undefined,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
