// src/components/common/ProgressBar.jsx
import './ProgressBar.css'

export default function ProgressBar({ value = 0, max = 100, color = 'lime', showLabel = false }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{ width: `${pct}%`, background: `var(--${color})` }}
        />
      </div>
      {showLabel && <span className="progress__label">{pct}%</span>}
    </div>
  )
}
