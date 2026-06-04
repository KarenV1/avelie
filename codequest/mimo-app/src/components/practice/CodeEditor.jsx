export default function CodeEditor({ code, onChange }) {
  return (
    <textarea
      className="workbench__editor"
      value={code}
      spellCheck={false}
      onChange={onChange}
      placeholder="Escribe tu código aquí…"
    />
  )
}
