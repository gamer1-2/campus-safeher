const mongoose = require('mongoose');

const unsafeZoneSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    default: 50, // Default radius in meters
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  description: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('UnsafeZone', unsafeZoneSchema);
