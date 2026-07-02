import ByteMascot from '../common/ByteMascot.jsx'
import '../common/ByteMascot.css'

export default function HintPanel({ hints, hintsShown, onShowHint }) {
  return (
    <>
      {hintsShown > 0 && (
        <div className="practice__hints">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <ByteMascot size={40} mood="hint" />
            <p className="section-title">Pistas de BYTE</p>
          </div>
          {hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} className="practice__hint">{h}</p>
          ))}
        </div>
      )}
      {hintsShown < hints.length && (
        <button className="practice__hintbtn" onClick={onShowHint}>
          Pedir pista ({hintsShown}/{hints.length})
        </button>
      )}
    </>
  )
}
