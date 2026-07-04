// src/pages/Login.jsx — entrar / crear cuenta / recuperar contraseña
// El acceso a CodeQuest requiere cuenta: App muestra esta pantalla a todo visitante sin sesión.
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import PasswordInput from '../components/common/PasswordInput.jsx'
import '../components/common/ByteMascot.css'
import './Login.css'

// Traduce mensajes de error de Supabase a español legible
function friendlyError(msg) {
  if (!msg) return 'Ocurrió un error inesperado.'
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (msg.includes('Email not confirmed'))       return 'Confirma tu email antes de entrar.'
  if (msg.includes('User already registered'))   return 'Ya existe una cuenta con ese email. Entra con tu contraseña o recupérala si la olvidaste.'
  if (msg.includes('Password should be'))        return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('For security purposes'))     return 'Demasiados intentos seguidos. Espera un momento y vuelve a intentar.'
  if (msg.includes('Unable to validate'))        return 'Supabase no está configurado todavía.'
  return msg
}

const TITLES = { login: 'Entrar', register: 'Crear cuenta', reset: 'Recuperar contraseña' }
const INTROS = {
  login:    'Tu progreso se sincronizará entre dispositivos.',
  register: 'Crea una cuenta para guardar tu progreso en la nube.',
  reset:    'Te enviaremos un enlace para definir una nueva contraseña.',
}

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // 'login' | 'register' | 'reset' — Welcome puede abrir directo en registro
  const [mode, setMode]         = useState(location.state?.mode === 'register' ? 'register' : 'login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(null) // null | 'registered' | 'reset'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let err = null
    if (mode === 'login')         err = await signIn(email, password)
    else if (mode === 'register') err = await signUp(email, password)
    else                          err = await resetPassword(email)

    setLoading(false)

    if (err) {
      setError(friendlyError(err.message))
      return
    }

    if (mode === 'register')   setSent('registered')
    else if (mode === 'reset') setSent('reset')
    else                       navigate('/')
  }

  function switchMode(next) {
    setMode(next)
    setError(null)
    setSent(null)
  }

  if (sent) {
    return (
      <main className="container login__container">
        <article className="login__confirm rise">
          <p className="login__confirm-icon">✉️</p>
          <p className="login__confirm-title">Revisa tu correo</p>
          <p className="faint login__confirm-note">
            {sent === 'registered' ? (
              <>Te enviamos un link de confirmación a <strong>{email}</strong>.
              Haz clic en él para activar tu cuenta y entrar al mundo.</>
            ) : (
              <>Te enviamos un enlace a <strong>{email}</strong> para
              definir tu nueva contraseña.</>
            )}
          </p>
          <Button variant="ghost" onClick={() => switchMode('login')}>
            {sent === 'registered' ? 'Ya confirmé — Entrar' : 'Volver a Entrar'}
          </Button>
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
            <h1 className="login__title">{TITLES[mode]}</h1>
          </div>
        </div>
        <p className="faint login__intro">{INTROS[mode]}</p>

        <form onSubmit={handleSubmit} className="login__form">
          <div>
            <label className="faint login__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="login__input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="faint login__label" htmlFor="login-password">
                Contraseña
              </label>
              <PasswordInput
                id="login-password"
                className="login__input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
          )}

          {error && (
            <p className="login__error">
              {error}
            </p>
          )}

          <Button variant="primary" size="lg" full type="submit" disabled={loading}>
            {loading ? 'Un momento…'
              : mode === 'login' ? 'Entrar'
              : mode === 'register' ? 'Crear cuenta'
              : 'Enviar enlace'}
          </Button>
        </form>

        {mode === 'login' && (
          <p className="faint login__switch">
            <button className="login__switch-btn" onClick={() => switchMode('reset')}>
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p className="faint login__switch">
          {mode === 'login' ? (
            <>¿No tienes cuenta?{' '}
              <button className="login__switch-btn" onClick={() => switchMode('register')}>
                Regístrate
              </button>
            </>
          ) : (
            <>¿Ya tienes cuenta?{' '}
              <button className="login__switch-btn" onClick={() => switchMode('login')}>
                Entrar
              </button>
            </>
          )}
        </p>

        <p className="faint login__skip">
          <Link to="/">‹ Volver al inicio</Link>
        </p>
      </article>
    </main>
  )
}
