const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  skills: { type: String, required: true },
  placed: { type: Boolean, default: false },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
