const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
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
  photoUrl: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  malayalamDescription: {
    type: String,
    default: ''
  },
  voicePrompt: {
    type: String,
    default: ''
  },
  malayalamVoicePrompt: {
    type: String,
    default: ''
  },
  frequentVisitor: {
    type: Boolean,
    default: false
  },
  isEmergencyContact: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-populate voice prompt if not provided
FamilyMemberSchema.pre('save', function (next) {
  if (!this.voicePrompt) {
    this.voicePrompt = `This is ${this.name}. ${this.relationship === 'Self' ? 'This is you.' : `${this.name} is your ${this.relationship}.`}`;
  }
  next();
});

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
