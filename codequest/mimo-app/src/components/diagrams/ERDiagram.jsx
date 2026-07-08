// src/components/diagrams/ERDiagram.jsx
// Renderer genérico de diagramas entidad-relación en notación pata de
// gallo. Todo llega por props (desde content_blocks.payload.props):
//   entidades:  [{ id, nombre, x, y, w?, atributos: [{ nombre, pk?, fk? }], descripcion }]
//   relaciones: [{ de, a, verbo, extremoDe: {card,min}, extremoA: {card,min}, descripcion }]
//   ancho/alto: tamaño del viewBox (las coordenadas de las entidades viven ahí)
// Cada extremo describe cuántas instancias de ESA entidad hay por cada
// instancia de la otra (mismo criterio que CardinalityDiagram).
import { useState } from 'react'
import DiagramShell from './DiagramShell.jsx'
import { ConnectorEnd, endLabel } from './notation.jsx'

const HEADER_H = 26
const ROW_H = 17
const DEFAULT_W = 150

function boxSize(ent) {
  return {
    w: ent.w ?? DEFAULT_W,
    h: HEADER_H + (ent.atributos?.length ?? 0) * ROW_H + 8,
  }
}

// Puntos de anclaje y ángulos de símbolo entre dos cajas (bordes enfrentados)
function anchors(entA, entB) {
  const a = { ...boxSize(entA), x: entA.x, y: entA.y }
  const b = { ...boxSize(entB), x: entB.x, y: entB.y }
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2
  const bcx = b.x + b.w / 2, bcy = b.y + b.h / 2

  if (Math.abs(bcx - acx) >= Math.abs(bcy - acy)) {
    // Conexión horizontal
    const leftFirst = acx <= bcx
    return {
      pa: { x: leftFirst ? a.x + a.w : a.x, y: acy, angle: leftFirst ? 180 : 0 },
      pb: { x: leftFirst ? b.x : b.x + b.w, y: bcy, angle: leftFirst ? 0 : 180 },
    }
  }
  // Conexión vertical
  const topFirst = acy <= bcy
  return {
    pa: { x: acx, y: topFirst ? a.y + a.h : a.y, angle: topFirst ? 270 : 90 },
    pb: { x: bcx, y: topFirst ? b.y : b.y + b.h, angle: topFirst ? 90 : 270 },
  }
}

function tags(attr) {
  const t = []
  if (attr.pk) t.push('PK')
  if (attr.fk) t.push('FK')
  return t.join(', ')
}

export default function ERDiagram({ ancho = 560, alto = 400, entidades = [], relaciones = [] }) {
  const [sel, setSel] = useState(null) // 'e:<id>' | 'r:<índice>'
  const pick = (key) => setSel((s) => (s === key ? null : key))
  const byId = Object.fromEntries(entidades.map((e) => [e.id, e]))

  let info = null
  if (sel?.startsWith('e:')) {
    const e = byId[sel.slice(2)]
    info = (
      <>
        <strong>{e.nombre}</strong> — {e.descripcion}
        {e.atributos?.some((a) => a.pk) && (
          <> Su primary key es <strong>{e.atributos.filter((a) => a.pk).map((a) => a.nombre).join(' + ')}</strong>.</>
        )}
      </>
    )
  } else if (sel?.startsWith('r:')) {
    const r = relaciones[Number(sel.slice(2))]
    const de = byId[r.de], a = byId[r.a]
    info = (
      <>
        <strong>{de.nombre} {r.verbo} {a.nombre}</strong> — {r.descripcion}
        <br />· Por cada {a.nombre} hay {endLabel(r.extremoDe)} {de.nombre}.
        <br />· Por cada {de.nombre} hay {endLabel(r.extremoA)} {a.nombre}.
      </>
    )
  }

  return (
    <DiagramShell
      label="Diagrama entidad-relación · pata de gallo"
      minWidth={Math.min(ancho, 560)}
      info={info}
      hint="Toca una entidad o el verbo de una relación para leerla."
    >
      <svg className="dg-svg" viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label="Diagrama entidad-relación">
        {/* Relaciones debajo de las cajas */}
        {relaciones.map((r, i) => {
          const de = byId[r.de], a = byId[r.a]
          if (!de || !a) return null
          const { pa, pb } = anchors(de, a)
          const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2
          const key = `r:${i}`
          return (
            <g key={key}>
              <path className="dg-line" d={`M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}`} />
              <ConnectorEnd x={pa.x} y={pa.y} angle={pa.angle} card={r.extremoDe.card} min={r.extremoDe.min} />
              <ConnectorEnd x={pb.x} y={pb.y} angle={pb.angle} card={r.extremoA.card} min={r.extremoA.min} />
              <g className={`dg-hit${sel === key ? ' dg-hit--selected' : ''}`} role="button" tabIndex={0}
                aria-label={`Relación ${de.nombre} ${r.verbo} ${a.nombre}`}
                onClick={() => pick(key)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(key))}>
                <rect x={mx - 38} y={my - 20} width={76} height={20} fill="transparent" stroke="none" />
                <text className="dg-verb" x={mx} y={my - 6} textAnchor="middle">{r.verbo}</text>
              </g>
            </g>
          )
        })}

        {/* Entidades con atributos */}
        {entidades.map((e) => {
          const { w, h } = boxSize(e)
          const key = `e:${e.id}`
          return (
            <g key={key}
              className={`dg-entity dg-hit${sel === key ? ' dg-hit--selected' : ''}`}
              role="button" tabIndex={0} aria-label={`Entidad ${e.nombre}`}
              onClick={() => pick(key)}
              onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), pick(key))}>
              <rect x={e.x} y={e.y} width={w} height={h} rx={10} />
              <line x1={e.x} y1={e.y + HEADER_H} x2={e.x + w} y2={e.y + HEADER_H}
                stroke="var(--border)" strokeWidth="1" />
              <text className="dg-entity__name" x={e.x + w / 2} y={e.y + 17} textAnchor="middle">
                {e.nombre}
              </text>
              {(e.atributos ?? []).map((attr, i) => (
                <g key={attr.nombre}>
                  <text className={`dg-attr${attr.pk ? ' dg-attr--pk' : ''}`}
                    x={e.x + 10} y={e.y + HEADER_H + 13 + i * ROW_H}>
                    {attr.nombre}
                  </text>
                  {tags(attr) && (
                    <text className="dg-tag" x={e.x + w - 8} y={e.y + HEADER_H + 13 + i * ROW_H}
                      textAnchor="end">
                      {tags(attr)}
                    </text>
                  )}
                </g>
              ))}
            </g>
          )
        })}
      </svg>
    </DiagramShell>
  )
}
