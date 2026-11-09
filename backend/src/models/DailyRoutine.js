const mongoose = require('mongoose');

const DailyRoutineSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  time: {
    type: String,
    required: true // e.g. "07:00 AM"
  },
  timeSlot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    default: 'Morning'
  },
  activity: {
    type: String,
    required: true
  },
  malayalamActivity: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    enum: ['sun', 'coffee', 'walk', 'utensils', 'users', 'pill', 'book', 'tv', 'moon', 'music'],
    default: 'sun'
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyRoutine', DailyRoutineSchema);
