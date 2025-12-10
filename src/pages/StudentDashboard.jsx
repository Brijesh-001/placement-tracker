import React, {useEffect, useState} from 'react'
import { getStudents, getCompanies, studentApplyToCompany, updateStudent, getCurrentUser } from '../utils/localStorageHelpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StudentDashboard(){
  const current = getCurrentUser()
  const [students, setStudents] = useState(getStudents())
  const [companies, setCompanies] = useState(getCompanies())
  const me = students.find(s=> s.name === current?.name) || students[0] || null

  useEffect(()=> {
    setStudents(getStudents())
    setCompanies(getCompanies())
  },[])

  function refresh(){ setStudents(getStudents()); setCompanies(getCompanies()) }

  function apply(companyId){
    if(!me) return alert('Student not found')
    studentApplyToCompany(me.id, companyId)
    refresh()
  }

  function togglePlaced(){
    updateStudent(me.id, {...me, placed: !me.placed})
    refresh()
  }

  const data = [{ name: me?.name || 'Me', Applied: me?.applications.length || 0, Selected: me?.placed ? 1 : 0 }]

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Profile</h3>
          <div><strong>{me?.name}</strong> <span className="muted">({me?.dept})</span></div>
          <div className="muted">Skills: {me?.skills}</div>
          <div style={{marginTop:8}}>
            <button className="btn" onClick={togglePlaced}>{me?.placed ? 'Mark Unplaced' : 'Mark Placed'}</button>
          </div>
        </div>

        <div className="card">
          <h3>Available Companies</h3>
          <table>
            <thead><tr><th>Company</th><th>Openings</th><th>Action</th></tr></thead>
            <tbody>
              {companies.map(c=>(
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="muted">{c.openings.join(', ')}</td>
                  <td><button className="small" onClick={()=>apply(c.id)}>Apply</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card full">
          <h3>Your Application Stats</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Applied" />
                <Bar dataKey="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
