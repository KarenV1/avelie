import ByteMascot from '../common/ByteMascot.jsx'
import '../../components/common/ByteMascot.css'

export default function FeedbackBox({ show, isCorrect, correct, incorrect }) {
  if (!show) return null
  return (
    <div className={'feedback ' + (isCorrect ? 'feedback--ok' : 'feedback--bad')}>
      <ByteMascot size={48} mood={isCorrect ? 'happy' : 'sad'} />
      <div className="feedback__text">
        <strong>{isCorrect ? '¡Correcto!' : '¡Casi…!'}</strong>
        <span>{isCorrect ? correct : incorrect}</span>
      </div>
    </div>
  )
}
