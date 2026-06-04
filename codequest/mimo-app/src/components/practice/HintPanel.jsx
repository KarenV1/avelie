export default function HintPanel({ hints, hintsShown, onShowHint }) {
  return (
    <>
      {hintsShown > 0 && (
        <div className="practice__hints">
          <p className="section-title">Pistas</p>
          {hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} className="practice__hint">💡 {h}</p>
          ))}
        </div>
      )}
      {hintsShown < hints.length && (
        <button className="practice__hintbtn" onClick={onShowHint}>
          Mostrar una pista ({hintsShown}/{hints.length})
        </button>
      )}
    </>
  )
}
