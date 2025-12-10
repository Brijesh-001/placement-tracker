import React, {useEffect, useState} from 'react'
import { getStudents, addStudent, updateStudent, deleteStudent, getCompanies, addCompany, updateCompany, deleteCompany, companySelectStudent } from '../utils/localStorageHelpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

function useSyncedData(getter){
  const [state,setState] = useState(getter())
  useEffect(()=> {
    const onStorage = ()=> setState(getter())
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  },[])
  return [state, setState]
}

export default function AdminDashboard(){
  const [students, setStudents] = useSyncedData(getStudents)
  const [companies, setCompanies] = useSyncedData(getCompanies)

  // form state
  const [sForm, setSForm] = useState({name:'',dept:'AIML',skills:'',placed:false})
  const [cForm, setCForm] = useState({name:'',openings:''})

  useEffect(()=> setStudents(getStudents()),[])
  useEffect(()=> setCompanies(getCompanies()),[])

  function refresh(){
    setStudents(getStudents())
    setCompanies(getCompanies())
  }

  function addNewStudent(){
    if(!sForm.name) return alert('Name required')
    addStudent({...sForm, applications: []})
    setSForm({name:'',dept:'AIML',skills:'',placed:false})
    refresh()
  }
  function editStudent(id){
    const s = students.find(x=>x.id===id)
    const name = prompt('Edit name', s.name)
    if(name!=null){
      updateStudent(id, {...s, name})
      refresh()
    }
  }
  function removeStudent(id){
    if(!confirm('Delete student?')) return
    deleteStudent(id)
    refresh()
  }

  function addNewCompany(){
    if(!cForm.name) return alert('Company name required')
    const openings = cForm.openings ? cForm.openings.split(',').map(x=>x.trim()) : []
    addCompany({name:cForm.name, openings, selectedStudents:[]})
    setCForm({name:'',openings:''})
    refresh()
  }
  function editCompany(id){
    const c = companies.find(x=>x.id===id)
    const name = prompt('Edit company name', c.name)
    if(name!=null){
      updateCompany(id, {...c, name})
      refresh()
    }
  }
  function removeCompany(id){
    if(!confirm('Delete company?')) return
    deleteCompany(id)
    refresh()
  }

  // charts
  const placedCount = students.filter(s=>s.placed).length
  const unplacedCount = students.length - placedCount
  const pieData = [{name:'Placed', value:placedCount},{name:'Unplaced', value:unplacedCount}]
  const barData = companies.map(c=> ({name:c.name, offers: c.selectedStudents.length}))

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Students</h3>
          <div style={{marginBottom:8}} className="muted">Add AIML students (stored in localStorage)</div>
          <div className="form-row">
            <input placeholder="Name" value={sForm.name} onChange={e=>setSForm({...sForm,name:e.target.value})} />
            <input placeholder="Skills (comma)" value={sForm.skills} onChange={e=>setSForm({...sForm,skills:e.target.value})} />
            <button className="btn" onClick={addNewStudent}>Add</button>
          </div>
          <div style={{marginTop:8}}>
            <table>
              <thead><tr><th>Name</th><th>Dept</th><th>Skills</th><th>Placed</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s=>(
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.dept}</td>
                    <td className="muted">{s.skills}</td>
                    <td>{s.placed ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="small" onClick={()=>editStudent(s.id)}>Edit</button>
                      <button className="small" onClick={()=>removeStudent(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Companies</h3>
          <div className="muted">Add companies (demo companies already included)</div>
          <div className="form-row">
            <input placeholder="Company name" value={cForm.name} onChange={e=>setCForm({...cForm,name:e.target.value})} />
            <input placeholder="Openings (comma)" value={cForm.openings} onChange={e=>setCForm({...cForm,openings:e.target.value})} />
            <button className="btn" onClick={addNewCompany}>Add</button>
          </div>
          <div style={{marginTop:8}}>
            <table>
              <thead><tr><th>Name</th><th>Openings</th><th>Selected</th><th>Actions</th></tr></thead>
              <tbody>
                {companies.map(c=>(
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="muted">{c.openings.join(', ')}</td>
                    <td>{c.selectedStudents.length}</td>
                    <td>
                      <button className="small" onClick={()=>editCompany(c.id)}>Edit</button>
                      <button className="small" onClick={()=>removeCompany(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card full">
          <h3>Placement Overview</h3>
          <div style={{display:'flex',gap:12}}>
            <div style={{flex:1}} className="chart-box card">
              <h4 className="muted">Placed vs Unplaced</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={idx===0 ? '#10b981' : '#f97316'} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{flex:1}} className="chart-box card">
              <h4 className="muted">Job Offers per Company</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="offers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
