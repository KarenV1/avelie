// src/pages/UnitMap.jsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import './UnitMap.css'

export default function UnitMap() {
  const { courseId, unitId } = useParams()
  const navigate = useNavigate()
  const { isCompleted, countCompleted } = useProgress()

  const course = getCourse(courseId)
  const unit = getUnit(courseId, unitId)

  if (!course || !unit) {
    return (
      <main className="container">
        <p>Unidad no encontrada. <Link to="/">Volver al inicio</Link></p>
      </main>
    )
  }

  const ids = unitItemIds(unit)
  const done = countCompleted(courseId, ids)

  // Un item esta desbloqueado si es el primero o si el anterior ya esta completo.
  function isUnlocked(index) {
    if (index === 0) return true
    return isCompleted(courseId, unit.items[index - 1].id)
  }

  function openItem(item) {
    const kind = item.type === 'practice' ? 'practica' : 'bloque'
    navigate(`/curso/${courseId}/unidad/${unitId}/${kind}/${item.id}`)
  }

  let blockCounter = 0
  let practiceCounter = 0

  return (
    <main className="container">
      <header className="unit__header rise">
        <Link to={`/curso/${courseId}`} className="unit__back">‹ Unidades</Link>
        <div className="unit__heading" style={{ '--accent': `var(--${course.accent})` }}>
          <span className="unit__course">{course.icon} {course.title}</span>
          <h1 className="unit__title">{unit.title}</h1>
          <p className="muted">{unit.summary}</p>
          <div className="unit__progress">
            <ProgressBar value={done} max={ids.length} color={course.accent} showLabel />
          </div>
        </div>
      </header>

      <ol className="path">
        {unit.items.map((item, index) => {
          const completed = isCompleted(courseId, item.id)
          const unlocked = isUnlocked(index)
          const isPractice = item.type === 'practice'
          if (isPractice) practiceCounter += 1
          else blockCounter += 1

          const side = index % 2 === 0 ? 'left' : 'right'
          const state = completed ? 'done' : unlocked ? 'open' : 'locked'

          return (
            <li
              key={item.id}
              className={`path__row path__row--${side} rise`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <button
                className={`node node--${state} ${isPractice ? 'node--practice' : 'node--block'}`}
                style={{ '--accent': isPractice ? 'var(--violet)' : `var(--${course.accent})` }}
                disabled={!unlocked}
                onClick={() => openItem(item)}
                title={unlocked ? item.title : 'Completa el paso anterior para desbloquear'}
              >
                <span className="node__icon">
                  {completed ? '✓' : isPractice ? '🛠️' : blockCounter}
                </span>
              </button>
              <div className="path__label">
                <span className="path__kind">
                  {isPractice ? `Práctica guiada ${practiceCounter}` : `Bloque ${blockCounter}`}
                </span>
                <span className={'path__name' + (unlocked ? '' : ' path__name--locked')}>
                  {unlocked ? item.title : '🔒 Bloqueado'}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
