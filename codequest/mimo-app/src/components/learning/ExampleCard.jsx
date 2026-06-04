export default function ExampleCard({ code, caption }) {
  return (
    <div className="learn__example">
      <pre className="code-block"><code>{code}</code></pre>
      {caption && <p className="learn__caption faint">{caption}</p>}
    </div>
  )
}
