const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();

    // Hash passwords
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedInfo = await bcrypt.hash('info123', 10);
    const hashedTcs = await bcrypt.hash('tcs123', 10);
    const hashedStud = await bcrypt.hash('stud123', 10);

    // Users
    const users = await User.insertMany([
      { username: 'admin', password: hashedAdmin, role: 'admin', name: 'Admin' },
      { username: 'infosys', password: hashedInfo, role: 'company', name: 'Infosys' },
      { username: 'tcs', password: hashedTcs, role: 'company', name: 'TCS' },
      { username: 'student1', password: hashedStud, role: 'student', name: 'Aarav Sharma' }
    ]);

    // Students
    const students = await Student.insertMany([
      { name: 'Aarav Sharma', dept: 'AIML', skills: 'Python, ML, TensorFlow', placed: false, applications: [] },
      { name: 'Neha Patel', dept: 'AIML', skills: 'React, AI/ML, Node.js', placed: true, applications: [] },
      { name: 'Rohan Iyer', dept: 'AIML', skills: 'Data Science, Deep Learning', placed: false, applications: [] },
      { name: 'Priya Nair', dept: 'AIML', skills: 'Computer Vision, Python', placed: true, applications: [] }
    ]);

    // Companies
    const companies = await Company.insertMany([
      { name: 'Infosys', openings: ['AI Engineer'], selectedStudents: [students[1]._id] },
      { name: 'TCS', openings: ['Data Scientist'], selectedStudents: [students[3]._id] },
      { name: 'Cognizant', openings: ['ML Engineer'], selectedStudents: [] }
    ]);

    // Update student applications
    await Student.findByIdAndUpdate(students[1]._id, { applications: [companies[0]._id] });
    await Student.findByIdAndUpdate(students[3]._id, { applications: [companies[1]._id] });

    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
