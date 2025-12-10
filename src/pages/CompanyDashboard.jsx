import React, {useEffect, useState} from 'react'
import { getCompanies, getStudents, studentApplyToCompany, companySelectStudent, updateCompany, getCurrentUser } from '../utils/localStorageHelpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CompanyDashboard(){
  const current = getCurrentUser()
  const [companies,setCompanies] = useState(getCompanies())
  const [students,setStudents] = useState(getStudents())

  useEffect(()=> {
    setCompanies(getCompanies())
    setStudents(getStudents())
  },[])

  function refresh(){ setCompanies(getCompanies()); setStudents(getStudents()) }

  // For demo we pick first company belonging to the logged-in company username by name match
  const myCompany = companies.find(c=> c.name.toLowerCase() === (current?.username || '').toLowerCase()) || companies[0] || null

  function selectStudent(studentId){
    if(!myCompany) return alert('No company assigned')
    companySelectStudent(myCompany.id, studentId)
    refresh()
  }

  // Chart: applicants vs selected (per company)
  const applicants = students.filter(s=> s.applications.includes(myCompany?.id)).length
  const selected = myCompany ? myCompany.selectedStudents.length : 0
  const data = [{name: myCompany?.name || 'Company', Applicants: applicants, Selected: selected}]

  return (
    <div>
      <h2>Company Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Company: {myCompany?.name || '—'}</h3>
          <div className="muted">Openings: {myCompany?.openings.join(', ')}</div>
          <h4 style={{marginTop:12}}>Applicants</h4>
          <table>
            <thead><tr><th>Name</th><th>Dept</th><th>Skills</th><th>Applied</th><th>Action</th></tr></thead>
            <tbody>
              {students.filter(s=> s.applications.includes(myCompany?.id)).map(s=>(
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.dept}</td>
                  <td className="muted">{s.skills}</td>
                  <td>{s.applied ? 'Yes' : 'No'}</td>
                  <td><button className="small" onClick={()=>selectStudent(s.id)}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Selected Students</h3>
          <table>
            <thead><tr><th>Name</th><th>Dept</th><th>Skills</th></tr></thead>
            <tbody>
              {myCompany?.selectedStudents.map(id=>{
                const s = students.find(x=>x.id===id)
                return s ? <tr key={id}><td>{s.name}</td><td>{s.dept}</td><td className="muted">{s.skills}</td></tr> : null
              })}
            </tbody>
          </table>
        </div>

        <div className="card full">
          <h3>Applicants vs Selected</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Applicants" />
                <Bar dataKey="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
