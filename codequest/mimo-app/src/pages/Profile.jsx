// src/pages/Profile.jsx
import { courses, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import './Profile.css'

// Nivel simple basado en XP (cada 100 XP = 1 nivel)
function levelFromXP(xp) {
  const level = Math.floor(xp / 100) + 1
  const intoLevel = xp % 100
  return { level, intoLevel }
}

export default function Profile() {
  const { progress, countCompleted } = useProgress()
  const { level, intoLevel } = levelFromXP(progress.xp)

  const totalCompleted = Object.values(progress.completed).reduce(
    (n, course) => n + Object.keys(course).length,
    0,
  )

  return (
    <main className="container">
      <header className="profile__head rise">
        <div className="profile__avatar">🧑‍💻</div>
        <div>
          <h1 className="profile__name">Mi progreso</h1>
          <p className="muted">Nivel {level} · {progress.xp} XP totales</p>
        </div>
      </header>

      <section className="profile__stats rise" style={{ animationDelay: '60ms' }}>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--amber)' }}>🔥 {progress.streak.count}</span>
          <span className="stat-box__label">días de racha</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--gold)' }}>⭐ {progress.xp}</span>
          <span className="stat-box__label">XP acumulada</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__value" style={{ color: 'var(--lime)' }}>✓ {totalCompleted}</span>
          <span className="stat-box__label">lecciones hechas</span>
        </div>
      </section>

      <section className="profile__level rise" style={{ animationDelay: '120ms' }}>
        <div className="row">
          <span className="section-title">Nivel {level}</span>
          <span className="spacer" />
          <span className="faint">{intoLevel}/100 al nivel {level + 1}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <ProgressBar value={intoLevel} max={100} color="gold" />
        </div>
      </section>

      <section className="stack" style={{ marginTop: 26 }}>
        <p className="section-title">Cursos</p>
        {courses.map((course) => {
          const total = course.units.reduce((n, u) => n + u.items.length, 0)
          const done = course.units.reduce(
            (n, u) => n + countCompleted(course.id, unitItemIds(u)),
            0,
          )
          return (
            <div key={course.id} className="profile__course rise">
              <span className="profile__course-icon">{course.icon}</span>
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
