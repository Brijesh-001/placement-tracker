import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { validateLogin } from '../utils/localStorageHelpers'

export default function Login(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    const u = validateLogin(username.trim(), password)
    if(u){
      setErr('')
      nav(`/${u.role}`)
      window.location.reload()
    } else {
      setErr('Invalid credentials (try admin/admin123 or infosys/info123)')
    }
  }

  return (
    <div style={{maxWidth:520, margin:'40px auto'}} className="card">
      <h2>Login</h2>
      <p className="muted">Use demo users: <strong>admin/admin123</strong> or <strong>infosys/info123</strong> or any demo student</p>
      <form onSubmit={submit}>
        <div className="form-row">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div style={{color:'#ffb4b4',marginBottom:8}}>{err}</div>}
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Login</button>
          <Link to="/register" className="btn" style={{background:'#94a3b8',color:'#021627'}}>Register</Link>
        </div>
      </form>
    </div>
  )
}
