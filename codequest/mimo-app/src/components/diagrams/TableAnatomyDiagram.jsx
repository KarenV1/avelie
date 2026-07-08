// src/components/diagrams/TableAnatomyDiagram.jsx
// Anatomía interactiva de una tabla: cada parte etiquetada con su término
// FORMAL y su término PRÁCTICO — relación/tabla, tupla/fila, atributo/
// columna, dominio (con valores válidos), grado, cardinalidad y primary key.
// Se selecciona tocando el diagrama o los chips de términos; el panel
// inferior muestra la definición.
// Props (desde content_blocks.payload.props):
//   nombre: 'PACIENTE'
//   columnas: [{ nombre, pk?, dominio: 'texto con los valores válidos' }]
//   filas: [['1','Ana Torres','O+','14/02/1991'], …]
//   destacarDominio: 'grupo_sanguineo'  (columna cuyo dominio se ilustra)
//   tuplaEjemplo: 0                      (índice de la fila que ilustra tupla)
import { useState } from 'react'
import Button from '../common/Button.jsx'
import DiagramShell from './DiagramShell.jsx'

// Layout (unidades del viewBox)
const W = 520
const M = 10        // margen
const TITLE_H = 24  // banda del nombre de la tabla
const GUT = 26      // canaleta con número de fila
const HEAD_H = 26
const ROW_H = 24
const BADGE_H = 34

const CHIPS = [
  ['relacion', 'Relación · tabla'],
  ['tupla', 'Tupla · fila'],
  ['atributo', 'Atributo · columna'],
  ['dominio', 'Dominio'],
  ['grado', 'Grado'],
  ['cardinalidad', 'Cardinalidad'],
  ['pk', 'Primary key'],
]

