// src/App.jsx
// El acceso a CodeQuest requiere sesión: sin ella solo existen
// Bienvenida (umbral del mundo), Login y Restablecer contraseña.
import { useEffect, useSyncExternalStore } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { subscribeCourses, getCourses, loadRemoteCourses } from './data/courseStore.js'
import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Welcome from './pages/Welcome.jsx'
import CourseScreen from './pages/CourseScreen.jsx'
import UnitMap from './pages/UnitMap.jsx'
import BlockScreen from './pages/BlockScreen.jsx'
import PracticeScreen from './pages/PracticeScreen.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import MistakesReview from './pages/MistakesReview.jsx'
import Cursos from './pages/Cursos.jsx'
import Login from './pages/Login.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ByteMascot from './components/common/ByteMascot.jsx'
import './components/common/ByteMascot.css'

function AuthLoading() {
  return (
    <div className="auth-loading" aria-busy="true">
      <ByteMascot size={96} mood="default" />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  // Contenido de cursos: re-render cuando llega la versión remota de Supabase
  useSyncExternalStore(subscribeCourses, getCourses)
  useEffect(() => {
    loadRemoteCourses()
  }, [])

  // Aún no sabemos si hay sesión — Byte espera contigo
  if (loading) return <AuthLoading />

  // Sin sesión: umbral del mundo
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/restablecer" element={<ResetPassword />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    )
  }

  // Con sesión: la app completa
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
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/practica" element={<MistakesReview />} />
        <Route path="/repasar-errores" element={<MistakesReview />} />
        <Route path="/restablecer" element={<ResetPassword />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}
