// src/pages/Settings.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/common/Button.jsx'
import { IconFlame, IconStar } from '../components/common/icons.jsx'
import './Settings.css'

export default function Settings() {
  const { resetProgress, progress } = useProgress()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [resetState, setResetState] = useState(null) // null | 'confirming' | 'done'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function handleReset() {
    resetProgress()
    setResetState('done')
    setTimeout(() => setResetState(null), 2500)
  }

  return (
    <main className="container">
      <header className="page-head rise">
        <p className="section-title">Configuración</p>
        <h1 className="page-head__title">Ajustes</h1>
      </header>

      {user ? (
        <section className="settings__card rise">
          <h3>Cuenta</h3>
          <p className="muted" style={{ marginBottom: 14 }}>{user.email}</p>
          <Button variant="ghost" onClick={handleSignOut}>Cerrar sesión</Button>
        </section>
      ) : (
        <section className="settings__card rise">
          <h3>Cuenta</h3>
          <p className="muted" style={{ marginBottom: 14 }}>
            Inicia sesión para sincronizar tu progreso entre dispositivos.
          </p>
          <Button variant="primary" onClick={() => navigate('/login')}>Entrar / Registrarse</Button>
        </section>
      )}

      <section className="settings__card rise" style={{ animationDelay: '40ms' }}>
        <h3>Datos locales</h3>
        <p className="muted">
          {user
            ? 'Tu progreso también se guarda localmente en este navegador.'
            : 'Tu progreso se guarda únicamente en este navegador (localStorage). No se envía a ningún servidor.'}
        </p>
        <div className="settings__metrics">
          <span style={{ color: 'var(--gold)' }}>
            <IconStar style={{ width: '1em', height: '1em', verticalAlign: '-0.1em' }} /> {progress.xp} XP
          </span>
          <span style={{ color: 'var(--gold)' }}>
            <IconFlame style={{ width: '1em', height: '1em', verticalAlign: '-0.1em' }} /> {progress.streak.count} de racha
          </span>
        </div>
      </section>

      <section className="settings__card settings__card--danger rise" style={{ animationDelay: '60ms' }}>
        <h3>Reiniciar progreso</h3>
        <p className="muted">
          Borra toda tu XP, racha y lecciones completadas. Esta acción no se puede deshacer.
        </p>

        {resetState === null && (
          <Button variant="danger" onClick={() => setResetState('confirming')}>
            Reiniciar todo
          </Button>
        )}

        {resetState === 'confirming' && (
          <div className="settings__confirm">
            <p>¿Seguro? Se perderá todo tu progreso.</p>
            <div className="row">
              <Button variant="danger" onClick={handleReset}>Sí, borrar</Button>
              <Button variant="ghost" onClick={() => setResetState(null)}>Cancelar</Button>
            </div>
          </div>
        )}

        {resetState === 'done' && <p className="settings__done">✓ Progreso reiniciado.</p>}
      </section>

      <p className="faint" style={{ textAlign: 'center', marginTop: 24, fontSize: '0.82rem' }}>
        CodeQuest v0.1 · Fase 1 · local-first
      </p>
    </main>
  )
}
