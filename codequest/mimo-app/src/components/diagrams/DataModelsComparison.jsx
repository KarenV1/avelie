// src/components/diagrams/DataModelsComparison.jsx
// Los cuatro tipos de modelos de datos (jerárquico, red, relacional,
// documental) mostrando LOS MISMOS datos del hospital en cada uno:
// la paciente Ana Torres, sus dos citas y la Dra. Reyes.
// Tabs para cambiar de modelo; el panel inferior explica cada uno.
import { useState } from 'react'
import Button from '../common/Button.jsx'
import DiagramShell from './DiagramShell.jsx'

function Node({ x, y, w = 150, label, sub = null }) {
  return (
    <g className="dg-node">
      <rect x={x} y={y} width={w} height={sub ? 34 : 26} rx={8} />
      <text className="dg-attr" x={x + w / 2} y={y + 17} textAnchor="middle">{label}</text>
      {sub && <text className="dg-tag" x={x + w / 2} y={y + 29} textAnchor="middle">{sub}</text>}
    </g>
  )
}

function MiniTable({ x, y, title, widths, head, rows }) {
  const totalW = widths.reduce((a, b) => a + b, 0)
  const colX = widths.map((_, i) => x + widths.slice(0, i).reduce((a, b) => a + b, 0))
  return (
    <g>
      <text className="dg-entity__name" x={x} y={y - 6} style={{ fontSize: 10 }}>{title}</text>
      {head.map((h, i) => (
        <g key={h}>
          <rect className="dg-cell dg-cell--head" x={colX[i]} y={y} width={widths[i]} height={18} />
          <text className="dg-mono dg-mono--head" x={colX[i] + 5} y={y + 12}>{h}</text>
        </g>
      ))}
      {rows.map((row, r) => row.map((cell, i) => (
        <g key={`${r}-${i}`}>
          <rect className="dg-cell" x={colX[i]} y={y + 18 + r * 18} width={widths[i]} height={18} />
          <text className="dg-mono" x={colX[i] + 5} y={y + 30 + r * 18}>{cell}</text>
        </g>
      )))}
      {/* marco */}
      <rect className="dg-cell" x={x} y={y} width={totalW} height={18 + rows.length * 18} fill="none" />
    </g>
  )
}

const MODELS = {
  jerarquico: {
    nombre: 'Jerárquico',
    info: 'Modelo jerárquico (años 60, IBM IMS — aún vivo en mainframes bancarios). Los datos forman un árbol: cada registro tiene UN solo padre. Como la Dra. Reyes atiende las dos citas, su registro se duplica bajo cada una, y preguntar "todas las citas de la Dra. Reyes" obliga a recorrer el árbol completo.',
  },
  red: {
    nombre: 'De red',
    info: 'Modelo de red (CODASYL, años 70). Un registro puede tener varios padres, así que la Dra. Reyes existe UNA sola vez y las citas apuntan a ella. Resuelve la duplicación, pero navegar los punteros exige conocer la estructura física de la base.',
  },
  relacional: {
    nombre: 'Relacional',
    info: 'Modelo relacional (E. F. Codd, 1970). Los datos viven en tablas conectadas por llaves: CITA referencia a PACIENTE y MEDICO con foreign keys, sin duplicar ni usar punteros físicos. Se consulta con SQL de forma declarativa. Es el modelo de Oracle y el corazón de este curso.',
  },
  documental: {
    nombre: 'Documental',
    info: 'Modelo documental (MongoDB y similares, años 2010). Cada paciente es un documento JSON autocontenido: leerlo completo es una sola operación, ideal para datos que siempre viajan juntos. El costo: la médica se repite dentro del documento y las consultas cruzadas ("todas las citas de la Dra. Reyes") se complican.',
  },
}

function Jerarquico() {
  return (
    <svg className="dg-svg" viewBox="0 0 520 240" role="img" aria-label="Modelo jerárquico: árbol con datos duplicados">
      <path className="dg-line" d="M 260 48 L 135 88" />
      <path className="dg-line" d="M 260 48 L 385 88" />
      <path className="dg-line" d="M 135 122 L 135 158" />
      <path className="dg-line" d="M 385 122 L 385 158" />
      <Node x={185} y={16} label="PACIENTE · Ana Torres" />
      <Node x={60} y={88} label="CITA · 12/03" sub="hijo de Ana" />
      <Node x={310} y={88} label="CITA · 04/05" sub="hijo de Ana" />
      <Node x={60} y={158} label="MÉDICA · Dra. Reyes" sub="duplicada" />
      <Node x={310} y={158} label="MÉDICA · Dra. Reyes" sub="duplicada" />
      <text className="dg-note" x={260} y={228} textAnchor="middle">
        La Dra. Reyes se repite bajo cada cita: mismo dato, dos registros.
      </text>
    </svg>
  )
}

