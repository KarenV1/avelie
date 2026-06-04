// src/pages/Settings.jsx
import { useState } from 'react'
import { useProgress } from '../context/ProgressContext.jsx'
import Button from '../components/common/Button.jsx'
import './Settings.css'

export default function Settings() {
  const { resetProgress, progress } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  function handleReset() {
    resetProgress()
    setConfirming(false)
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  return (
    <main className="container">
      <header className="rise" style={{ padding: '18px 0' }}>
        <p className="section-title">Configuración</p>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: 6 }}>Ajustes</h1>
      </header>

      <section className="settings__card rise">
        <h3>Datos locales</h3>
        <p className="muted">
          Tu progreso se guarda únicamente en este navegador (localStorage). No se envía a ningún
          servidor.
        </p>
        <div className="settings__metrics">
          <span>⭐ {progress.xp} XP</span>
          <span>🔥 {progress.streak.count} de racha</span>
        </div>
      </section>

      <section className="settings__card settings__card--danger rise" style={{ animationDelay: '60ms' }}>
        <h3>Reiniciar progreso</h3>
        <p className="muted">
          Borra toda tu XP, racha y lecciones completadas. Esta acción no se puede deshacer.
        </p>

        {!confirming && !done && (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Reiniciar todo
          </Button>
        )}

        {confirming && (
          <div className="settings__confirm">
            <p>¿Seguro? Se perderá todo tu progreso.</p>
            <div className="row">
              <Button variant="danger" onClick={handleReset}>Sí, borrar</Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {done && <p className="settings__done">✓ Progreso reiniciado.</p>}
      </section>

      <p className="faint" style={{ textAlign: 'center', marginTop: 24, fontSize: '0.82rem' }}>
        CodeQuest v0.1 · Fase 1 · local-first
      </p>
    </main>
  )
}
