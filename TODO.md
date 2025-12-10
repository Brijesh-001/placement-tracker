# TODO: Add MERN Backend to Placement Tracker

## Backend Setup
- [ ] Create `backend` folder in project root
- [ ] Initialize backend with `npm init -y`
- [ ] Install dependencies: express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken
- [ ] Create `.env` file with MongoDB connection string and JWT secret
- [ ] Create `backend/server.js` with Express app setup, MongoDB connection, and middleware
- [ ] Create `backend/models/User.js` for User schema (admin, company, student roles)
- [ ] Create `backend/models/Student.js` for Student schema
- [ ] Create `backend/models/Company.js` for Company schema
- [ ] Create `backend/routes/auth.js` for login/logout routes
- [ ] Create `backend/routes/students.js` for student CRUD and applications
- [ ] Create `backend/routes/companies.js` for company CRUD and selections
- [ ] Create `backend/middleware/auth.js` for JWT authentication middleware
- [ ] Update `backend/server.js` to use routes and middleware

## Frontend Updates
- [ ] Rename `src/utils/localStorageHelpers.js` to `src/utils/apiHelpers.js`
- [ ] Update `apiHelpers.js` to use fetch API calls to backend instead of localStorage
- [ ] Update `src/App.jsx` to handle authentication via API (if needed, add auth context)
- [ ] Update any other files that import localStorageHelpers to use apiHelpers

## Data Seeding and Testing
- [ ] Create `backend/seed.js` to seed initial demo data into MongoDB
- [ ] Run seed script to populate database
- [ ] Start backend server on port 5000
- [ ] Test API endpoints (e.g., login, get students, etc.)
- [ ] Update frontend to connect to backend API
- [ ] Test full integration: login, CRUD operations, applications/selections

## Final Steps
- [ ] Ensure MongoDB is running locally via Compass
- [ ] Run both frontend (npm run dev) and backend (node server.js) simultaneously
- [ ] Verify the app works end-to-end