function Red() {
  return (
    <svg className="dg-svg" viewBox="0 0 520 240" role="img" aria-label="Modelo de red: registros con varios padres">
      <path className="dg-line" d="M 160 60 L 235 40" />
      <path className="dg-line" d="M 160 76 L 235 140" />
      <path className="dg-line" d="M 385 40 L 430 96" />
      <path className="dg-line" d="M 385 140 L 430 116" />
      <Node x={10} y={50} label="PACIENTE · Ana Torres" />
      <Node x={235} y={16} label="CITA · 12/03" />
      <Node x={235} y={128} label="CITA · 04/05" />
      <Node x={360} y={90} label="MÉDICA · Dra. Reyes" sub="un solo registro" />
      <text className="dg-note" x={260} y={228} textAnchor="middle">
        Las dos citas apuntan a la misma médica: sin duplicar, pero navegando punteros.
      </text>
    </svg>
  )
}

function Relacional() {
  return (
    <svg className="dg-svg" viewBox="0 0 520 240" role="img" aria-label="Modelo relacional: tablas conectadas por llaves">
      <MiniTable x={10} y={30} title="PACIENTE"
        widths={[80, 90]} head={['paciente_id', 'nombre']}
        rows={[['1', 'Ana Torres']]} />
      <MiniTable x={10} y={120} title="MEDICO"
        widths={[75, 90]} head={['medico_id', 'nombre']}
        rows={[['9', 'Dra. Reyes']]} />
      <MiniTable x={240} y={70} title="CITA"
        widths={[55, 80, 70, 55]} head={['cita_id', 'paciente_id', 'medico_id', 'fecha']}
        rows={[['501', '1', '9', '12/03'], ['502', '1', '9', '04/05']]} />
      <path className="dg-line dg-line--dashed" d="M 240 96 C 210 88, 200 66, 180 57" />
      <path className="dg-line dg-line--dashed" d="M 240 116 C 210 130, 205 145, 175 147" />
      <text className="dg-note" x={260} y={228} textAnchor="middle">
        CITA referencia a PACIENTE y MEDICO con llaves foráneas — sin duplicar nada.
      </text>
    </svg>
  )
}

const DOC_LINES = [
  '{',
  '  "paciente": "Ana Torres",',
  '  "citas": [',
  '    { "fecha": "12/03",',
  '      "medica": "Dra. Reyes" },',
  '    { "fecha": "04/05",',
  '      "medica": "Dra. Reyes" }',
  '  ]',
  '}',
]

function Documental() {
  return (
    <svg className="dg-svg" viewBox="0 0 520 240" role="img" aria-label="Modelo documental: un documento JSON autocontenido">
      <g className="dg-node">
        <rect x={130} y={14} width={260} height={182} rx={10} />
      </g>
      {DOC_LINES.map((line, i) => (
        <text key={i} className="dg-mono" x={146} y={38 + i * 18} style={{ whiteSpace: 'pre' }}>
          {line}
        </text>
      ))}
      <text className="dg-note" x={260} y={228} textAnchor="middle">
        Todo viaja junto en un documento; la médica vuelve a repetirse adentro.
      </text>
    </svg>
  )
}

const VIEWS = { jerarquico: Jerarquico, red: Red, relacional: Relacional, documental: Documental }

export default function DataModelsComparison({ inicial = 'jerarquico' }) {
  const [model, setModel] = useState(inicial in MODELS ? inicial : 'jerarquico')
  const View = VIEWS[model]

  return (
    <DiagramShell
      label={`Tipos de modelos de datos · ${MODELS[model].nombre}`}
      minWidth={480}
      controls={Object.entries(MODELS).map(([key, m]) => (
        <Button key={key} size="sm"
          variant={model === key ? 'primary' : 'ghost'}
          aria-pressed={model === key}
          onClick={() => setModel(key)}>
          {m.nombre}
        </Button>
      ))}
      info={MODELS[model].info}
    >
      <View />
    </DiagramShell>
  )
}
