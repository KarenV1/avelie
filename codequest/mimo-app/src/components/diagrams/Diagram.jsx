// src/components/diagrams/Diagram.jsx
// Contenedor base de todo diagrama: DiagramShell (marco, controles,
// scroll horizontal y panel de definiciones) + el <svg> con viewBox.
// Los diagramas específicos solo dibujan su contenido como children.
// Props:
//   label      — etiqueta del marco ('Diagrama · Red de la clínica')
//   titulo     — descripción accesible del SVG (aria-label)
//   ancho/alto — dimensiones del viewBox (unidades internas del dibujo)
//   minWidth   — ancho mínimo antes de hacer scroll horizontal
//   controls   — botones/chips sobre el lienzo (usar <Button size="sm">)
//   info       — definición de la parte seleccionada (JSX) o null
//   hint       — texto guía cuando no hay selección
import DiagramShell from './DiagramShell.jsx'

export default function Diagram({
  label,
  titulo,
  ancho = 520,
  alto = 200,
  minWidth = 480,
  controls = null,
  info = null,
  hint = null,
  children,
}) {
  return (
    <DiagramShell label={label} minWidth={minWidth} controls={controls} info={info} hint={hint}>
      <svg className="dg-svg" viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={titulo ?? label}>
        {children}
      </svg>
    </DiagramShell>
  )
}
