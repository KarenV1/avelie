import CodeEditor from './CodeEditor.jsx'
import ConsolePanel from './ConsolePanel.jsx'
import PracticeActions from './PracticeActions.jsx'
import ValidationFeedback from './ValidationFeedback.jsx'

export default function CodeWorkspace({
  tab, onTabChange,
  language, code, onCodeChange,
  consoleState,
  onRun, onReset, onValidate, onNext,
  validated,
  failMessage, successMessage, isAlreadyDone,
}) {
  return (
    <section className="workbench rise" style={{ animationDelay: '80ms' }}>
      <div className="workbench__tabs">
        <button
          className={'wb-tab' + (tab === 'script' ? ' wb-tab--active' : '')}
          onClick={() => onTabChange('script')}
        >
          📄 script.{language}
        </button>
        <button
          className={'wb-tab' + (tab === 'consola' ? ' wb-tab--active' : '')}
          onClick={() => onTabChange('consola')}
        >
          ▶ consola
        </button>
      </div>

      {tab === 'script' ? (
        <CodeEditor code={code} onChange={onCodeChange} />
      ) : (
        <ConsolePanel consoleState={consoleState} />
      )}

      <PracticeActions
        onRun={onRun}
        onReset={onReset}
        onValidate={onValidate}
        onNext={onNext}
        validated={validated}
      />
      <ValidationFeedback
        validated={validated}
        failMessage={failMessage}
        successMessage={successMessage}
        isAlreadyDone={isAlreadyDone}
      />
    </section>
  )
}
