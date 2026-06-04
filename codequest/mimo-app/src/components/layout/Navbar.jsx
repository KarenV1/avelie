// src/components/layout/Navbar.jsx
import { NavLink } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext.jsx'
import './Navbar.css'

const links = [
  { to: '/', label: 'Inicio', icon: '🏠', end: true },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
  { to: '/ajustes', label: 'Ajustes', icon: '⚙️' },
]

export default function Navbar() {
  const { progress } = useProgress()

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" end>
          <span className="navbar__logo">{'</>'}</span>
          <span className="navbar__name">CodeQuest</span>
        </NavLink>

        <div className="navbar__stats">
          <span className="stat-chip stat-chip--streak" title="Racha">
            🔥 {progress.streak.count}
          </span>
          <span className="stat-chip stat-chip--xp" title="Experiencia">
            ⭐ {progress.xp}
          </span>
        </div>

        <div className="navbar__links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              <span className="navbar__icon">{l.icon}</span>
              <span className="navbar__label">{l.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
