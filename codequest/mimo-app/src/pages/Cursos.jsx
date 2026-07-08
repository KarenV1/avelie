// src/pages/Cursos.jsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { courses, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import { CourseIcon } from '../components/common/icons.jsx'
import LearningPath from '../components/catalog/LearningPath.jsx'
import './Home.css'

export default function Cursos() {
  const navigate = useNavigate()
  const { countCompleted } = useProgress()

  const courseStats = useMemo(
    () => courses.map((course) => {
      const total = course.units.reduce((n, u) => n + u.items.length, 0)
      const done  = course.units.reduce((n, u) => n + countCompleted(course.id, unitItemIds(u)), 0)
      return { course, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
    }),
    [countCompleted]
  )

  return (
    <main className="container">
      <header className="page-head rise">
        <p className="section-title">Explora</p>
        <h1 className="page-head__title">Mis cursos</h1>
      </header>
      <div className="home__courses">
        {courseStats.map(({ course, total, done, pct }, idx) => (
          <button
            key={course.id}
            className="course-card rise"
            style={{ animationDelay: `${idx * 60}ms`, '--accent': `var(--${course.accent})` }}
            onClick={() => navigate(`/curso/${course.id}`)}
          >
            <div className="course-card__icon">
              <CourseIcon courseId={course.id}
                style={{ width: '1.6rem', height: '1.6rem', color: 'var(--teal)' }} />
            </div>
            <div className="course-card__body">
              <h3 className="course-card__title">{course.title}</h3>
              <p className="course-card__sub">{course.subtitle}</p>
              <ProgressBar value={done} max={total} color={course.accent} />
            </div>
            <span className="course-card__pct">{pct}%</span>
          </button>
        ))}
      </div>

      {/* Catálogo con itinerario: rutas de aprendizaje desde Supabase */}
      <LearningPath />
    </main>
  )
}
