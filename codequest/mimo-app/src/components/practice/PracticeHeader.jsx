export default function PracticeHeader({ xp, title, scenario }) {
  return (
    <>
      <span className="learn__tag" style={{ '--accent': 'var(--violet)' }}>
        Práctica · {xp} XP
      </span>
      <h1 className="learn__title">{title}</h1>
      <p className="muted">{scenario}</p>
    </>
  )
}
