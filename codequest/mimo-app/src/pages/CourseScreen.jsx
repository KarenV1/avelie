// src/pages/CourseScreen.jsx — El Camino del curso
// Un solo camino continuo: cada nodo es una lección (bloque) o una práctica.
// El camino se corta por unidades; cada tramo se desbloquea al completar el anterior.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import { IconCheck, IconLock, IconCube, IconTool, IconSettings } from '../components/common/icons.jsx'
import '../components/common/ByteMascot.css'
import './CourseScreen.css'

/* ─── Geometría del camino ───────────────────────────────
   Serpentina: los nodos alternan centro → derecha → centro → izquierda.
   Las conexiones son trazos ortogonales (circuito digital). */
const XS = [50, 78, 50, 22]      // % horizontales del ciclo serpenteante
const ROW = 100                  // px entre centros de nodos
const ACTIVE_ROW = 148           // px extra para el nodo activo (espacio para Byte)
const PAD = 40                   // px arriba y abajo de cada tramo

/* Elementos ambientales — posiciones deterministas */
const AMBIENT = [
  { x: 10, dy: -18, type: 'cube',     delay: 0    },
  { x: 88, dy:  10, type: 'code',     delay: 0.9  },
  { x: 14, dy:  20, type: 'crystal',  delay: 1.6  },
  { x: 90, dy: -24, type: 'bit',      delay: 0.4  },
  { x: 8,  dy:   4, type: 'terminal', delay: 2.1  },
  { x: 86, dy:  26, type: 'bit',      delay: 1.2  },
]

/* Circuito ortogonal entre nodos consecutivos */
function buildCircuit(pts) {
  if (pts.length < 2) return { full: '', segs: [] }
  let full = `M ${pts[0].x} ${pts[0].y}`
  const segs = []
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i]
    const midY = (p.y + c.y) / 2
    const seg = ` L ${p.x} ${midY} L ${c.x} ${midY} L ${c.x} ${c.y}`
    full += seg
    segs.push({ seg, junction1: { x: p.x, y: midY }, junction2: { x: c.x, y: midY } })
  }
  return { full, segs }
}

