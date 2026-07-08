// src/components/diagrams/DiagramShell.jsx
// Marco común de todos los diagramas del curso: etiqueta, lienzo con
// scroll horizontal en móvil, controles opcionales (toggles de notación,
// tabs) y panel de información para las partes interactivas.
// Los diagramas renderizan SVG inline con tokens CSS — nada de imágenes.
import './DiagramShell.css'

export default function DiagramShell({
  label,          // etiqueta corta arriba del lienzo
  controls,       // nodo opcional: toggles / tabs (usar <Button> de common)
  minWidth = 0,   // ancho mínimo del lienzo — activa scroll horizontal en móvil
  info,           // contenido del panel de definición (parte seleccionada)
  hint,           // texto guía cuando no hay nada seleccionado
  children,
}) {
  return (
    <figure className="dg">
      {label && <figcaption className="dg__label">{label}</figcaption>}
      {controls && <div className="dg__controls">{controls}</div>}
      <div className="dg__scroll">
        <div className="dg__canvas" style={minWidth ? { minWidth } : undefined}>
          {children}
        </div>
      </div>
      {(info || hint) && (
        <div className="dg__info" role="status" aria-live="polite">
          {info ?? <span className="dg__hint">{hint}</span>}
        </div>
      )}
    </figure>
  )
}
