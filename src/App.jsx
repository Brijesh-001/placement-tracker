import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import StudentDashboard from './pages/StudentDashboard'
import { getCurrentUser } from './utils/localStorageHelpers'
import TopNav from './components/TopNav'

export default function App(){
  const user = getCurrentUser()
  return (
    <div className="app-root">
      <TopNav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="*" element={<div style={{padding:20}}>Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  )
}
