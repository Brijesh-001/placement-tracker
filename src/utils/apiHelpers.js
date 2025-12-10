// API helpers for backend integration
const API_BASE = 'https://placement-backend-64oz.onrender.com/api';

let token = localStorage.getItem('token');

export function setToken(newToken) {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth
export async function validateLogin(username, password) {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    return data.user;
  } catch (err) {
    return null;
  }
}

export function logout() {
  setToken(null);
}

// Students
export async function getStudents() {
  return await apiRequest('/students');
}

export async function addStudent(student) {
  const data = await apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  });
  return data._id;
}

export async function updateStudent(id, payload) {
  return await apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteStudent(id) {
  await apiRequest(`/students/${id}`, { method: 'DELETE' });
}

// Companies
export async function getCompanies() {
  return await apiRequest('/companies');
}

export async function addCompany(company) {
  const data = await apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(company),
  });
  return data._id;
}

export async function updateCompany(id, payload) {
  return await apiRequest(`/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteCompany(id) {
  await apiRequest(`/companies/${id}`, { method: 'DELETE' });
}

// Applications & selection
export async function studentApplyToCompany(studentId, companyId) {
  return await apiRequest(`/students/${studentId}/apply/${companyId}`, { method: 'POST' });
}

export async function companySelectStudent(companyId, studentId) {
  return await apiRequest(`/companies/${companyId}/select/${studentId}`, { method: 'POST' });
}
