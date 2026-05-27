import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserPage from './pages/User.jsx'
import AuthModal from './components/AuthModal.jsx'

export default function App() {
  // Check if already logged in from a previous session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vihara_auth')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [showAuth, setShowAuth] = useState(false)

  // Show login modal immediately if not logged in
  useEffect(() => {
    if (!user) setShowAuth(true)
  }, [user])

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    setShowAuth(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('vihara_auth')
    setUser(null)
    setShowAuth(true)
  }

  return (
    <BrowserRouter>
      {/* Auth modal — shows on top of everything when not logged in */}
      {showAuth && (
        <AuthModal
          onClose={() => {
            // Only allow closing if already logged in
            if (user) setShowAuth(false)
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Main app — only accessible when logged in */}
      {user && (
        <Routes>
          <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user" element={<UserPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}