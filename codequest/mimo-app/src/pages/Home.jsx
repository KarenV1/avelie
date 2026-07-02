// src/pages/Home.jsx — dashboard del jugador (siempre con sesión: App exige login)
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { courses, unitItemIds } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import { IconFlame, IconStar, IconGem, CourseIcon } from '../components/common/icons.jsx'
import '../components/common/ByteMascot.css'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { progress, countCompleted } = useProgress()

  const courseStats = useMemo(
    () => courses.map((course) => {
      const total = course.units.reduce((n, u) => n + u.items.length, 0)
      const done  = course.units.reduce((n, u) => n + countCompleted(course.id, unitItemIds(u)), 0)
      return { course, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
    }),
    [countCompleted]
  )
  // Total de lecciones completadas (para el primer stat badge)
  const totalDone = useMemo(
    () => courseStats.reduce((n, s) => n + s.done, 0),
    [courseStats]
  )

  // Posición activa: primera lección incompleta del primer curso con avance
  const activeCourse = useMemo(() => {
    for (const { course, total, done, pct } of courseStats) {
      const completedMap = progress.completed?.[course.id] ?? {}
      for (let ui = 0; ui < course.units.length; ui++) {
        const unit = course.units[ui]
        let blockIdx = 0
        for (let ii = 0; ii < unit.items.length; ii++) {
          const item = unit.items[ii]
          if (item.type !== 'practice') blockIdx++
          if (!completedMap[item.id]) {
            return { course, unit, item, unitNumber: ui + 1, blockNumber: blockIdx, total, done, pct }
          }
        }
      }
    }
    return null
  }, [courseStats, progress.completed])

  /* ── Dashboard ── */
  return (
    <main className="container">

      {/* Header visible solo en mobile — desktop usa navbar sticky */}
      <header className="home__page-header">
        <button className="home__page-back" onClick={() => navigate(-1)} aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="home__page-title">Inicio</h1>
      </header>

      {/* 3 stat badges */}
      <div className="home__stats rise">
        <span className="home__stat">
          <IconStar style={{ width: '1em', height: '1em', verticalAlign: '-0.1em' }} />
          <strong>{totalDone}</strong>
        </span>
        <span className="home__stat">
          <IconFlame style={{ width: '1em', height: '1em', verticalAlign: '-0.15em' }} />
          <strong>{progress.streak.count}</strong>
        </span>
        <span className="home__stat">
          <IconGem style={{ width: '1em', height: '1em', verticalAlign: '-0.1em' }} />
          <strong>{progress.xp}</strong>
        </span>
      </div>

      {/* Greeting — Byte se asoma desde el borde inferior de la tarjeta */}
      <div className="home__greeting rise" style={{ animationDelay: '60ms' }}>
        <div className="home__greeting-text">
          <p className="home__greeting-title">¡Hola, Explorador! 👋</p>
          <p className="home__greeting-sub">Hoy es un buen día para aprender algo nuevo.</p>
        </div>
        <div className="home__greeting-byte" aria-hidden="true">
          <ByteMascot src="/pixel-asomada.png" size={84} className="home__greeting-byte-m" />
        </div>
      </div>

      {/* CTA */}
      {activeCourse && (
        <div className="rise home__cta-wrap" style={{ animationDelay: '120ms' }}>
          <Button
            variant="primary"
            size="lg"
            full
            onClick={() => navigate(
              `/curso/${activeCourse.course.id}/unidad/${activeCourse.unit.id}/${activeCourse.item.type === 'practice' ? 'practica' : 'bloque'}/${activeCourse.item.id}`
            )}
          >
            Continuar aprendiendo →
          </Button>
        </div>
      )}

      {/* Card de posición activa con detalle: curso · unidad · bloque · lección */}
      {activeCourse && (
        <button
          className="home__active-card rise"
          style={{ animationDelay: '160ms' }}
          onClick={() => navigate(
            `/curso/${activeCourse.course.id}/unidad/${activeCourse.unit.id}/${activeCourse.item.type === 'practice' ? 'practica' : 'bloque'}/${activeCourse.item.id}`
          )}
        >
          <div className="home__active-icon">
            <CourseIcon courseId={activeCourse.course.id}
              style={{ width: '1.8rem', height: '1.8rem', color: 'var(--teal)' }} />
          </div>
          <div className="home__active-body">
            <p className="home__active-name">{activeCourse.course.title}</p>
            <p className="home__active-meta">
              Unidad {activeCourse.unitNumber} · Bloque {activeCourse.blockNumber}
            </p>
            <p className="home__active-lesson">{activeCourse.item.title}</p>
            <div className="home__active-progress">
              <ProgressBar value={activeCourse.done} max={activeCourse.total} color={activeCourse.course.accent} />
              <span className="home__active-pct">{activeCourse.pct}%</span>
            </div>
          </div>
          <svg className="home__active-chevron" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}

      {/* Lista de cursos */}
      <section style={{ marginTop: 24 }}>
        <p className="section-title home__section-title">Cursos</p>
        <div className="home__courses">
          {courseStats.map(({ course, total, done, pct }, idx) => (
            <button
              key={course.id}
              className="course-card rise"
              style={{ animationDelay: `${200 + idx * 60}ms`, '--accent': `var(--${course.accent})` }}
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
          <button className="course-card course-card--add">
            <div className="course-card__icon">＋</div>
            <div className="course-card__body">
              <h3 className="course-card__title">Agregar más cursos</h3>
              <p className="course-card__sub">Próximamente: Java, Python, APIs REST…</p>
            </div>
          </button>
        </div>
      </section>

    </main>
  )
}
