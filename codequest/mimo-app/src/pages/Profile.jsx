// src/pages/Profile.jsx
import { courses, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import { IconFlame, IconStar, IconCheck, CourseIcon } from '../components/common/icons.jsx'
import '../components/common/ByteMascot.css'
import './Profile.css'

/* ── Circular SVG progress ring ── */
function CircularRing({ value, max, size = 130, strokeWidth = 11 }) {
  const radius = (size - strokeWidth) / 2
  const circ   = 2 * Math.PI * radius
  const offset = max > 0 ? circ - (value / max) * circ : circ
  const pct    = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="circ-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="var(--surface-2)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="var(--teal)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <div className="circ-ring__label">
        <span className="circ-ring__pct">{pct}%</span>
        <span className="circ-ring__sub">Completado</span>
      </div>
    </div>
  )
}

function levelFromXP(xp) {
  return { level: Math.floor(xp / 100) + 1, intoLevel: xp % 100 }
}

export default function Profile() {
  const { progress, countCompleted } = useProgress()
  const { level, intoLevel } = levelFromXP(progress.xp)

  // Compute global stats across all courses
  let totalBlocks = 0, doneBlocks = 0
  let totalPractices = 0, donePractices = 0

  const completedMap = progress.completed ?? {}
  for (const course of courses) {
    const doneSet = new Set(Object.keys(completedMap[course.id] ?? {}))
    for (const unit of course.units) {
      for (const item of unit.items) {
        if (item.type === 'practice') {
          totalPractices++
          if (doneSet.has(item.id)) donePractices++
        } else {
          totalBlocks++
          if (doneSet.has(item.id)) doneBlocks++
        }
      }
    }
  }
  const totalAll = totalBlocks + totalPractices
  const doneAll  = doneBlocks + donePractices

  return (
    <main className="container">
      {/* Avatar + name */}
      <header className="profile__head rise">
        <ByteMascot size={96} mood="happy" />
        <div>
          <h1 className="profile__name">Mi progreso</h1>
          <p className="muted">Nivel {level} · {progress.xp} XP totales</p>
        </div>
      </header>

      {/* Top stat chips */}
      <section className="profile__stats rise" style={{ animationDelay: '55ms' }}>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--gold)' }}>
            <IconFlame className="stat-icon" /> {progress.streak.count}
          </span>
          <span className="stat-box__label">días de racha</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--gold)' }}>
            <IconStar className="stat-icon" /> {progress.xp}
          </span>
          <span className="stat-box__label">XP acumulada</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--gold)' }}>
            <IconCheck className="stat-icon" /> {doneAll}
          </span>
          <span className="stat-box__label">lecciones hechas</span>
        </div>
      </section>

      {/* General progress with circular ring */}
      <section className="profile__general rise" style={{ animationDelay: '110ms' }}>
        <p className="section-title">Progreso general</p>
        <div className="profile__general-inner">
          <CircularRing value={doneAll} max={totalAll} size={126} strokeWidth={11} />
          <div className="profile__general-stats">
            <div className="profile__stat-row">
              <span className="faint" style={{ fontSize: '0.8rem' }}>Bloques completados</span>
              <span className="profile__stat-val">{doneBlocks}/{totalBlocks}</span>
            </div>
            <div className="profile__stat-row">
              <span className="faint" style={{ fontSize: '0.8rem' }}>Prácticas completadas</span>
              <span className="profile__stat-val">{donePractices}/{totalPractices}</span>
            </div>
            <div className="profile__stat-row">
              <span className="faint" style={{ fontSize: '0.8rem' }}>XP total</span>
              <span className="profile__stat-val" style={{ color: 'var(--gold)' }}>{progress.xp}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Level progress */}
      <section className="profile__level rise" style={{ animationDelay: '160ms' }}>
        <div className="row">
          <span className="section-title">Nivel {level}</span>
          <span className="spacer" />
          <span className="faint">{intoLevel}/100 XP al nivel {level + 1}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <ProgressBar value={intoLevel} max={100} color="gold" />
        </div>
      </section>

      {/* Course list */}
      <section className="stack" style={{ marginTop: 22 }}>
        <p className="section-title">Cursos</p>
        {courses.map((course) => {
          const total = course.units.reduce((n, u) => n + u.items.length, 0)
          const done  = course.units.reduce(
            (n, u) => n + countCompleted(course.id, unitItemIds(u)), 0
          )
          return (
            <div key={course.id} className="profile__course rise">
              <span className="profile__course-icon">
                <CourseIcon courseId={course.id} style={{ width: '1.4rem', height: '1.4rem', color: 'var(--teal)' }} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="row">
                  <strong>{course.title}</strong>
                  <span className="spacer" />
                  <span className="faint">{done}/{total}</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <ProgressBar value={done} max={total} color={course.accent} />
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
