export default function ConsolePanel({ consoleState }) {
  return (
    <div className="workbench__console">
      {!consoleState && (
        <p className="console__hint faint">Pulsa Ejecutar para ver la salida.</p>
      )}
      {consoleState && (
        <>
          <p className={'console__msg ' + (consoleState.ok ? 'console__msg--ok' : 'console__msg--bad')}>
            {consoleState.ok ? '✓ ' : '✕ '}{consoleState.message}
          </p>
          {consoleState.ok && consoleState.columns && (
            <table className="result-table">
              <thead>
                <tr>{consoleState.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {consoleState.rows.map((row, ri) => (
                  <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
