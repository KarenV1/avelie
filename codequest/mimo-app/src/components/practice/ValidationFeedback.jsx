export default function ValidationFeedback({ validated, failMessage, successMessage, isAlreadyDone }) {
  return (
    <>
      {validated === false && (
        <div className="feedback feedback--bad">{failMessage}</div>
      )}
      {validated === true && (
        <div className="feedback feedback--ok">{successMessage}</div>
      )}
      {isAlreadyDone && validated === null && (
        <p className="learn__donenote faint">Ya completaste esta práctica. Puedes repasarla.</p>
      )}
    </>
  )
}
