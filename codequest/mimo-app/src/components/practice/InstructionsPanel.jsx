export default function InstructionsPanel({ instructions }) {
  return (
    <>
      <p className="section-title" style={{ marginTop: 18 }}>Instrucciones</p>
      <ol className="practice__steps">
        {instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </>
  )
}
