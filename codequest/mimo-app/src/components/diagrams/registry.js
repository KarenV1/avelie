// src/components/diagrams/registry.js
// Registro de componentes de diagrama. Los content_blocks de tipo
// 'diagrama' referencian estos componentes por nombre:
//   payload: { component: 'CardinalityDiagram', props: {…}, caption }
// Para agregar un diagrama nuevo: crear el componente en esta carpeta
// e inscribirlo aquí — el contenido en Supabase ya puede usarlo.
import CardinalityDiagram from './CardinalityDiagram.jsx'
import ERDiagram from './ERDiagram.jsx'
import DataModelsComparison from './DataModelsComparison.jsx'
import TableAnatomyDiagram from './TableAnatomyDiagram.jsx'
import NetworkDiagram from './NetworkDiagram.jsx'

const diagramRegistry = {
  CardinalityDiagram,
  ERDiagram,
  DataModelsComparison,
  TableAnatomyDiagram,
  NetworkDiagram, // genérico data-driven: redes, nube, DFIR…
  // M2: ERToRelationalSteps
  // M6: JoinDiagram
}

export function getDiagram(name) {
  const component = diagramRegistry[name] ?? null
  if (!component) console.warn(`Diagrama no registrado: ${name}`)
  return component
}