export default function CourseScreen() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { isCompleted } = useProgress()
  const [selected, setSelected] = useState(null) // { item, unit, unitNumber, state }
  const activeRef = useRef(null)

  const course = getCourse(courseId)

  /* Lista plana de todos los items del curso, con su unidad */
  const flat = useMemo(() => {
    if (!course) return []
    const out = []
    course.units.forEach((unit, ui) => {
      unit.items.forEach((item) => out.push({ item, unit, ui }))
    })
    return out
  }, [course])

  /* Desbloqueo lineal: un item se abre al completar el anterior */
  const states = useMemo(() => {
    let activeFound = false
    return flat.map(({ item }, i) => {
      const done = isCompleted(courseId, item.id)
      if (done) return 'done'
      const unlocked = i === 0 || isCompleted(courseId, flat[i - 1].item.id)
      if (unlocked && !activeFound) { activeFound = true; return 'active' }
      return unlocked ? 'open' : 'locked'
    })
  }, [flat, isCompleted, courseId])

  /* Auto-scroll al nodo activo al entrar */
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [courseId])

  /* Cerrar la burbuja con Escape */
  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  if (!course) {
    return (
      <main className="container">
        <p>Curso no encontrado. <Link to="/">Volver al inicio</Link></p>
      </main>
    )
  }

  const totalItems = flat.length
  const totalDone  = states.filter(s => s === 'done').length
  const pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0

  function openItem(entry) {
    const kind = entry.item.type === 'practice' ? 'practica' : 'bloque'
    navigate(`/curso/${courseId}/unidad/${entry.unit.id}/${kind}/${entry.item.id}`)
  }

  /* ─── Render de un tramo (unidad) ─── */
  let flatBase = 0
  const segments = course.units.map((unit, ui) => {
    const base = flatBase
    flatBase += unit.items.length

    const segStates = unit.items.map((_, i) => states[base + i])
    const unitDone   = segStates.every(s => s === 'done')
    const unitLocked = segStates.every(s => s === 'locked')
    const activeIdx  = segStates.indexOf('active')

    /* posiciones de nodos */
    let accY = PAD
    const nodes = unit.items.map((_, i) => {
      const h = i === activeIdx ? ACTIVE_ROW : ROW
      const y = accY + h / 2
      accY += h
      return { x: XS[(base + i) % XS.length], y }
    })
    const segH = accY + PAD
    const { full, segs } = buildCircuit(nodes)

    /* tramo completado del circuito */
    let doneSvg = ''
    for (let i = 0; i < unit.items.length - 1; i++) {
      if (segStates[i] !== 'done') break
      if (doneSvg === '') doneSvg = `M ${nodes[i].x} ${nodes[i].y}`
      doneSvg += segs[i].seg
    }

    /* Byte antes del nodo activo */
    let byte = null
    if (activeIdx >= 0) {
      const n = nodes[activeIdx]
      byte = activeIdx === 0
        ? { x: n.x, y: n.y - 58 }
        : { x: n.x, y: (nodes[activeIdx - 1].y + n.y) / 2 + 14 }
    }

    return { unit, ui, base, nodes, segH, full, segs, segStates, unitDone, unitLocked, activeIdx, byte }
  })

  return (
    <main className="cmap-page">

      {/* Header */}
      <header className="cmap__page-header">
        <button className="cmap__page-back" onClick={() => navigate(-1)} aria-label="Volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="cmap__page-title">{course.title}</span>
        <Link to="/ajustes" className="cmap__page-settings" aria-label="Ajustes">
          <IconSettings style={{ width: 18, height: 18 }} />
        </Link>
      </header>

      <div className="container">

        {/* Progreso del mundo */}
        <header className="cmap__head rise">
          <div className="cmap__world-progress">
            <div className="cmap__pct-block">
              <span className="cmap__pct-num">{pct}</span>
              <span className="cmap__pct-sign">%</span>
            </div>
            <div className="cmap__bar-block">
              <span className="cmap__bar-label">Mundo explorado · {totalDone}/{totalItems}</span>
              <ProgressBar value={totalDone} max={totalItems} color={course.accent} />
            </div>
          </div>
        </header>

        {/* ═══ EL CAMINO — tramos por unidad ═══ */}
        {segments.map((seg) => (
          <section key={seg.unit.id} className={`cpath__section${seg.unitLocked ? ' cpath__section--locked' : ''}`}>

            {/* Corte del camino: banda de unidad */}
            <div className={`cpath__divider${seg.unitDone ? ' cpath__divider--done' : ''}`}>
              <span className="cpath__divider-line" />
              <div className="cpath__divider-body">
                <span className="cpath__divider-tag">
                  {seg.unitLocked && <IconLock style={{ width: '0.9em', height: '0.9em', verticalAlign: '-0.1em', marginRight: 4 }} />}
                  Unidad {seg.ui + 1}
                </span>
                <span className="cpath__divider-name">{seg.unit.title}</span>
                {seg.unitLocked && (
                  <span className="cpath__divider-hint">Completa la unidad anterior para desbloquear</span>
                )}
              </div>
              <span className="cpath__divider-line" />
            </div>

            {/* Tramo del circuito */}
            <div className="qmap" style={{ '--accent': `var(--${course.accent})`, height: `${seg.segH}px` }}>

              <svg className="qmap__svg" viewBox={`0 0 100 ${seg.segH}`} preserveAspectRatio="none" aria-hidden="true">
                <path className="qmap__circuit-bg" d={seg.full} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                {seg.segStates[0] === 'done' && seg.full && (
                  <path className="qmap__circuit-done" d={
                    // circuito iluminado hasta el último nodo completado consecutivo
                    (() => {
                      let d = ''
                      for (let i = 0; i < seg.unit.items.length - 1; i++) {
                        if (seg.segStates[i] !== 'done') break
                        if (d === '') d = `M ${seg.nodes[i].x} ${seg.nodes[i].y}`
                        d += seg.segs[i].seg
                      }
                      return d
                    })()
                  } fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                )}
                {seg.segs.map((s, i) => {
                  const isDone = seg.segStates[i] === 'done' && seg.segStates[i + 1] === 'done'
                  return (
                    <g key={i}>
                      <rect x={s.junction1.x - 2.2} y={s.junction1.y - 2.2} width={4.4} height={4.4}
                        transform={`rotate(45 ${s.junction1.x} ${s.junction1.y})`}
                        className={isDone ? 'qmap__junc qmap__junc--done' : 'qmap__junc'} />
                      <rect x={s.junction2.x - 2.2} y={s.junction2.y - 2.2} width={4.4} height={4.4}
                        transform={`rotate(45 ${s.junction2.x} ${s.junction2.y})`}
                        className={isDone ? 'qmap__junc qmap__junc--done' : 'qmap__junc'} />
                    </g>
                  )
                })}
              </svg>

              {/* Ambientales */}
              {seg.nodes.map((n, i) => {
                if (i % 3 !== 1) return null
                const amb = AMBIENT[(seg.base + i) % AMBIENT.length]
                return (
                  <div key={`amb-${i}`} className={`qmap__amb qmap__amb--${amb.type}`}
                    style={{ left: `${amb.x}%`, top: `${n.y + amb.dy}px`, '--delay': `${amb.delay}s` }}
                    aria-hidden="true" />
                )
              })}

              {/* Byte marca la posición actual */}
              {seg.byte && (
                <div className="qmap__byte" style={{ left: `${seg.byte.x}%`, top: `${seg.byte.y}px` }} aria-hidden="true">
                  <span className="qmap__byte-trail" style={{ '--d': 1 }} />
                  <span className="qmap__byte-trail" style={{ '--d': 2 }} />
                  <span className="qmap__byte-trail" style={{ '--d': 3 }} />
                  <ByteMascot size={52} className="qmap__byte-m" />
                </div>
              )}

              {/* Nodos: cada uno es una lección o práctica */}
              {seg.unit.items.map((item, i) => {
                const state = seg.segStates[i]
                const { x, y } = seg.nodes[i]
                const isPractice = item.type === 'practice'
                const clickable = state !== 'locked'
                const isActive = state === 'active'

                return (
                  <div
                    key={item.id}
                    ref={isActive ? activeRef : undefined}
                    className={`qmap__station qmap__station--${state} rise`}
                    style={{ left: `${x}%`, top: `${y}px`, animationDelay: `${(i % 8) * 45}ms` }}
                  >
                    {isActive && <div className="qmap__aura" />}
                    <button
                      className={`qmap__node qmap__node--${state}${isPractice ? ' qmap__node--practice' : ''}`}
                      disabled={!clickable}
                      aria-label={`${isPractice ? 'Práctica' : 'Lección'}: ${item.title}`}
                      onClick={() => clickable && setSelected({ item, unit: seg.unit, unitNumber: seg.ui + 1, state })}
                    >
                      <div className="qmap__node-ring" />
                      <div className="qmap__node-fill">
                        <span className="qmap__node-icon">
                          {state === 'done'
                            ? <IconCheck style={{ width: '0.9em', height: '0.9em' }} />
                            : state === 'locked'
                              ? <IconLock style={{ width: '0.8em', height: '0.8em' }} />
                              : isPractice
                                ? <IconTool style={{ width: '0.9em', height: '0.9em' }} />
                                : <IconCube style={{ width: '0.95em', height: '0.95em' }} />}
                        </span>
                      </div>
                    </button>

                    {/* Solo el nodo activo lleva etiqueta; el resto habla en la burbuja */}
                    {isActive && (
                      <div className="qmap__label qmap__label--under">
                        <span className="qmap__label-name">{item.title}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ═══ Burbuja de preview ═══ */}
      {selected && (
        <>
          <div className="cpath__backdrop" onClick={() => setSelected(null)} />
          <aside className="cpath__sheet" role="dialog" aria-modal="true" aria-label={selected.item.title}>
            <span className="cpath__sheet-tag">
              {selected.item.type === 'practice' ? <IconTool style={{ width: '0.9em', height: '0.9em', verticalAlign: '-0.1em' }} /> : <IconCube style={{ width: '0.9em', height: '0.9em', verticalAlign: '-0.1em' }} />}
              {' '}{selected.item.type === 'practice' ? 'Práctica' : 'Lección'} · {selected.item.xp || 0} XP
            </span>
            <h2 className="cpath__sheet-title">{selected.item.title}</h2>
            <p className="cpath__sheet-meta">Unidad {selected.unitNumber} · {selected.unit.title}</p>
            <div className="cpath__sheet-actions">
              <Button variant="primary" size="lg" full onClick={() => openItem(selected)}>
                {selected.state === 'done' ? 'Repasar' : 'Empezar'}
              </Button>
              <Button variant="ghost" size="md" full onClick={() => setSelected(null)}>
                Cerrar
              </Button>
            </div>
          </aside>
        </>
      )}
    </main>
  )
}
