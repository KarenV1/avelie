// PasswordInput — campo de contraseña con botón para mostrar/ocultar.
// Envuelve un input normal: recibe las mismas props (id, value, onChange, …)
// y les suma el ojito. Usar en TODO campo de contraseña; no recrear el toggle.
import { useState } from 'react'
import { IconEye, IconEyeOff } from './icons.jsx'
import './PasswordInput.css'

export default function PasswordInput({ className = '', ...inputProps }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-input">
      <input
        {...inputProps}
        type={visible ? 'text' : 'password'}
        className={`password-input__field${className ? ` ${className}` : ''}`}
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
      >
        {visible
          ? <IconEyeOff className="password-input__icon" />
          : <IconEye className="password-input__icon" />}
      </button>
    </div>
  )
}
