// src/components/diagrams/primitives.jsx
// Primitivos SVG reutilizables por todos los diagramas de todos los
// cursos. Comparten el vocabulario visual de DiagramShell.css (tokens):
//   <DiagramNode>      caja con título/subtítulo, seleccionable
//   <DiagramConnector> línea/flecha entre dos puntos, seleccionable
//   <DiagramContainer> agrupador punteado con etiqueta (zonas, subredes…)
// Patrón de interacción: el padre controla la selección (seleccionado +
// onSelect) y muestra la definición en el panel info del Diagram.

// Props de accesibilidad compartidas por los elementos seleccionables
function hitProps(label, onSelect) {
  if (!onSelect) return {}
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    onClick: onSelect,
    onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect()),
  }
}

// ── Nodo: caja con título y subtítulo ────────────────────────────────
export function DiagramNode({
  x, y, w = 120, h = 44,
  titulo, subtitulo = null, tag = null,
  seleccionado = false, onSelect = null,
}) {
  const clases = ['dg-node']
  if (onSelect) clases.push('dg-hit')
  if (seleccionado) clases.push('dg-hit--selected')
  const cy = y + (subtitulo ? h / 2 - 4 : h / 2 + 4)
  return (
    <g className={clases.join(' ')} {...hitProps(titulo, onSelect)}>
      <rect x={x} y={y} width={w} height={h} rx={10} />
      <text className="dg-entity__name" x={x + w / 2} y={cy} textAnchor="middle">{titulo}</text>
      {subtitulo && (
        <text className="dg-node__sub" x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle">
          {subtitulo}
        </text>
      )}
      {tag && (
        <text className="dg-tag" x={x + w - 6} y={y + 12} textAnchor="end">{tag}</text>
      )}
    </g>
  )
}

// ── Conector: línea o flecha entre dos puntos ────────────────────────
// flecha: 'ninguna' | 'fin' | 'ambas' · discontinua: opcionalidad/flujo
export function DiagramConnector({
  x1, y1, x2, y2,
  flecha = 'ninguna', discontinua = false, etiqueta = null,
  seleccionado = false, onSelect = null,
}) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const punta = (x, y, a) => {
    const p1 = [x - 9 * Math.cos(a - 0.42), y - 9 * Math.sin(a - 0.42)]
    const p2 = [x - 9 * Math.cos(a + 0.42), y - 9 * Math.sin(a + 0.42)]
    return `M ${p1[0]} ${p1[1]} L ${x} ${y} L ${p2[0]} ${p2[1]}`
  }
  const clases = ['dg-conn']
  if (onSelect) clases.push('dg-hit')
  if (seleccionado) clases.push('dg-hit--selected')
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <g className={clases.join(' ')} {...hitProps(etiqueta ?? 'conector', onSelect)}>
      {/* zona táctil ancha e invisible sobre la línea */}
      {onSelect && <line className="dg-conn-hit" x1={x1} y1={y1} x2={x2} y2={y2} />}
      <line
        className={`dg-line${discontinua ? ' dg-line--dashed' : ''}`}
        x1={x1} y1={y1} x2={x2} y2={y2}
      />
      {(flecha === 'fin' || flecha === 'ambas') && (
        <path className="dg-end" d={punta(x2, y2, ang)} />
      )}
      {flecha === 'ambas' && (
        <path className="dg-end" d={punta(x1, y1, ang + Math.PI)} />
      )}
      {etiqueta && (
        <text className="dg-verb" x={mx} y={my - 6} textAnchor="middle">{etiqueta}</text>
      )}
    </g>
  )
}

// ── Agrupador: zona punteada con etiqueta (subred, DMZ, esquema…) ────
export function DiagramContainer({
  x, y, w, h,
  titulo = null,
  seleccionado = false, onSelect = null,
  children,
}) {
  const clases = ['dg-container']
  if (onSelect) clases.push('dg-hit')
  if (seleccionado) clases.push('dg-hit--selected')
  return (
    <g className={clases.join(' ')} {...hitProps(titulo, onSelect)}>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      {titulo && (
        <text className="dg-container__label" x={x + 10} y={y + 16}>{titulo}</text>
      )}
      {children}
    </g>
  )
}
