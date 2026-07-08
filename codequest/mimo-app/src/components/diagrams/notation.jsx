// src/components/diagrams/notation.jsx
// Símbolos de cardinalidad para los extremos de una relación.
// Convención de coordenadas: (x, y) es el punto donde la línea toca el
// borde de la entidad; `angle` orienta el símbolo de modo que la línea
// llegue desde el eje -X local (angle = dirección hacia la otra entidad + 180).
//
// Semántica de cada extremo: describe CUÁNTAS instancias de ESA entidad
// participan por cada instancia de la otra.
//   card: '1' | 'N'   (máximo)    min: 0 | 1   (mínimo / opcionalidad)
//
// Notación pata de gallo (IE): símbolos de min y max en el extremo.
// Notación Barker (Oracle): pata de gallo solo para 'N'; la opcionalidad
// se dibuja en el trazo de la línea (mitad discontinua), no aquí.

export function ConnectorEnd({ x, y, angle = 0, card = '1', min = 1, notation = 'crowsfoot' }) {
  const many = card === 'N'
  return (
    <g className="dg-end" transform={`translate(${x} ${y}) rotate(${angle})`}>
      {many && (
        // Pata de gallo: tres puntas que tocan a la entidad (ambas notaciones)
        <path d="M -14 0 L 0 -7 M -14 0 L 0 0 M -14 0 L 0 7" />
      )}
      {notation === 'crowsfoot' && !many && (
        // Máximo uno: barra perpendicular
        <path d="M -14 -6 L -14 6" />
      )}
      {notation === 'crowsfoot' && (
        min === 0
          ? <circle cx={-22} cy={0} r={4.5} />           // mínimo cero: anillo
          : <path d="M -22 -6 L -22 6" />                 // mínimo uno: barra
      )}
    </g>
  )
}

// Texto corto de lectura de un extremo (para paneles de información)
export function endLabel({ card, min }) {
  if (card === 'N') return min === 0 ? 'cero, una o muchas' : 'una o muchas'
  return min === 0 ? 'cero o una' : 'exactamente una'
}
