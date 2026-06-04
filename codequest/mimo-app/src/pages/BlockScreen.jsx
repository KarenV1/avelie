// src/pages/BlockScreen.jsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Button from '../components/common/Button.jsx'
import LessonHeader from '../components/learning/LessonHeader.jsx'
import ExplanationCard from '../components/learning/ExplanationCard.jsx'
import ExampleCard from '../components/learning/ExampleCard.jsx'
import MiniQuestion from '../components/learning/MiniQuestion.jsx'
import FeedbackBox from '../components/learning/FeedbackBox.jsx'
import LessonNavigation from '../components/learning/LessonNavigation.jsx'
import './LearningScreens.css'

export default function BlockScreen() {
  const { courseId, unitId, itemId } = useParams()
  const navigate = useNavigate()
  const { completeItem, isCompleted, saveErrors } = useProgress()

  const course = getCourse(courseId)
  const unit = getUnit(courseId, unitId)
  const index = unit ? unit.items.findIndex((i) => i.id === itemId) : -1
  const block = index >= 0 ? unit.items[index] : null

  // Soporta ambos formatos: question (singular, legado) y questions (array, nuevo)
  const questions = block?.questions ?? (block?.question ? [block.question] : [])
  const isMulti = !!block?.questions

  // Estado compartido
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  // Estado exclusivo del flujo multi-pregunta
  const [queue, setQueue] = useState(() => questions.map((_, i) => i))
  const [qPos, setQPos] = useState(0)
  const [wrong, setWrong] = useState([])       // índices erróneos del round actual
  const [totalErrors, setTotalErrors] = useState(0)
  const [phase, setPhase] = useState('playing') // 'playing' | 'complete'
  const [isReview, setIsReview] = useState(false)

  if (!block || block.type !== 'block') {
    return (
      <main className="container">
        <p>Bloque no encontrado. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const alreadyDone = isCompleted(courseId, block.id)
  const unitPath = `/curso/${courseId}/unidad/${unitId}`

  // ── Flujo legado (question singular) ──────────────────────────────────────
  const q = block.question
  const isCorrect = !isMulti && q ? selected === q.correctIndex : false

  function handleCheck() {
    setChecked(true)
    if (selected === q.correctIndex) {
      completeItem(courseId, block.id, block.xp)
    }
  }

  function goNext() {
    const next = unit.items[index + 1]
    if (!next) return navigate(unitPath)
    // Solo navegamos directo si el siguiente quedó desbloqueado (este bloque ya está completo)
    if (isCompleted(courseId, block.id)) {
      const kind = next.type === 'practice' ? 'practica' : 'bloque'
      navigate(`${unitPath}/${kind}/${next.id}`)
    } else {
      navigate(unitPath)
    }
  }

  // ── Flujo multi-pregunta ───────────────────────────────────────────────────
  const activeQ = isMulti ? questions[queue[qPos]] : null
  const activeIsCorrect = isMulti && activeQ ? selected === activeQ.correctIndex : false

  function handleCheckMulti() {
    setChecked(true)
    if (selected !== activeQ.correctIndex) {
      setWrong((prev) => [...prev, queue[qPos]])
      setTotalErrors((prev) => prev + 1)
    }
  }

  // Llamado al pulsar "Siguiente →". Lee `wrong` del render en que se creó
  // (después de que handleCheckMulti ya actualizó el estado en el render anterior).
  function handleAdvance() {
    const nextPos = qPos + 1
    if (nextPos < queue.length) {
      setQPos(nextPos)
      setSelected(null)
      setChecked(false)
    } else if (wrong.length > 0) {
      // Hay errores: reiniciar con solo las preguntas fallidas
      setQueue([...wrong])
      setQPos(0)
      setWrong([])
      setIsReview(true)
      setSelected(null)
      setChecked(false)
    } else {
      // Todas correctas: completar bloque
      completeItem(courseId, block.id, block.xp)
      saveErrors(courseId, block.id, totalErrors)
      setPhase('complete')
      setSelected(null)
      setChecked(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="container learn">
      <Link to={unitPath} className="learn__back">‹ Volver a la unidad</Link>

      <article className="learn__card rise" style={{ '--accent': `var(--${course.accent})` }}>
        <LessonHeader tag={`Bloque · ${block.xp} XP`} title={block.title} />
        <ExplanationCard text={block.explanation} />
        {block.example && <ExampleCard code={block.example.code} caption={block.example.caption} />}

        <div className="quiz">
          {isMulti ? (
            <>
              {phase !== 'complete' && (
                <p className="learn__donenote faint" style={{ marginBottom: 10, textAlign: 'left' }}>
                  {isReview
                    ? `Repaso · ${qPos + 1} de ${queue.length}`
                    : `Pregunta ${qPos + 1} de ${questions.length}`}
                  {totalErrors > 0 && ` · ${totalErrors} error${totalErrors !== 1 ? 'es' : ''}`}
                </p>
              )}

              {phase === 'complete' ? (
                <div className="feedback feedback--ok" style={{ marginBottom: 16 }}>
                  <strong>¡Bloque completado! </strong>
                  {totalErrors === 0
                    ? 'Sin errores. Excelente dominio del tema.'
                    : `${totalErrors} error${totalErrors !== 1 ? 'es' : ''} cometido${totalErrors !== 1 ? 's' : ''} durante el repaso.`}
                </div>
              ) : (
                <>
                  <MiniQuestion
                    question={activeQ}
                    selected={selected}
                    checked={checked}
                    onSelect={setSelected}
                  />
                  <FeedbackBox
                    show={checked}
                    isCorrect={activeIsCorrect}
                    correct={activeQ.feedback.correct}
                    incorrect={activeQ.feedback.incorrect}
                  />
                </>
              )}

              <div className="learn__actions">
                {phase === 'complete' ? (
                  <Button variant="success" size="lg" full onClick={goNext}>
                    Continuar →
                  </Button>
                ) : !checked ? (
                  <Button
                    variant="primary"
                    size="lg"
                    full
                    disabled={selected === null}
                    onClick={handleCheckMulti}
                  >
                    Comprobar
                  </Button>
                ) : (
                  <Button
                    variant={activeIsCorrect ? 'primary' : 'soft'}
                    size="lg"
                    full
                    onClick={handleAdvance}
                  >
                    Siguiente →
                  </Button>
                )}
              </div>

              {alreadyDone && phase !== 'complete' && !isReview && qPos === 0 && !checked && (
                <p className="learn__donenote faint">Ya completaste este bloque. Puedes repasarlo.</p>
              )}
            </>
          ) : (
            <>
              <MiniQuestion
                question={q}
                selected={selected}
                checked={checked}
                onSelect={setSelected}
              />
              <FeedbackBox
                show={checked}
                isCorrect={isCorrect}
                correct={q.feedback.correct}
                incorrect={q.feedback.incorrect}
              />
              <LessonNavigation
                checked={checked}
                isCorrect={isCorrect}
                hasSelection={selected !== null}
                alreadyDone={alreadyDone}
                onCheck={handleCheck}
                onRetry={() => { setChecked(false); setSelected(null) }}
                onContinue={goNext}
              />
            </>
          )}
        </div>
      </article>
    </main>
  )
}
