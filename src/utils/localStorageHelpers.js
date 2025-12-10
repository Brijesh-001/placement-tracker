// Helpers for localStorage CRUD and demo init
const LS_KEY = 'placement_tracker_v1'

const defaultData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
    { id: 2, username: 'infosys', password: 'info123', role: 'company', name: 'Infosys' },
    { id: 3, username: 'tcs', password: 'tcs123', role: 'company', name: 'TCS' },
    { id: 4, username: 'student1', password: 'stud123', role: 'student', name: 'Aarav Sharma' }
  ],
  students: [
    { id: 1, name: 'Aarav Sharma', dept: 'AIML', skills: 'Python, ML, TensorFlow', placed: false, applications: [] },
    { id: 2, name: 'Neha Patel', dept: 'AIML', skills: 'React, AI/ML, Node.js', placed: true, applications: [1] },
    { id: 3, name: 'Rohan Iyer', dept: 'AIML', skills: 'Data Science, Deep Learning', placed: false, applications: [] },
    { id: 4, name: 'Priya Nair', dept: 'AIML', skills: 'Computer Vision, Python', placed: true, applications: [2] }
  ],
  companies: [
    { id: 1, name: 'Infosys', openings: ['AI Engineer'], selectedStudents: [2] },
    { id: 2, name: 'TCS', openings: ['Data Scientist'], selectedStudents: [4] },
    { id: 3, name: 'Cognizant', openings: ['ML Engineer'], selectedStudents: [] }
  ],
  currentUser: null
}

export function readData(){
  try{
    const raw = localStorage.getItem(LS_KEY)
    if(!raw) return null
    return JSON.parse(raw)
  }catch(e){ return null }
}

export function writeData(obj){
  localStorage.setItem(LS_KEY, JSON.stringify(obj))
}

export function initDemoData(){
  const existing = readData()
  if(!existing){
    writeData(defaultData)
  }
}

export function getCurrentUser(){
  const d = readData()
  return d ? d.currentUser : null
}

export function setCurrentUser(user){
  const d = readData() || defaultData
  d.currentUser = user
  writeData(d)
}

// Users
export function validateLogin(username,password){
  const d = readData()
  if(!d) return null
  const u = d.users.find(x=>x.username === username && x.password === password)
  if(u) {
    setCurrentUser({ id:u.id, username:u.username, role:u.role, name:u.name })
    return { id:u.id, username:u.username, role:u.role, name:u.name }
  }
  return null
}

export function registerUser({ username, password, role = 'student', name }){
  const d = readData() || defaultData
  if(d.users.find(u => u.username === username)){
    return { error: 'Username already exists' }
  }
  const id = Math.max(0, ...d.users.map(u=>u.id)) + 1
  const newUser = { id, username, password, role, name }
  d.users.push(newUser)
  // if registering a student, also add a student profile entry
  if(role === 'student'){
    const sid = Math.max(0, ...d.students.map(s=>s.id)) + 1
    d.students.push({ id: sid, name, dept: 'AIML', skills: '', placed: false, applications: [] })
  }
  writeData(d)
  // set as current user (logged in)
  setCurrentUser({ id:newUser.id, username:newUser.username, role:newUser.role, name:newUser.name })
  return { id:newUser.id, username:newUser.username, role:newUser.role, name:newUser.name }
}

export function logout(){
  const d = readData() || defaultData
  d.currentUser = null
  writeData(d)
}

// Students
export function getStudents(){
  const d = readData()
  return d ? d.students : []
}
export function addStudent(student){
  const d = readData() || defaultData
  const id = Math.max(0, ...d.students.map(s=>s.id))+1
  d.students.push({...student, id})
  writeData(d)
  return id
}
export function updateStudent(id, payload){
  const d = readData() || defaultData
  d.students = d.students.map(s=> s.id===id ? {...s, ...payload} : s)
  writeData(d)
}
export function deleteStudent(id){
  const d = readData() || defaultData
  d.students = d.students.filter(s=>s.id!==id)
  // also remove from companies selected/applications
  d.companies = d.companies.map(c=> ({...c, selectedStudents: c.selectedStudents.filter(x=>x!==id)}))
  writeData(d)
}

// Companies
export function getCompanies(){
  const d = readData()
  return d ? d.companies : []
}
export function addCompany(company){
  const d = readData() || defaultData
  const id = Math.max(0, ...d.companies.map(c=>c.id))+1
  d.companies.push({...company, id})
  writeData(d)
  return id
}
export function updateCompany(id, payload){
  const d = readData() || defaultData
  d.companies = d.companies.map(c=> c.id===id ? {...c, ...payload} : c)
  writeData(d)
}
export function deleteCompany(id){
  const d = readData() || defaultData
  d.companies = d.companies.filter(c=>c.id!==id)
  // remove applications referencing company from students
  d.students = d.students.map(s=> ({...s, applications: s.applications.filter(app=> app!==id)}))
  writeData(d)
}

// Applications & selection
export function studentApplyToCompany(studentId, companyId){
  const d = readData() || defaultData
  d.students = d.students.map(s=> s.id===studentId ? {...s, applications: Array.from(new Set([...s.applications, companyId]))} : s)
  writeData(d)
}
export function companySelectStudent(companyId, studentId){
  const d = readData() || defaultData
  d.companies = d.companies.map(c=> c.id===companyId ? {...c, selectedStudents: Array.from(new Set([...c.selectedStudents, studentId]))} : c)
  // mark student as placed
  d.students = d.students.map(s=> s.id===studentId ? {...s, placed: true} : s)
  writeData(d)
}
