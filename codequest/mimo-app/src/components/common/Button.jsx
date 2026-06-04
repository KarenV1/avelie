// src/components/common/Button.jsx
import './Button.css'

export default function Button({
  children,
  variant = 'primary', // primary | ghost | success | danger | soft
  size = 'md',         // sm | md | lg
  full = false,
  disabled = false,
  onClick,
  type = 'button',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    full ? 'btn--full' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} disabled={disabled} onClick={onClick} type={type} {...rest}>
      {children}
    </button>
  )
}
