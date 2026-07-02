// src/pages/BlockScreen.jsx
import { useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import LessonHeader from '../components/learning/LessonHeader.jsx'
import ExplanationCard from '../components/learning/ExplanationCard.jsx'
import ExampleCard from '../components/learning/ExampleCard.jsx'
import MiniQuestion from '../components/learning/MiniQuestion.jsx'
import FeedbackBox from '../components/learning/FeedbackBox.jsx'
import LessonNavigation from '../components/learning/LessonNavigation.jsx'
import StepRenderer, { isInteractive } from '../components/learning/StepRenderer.jsx'
import '../components/common/ByteMascot.css'
import './LearningScreens.css'

/* ── Avance de pasos: siempre puntitos + contador (sistema único en toda lección) ── */
function ProgressDots({ total, current }) {
  if (total <= 1) return null
  return (
    <div className={`progress-dots${total > 20 ? ' progress-dots--dense' : ''}`}>
      <div className="progress-dots__row">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`progress-dots__dot ${
              i < current ? 'progress-dots__dot--done' :
              i === current ? 'progress-dots__dot--active' : ''
            }`}
          />
        ))}
      </div>
      <span className="progress-dots__label">{current + 1}/{total}</span>
    </div>
  )
}

export default function BlockScreen() {
  const { courseId, unitId, itemId } = useParams()
  const navigate = useNavigate()
  const { completeItem, isCompleted, saveErrors } = useProgress()

  const course = getCourse(courseId)
  const unit   = getUnit(courseId, unitId)
  const index  = unit ? unit.items.findIndex((i) => i.id === itemId) : -1
  const block  = index >= 0 ? unit.items[index] : null

  const hasSteps = !!block?.steps
  const questions = block?.questions ?? (block?.question ? [block.question] : [])
  const isMulti   = !hasSteps && !!block?.questions

  const [selected, setSelected] = useState(null)
  const [checked, setChecked]   = useState(false)

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
  // Respuestas por posición de la cola — permite volver atrás para repasar
  // sin perder lo contestado ni contar errores dos veces
  const [answers, setAnswers]         = useState({})

  const wrongQuestionsRef = useRef([])

  if (!block || block.type !== 'block') {
    return (
      <main className="container">
        <p>Bloque no encontrado. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const alreadyDone = isCompleted(courseId, block.id)
  const unitPath    = `/curso/${courseId}/unidad/${unitId}`
  const coursePath  = `/curso/${courseId}` // el camino continuo del curso

  const activeStep        = hasSteps ? block.steps[queue[qPos]] : null
  const activeQ           = isMulti  ? questions[queue[qPos]]   : null
  const isInteractiveStep = hasSteps && activeStep && isInteractive(activeStep)
  const activeIsCorrect   = isMulti  && activeQ   ? selected === activeQ.correctIndex : false

  function goNext() {
    const next = unit.items[index + 1]
    if (!next) return navigate(coursePath)
    if (isCompleted(courseId, block.id)) {
      const kind = next.type === 'practice' ? 'practica' : 'bloque'
      navigate(`${unitPath}/${kind}/${next.id}`)
    } else {
      navigate(coursePath)
    }
  }

  // Navega a una posición de la cola restaurando su respuesta guardada (si existe)
  function goToPos(pos) {
    const saved = answers[pos]
    setQPos(pos)
    setSelected(saved ? saved.selected : null)
    setChecked(saved ? saved.checked : false)
  }

  function handleBack() {
    if (qPos === 0) return
    // conserva la selección en curso del paso actual antes de retroceder
    setAnswers((prev) => ({ ...prev, [qPos]: { selected, checked } }))
    goToPos(qPos - 1)
  }

  function handleAdvance() {
    const nextPos = qPos + 1
    if (nextPos < queue.length) {
      goToPos(nextPos)
    } else if (wrong.length > 0) {
      setQueue([...wrong]); setQPos(0); setWrong([])
      setIsReview(true); setSelected(null); setChecked(false)
      setAnswers({})
    } else {
      completeItem(courseId, block.id, block.xp)
      saveErrors(courseId, block.id, totalErrors, wrongQuestionsRef.current)
      setPhase('complete'); setSelected(null); setChecked(false)
    }
  }

  function handleCheckSteps() {
    setChecked(true)
    setAnswers((prev) => ({ ...prev, [qPos]: { selected, checked: true } }))
    if (selected !== activeStep.correctIndex) {
      if (!isReview) {
        setWrong((prev) => [...prev, queue[qPos]])
        wrongQuestionsRef.current.push({
          questionId: activeStep.id ?? `${block.id}_q${queue[qPos]}`,
          prompt: activeStep.prompt ?? activeStep.text ?? null,
          topic: block.topic ?? null, unitId,
        })
      }
      setTotalErrors((prev) => prev + 1)
    }
  }

  function handleCheckMulti() {
    setChecked(true)
    setAnswers((prev) => ({ ...prev, [qPos]: { selected, checked: true } }))
    if (selected !== activeQ.correctIndex) {
      if (!isReview) {
        setWrong((prev) => [...prev, queue[qPos]])
        wrongQuestionsRef.current.push({
          questionId: activeQ.id ?? `${block.id}_q${queue[qPos]}`,
          prompt: activeQ.prompt ?? null,
          topic: block.topic ?? null, unitId,
        })
      }
      setTotalErrors((prev) => prev + 1)
    }
  }

  // Legacy single-question
  const q         = block.question
  const isCorrect = !isMulti && !hasSteps && q ? selected === q.correctIndex : false

  function handleCheck() {
    setChecked(true)
    if (selected === q.correctIndex) completeItem(courseId, block.id, block.xp)
  }

  // ── Full-page completion screen ───────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <main className="complete-screen">
        <div className="complete-screen__mascot">
          <ByteMascot size={160} mood="celebrate" />
        </div>
        <div className="complete-screen__body">
          <p className="complete-screen__title">¡Bloque completado!</p>
          <div className="complete-screen__xp">
            ⚡ +{block.xp} XP
          </div>
          <p className="complete-screen__sub">
            {totalErrors === 0
              ? '¡Sin errores! Excelente dominio del tema. 🎉'
              : `Reforzaste ${totalErrors} pregunta${totalErrors !== 1 ? 's' : ''} hasta dominarla${totalErrors !== 1 ? 's' : ''}. ¡Sigue así! 🚀`}
          </p>
          <div className="complete-screen__actions">
            <Button variant="primary" size="lg" full onClick={goNext}>
              Continuar
            </Button>
            {totalErrors > 0 && (
              <Button variant="ghost" size="lg" full onClick={() => navigate('/repasar-errores')}>
                Depurar errores ({totalErrors})
              </Button>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ── Normal block screen ───────────────────────────────────────────────────
  const totalSteps = hasSteps ? block.steps.length : isMulti ? questions.length : 0

  return (
    <main className="container learn">
      <Link to={coursePath} className="learn__back">‹ Volver al camino</Link>

      <article className="learn__card rise" style={{ '--accent': `var(--${course.accent})` }}>
        <LessonHeader tag={`Bloque · ${block.xp} XP`} title={block.title} />

        {!hasSteps && block.explanation && <ExplanationCard text={block.explanation} />}
        {!hasSteps && block.example && (
          <ExampleCard code={block.example.code} caption={block.example.caption} />
        )}

        <div className="quiz">

          {/* ── Steps mode ── */}
          {hasSteps ? (
            <>
              <ProgressDots total={block.steps.length} current={qPos} />
              {isReview && (
                <p className="learn__donenote faint" style={{ marginBottom: 8 }}>
                  Repaso · {qPos + 1} de {queue.length}
                </p>
              )}
              <StepRenderer
                step={activeStep}
                selected={selected}
                checked={checked}
                onSelect={setSelected}
              />
              <div className="learn__actions learn__actions--row">
                {qPos > 0 && (
                  <Button variant="ghost" size="lg" onClick={handleBack} aria-label="Paso anterior">
                    ‹
                  </Button>
                )}
                {isInteractiveStep && !checked ? (
                  <Button variant="primary" size="lg" full
                    disabled={selected === null} onClick={handleCheckSteps}>
                    Comprobar
                  </Button>
                ) : isInteractiveStep && checked ? (
                  <Button variant={selected === activeStep.correctIndex ? 'primary' : 'soft'}
                    size="lg" full onClick={handleAdvance}>
                    Siguiente →
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" full onClick={handleAdvance}>
                    Siguiente →
                  </Button>
                )}
              </div>
              {alreadyDone && !isReview && qPos === 0 && (
                <p className="learn__donenote faint">Ya completaste este bloque. Puedes repasarlo.</p>
              )}
            </>

          /* ── Multi-question mode ── */
          ) : isMulti ? (
            <>
              <ProgressDots total={questions.length} current={qPos} />
              {isReview && (
                <p className="learn__donenote faint" style={{ marginBottom: 8 }}>
                  Repaso · {qPos + 1} de {queue.length}
                </p>
              )}
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
              <div className="learn__actions learn__actions--row">
                {qPos > 0 && (
                  <Button variant="ghost" size="lg" onClick={handleBack} aria-label="Pregunta anterior">
                    ‹
                  </Button>
                )}
                {!checked ? (
                  <Button variant="primary" size="lg" full
                    disabled={selected === null} onClick={handleCheckMulti}>
                    Comprobar
                  </Button>
                ) : (
                  <Button variant={activeIsCorrect ? 'primary' : 'soft'}
                    size="lg" full onClick={handleAdvance}>
                    Siguiente →
                  </Button>
                )}
              </div>
              {alreadyDone && !isReview && qPos === 0 && !checked && (
                <p className="learn__donenote faint">Ya completaste este bloque. Puedes repasarlo.</p>
              )}
            </>

          /* ── Legacy single-question mode ── */
          ) : (
            <>
              <MiniQuestion question={q} selected={selected} checked={checked} onSelect={setSelected} />
              <FeedbackBox
                show={checked} isCorrect={isCorrect}
                correct={q.feedback.correct} incorrect={q.feedback.incorrect}
              />
              <LessonNavigation
                checked={checked} isCorrect={isCorrect} hasSelection={selected !== null}
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
