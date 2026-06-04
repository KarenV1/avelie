import Button from '../common/Button.jsx'

export default function LessonNavigation({ checked, isCorrect, hasSelection, alreadyDone, onCheck, onRetry, onContinue }) {
  return (
    <>
      <div className="learn__actions">
        {!checked && (
          <Button variant="primary" size="lg" full disabled={!hasSelection} onClick={onCheck}>
            Comprobar
          </Button>
        )}
        {checked && !isCorrect && (
          <Button variant="soft" size="lg" full onClick={onRetry}>
            Intentar de nuevo
          </Button>
        )}
        {checked && isCorrect && (
          <Button variant="success" size="lg" full onClick={onContinue}>
            Continuar →
          </Button>
        )}
      </div>
      {alreadyDone && !checked && (
        <p className="learn__donenote faint">Ya completaste este bloque. Puedes repasarlo.</p>
      )}
    </>
  )
}
