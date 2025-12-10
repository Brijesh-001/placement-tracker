const express = require('express');
const Company = require('../models/Company');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all companies
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find().populate('selectedStudents');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add company
router.post('/', auth, async (req, res) => {
  const company = new Company(req.body);
  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update company
router.put('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete company
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    // Remove from students' applications
    await Student.updateMany({}, { $pull: { applications: req.params.id } });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Company select student
router.post('/:companyId/select/:studentId', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (!company.selectedStudents.includes(req.params.studentId)) {
      company.selectedStudents.push(req.params.studentId);
      await company.save();
    }

    // Mark student as placed
    await Student.findByIdAndUpdate(req.params.studentId, { placed: true });

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
