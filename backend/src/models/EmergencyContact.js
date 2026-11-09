const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  priority: {
    type: Number,
    default: 1 // 1 is highest priority
  },
  isPrimaryCaregiver: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: 'Call immediately if patient feels disoriented or presses emergency button.'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema);
