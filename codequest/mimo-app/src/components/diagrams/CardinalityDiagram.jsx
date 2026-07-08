// src/components/diagrams/CardinalityDiagram.jsx
// Diagrama parametrizable de cardinalidad (1:1, 1:N, N:M) entre dos
// entidades, con toggle entre notación pata de gallo (IE) y Barker
// (la de Oracle), y una vista de instancias con datos de ejemplo.
//
// Semántica de cada extremo (izquierda/derecha):
//   { nombre, card: '1'|'N', min: 0|1, descripcion }
//   card/min = cuántas instancias de ESA entidad existen por cada
//   instancia de la otra. Los símbolos se dibujan en SU extremo.
import { useState } from 'react'
import Button from '../common/Button.jsx'
import DiagramShell from './DiagramShell.jsx'
import { ConnectorEnd, endLabel } from './notation.jsx'

const NOTATION_NAMES = { crowsfoot: 'pata de gallo (IE)', barker: 'Barker (Oracle)' }

function EntityBox({ x, y, w = 150, h = 44, nombre, selected, onSelect }) {
  return (
    <g
      className={`dg-entity dg-hit${selected ? ' dg-hit--selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Entidad ${nombre}`}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
    >
      <rect x={x} y={y} width={w} height={h} rx={10} />
      <text className="dg-entity__name" x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle">
        {nombre}
      </text>
    </g>
  )
}

