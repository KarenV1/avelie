// ByteMascot — única forma de renderizar a Byte (design.md §6).
// mood= ánimo (default|happy|sad|celebrate|hint), src= asset oficial, className= clases extra del contexto
// Asset por defecto: byte.png — Byte completo, arte oficial vigente
// (byte-mascot.png y pixel-bug.png están recortados dentro del archivo; no usarlos sueltos)
export default function ByteMascot({ size = 80, mood = 'default', style = {}, variant = null, className = '', src = '/byte.png' }) {
  return (
    <div
      className={`byte-mascot byte-mascot--${mood}${variant ? ` byte-mascot--${variant}` : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, flexShrink: 0, ...style }}
    >
      <img src={src} alt="" className="byte-mascot__img" />
    </div>
  )
}
