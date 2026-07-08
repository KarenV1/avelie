// src/components/catalog/LearningPath.jsx
// Mapa de rutas del catálogo: lee tracks + track_courses +
// course_prerequisites (vía catalogStore) y pinta cada ruta como una
// cadena vertical de cursos con tres estados:
//   completado (✓) · disponible · bloqueado (🔒 hasta terminar sus
//   prerrequisitos)
// El progreso sale del mismo cálculo que usan Home/Cursos; si el curso
// aún no tiene contenido cargado se muestra como "en preparación".
// Si el catálogo está vacío (sin red o sin migraciones) muestra el
// placeholder de siempre: la app no pierde nada.
import { useEffect, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscribeCatalog, getCatalog, loadCatalog } from '../../data/catalogStore.js'
import { courses, unitItemIds } from '../../data/courses/index.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { CourseIcon, IconLock, IconCheck } from '../common/icons.jsx'
import './LearningPath.css'

const NIVEL = { basico: 'Básico', intermedio: 'Intermedio', senior: 'Senior' }

export default function LearningPath() {
  const navigate = useNavigate()
  const catalog = useSyncExternalStore(subscribeCatalog, getCatalog)
  const { countCompleted } = useProgress()

  useEffect(() => { loadCatalog() }, [])

  // Progreso de un curso, con el mismo cálculo de Home/Cursos.
  // null = el curso aún no tiene contenido cargado en la app.
  const stats = (courseId) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return null
    const total = course.units.reduce((n, u) => n + u.items.length, 0)
    const done = course.units.reduce((n, u) => n + countCompleted(course.id, unitItemIds(u)), 0)
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
  }

  const titleOf = (slug) => {
    for (const track of catalog.tracks) {
      const found = track.courses.find((c) => c.id === slug)
      if (found) return found.title
    }
    return courses.find((c) => c.id === slug)?.title ?? slug
  }

  if (catalog.tracks.length === 0) {
    return (
      <div className="lpath__placeholder">
        <h3 className="lpath__placeholder-title">Más cursos próximamente</h3>
        <p className="lpath__placeholder-sub">Ciberseguridad, redes, cumplimiento…</p>
      </div>
    )
  }

  return (
    <section className="lpath" aria-label="Rutas de aprendizaje">
      <p className="lpath__label">Rutas de aprendizaje</p>

      {catalog.tracks.map((track, tIdx) => (
        <article key={track.id} className="lpath__track rise" style={{ animationDelay: `${tIdx * 60}ms` }}>
          <header className="lpath__head">
            <span className="lpath__emoji" aria-hidden="true">{track.icon}</span>
            <div>
              <h3 className="lpath__title">{track.title}</h3>
              {track.description && <p className="lpath__desc">{track.description}</p>}
            </div>
          </header>

          {track.courses.length === 0 ? (
            <p className="lpath__empty">Cursos en preparación…</p>
          ) : (
            <ol className="lpath__chain">
              {track.courses.map((course) => {
                const s = stats(course.id)
                const prereqs = catalog.prerequisites[course.id] ?? []
                const bloqueado = prereqs.some((p) => (stats(p)?.pct ?? 0) < 100)
                const completado = s !== null && s.total > 0 && s.pct === 100
                const abrible = !bloqueado && s !== null

                return (
                  <li key={course.id} className="lpath__step">
                    <button
                      className={`lpath__course${bloqueado ? ' lpath__course--locked' : ''}`}
                      disabled={!abrible}
                      aria-label={bloqueado
                        ? `${course.title} (bloqueado: requiere ${prereqs.map(titleOf).join(', ')})`
                        : course.title}
                      onClick={() => abrible && navigate(`/curso/${course.id}`)}
                    >
                      <span className="lpath__icon">
                        <CourseIcon courseId={course.id}
                          style={{ width: '1.3rem', height: '1.3rem', color: 'var(--teal)' }} />
                      </span>
                      <span className="lpath__body">
                        <span className="lpath__course-title">{course.title}</span>
                        <span className="lpath__meta">
                          {NIVEL[course.nivel] ?? course.nivel}
                          {s === null && ' · en preparación'}
                        </span>
                        {s !== null && (
                          <ProgressBar value={s.done} max={s.total} color={course.accent} />
                        )}
                      </span>
                      <span className="lpath__state" aria-hidden="true">
                        {bloqueado
                          ? <IconLock style={{ width: '1rem', height: '1rem' }} />
                          : completado
                            ? <IconCheck style={{ width: '1rem', height: '1rem' }} />
                            : null}
                      </span>
                    </button>
                    {prereqs.length > 0 && (
                      <p className="lpath__req">Requiere: {prereqs.map(titleOf).join(', ')}</p>
                    )}
                  </li>
                )
              })}
            </ol>
          )}
        </article>
      ))}
    </section>
  )
}
