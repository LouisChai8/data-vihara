import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserPage from './pages/User.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}