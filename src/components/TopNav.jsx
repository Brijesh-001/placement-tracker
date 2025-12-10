import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/localStorageHelpers'

export default function TopNav(){
  const user = getCurrentUser()
  const navigate = useNavigate()

  function doLogout(){
    logout()
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className="topnav">
      <div className="brand">
        <span className="logo-dot" />
        Placement Tracker
        <span className="muted" style={{fontWeight:400,fontSize:13,marginLeft:8}}>AIML Dept Demo</span>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <div className="muted">Signed in as <strong>{user.name}</strong></div>
            <button className="small" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="button" to="/login">Login</Link>
            <Link className="button" to="/register" style={{marginLeft:8}}>Register</Link>
          </>
        )}
      </div>
    </div>
  )
}