export default function TableAnatomyDiagram({
  nombre = 'TABLA',
  columnas = [],
  filas = [],
  destacarDominio = null,
  tuplaEjemplo = 0,
}) {
  const [part, setPart] = useState(null)
  const pick = (key) => setPart((p) => (p === key ? null : key))

  const n = columnas.length
  const colW = (W - 2 * M - GUT) / n
  const colX = (i) => M + GUT + i * colW
  const headY = M + TITLE_H
  const rowY = (r) => headY + HEAD_H + r * ROW_H
  const tableH = TITLE_H + HEAD_H + filas.length * ROW_H
  const H = M + tableH + 10 + BADGE_H + M

  const pkIdx = columnas.findIndex((c) => c.pk)
  const domIdx = Math.max(
    0,
    destacarDominio ? columnas.findIndex((c) => c.nombre === destacarDominio) : (pkIdx === 0 ? 1 : 0),
  )
  const domCol = columnas[domIdx]

  // Zona resaltada por parte: [x, y, w, h]
  const ZONES = {
    relacion: [M, M, W - 2 * M, tableH],
    tupla: [M, rowY(tuplaEjemplo), W - 2 * M, ROW_H],
    atributo: [M + GUT, headY, n * colW, HEAD_H],
    dominio: [colX(domIdx), rowY(0), colW, filas.length * ROW_H],
    grado: [M + GUT, headY, n * colW, HEAD_H],
    cardinalidad: [M, rowY(0), GUT, filas.length * ROW_H],
    pk: pkIdx >= 0 ? [colX(pkIdx), headY, colW, HEAD_H + filas.length * ROW_H] : null,
  }

  const INFO = {
    relacion: (
      <>
        <strong>Relación</strong> (término práctico: <strong>tabla</strong>) — la estructura completa:
        el nombre ({nombre}), sus atributos y el conjunto de tuplas. Formalmente, una relación ES un
        conjunto de tuplas. De aquí viene el nombre modelo relacional.
      </>
    ),
    tupla: (
      <>
        <strong>Tupla</strong> (término práctico: <strong>fila</strong> o registro) — una instancia
        concreta y completa: {filas[tuplaEjemplo]?.[1] ?? 'una fila'} con todos sus valores. La tabla
        tiene tantas tuplas como casos registrados.
      </>
    ),
    atributo: (
      <>
        <strong>Atributo</strong> (término práctico: <strong>columna</strong> o campo) — cada
        propiedad que se registra: {columnas.map((c) => c.nombre).join(', ')}. Su nombre vive en el
        encabezado; sus valores, en la columna de abajo.
      </>
    ),
    dominio: (
      <>
        <strong>Dominio</strong> — el conjunto de valores VÁLIDOS de un atributo. Para{' '}
        <strong>{domCol?.nombre}</strong>: {domCol?.dominio} Un valor fuera del dominio no debería
        poder guardarse (las constraints CHECK del módulo 4 lo garantizan).
      </>
    ),
    grado: (
      <>
        <strong>Grado</strong> — el número de atributos (columnas) de la relación. {nombre} tiene
        grado <strong>{n}</strong>. No cambia al insertar o borrar filas: es parte de la estructura.
      </>
    ),
    cardinalidad: (
      <>
        <strong>Cardinalidad de la relación</strong> — el número de tuplas (filas):{' '}
        <strong>{filas.length}</strong> en este momento. Ojo de entrevista: no la confundas con la
        cardinalidad de una relación ER (1:1, 1:N, N:M) — misma palabra, concepto distinto.
      </>
    ),
    pk: (
      <>
        <strong>Primary key</strong> — el atributo que identifica a cada tupla sin ambigüedad:{' '}
        <strong>{columnas[pkIdx]?.nombre}</strong>. No admite valores repetidos ni NULL: dos tuplas
        jamás comparten su valor.
      </>
    ),
  }

  function Zone({ id, label }) {
    const z = ZONES[id]
    if (!z) return null
    return (
      <rect
        className="dg-hit"
        role="button"
        tabIndex={0}
        aria-label={label}
        x={z[0]} y={z[1]} width={z[2]} height={z[3]}
        fill="transparent" stroke="none"
        onClick={() => pick(id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(id))}
      />
    )
  }

  const active = part ? ZONES[part] : null

  return (
    <DiagramShell
      label={`Anatomía de una tabla · ${nombre}`}
      minWidth={480}
      controls={CHIPS.map(([key, label]) => (
        <Button key={key} size="sm"
          variant={part === key ? 'primary' : 'ghost'}
          aria-pressed={part === key}
          onClick={() => pick(key)}>
          {label}
        </Button>
      ))}
      info={part ? INFO[part] : null}
      hint="Toca un término o una zona de la tabla para ver su definición formal y práctica."
    >
      <svg className="dg-svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Anatomía de la tabla ${nombre}`}>

        {/* Marco de la relación + nombre */}
        <g className="dg-entity">
          <rect x={M} y={M} width={W - 2 * M} height={tableH} rx={10} />
        </g>
        <text className="dg-entity__name" x={M + GUT} y={M + 16}>{nombre}</text>
        <text className="dg-tag" x={W - M - 8} y={M + 16} textAnchor="end">relación / tabla</text>

        {/* Encabezados (atributos) */}
        {columnas.map((c, i) => (
          <g key={c.nombre}>
            <rect className="dg-cell dg-cell--head" x={colX(i)} y={headY} width={colW} height={HEAD_H} />
            <text className="dg-mono dg-mono--head" x={colX(i) + 6} y={headY + 17}>
              {c.nombre}
            </text>
            {c.pk && (
              <text className="dg-tag" x={colX(i) + colW - 6} y={headY + 17} textAnchor="end">PK</text>
            )}
          </g>
        ))}

        {/* Canaleta con número de fila (cardinalidad) */}
        {filas.map((_, r) => (
          <text key={r} className="dg-tag" x={M + GUT / 2} y={rowY(r) + 16} textAnchor="middle">
            {r + 1}
          </text>
        ))}

        {/* Celdas de datos */}
        {filas.map((fila, r) => fila.map((cell, i) => (
          <g key={`${r}-${i}`}>
            <rect className="dg-cell" x={colX(i)} y={rowY(r)} width={colW} height={ROW_H} />
            <text className="dg-mono" x={colX(i) + 6} y={rowY(r) + 16}>{cell}</text>
          </g>
        )))}

        {/* Insignias de grado y cardinalidad */}
        <g className={`dg-chip dg-hit${part === 'grado' ? ' dg-hit--selected' : ''}`}
          role="button" tabIndex={0} aria-label={`Grado: ${n} columnas`}
          onClick={() => pick('grado')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick('grado'))}>
          <rect x={M} y={M + tableH + 10} width={150} height={24} rx={8} />
          <text x={M + 75} y={M + tableH + 26} textAnchor="middle">grado = {n} columnas</text>
        </g>
        <g className={`dg-chip dg-hit${part === 'cardinalidad' ? ' dg-hit--selected' : ''}`}
          role="button" tabIndex={0} aria-label={`Cardinalidad: ${filas.length} filas`}
          onClick={() => pick('cardinalidad')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick('cardinalidad'))}>
          <rect x={W - M - 178} y={M + tableH + 10} width={178} height={24} rx={8} />
          <text x={W - M - 89} y={M + tableH + 26} textAnchor="middle">cardinalidad = {filas.length} filas</text>
        </g>

        {/* Resaltado de la parte activa */}
        {active && (
          <rect className="dg-zone" x={active[0]} y={active[1]} width={active[2]} height={active[3]} rx={4} />
        )}

        {/* Zonas táctiles (encima de todo) */}
        <Zone id="cardinalidad" label="Cardinalidad: número de filas" />
        <Zone id="atributo" label="Atributos: los encabezados de columna" />
        <Zone id="dominio" label={`Dominio del atributo ${domCol?.nombre}`} />
        <Zone id="pk" label="Primary key" />
        <Zone id="tupla" label="Una tupla: una fila completa" />
      </svg>
    </DiagramShell>
  )
}
