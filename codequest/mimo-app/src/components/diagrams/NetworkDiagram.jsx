// src/components/diagrams/NetworkDiagram.jsx
// Diagrama de red genérico y 100% data-driven: recibe nodos, enlaces y
// grupos como props (desde content_blocks.payload.props) y los dibuja
// con los primitivos compartidos. Sirve de base para los cursos de
// redes, nube y DFIR sin escribir componentes nuevos.
// Props:
//   label     — etiqueta del marco
//   ancho/alto— viewBox
//   nodos:    [{ id, x, y, w?, h?, titulo, subtitulo?, tag?, descripcion? }]
//   enlaces:  [{ de, a, tipo?: 'linea'|'flecha'|'doble', discontinuo?,
//                etiqueta?, descripcion? }]      (de/a = ids de nodos)
//   grupos:   [{ id, x, y, w, h, titulo, descripcion? }]  (zonas punteadas)
//   hint      — guía del panel cuando no hay selección
// Todo elemento con `descripcion` es seleccionable (tap/click/teclado)
// y muestra su definición en el panel inferior.
import { useState } from 'react'
import Diagram from './Diagram.jsx'
import { DiagramNode, DiagramConnector, DiagramContainer } from './primitives.jsx'

const NODO_W = 120
const NODO_H = 44

// Punto donde la línea centro→centro cruza el borde de la caja del nodo
function borde(nodo, haciaX, haciaY) {
  const w = nodo.w ?? NODO_W
  const h = nodo.h ?? NODO_H
  const cx = nodo.x + w / 2
  const cy = nodo.y + h / 2
  const dx = haciaX - cx
  const dy = haciaY - cy
  if (dx === 0 && dy === 0) return [cx, cy]
  const t = Math.min(
    dx !== 0 ? (w / 2) / Math.abs(dx) : Infinity,
    dy !== 0 ? (h / 2) / Math.abs(dy) : Infinity,
  )
  return [cx + dx * t, cy + dy * t]
}

function centro(nodo) {
  return [nodo.x + (nodo.w ?? NODO_W) / 2, nodo.y + (nodo.h ?? NODO_H) / 2]
}

export default function NetworkDiagram({
  label = 'Diagrama',
  ancho = 520,
  alto = 260,
  nodos = [],
  enlaces = [],
  grupos = [],
  hint = 'Toca un elemento del diagrama para ver qué es.',
}) {
  const [sel, setSel] = useState(null) // { tipo: 'nodo'|'enlace'|'grupo', id }
  const pick = (tipo, id) =>
    setSel((s) => (s && s.tipo === tipo && s.id === id ? null : { tipo, id }))

  const porId = Object.fromEntries(nodos.map((n) => [n.id, n]))

  let info = null
  if (sel?.tipo === 'nodo') info = porId[sel.id]?.descripcion ?? null
  if (sel?.tipo === 'grupo') info = grupos.find((g) => g.id === sel.id)?.descripcion ?? null
  if (sel?.tipo === 'enlace') info = enlaces[sel.id]?.descripcion ?? null

  return (
    <Diagram label={label} titulo={label} ancho={ancho} alto={alto} info={info} hint={hint}>
      {grupos.map((g) => (
        <DiagramContainer
          key={g.id}
          x={g.x} y={g.y} w={g.w} h={g.h}
          titulo={g.titulo}
          seleccionado={sel?.tipo === 'grupo' && sel.id === g.id}
          onSelect={g.descripcion ? () => pick('grupo', g.id) : null}
        />
      ))}

      {enlaces.map((e, i) => {
        const de = porId[e.de]
        const a = porId[e.a]
        if (!de || !a) return null
        const [cxA, cyA] = centro(a)
        const [cxD, cyD] = centro(de)
        const [x1, y1] = borde(de, cxA, cyA)
        const [x2, y2] = borde(a, cxD, cyD)
        return (
          <DiagramConnector
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            flecha={e.tipo === 'flecha' ? 'fin' : e.tipo === 'doble' ? 'ambas' : 'ninguna'}
            discontinua={Boolean(e.discontinuo)}
            etiqueta={e.etiqueta ?? null}
            seleccionado={sel?.tipo === 'enlace' && sel.id === i}
            onSelect={e.descripcion ? () => pick('enlace', i) : null}
          />
        )
      })}

      {nodos.map((n) => (
        <DiagramNode
          key={n.id}
          x={n.x} y={n.y} w={n.w} h={n.h}
          titulo={n.titulo}
          subtitulo={n.subtitulo ?? null}
          tag={n.tag ?? null}
          seleccionado={sel?.tipo === 'nodo' && sel.id === n.id}
          onSelect={n.descripcion ? () => pick('nodo', n.id) : null}
        />
      ))}
    </Diagram>
  )
}
