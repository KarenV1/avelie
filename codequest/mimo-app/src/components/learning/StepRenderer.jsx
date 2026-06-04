import MiniQuestion from './MiniQuestion.jsx'
import FeedbackBox from './FeedbackBox.jsx'

const INTERACTIVE_TYPES = new Set([
  'multiple_choice', 'fill_blank', 'code_choice', 'debug', 'table_reading',
])

export function isInteractive(step) {
  return INTERACTIVE_TYPES.has(step.type)
}

// Maps a step object to the shape MiniQuestion expects
function toQuestion(step) {
  return {
    context: step.code ?? step.table ?? null,
    prompt: step.prompt,
    options: step.options,
    correctIndex: step.correctIndex,
    feedback: step.feedback,
  }
}

export default function StepRenderer({ step, selected, checked, onSelect }) {
  switch (step.type) {
    case 'info':
      return (
        <div className="learn__example">
          <p className="quiz__prompt" style={{ marginBottom: 10 }}>{step.title}</p>
          <p className="learn__explanation">{step.body}</p>
        </div>
      )

    case 'example':
      return (
        <div className="learn__example">
          {step.title && (
            <p className="quiz__prompt" style={{ marginBottom: 10 }}>{step.title}</p>
          )}
          <pre className="code-block"><code>{step.code}</code></pre>
          {step.caption && (
            <p className="learn__caption faint">{step.caption}</p>
          )}
        </div>
      )

    case 'multiple_choice':
    case 'fill_blank':
    case 'code_choice':
    case 'debug':
    case 'table_reading': {
      const q = toQuestion(step)
      return (
        <>
          <MiniQuestion
            question={q}
            selected={selected}
            checked={checked}
            onSelect={onSelect}
          />
          <FeedbackBox
            show={checked}
            isCorrect={selected === q.correctIndex}
            correct={q.feedback.correct}
            incorrect={q.feedback.incorrect}
          />
        </>
      )
    }

    case 'summary':
      return (
        <div className="learn__example">
          <p className="quiz__prompt" style={{ marginBottom: 12 }}>{step.title}</p>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {step.points.map((pt, i) => (
              <li key={i} className="learn__explanation">{pt}</li>
            ))}
          </ul>
        </div>
      )

    default:
      return null
  }
}
