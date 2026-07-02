// src/pages/MistakesReview.jsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { getCourse } from '../data/courses/index.js'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import '../components/common/ByteMascot.css'
import './Profile.css'

// Compatibilidad con formato antiguo (número) y nuevo ({ count, lastWrongAt })
function normalize(raw) {
  if (typeof raw === 'number') return { count: raw, lastWrongAt: null }
  return raw || { count: 0, lastWrongAt: null }
}

// Busca un bloque en todos los cursos y devuelve { course, unit, item } o null
function findBlock(courseId, blockId) {
  const course = getCourse(courseId)
  if (!course) return null
  for (const unit of course.units) {
    const item = unit.items.find((i) => i.id === blockId)
    if (item) return { course, unit, item }
  }
  return null
}

function formatDate(iso) {
  if (!iso) return null
  const diffDays = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  return `hace ${diffDays} días`
}

export default function MistakesReview() {
  const { progress, remoteLoading } = useProgress()
  const navigate = useNavigate()

  const cards = useMemo(() => {
    const result = []
    for (const [courseId, blocks] of Object.entries(progress.errors || {})) {
      for (const [blockId, rawEntry] of Object.entries(blocks)) {
        const { count, lastWrongAt } = normalize(rawEntry)
        if (count === 0) continue
        result.push({ courseId, blockId, count, lastWrongAt, found: findBlock(courseId, blockId) })
      }
    }
    return result.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      if (!a.lastWrongAt && !b.lastWrongAt) return 0
      if (!a.lastWrongAt) return 1
      if (!b.lastWrongAt) return -1
      return b.lastWrongAt.localeCompare(a.lastWrongAt)
    })
  }, [progress.errors])

  if (remoteLoading && cards.length === 0) {
    return (
      <main className="container">
        <header className="page-head rise">
          <p className="section-title">Modo Debug</p>
          <h1 className="page-head__title">Repasar errores</h1>
        </header>
        <div className="rise" style={{ marginTop: 40, textAlign: 'center' }}>
          <p className="faint">Escaneando bugs…</p>
        </div>
      </main>
    )
  }

  if (cards.length === 0) {
    return (
      <main className="container">
        <header className="page-head rise">
          <p className="section-title">Modo Debug</p>
          <h1 className="page-head__title">Repasar errores</h1>
        </header>
        <div className="rise" style={{ marginTop: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <ByteMascot size={96} mood="celebrate" />
          <p className="quiz__prompt" style={{ marginTop: 8 }}>¡Cero bugs! Todo depurado.</p>
          <p className="faint">
            Cuando falles una pregunta, aparecerá aquí para que la caces con Byte.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <header className="page-head rise" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <ByteMascot size={56} mood="default" />
        <div>
          <p className="section-title" style={{ marginBottom: 0 }}>Modo Debug</p>
          <h1 className="page-head__title">Repasar errores</h1>
          <p className="faint" style={{ marginTop: 4 }}>
            {cards.length} bloque{cards.length !== 1 ? 's' : ''} por depurar
          </p>
        </div>
      </header>

      <div className="stack">
        {cards.map(({ courseId, blockId, count, lastWrongAt, found }) => {
          if (!found) {
            return (
              <div key={`${courseId}-${blockId}`} className="profile__course rise">
                <span className="profile__course-icon">❓</span>
                <div style={{ flex: 1 }}>
                  <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 2 }}>
                    {courseId} / {blockId}
                  </p>
                  <p className="faint" style={{ fontSize: '0.85rem' }}>
                    Bloque no encontrado — puede haberse eliminado del curso.
                  </p>
                </div>
              </div>
            )
          }

          const { course, unit, item } = found
          const dateLabel = formatDate(lastWrongAt)

          return (
            <div key={`${courseId}-${blockId}`} className="profile__course rise">
              <span className="profile__course-icon">{course.icon}</span>
              <div style={{ flex: 1 }}>
                <div className="row" style={{ marginBottom: 4 }}>
                  <strong>{item.title}</strong>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'var(--surface-2)',
                    color: 'var(--text-dim)',
                    borderRadius: 'var(--r-sm)',
                    padding: '2px 8px',
                  }}>
                    {count} {count === 1 ? 'error' : 'errores'}
                  </span>
                </div>
                <p className="faint" style={{ fontSize: '0.8rem', marginBottom: 10 }}>
                  {course.title} › {unit.title}
                  {dateLabel && <span> · {dateLabel}</span>}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate(`/curso/${courseId}/unidad/${unit.id}/bloque/${blockId}`)
                  }
                >
                  Repasar →
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
