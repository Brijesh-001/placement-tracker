import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/localStorageHelpers'

export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    setErr('')
    if(!username.trim() || !password) return setErr('Username and password required')
    if(!name.trim()) return setErr('Please enter your name')

    const res = registerUser({ username: username.trim(), password, role, name: name.trim() })
    if(res && res.error){
      setErr(res.error)
    } else if(res){
      // registered and logged in
      nav(`/${res.role}`)
      window.location.reload()
    } else {
      setErr('Registration failed')
    }
  }

  return (
    <div style={{maxWidth:520, margin:'40px auto'}} className="card">
      <h2>Register</h2>
      <p className="muted">Create a demo account — you'll be logged in automatically.</p>
      <form onSubmit={submit}>
        <div className="form-row">
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="form-row">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="form-row">
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {err && <div style={{color:'#ffb4b4',marginBottom:8}}>{err}</div>}
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Register</button>
        </div>
      </form>
    </div>
  )
}
