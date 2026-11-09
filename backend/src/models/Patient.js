const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  preferredName: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  stage: {
    type: String,
    enum: ['Early', 'Moderate', 'Advanced'],
    default: 'Early'
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  },
  emergencyNotes: {
    type: String,
    default: 'Mild memory impairment. Hearing aid in left ear. Responds well to calm, familiar voices.'
  },
  address: {
    type: String,
    default: 'Rose Villa, Hill View Road, Kochi, Kerala'
  },
  primaryDoctor: {
    name: { type: String, default: 'Dr. Elizabeth Roy (Neurologist)' },
    phone: { type: String, default: '+91 98470 12345' },
    clinic: { type: String, default: 'City Memorial Healthcare Center' }
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'ml'],
    default: 'en'
  },
  voiceEnabled: {
    type: Boolean,
    default: true
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: String,
    enum: ['normal', 'large', 'xlarge'],
    default: 'large'
  },
  consentGiven: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
