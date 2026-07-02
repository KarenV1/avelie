// src/pages/PracticeScreen.jsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import PracticeHeader from '../components/practice/PracticeHeader.jsx'
import InstructionsPanel from '../components/practice/InstructionsPanel.jsx'
import HintPanel from '../components/practice/HintPanel.jsx'
import CodeWorkspace from '../components/practice/CodeWorkspace.jsx'
import './LearningScreens.css'
import './PracticeScreen.css'

// Normaliza el código para validarlo: minúsculas, espacios colapsados, sin punto y coma final.
function normalize(code) {
  return code
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/;\s*$/, '')
    .trim()
}

// Todos los validadores (regex) deben cumplirse para considerar la respuesta correcta.
function runValidators(code, validators) {
  const norm = normalize(code)
  return validators.every((pattern) => new RegExp(pattern, 'i').test(norm))
}

export default function PracticeScreen() {
  const { courseId, unitId, itemId } = useParams()
  const navigate = useNavigate()
  const { completeItem, isCompleted } = useProgress()

  const course = getCourse(courseId)
  const unit = getUnit(courseId, unitId)
  const index = unit ? unit.items.findIndex((i) => i.id === itemId) : -1
  const practice = index >= 0 ? unit.items[index] : null

  const [code, setCode] = useState(practice ? practice.initialCode : '')
  const [tab, setTab] = useState('script') // script | consola
  const [console_, setConsole] = useState(null) // { ok, columns?, rows?, message }
  const [validated, setValidated] = useState(null) // null | true | false
  const [hintsShown, setHintsShown] = useState(0)

  if (!practice || practice.type !== 'practice') {
    return (
      <main className="container">
        <p>Práctica no encontrada. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const unitPath = `/curso/${courseId}/unidad/${unitId}`
  const coursePath = `/curso/${courseId}` // el camino continuo del curso

  function handleRun() {
    const ok = runValidators(code, practice.validators)
    setTab('consola')
    if (ok) {
      setConsole({ ok: true, ...practice.mockOutput, message: 'Consulta ejecutada correctamente.' })
    } else {
      setConsole({
        ok: false,
        message:
          'La consulta se ejecutó pero no produjo el resultado esperado. Revisa la sintaxis y las columnas.',
      })
    }
  }

  function handleValidate() {
    const ok = runValidators(code, practice.validators)
    setValidated(ok)
    if (ok) {
      completeItem(courseId, practice.id, practice.xp)
      setTab('consola')
      setConsole({ ok: true, ...practice.mockOutput, message: practice.successMessage })
    } else if (hintsShown < practice.hints.length) {
      setHintsShown((n) => n + 1) // revela una pista al fallar
    }
  }

  function goNext() {
    const next = unit.items[index + 1]
    if (!next) return navigate(coursePath)
    const kind = next.type === 'practice' ? 'practica' : 'bloque'
    navigate(`${unitPath}/${kind}/${next.id}`)
  }

  return (
    <main className="container learn">
      <Link to={coursePath} className="learn__back">‹ Volver al camino</Link>

      <div className="practice">
        <aside className="practice__brief rise">
          <PracticeHeader xp={practice.xp} title={practice.title} scenario={practice.scenario} />
          <InstructionsPanel instructions={practice.instructions} />
          <HintPanel
            hints={practice.hints}
            hintsShown={hintsShown}
            onShowHint={() => setHintsShown((n) => n + 1)}
          />
        </aside>

        <CodeWorkspace
          tab={tab}
          onTabChange={setTab}
          language={course.language}
          code={code}
          onCodeChange={(e) => setCode(e.target.value)}
          consoleState={console_}
          onRun={handleRun}
          onReset={() => setCode(practice.initialCode)}
          onValidate={handleValidate}
          onNext={goNext}
          validated={validated}
          failMessage={practice.failMessage}
          successMessage={practice.successMessage}
          isAlreadyDone={isCompleted(courseId, practice.id)}
        />
      </div>
    </main>
  )
}
