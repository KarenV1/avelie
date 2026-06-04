// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import { courses, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { progress, countCompleted } = useProgress()

  return (
    <main className="container">
      <header className="home__hero rise">
        <p className="section-title">Tu aventura de código</p>
        <h1 className="home__title">Aprende un poco cada día</h1>
        <div className="home__hero-stats">
          <span className="hero-chip">🔥 {progress.streak.count} de racha</span>
          <span className="hero-chip">⭐ {progress.xp} XP</span>
        </div>
      </header>

      <section className="stack" style={{ marginTop: 28 }}>
        <p className="section-title">Cursos</p>
        <div className="home__courses">
          {courses.map((course, idx) => {
            const totalItems = course.units.reduce((n, u) => n + u.items.length, 0)
            const doneItems = course.units.reduce(
              (n, u) => n + countCompleted(course.id, unitItemIds(u)),
              0,
            )
            const firstUnit = course.units[0]
            return (
              <button
                key={course.id}
                className="course-card rise"
                style={{ animationDelay: `${idx * 70}ms`, '--accent': `var(--${course.accent})` }}
                onClick={() => navigate(`/curso/${course.id}/unidad/${firstUnit.id}`)}
              >
                <div className="course-card__icon">{course.icon}</div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__sub muted">{course.subtitle}</p>
                  <div className="course-card__progress">
                    <ProgressBar
                      value={doneItems}
                      max={totalItems}
                      color={course.accent}
                    />
                    <span className="course-card__count faint">
                      {doneItems}/{totalItems}
                    </span>
                  </div>
                </div>
                <span className="course-card__chevron">›</span>
              </button>
            )
          })}
        </div>

        <p className="home__hint faint">
          Próximamente: Java, Python, APIs REST, Testing y Oracle. Cada curso es un archivo JSON.
        </p>
      </section>
    </main>
  )
}
