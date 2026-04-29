const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
