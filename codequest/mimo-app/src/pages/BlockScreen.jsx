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
import StepRenderer, { isInteractive } from '../components/learning/StepRenderer.jsx'
import './LearningScreens.css'

export default function BlockScreen() {
  const { courseId, unitId, itemId } = useParams()
  const navigate = useNavigate()
  const { completeItem, isCompleted, saveErrors } = useProgress()

  const course = getCourse(courseId)
  const unit   = getUnit(courseId, unitId)
  const index  = unit ? unit.items.findIndex((i) => i.id === itemId) : -1
  const block  = index >= 0 ? unit.items[index] : null

  // ── Mode detection (priority order) ──────────────────────────────────────
  const hasSteps = !!block?.steps
  const questions = block?.questions ?? (block?.question ? [block.question] : [])
  const isMulti   = !hasSteps && !!block?.questions

  // ── Shared state ──────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null)
  const [checked, setChecked]   = useState(false)

  // ── Queue-based state (shared by isMulti and hasSteps modes) ─────────────
  const [queue, setQueue] = useState(() => {
    if (block?.steps)     return block.steps.map((_, i) => i)
    if (block?.questions) return block.questions.map((_, i) => i)
    return []
  })
  const [qPos, setQPos]               = useState(0)
  const [wrong, setWrong]             = useState([])
  const [totalErrors, setTotalErrors] = useState(0)
  const [phase, setPhase]             = useState('playing') // 'playing' | 'complete'
  const [isReview, setIsReview]       = useState(false)

  if (!block || block.type !== 'block') {
    return (
      <main className="container">
        <p>Bloque no encontrado. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const alreadyDone = isCompleted(courseId, block.id)
  const unitPath    = `/curso/${courseId}/unidad/${unitId}`

  // ── Active item helpers ───────────────────────────────────────────────────
  const activeStep           = hasSteps  ? block.steps[queue[qPos]]  : null
  const activeQ              = isMulti   ? questions[queue[qPos]]     : null
  const isInteractiveStep    = hasSteps  && activeStep && isInteractive(activeStep)
  const activeIsCorrect      = isMulti   && activeQ   ? selected === activeQ.correctIndex : false

  // ── Navigate to next item in the unit map ────────────────────────────────
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

  // ── Shared queue advance (used by both hasSteps and isMulti modes) ────────
  // Safe to read `wrong` here: handleCheck* fires on a prior render (separate
  // button click), so React has already committed the setWrong update.
  function handleAdvance() {
    const nextPos = qPos + 1
    if (nextPos < queue.length) {
      setQPos(nextPos)
      setSelected(null)
      setChecked(false)
    } else if (wrong.length > 0) {
      setQueue([...wrong])
      setQPos(0)
      setWrong([])
      setIsReview(true)
      setSelected(null)
      setChecked(false)
    } else {
      completeItem(courseId, block.id, block.xp)
      saveErrors(courseId, block.id, totalErrors)
      setPhase('complete')
      setSelected(null)
      setChecked(false)
    }
  }

  // ── Steps mode: check interactive answer ─────────────────────────────────
  function handleCheckSteps() {
    setChecked(true)
    if (selected !== activeStep.correctIndex) {
      setWrong((prev) => [...prev, queue[qPos]])
      setTotalErrors((prev) => prev + 1)
    }
  }

  // ── Multi-question mode: check answer ────────────────────────────────────
  function handleCheckMulti() {
    setChecked(true)
    if (selected !== activeQ.correctIndex) {
      setWrong((prev) => [...prev, queue[qPos]])
      setTotalErrors((prev) => prev + 1)
    }
  }

  // ── Legacy single-question mode ───────────────────────────────────────────
  const q         = block.question
  const isCorrect = !isMulti && !hasSteps && q ? selected === q.correctIndex : false

  function handleCheck() {
    setChecked(true)
    if (selected === q.correctIndex) {
      completeItem(courseId, block.id, block.xp)
    }
  }

  // ── Progress indicator text ───────────────────────────────────────────────
  function progressLabel(total) {
    const noun = hasSteps ? 'Paso' : 'Pregunta'
    const base = isReview
      ? `Repaso · ${qPos + 1} de ${queue.length}`
      : `${noun} ${qPos + 1} de ${total}`
    return totalErrors > 0
      ? `${base} · ${totalErrors} error${totalErrors !== 1 ? 'es' : ''}`
      : base
  }

  // ── Shared completion banner ──────────────────────────────────────────────
  function completionBanner() {
    return (
      <div className="feedback feedback--ok" style={{ marginBottom: 16 }}>
        <strong>¡Bloque completado! </strong>
        {totalErrors === 0
          ? 'Sin errores. Excelente dominio del tema.'
          : `${totalErrors} error${totalErrors !== 1 ? 'es' : ''} durante el repaso.`}
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="container learn">
      <Link to={unitPath} className="learn__back">‹ Volver a la unidad</Link>

      <article className="learn__card rise" style={{ '--accent': `var(--${course.accent})` }}>
        <LessonHeader tag={`Bloque · ${block.xp} XP`} title={block.title} />

        {/* Explanation + example only in legacy and multi modes — steps embed their own */}
        {!hasSteps && block.explanation && <ExplanationCard text={block.explanation} />}
        {!hasSteps && block.example && (
          <ExampleCard code={block.example.code} caption={block.example.caption} />
        )}

        <div className="quiz">

          {/* ── Steps mode ─────────────────────────────────── */}
          {hasSteps ? (
            <>
              {phase !== 'complete' && (
                <p className="learn__donenote faint" style={{ marginBottom: 10, textAlign: 'left' }}>
                  {progressLabel(block.steps.length)}
                </p>
              )}

              {phase === 'complete' ? completionBanner() : (
                <StepRenderer
                  step={activeStep}
                  selected={selected}
                  checked={checked}
                  onSelect={setSelected}
                />
              )}

              <div className="learn__actions">
                {phase === 'complete' ? (
                  <Button variant="success" size="lg" full onClick={goNext}>
                    Continuar →
                  </Button>
                ) : isInteractiveStep && !checked ? (
                  <Button
                    variant="primary" size="lg" full
                    disabled={selected === null}
                    onClick={handleCheckSteps}
                  >
                    Comprobar
                  </Button>
                ) : isInteractiveStep && checked ? (
                  <Button
                    variant={selected === activeStep.correctIndex ? 'primary' : 'soft'}
                    size="lg" full
                    onClick={handleAdvance}
                  >
                    Siguiente →
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" full onClick={handleAdvance}>
                    Siguiente →
                  </Button>
                )}
              </div>

              {alreadyDone && phase !== 'complete' && !isReview && qPos === 0 && (
                <p className="learn__donenote faint">Ya completaste este bloque. Puedes repasarlo.</p>
              )}
            </>

          /* ── Multi-question mode ───────────────────────── */
          ) : isMulti ? (
            <>
              {phase !== 'complete' && (
                <p className="learn__donenote faint" style={{ marginBottom: 10, textAlign: 'left' }}>
                  {progressLabel(questions.length)}
                </p>
              )}

              {phase === 'complete' ? completionBanner() : (
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
                    variant="primary" size="lg" full
                    disabled={selected === null}
                    onClick={handleCheckMulti}
                  >
                    Comprobar
                  </Button>
                ) : (
                  <Button
                    variant={activeIsCorrect ? 'primary' : 'soft'}
                    size="lg" full
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

          /* ── Legacy single-question mode ──────────────── */
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
