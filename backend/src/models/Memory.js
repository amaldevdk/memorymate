const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Family', 'Friends', 'Childhood', 'Education', 'Special Events'],
    default: 'Family'
  },
  date: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  malayalamDescription: {
    type: String,
    default: ''
  },
  peopleTagged: [{
    type: String,
    trim: true
  }],
  audioText: {
    type: String,
    default: ''
  },
  favorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Memory', MemorySchema);
