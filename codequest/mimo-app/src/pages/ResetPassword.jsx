// src/pages/ResetPassword.jsx — define la nueva contraseña
// Se llega aquí desde el enlace del email de recuperación de Supabase,
// que abre la app con una sesión temporal de recuperación.
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import '../components/common/ByteMascot.css'
import './Login.css'

export default function ResetPassword() {
  const { updatePassword, user } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    const err = await updatePassword(password)
    setLoading(false)
    if (err) {
      setError(
        err.message?.includes('should be different')
          ? 'La nueva contraseña debe ser distinta a la anterior.'
          : err.message || 'No se pudo actualizar la contraseña.'
      )
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <main className="container login__container">
        <article className="login__confirm rise">
          <ByteMascot size={96} mood="celebrate" style={{ margin: '0 auto 12px' }} />
          <p className="login__confirm-title">Contraseña actualizada</p>
          <p className="faint login__confirm-note">
            Ya puedes seguir explorando con tu nueva contraseña.
          </p>
          <Button variant="primary" size="lg" full onClick={() => navigate('/')}>
            Ir a CodeQuest
          </Button>
        </article>
      </main>
    )
  }

  // Sin sesión de recuperación no hay a quién cambiarle la contraseña
  if (!user) {
    return (
      <main className="container login__container">
        <article className="login__confirm rise">
          <p className="login__confirm-icon">🔑</p>
          <p className="login__confirm-title">Enlace no válido o caducado</p>
          <p className="faint login__confirm-note">
            Pide un nuevo enlace desde “¿Olvidaste tu contraseña?” en la pantalla de entrada.
          </p>
          <Link to="/login">
            <Button variant="ghost">Ir a Entrar</Button>
          </Link>
        </article>
      </main>
    )
  }

  return (
    <main className="container login__container">
      <article className="login__card rise">
        <div className="login__head">
          <ByteMascot size={56} mood="default" />
          <div>
            <p className="login__brand">CodeQuest</p>
            <h1 className="login__title">Nueva contraseña</h1>
          </div>
        </div>
        <p className="faint login__intro">
          Define la nueva contraseña de tu cuenta{user?.email ? <> <strong>{user.email}</strong></> : null}.
        </p>

        <form onSubmit={handleSubmit} className="login__form">
          <div>
            <label className="faint login__label" htmlFor="new-password">
              Nueva contraseña
            </label>
            <input
              id="new-password"
              className="login__input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div>
            <label className="faint login__label" htmlFor="confirm-password">
              Repite la contraseña
            </label>
            <input
              id="confirm-password"
              className="login__input"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Igual que la anterior"
              minLength={6}
            />
          </div>

          {error && <p className="login__error">{error}</p>}

          <Button variant="primary" size="lg" full type="submit" disabled={loading}>
            {loading ? 'Un momento…' : 'Guardar contraseña'}
          </Button>
        </form>
      </article>
    </main>
  )
}
