export default function LessonHeader({ tag, title }) {
  return (
    <>
      <span className="learn__tag">{tag}</span>
      <h1 className="learn__title">{title}</h1>
    </>
  )
}
