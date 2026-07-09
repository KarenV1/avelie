// src/pages/PracticeScreen.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit } from '../data/courses/index.js'
import { precargarPython, ejecutarPython } from '../lib/pyRunner.js'
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

// Compara la salida real con la esperada (string con \n o array de líneas),
// ignorando espacios al final de línea y líneas vacías finales.
function coincideSalida(salida, esperada) {
  const limpiar = (lineas) => {
    const l = lineas.map((x) => String(x).replace(/\s+$/, ''))
    while (l.length && l[l.length - 1] === '') l.pop()
    return l.join('\n')
  }
  const esperadaLineas = Array.isArray(esperada) ? esperada : String(esperada).split('\n')
  return limpiar(salida) === limpiar(esperadaLineas)
}

// Estado de consola a partir de un resultado real de Python.
function consolaPython(r, mensajeOk) {
  if (r.cargaFallida) {
    return {
      ok: false,
      message: 'No se pudo preparar el entorno Python (¿sin conexión?). Revisa tu red y vuelve a intentar.',
    }
  }
  if (r.timeout) {
    return {
      ok: false,
      message: 'Tu código no terminó en 10 segundos. ¿Un bucle infinito? Algo dentro del bucle debe acercarlo a su final.',
    }
  }
  if (!r.ok) {
    return {
      ok: false,
      message: r.traceback[r.traceback.length - 1] ?? 'Error de ejecución',
      columns: ['CONSOLA'],
      rows: [...r.salida, ...r.traceback].map((l) => [l]),
    }
  }
  return {
    ok: true,
    message: mensajeOk,
    columns: ['CONSOLA'],
    rows: (r.salida.length ? r.salida : ['(el programa no imprimió nada — ¿faltó un print?)']).map((l) => [l]),
  }
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
  const [ejecutando, setEjecutando] = useState(false)

  // Python real (Pyodide): precargar el motor mientras el alumno lee las
  // instrucciones, para que la primera ejecución no espere la descarga.
  const usaPython = course?.language === 'python'
  useEffect(() => {
    if (usaPython) precargarPython()
  }, [usaPython])

  if (!practice || practice.type !== 'practice') {
    return (
      <main className="container">
        <p>Práctica no encontrada. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const unitPath = `/curso/${courseId}/unidad/${unitId}`
  const coursePath = `/curso/${courseId}` // el camino continuo del curso

  async function handleRun() {
    setTab('consola')

    if (usaPython) {
      if (ejecutando) return
      setEjecutando(true)
      setConsole({ ok: true, message: 'Ejecutando tu código…' })
      const r = await ejecutarPython(code, practice.entradas, practice.archivos)
      setConsole(consolaPython(r, 'Ejecución terminada.'))
      setEjecutando(false)
      return
    }

    const ok = runValidators(code, practice.validators)
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

  async function handleValidate() {
    // Python real: validación en dos fases — la salida del programa debe
    // coincidir con la esperada Y el código debe usar las construcciones
    // pedidas (validators regex). Ver auditoría Pyodide aprobada.
    if (usaPython) {
      if (ejecutando) return
      setEjecutando(true)
      const estructuraOk = runValidators(code, practice.validators ?? [])
      const r = await ejecutarPython(code, practice.entradas, practice.archivos)
      const salidaOk = r.ok && (practice.salidaEsperada == null || coincideSalida(r.salida, practice.salidaEsperada))
      const ok = r.ok && estructuraOk && salidaOk
      setValidated(ok)
      setTab('consola')
      if (ok) {
        completeItem(courseId, practice.id, practice.xp)
        setConsole(consolaPython(r, practice.successMessage))
      } else {
        let estado = consolaPython(r, '')
        if (r.ok && !salidaOk) {
          estado = { ...estado, ok: false, message: 'El programa corre, pero su salida no es la esperada. Compárala con el enunciado.' }
        } else if (r.ok && !estructuraOk) {
          estado = { ...estado, ok: false, message: practice.failMessage }
        }
        setConsole(estado)
        if (!r.cargaFallida && hintsShown < practice.hints.length) {
          setHintsShown((n) => n + 1) // revela una pista al fallar
        }
      }
      setEjecutando(false)
      return
    }

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
