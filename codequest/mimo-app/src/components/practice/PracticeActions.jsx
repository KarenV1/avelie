import Button from '../common/Button.jsx'

export default function PracticeActions({ onRun, onReset, onValidate, onNext, validated }) {
  return (
    <div className="workbench__bar">
      <Button variant="soft" onClick={onRun}>▶ Ejecutar</Button>
      <Button variant="ghost" size="md" onClick={onReset}>↺ Reiniciar</Button>
      <span className="spacer" />
      {validated === true ? (
        <Button variant="success" onClick={onNext}>Continuar →</Button>
      ) : (
        <Button variant="primary" onClick={onValidate}>✓ Validar</Button>
      )}
    </div>
  )
}
