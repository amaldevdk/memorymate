const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['medication', 'meals', 'water', 'doctor', 'activity', 'general'],
    default: 'general'
  },
  time: {
    type: String,
    required: true // e.g. "08:30" or "08:30 AM"
  },
  dosageOrInstruction: {
    type: String,
    default: ''
  },
  audioPrompt: {
    type: String,
    default: ''
  },
  malayalamAudioPrompt: {
    type: String,
    default: ''
  },
  repeat: {
    type: String,
    enum: ['daily', 'weekdays', 'once'],
    default: 'daily'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  date: {
    type: String, // format "YYYY-MM-DD"
    default: () => new Date().toISOString().split('T')[0]
  },
  missed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  medicalDisclaimerConfirmed: {
    type: Boolean,
    default: true // Caregiver certifies schedule matches doctor instructions
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