export default function CardinalityDiagram({
  tipo,
  izquierda,
  derecha,
  verbo,
  lecturas = [],
  instancias = null,
}) {
  const [notation, setNotation] = useState('crowsfoot')
  const [sel, setSel] = useState(null) // 'izq' | 'der' | 'finIzq' | 'finDer' | 'verbo'

  const pick = (key) => setSel((s) => (s === key ? null : key))

  // Línea principal: de x=160 a x=360, y=48
  const LY = 48
  const dashLeft = notation === 'barker' && derecha.min === 0   // opcional leído desde la izquierda
  const dashRight = notation === 'barker' && izquierda.min === 0

  const info =
    sel === 'izq' ? (<><strong>{izquierda.nombre}</strong> — {izquierda.descripcion}</>)
    : sel === 'der' ? (<><strong>{derecha.nombre}</strong> — {derecha.descripcion}</>)
    : sel === 'finIzq' ? (
      <>
        <strong>Extremo {izquierda.nombre}</strong>: por cada {derecha.nombre} hay{' '}
        {endLabel(izquierda)} {izquierda.nombre}.{' '}
        {notation === 'barker'
          ? 'En Barker, la pata de gallo marca "muchas" y la mitad discontinua de la línea marca lo opcional.'
          : 'En pata de gallo, el símbolo interior es el máximo y el exterior el mínimo (anillo = cero, barra = uno).'}
      </>
    )
    : sel === 'finDer' ? (
      <>
        <strong>Extremo {derecha.nombre}</strong>: por cada {izquierda.nombre} hay{' '}
        {endLabel(derecha)} {derecha.nombre}.{' '}
        {notation === 'barker'
          ? 'En Barker, la pata de gallo marca "muchas" y la mitad discontinua de la línea marca lo opcional.'
          : 'En pata de gallo, el símbolo interior es el máximo y el exterior el mínimo (anillo = cero, barra = uno).'}
      </>
    )
    : sel === 'verbo' ? (
      <>
        <strong>{izquierda.nombre} {verbo} {derecha.nombre}</strong>
        {lecturas.map((l, i) => <span key={i}><br />· {l}</span>)}
      </>
    )
    : null

  const maxRows = instancias ? Math.max(instancias.izquierda.length, instancias.derecha.length) : 0
  const instH = 26 + maxRows * 30

  return (
    <DiagramShell
      label={`Cardinalidad ${tipo} · notación ${NOTATION_NAMES[notation]}`}
      minWidth={480}
      controls={
        <>
          <Button
            size="sm"
            variant={notation === 'crowsfoot' ? 'primary' : 'ghost'}
            aria-pressed={notation === 'crowsfoot'}
            onClick={() => setNotation('crowsfoot')}
          >
            Pata de gallo
          </Button>
          <Button
            size="sm"
            variant={notation === 'barker' ? 'primary' : 'ghost'}
            aria-pressed={notation === 'barker'}
            onClick={() => setNotation('barker')}
          >
            Barker (Oracle)
          </Button>
        </>
      }
      info={info}
      hint="Toca las entidades, los extremos de la línea o el verbo para ver qué significa cada parte."
    >
      <svg className="dg-svg" viewBox="0 0 520 96" role="img"
        aria-label={`Relación ${tipo}: ${izquierda.nombre} ${verbo} ${derecha.nombre}`}>
        {/* Línea en dos mitades (Barker usa trazo discontinuo para lo opcional) */}
        <path className={`dg-line${dashLeft ? ' dg-line--dashed' : ''}`} d={`M 160 ${LY} L 260 ${LY}`} />
        <path className={`dg-line${dashRight ? ' dg-line--dashed' : ''}`} d={`M 260 ${LY} L 360 ${LY}`} />

        {/* Extremos con su símbolo de cardinalidad + zona táctil */}
        <g className={`dg-hit${sel === 'finIzq' ? ' dg-hit--selected' : ''}`} role="button" tabIndex={0}
          aria-label={`Cardinalidad en el extremo ${izquierda.nombre}`}
          onClick={() => pick('finIzq')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick('finIzq'))}>
          <rect x={160} y={LY - 14} width={34} height={28} fill="transparent" stroke="none" />
          <ConnectorEnd x={160} y={LY} angle={180} card={izquierda.card} min={izquierda.min} notation={notation} />
        </g>
        <g className={`dg-hit${sel === 'finDer' ? ' dg-hit--selected' : ''}`} role="button" tabIndex={0}
          aria-label={`Cardinalidad en el extremo ${derecha.nombre}`}
          onClick={() => pick('finDer')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick('finDer'))}>
          <rect x={326} y={LY - 14} width={34} height={28} fill="transparent" stroke="none" />
          <ConnectorEnd x={360} y={LY} angle={0} card={derecha.card} min={derecha.min} notation={notation} />
        </g>

        {/* Verbo de la relación */}
        <g className={`dg-hit${sel === 'verbo' ? ' dg-hit--selected' : ''}`} role="button" tabIndex={0}
          aria-label={`Relación: ${verbo}`}
          onClick={() => pick('verbo')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick('verbo'))}>
          <rect x={225} y={LY - 26} width={70} height={20} fill="transparent" stroke="none" />
          <text className="dg-verb" x={260} y={LY - 12} textAnchor="middle">{verbo}</text>
        </g>

        <EntityBox x={10} y={26} nombre={izquierda.nombre} selected={sel === 'izq'} onSelect={() => pick('izq')} />
        <EntityBox x={360} y={26} nombre={derecha.nombre} selected={sel === 'der'} onSelect={() => pick('der')} />
      </svg>

      {/* Vista de instancias: la cardinalidad con datos concretos */}
      {instancias && (
        <svg className="dg-svg" viewBox={`0 0 520 ${instH}`} role="img"
          aria-label={`Ejemplo con datos: ${instancias.titulo ?? ''}`}>
          {instancias.titulo && (
            <text className="dg-note" x={10} y={14}>{instancias.titulo}</text>
          )}
          {instancias.conexiones.map(([li, ri], i) => (
            <path key={i} className="dg-chip-line"
              d={`M 160 ${33 + li * 30} C 230 ${33 + li * 30}, 290 ${33 + ri * 30}, 360 ${33 + ri * 30}`} />
          ))}
          {instancias.izquierda.map((txt, i) => (
            <g key={`l${i}`} className="dg-chip">
              <rect x={10} y={20 + i * 30} width={150} height={26} rx={8} />
              <text x={85} y={37 + i * 30} textAnchor="middle">{txt}</text>
            </g>
          ))}
          {instancias.derecha.map((txt, i) => (
            <g key={`r${i}`} className="dg-chip">
              <rect x={360} y={20 + i * 30} width={150} height={26} rx={8} />
              <text x={435} y={37 + i * 30} textAnchor="middle">{txt}</text>
            </g>
          ))}
        </svg>
      )}
    </DiagramShell>
  )
}
