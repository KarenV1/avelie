// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import CourseScreen from './pages/CourseScreen.jsx'
import UnitMap from './pages/UnitMap.jsx'
import BlockScreen from './pages/BlockScreen.jsx'
import PracticeScreen from './pages/PracticeScreen.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import MistakesReview from './pages/MistakesReview.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curso/:courseId" element={<CourseScreen />} />
        <Route path="/curso/:courseId/unidad/:unitId" element={<UnitMap />} />
        <Route path="/curso/:courseId/unidad/:unitId/bloque/:itemId" element={<BlockScreen />} />
        <Route path="/curso/:courseId/unidad/:unitId/practica/:itemId" element={<PracticeScreen />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/repasar-errores" element={<MistakesReview />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}
