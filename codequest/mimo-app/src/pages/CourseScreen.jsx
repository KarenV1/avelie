// src/pages/CourseScreen.jsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import './Home.css'

export default function CourseScreen() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { countCompleted } = useProgress()

  const course = getCourse(courseId)

  if (!course) {
    return (
      <main className="container">
        <p>Curso no encontrado. <Link to="/">Volver al inicio</Link></p>
      </main>
    )
  }

  if (!course.units || course.units.length === 0) {
    return (
      <main className="container">
        <p>Este curso aún no tiene unidades disponibles. <Link to="/">Volver</Link></p>
      </main>
    )
  }

  return (
    <main className="container">
      <header className="home__hero rise">
        <Link to="/" className="learn__back">‹ Cursos</Link>
        <p className="section-title" style={{ marginTop: 16 }}>
          {course.icon} {course.title}
        </p>
        <h1 className="home__title" style={{ '--accent': `var(--${course.accent})` }}>
          {course.subtitle}
        </h1>
        <p className="muted">{course.description}</p>
      </header>

      <section className="stack" style={{ marginTop: 28 }}>
        <p className="section-title">Unidades</p>
        <div className="home__courses">
          {course.units.map((unit, idx) => {
            const ids = unitItemIds(unit)
            const done = countCompleted(courseId, ids)
            return (
              <button
                key={unit.id}
                className="course-card rise"
                style={{ animationDelay: `${idx * 70}ms`, '--accent': `var(--${course.accent})` }}
                onClick={() => navigate(`/curso/${courseId}/unidad/${unit.id}`)}
              >
                <div className="course-card__icon">{idx + 1}</div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{unit.title}</h3>
                  <p className="course-card__sub muted">{unit.summary}</p>
                  <div className="course-card__progress">
                    <ProgressBar value={done} max={ids.length} color={course.accent} />
                    <span className="course-card__count faint">{done}/{ids.length}</span>
                  </div>
                </div>
                <span className="course-card__chevron">›</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
