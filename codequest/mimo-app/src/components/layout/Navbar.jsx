// src/components/layout/Navbar.jsx
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { IconFlame, IconStar, IconBookOpen, IconBug } from '../common/icons.jsx'
import './Navbar.css'

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 4l9 8"/>
      <path d="M5 10v9h5v-5h4v5h5v-9"/>
    </svg>
  )
}

function IconPerfil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

function IconEntrar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  )
}

const BASE_LINKS = [
  { to: '/',        label: 'Inicio',   end: true, Icon: IconHome    },
  { to: '/cursos',  label: 'Cursos',             Icon: IconBookOpen },
  { to: '/practica',label: 'Debug',               Icon: IconBug      },
  { to: '/perfil',  label: 'Perfil',              Icon: IconPerfil   },
]
const LOGIN_LINK = { to: '/login', label: 'Entrar', Icon: IconEntrar }

export default function Navbar() {
  const { progress } = useProgress()
  const { user, loading } = useAuth()

  const links = useMemo(
    () => (!loading && !user) ? [...BASE_LINKS, LOGIN_LINK] : BASE_LINKS,
    [loading, user]
  )

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" end>
          <span className="navbar__logo">&lt;/&gt;</span>
          <span className="navbar__name">CodeQuest</span>
        </NavLink>

        <div className="navbar__stats">
          <span className="stat-chip stat-chip--streak">
            <span className="stat-chip__icon"><IconFlame /></span>
            <strong>{progress.streak.count}</strong>
          </span>
          <span className="stat-chip stat-chip--xp">
            <span className="stat-chip__icon"><IconStar /></span>
            <strong>{progress.xp}</strong> XP
          </span>
        </div>

        <div className="navbar__links">
          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              <span className="navbar__link-icon"><Icon /></span>
              <span className="navbar__link-label">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
