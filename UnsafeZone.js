const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['medical', 'security', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'resolved'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
