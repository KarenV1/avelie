export default function MiniQuestion({ question, selected, checked, onSelect }) {
  return (
    <>
      {question.context && (
        <pre className="code-block" style={{ marginBottom: 16 }}>{question.context}</pre>
      )}
      <p className="quiz__prompt">{question.prompt}</p>
      <div className="quiz__options">
        {question.options.map((opt, i) => {
          let cls = 'quiz__option'
          if (checked) {
            if (i === question.correctIndex) cls += ' quiz__option--correct'
            else if (i === selected) cls += ' quiz__option--wrong'
          } else if (i === selected) {
            cls += ' quiz__option--selected'
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={checked}
              onClick={() => onSelect(i)}
            >
              <span className="quiz__bullet">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>
    </>
  )
}
