import ByteMascot from '../common/ByteMascot.jsx'
import '../common/ByteMascot.css'

export default function ValidationFeedback({ validated, failMessage, successMessage, isAlreadyDone }) {
  return (
    <>
      {validated === false && (
        <div className="feedback feedback--bad">
          <ByteMascot size={48} mood="sad" />
          <div className="feedback__text">
            <strong>Hmm… revisa tu consulta</strong>
            <span>{failMessage}</span>
          </div>
        </div>
      )}
      {validated === true && (
        <div className="feedback feedback--ok">
          <ByteMascot size={48} mood="celebrate" />
          <div className="feedback__text">
            <strong>¡Perfecto!</strong>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {isAlreadyDone && validated === null && (
        <p className="learn__donenote faint">Ya completaste esta práctica. Puedes repasarla.</p>
      )}
    </>
  )
}
