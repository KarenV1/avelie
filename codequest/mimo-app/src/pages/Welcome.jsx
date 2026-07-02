// src/pages/Welcome.jsx — umbral del mundo (design.md §8)
// Se muestra a todo visitante sin sesión; el acceso a CodeQuest requiere cuenta.
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import ByteMascot from '../components/common/ByteMascot.jsx'
import '../components/common/ByteMascot.css'
import './Home.css'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="splash">
      <header className="splash__header">
        <h1 className="splash__brand">Code<em>Quest</em></h1>
        <p className="splash__tagline">Aprende <strong>SQL</strong>. Domina datos.</p>
      </header>

      <div className="splash__mascot-wrap">
        <ByteMascot mood="happy" className="splash__mascot" size="min(280px, 78vw)" />
      </div>

      <div className="splash__actions">
        <Button variant="primary" size="lg" full
          onClick={() => navigate('/login', { state: { mode: 'register' } })}>
          Comenzar
        </Button>
        <Button variant="ghost" size="lg" full onClick={() => navigate('/login')}>
          Ya tengo cuenta
        </Button>
      </div>
    </div>
  )
}
