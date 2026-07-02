// src/pages/UnitMap.jsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import Button from '../components/common/Button.jsx'
import { IconCheck, IconLock, IconTool } from '../components/common/icons.jsx'
import './UnitMap.css'

const iconSm = { width: '1em', height: '1em' }

export default function UnitMap() {
  const { courseId, unitId } = useParams()
  const navigate = useNavigate()
  const { isCompleted, countCompleted } = useProgress()
  const [tab, setTab] = useState('bloques')

  const course = getCourse(courseId)
  const unit   = getUnit(courseId, unitId)

  if (!course || !unit) {
    return (
      <main className="container">
        <p>Unidad no encontrada. <Link to="/">Volver al inicio</Link></p>
      </main>
    )
  }

  const unitNumber = course.units.findIndex(u => u.id === unitId) + 1
  const ids  = unitItemIds(unit)
  const done = countCompleted(courseId, ids)
  const pct  = ids.length ? Math.round((done / ids.length) * 100) : 0
  const totalXP = unit.items.reduce((n, i) => n + (i.xp || 0), 0)

  const blocks    = unit.items.filter(i => i.type !== 'practice')
  const practices = unit.items.filter(i => i.type === 'practice')

  function isUnlocked(originalIndex) {
    if (originalIndex === 0) return true
    return isCompleted(courseId, unit.items[originalIndex - 1].id)
  }

  function openItem(item) {
    const kind = item.type === 'practice' ? 'practica' : 'bloque'
    navigate(`/curso/${courseId}/unidad/${unitId}/${kind}/${item.id}`)
  }

  // First uncompleted unlocked item (for "Continuar" button)
  const nextItem = unit.items.find((item, idx) =>
    !isCompleted(courseId, item.id) && isUnlocked(idx)
  )

  function renderItem(item, tabIdx) {
    const originalIndex = unit.items.indexOf(item)
    const completed = isCompleted(courseId, item.id)
    const unlocked  = isUnlocked(originalIndex)
    const isActive  = nextItem?.id === item.id
    const isPractice = item.type === 'practice'

    const typeItems = isPractice ? practices : blocks
    const typeIdx   = typeItems.indexOf(item) + 1
    const numLabel  = isPractice ? `P${typeIdx}` : `${unitNumber}.${typeIdx}`

    const state = completed ? 'done' : isActive ? 'active' : unlocked ? 'open' : 'locked'

    return (
      <button
        key={item.id}
        className={`unit-item unit-item--${state} rise`}
        style={{ animationDelay: `${80 + tabIdx * 40}ms` }}
        disabled={!unlocked}
        onClick={() => unlocked && openItem(item)}
      >
        <span className="unit-item__num">{numLabel}</span>
        <span className="unit-item__title">{item.title}</span>
        <span className="unit-item__status">
          {completed
            ? <IconCheck style={iconSm} />
            : !unlocked
              ? <IconLock style={iconSm} />
              : isPractice
                ? <IconTool style={iconSm} />
                : <span className="unit-item__arrow">›</span>}
        </span>
      </button>
    )
  }

  return (
    <main className="container">
      <Link to={`/curso/${courseId}`} className="cmap__back">‹ Unidades</Link>

      {/* Header */}
      <header className="unit-detail__head rise">
        <div className="unit-detail__meta">
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="unit-detail__label">Unidad {unitNumber}</span>
            <h1 className="unit-detail__title">{unit.title}</h1>
            {unit.summary && <p className="muted unit-detail__sub">{unit.summary}</p>}
          </div>
          {totalXP > 0 && (
            <div className="unit-detail__xp-badge">
              <span className="unit-detail__xp-num">{totalXP}</span>
              <span className="unit-detail__xp-lbl">XP</span>
            </div>
          )}
        </div>
        <div className="unit-detail__prog">
          <div className="row" style={{ marginBottom: 7 }}>
            <span className="unit-detail__prog-label">Tu progreso en esta unidad</span>
            <span className="unit-detail__prog-pct">{pct}%</span>
          </div>
          <ProgressBar value={done} max={ids.length} color={course.accent} />
        </div>
      </header>

      {/* Tabs */}
      <div className="unit-tabs rise" style={{ animationDelay: '70ms' }}>
        <button
          className={`unit-tab ${tab === 'bloques' ? 'unit-tab--active' : ''}`}
          onClick={() => setTab('bloques')}
        >
          Bloques
          <span className="unit-tab__count">{blocks.length}</span>
        </button>
        <button
          className={`unit-tab ${tab === 'practicas' ? 'unit-tab--active' : ''}`}
          onClick={() => setTab('practicas')}
        >
          Prácticas
          <span className="unit-tab__count">{practices.length}</span>
        </button>
      </div>

      {/* Item list */}
      <div className="unit-list">
        {(tab === 'bloques' ? blocks : practices).map((item, idx) =>
          renderItem(item, idx)
        )}
        {(tab === 'bloques' ? blocks : practices).length === 0 && (
          <p className="faint" style={{ textAlign: 'center', padding: '28px 0', fontSize: '0.88rem' }}>
            No hay {tab === 'bloques' ? 'bloques' : 'prácticas'} en esta unidad aún.
          </p>
        )}
      </div>

      {/* Sticky continue */}
      {nextItem && (
        <div className="unit-continue">
          <Button variant="primary" size="lg" full onClick={() => openItem(nextItem)}>
            Continuar {nextItem.type === 'practice' ? 'práctica' : 'bloque'} →
          </Button>
        </div>
      )}
    </main>
  )
}
