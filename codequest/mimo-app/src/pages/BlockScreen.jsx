// src/pages/BlockScreen.jsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, getUnit } from '../data/courses/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
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
  const { completeItem, isCompleted } = useProgress()

  const course = getCourse(courseId)
  const unit = getUnit(courseId, unitId)
  const index = unit ? unit.items.findIndex((i) => i.id === itemId) : -1
  const block = index >= 0 ? unit.items[index] : null

  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  if (!block || block.type !== 'block') {
    return (
      <main className="container">
        <p>Bloque no encontrado. <Link to="/">Inicio</Link></p>
      </main>
    )
  }

  const q = block.question
  const isCorrect = selected === q.correctIndex
  const alreadyDone = isCompleted(courseId, block.id)
  const unitPath = `/curso/${courseId}/unidad/${unitId}`

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

  return (
    <main className="container learn">
      <Link to={unitPath} className="learn__back">‹ Volver a la unidad</Link>

      <article className="learn__card rise" style={{ '--accent': `var(--${course.accent})` }}>
        <LessonHeader tag={`Bloque · ${block.xp} XP`} title={block.title} />
        <ExplanationCard text={block.explanation} />
        {block.example && <ExampleCard code={block.example.code} caption={block.example.caption} />}

        <div className="quiz">
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
        </div>
      </article>
    </main>
  )
}
