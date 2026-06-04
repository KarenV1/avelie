// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/common/Button.jsx'

// Traduce mensajes de error de Supabase a español legible
function friendlyError(msg) {
  if (!msg) return 'Ocurrió un error inesperado.'
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (msg.includes('Email not confirmed'))       return 'Confirma tu email antes de entrar.'
  if (msg.includes('User already registered'))   return 'Ya existe una cuenta con ese email.'
  if (msg.includes('Password should be'))        return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate'))        return 'Supabase no está configurado todavía.'
  return msg
}

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]       = useState('login') // 'login' | 'register'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const err = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (err) {
      setError(friendlyError(err.message))
      return
    }

    if (mode === 'register') {
      setRegistered(true)
    } else {
      navigate('/')
    }
  }

  function toggleMode() {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError(null)
    setRegistered(false)
  }

  if (registered) {
    return (
      <main className="container" style={{ maxWidth: 420 }}>
        <article className="learn__card rise" style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>✉️</p>
          <p className="quiz__prompt">Revisa tu correo</p>
          <p className="faint" style={{ marginTop: 8, marginBottom: 24 }}>
            Te enviamos un link de confirmación a <strong>{email}</strong>.
            Haz clic en él para activar tu cuenta.
          </p>
          <Button variant="ghost" onClick={() => { setMode('login'); setRegistered(false) }}>
            Ya confirmé — Entrar
          </Button>
        </article>
      </main>
    )
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <article className="learn__card rise" style={{ padding: 28 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>
          {mode === 'login' ? 'Entrar a CodeQuest' : 'Crear cuenta'}
        </h1>
        <p className="faint" style={{ marginBottom: 24, fontSize: '0.9rem' }}>
          {mode === 'login'
            ? 'Tu progreso se sincronizará entre dispositivos.'
            : 'Crea una cuenta para guardar tu progreso en la nube.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="faint" style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label className="faint" style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p className="feedback feedback--err" style={{ margin: 0, fontSize: '0.9rem' }}>
              {error}
            </p>
          )}

          <Button variant="primary" size="lg" full type="submit" disabled={loading}>
            {loading ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="faint" style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={toggleMode}
            style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: 'inherit' }}
          >
            {mode === 'login' ? 'Regístrate' : 'Entrar'}
          </button>
        </p>

        <p className="faint" style={{ textAlign: 'center', marginTop: 12, fontSize: '0.82rem' }}>
          <Link to="/" style={{ color: 'var(--text-faint)' }}>← Continuar sin cuenta</Link>
        </p>
      </article>
    </main>
  )
}
