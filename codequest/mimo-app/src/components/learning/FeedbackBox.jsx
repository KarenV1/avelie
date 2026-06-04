export default function FeedbackBox({ show, isCorrect, correct, incorrect }) {
  if (!show) return null
  return (
    <div className={'feedback ' + (isCorrect ? 'feedback--ok' : 'feedback--bad')}>
      <strong>{isCorrect ? '¡Correcto! ' : 'Casi… '}</strong>
      {isCorrect ? correct : incorrect}
    </div>
  )
}
