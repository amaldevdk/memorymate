const mongoose = require('mongoose');
const {
  defaultPatient,
  defaultCaregiver,
  defaultFamilyMembers,
  defaultMemories,
  defaultReminders,
  defaultRoutines,
  defaultEmergencyContacts,
  defaultNotifications
} = require('../utils/seedData');

let isConnected = false;
let inMemoryStore = {
  patients: [JSON.parse(JSON.stringify(defaultPatient))],
  users: [JSON.parse(JSON.stringify(defaultCaregiver))],
  familyMembers: JSON.parse(JSON.stringify(defaultFamilyMembers)),
  memories: JSON.parse(JSON.stringify(defaultMemories)),
  reminders: JSON.parse(JSON.stringify(defaultReminders)),
  routines: JSON.parse(JSON.stringify(defaultRoutines)),
  emergencyContacts: JSON.parse(JSON.stringify(defaultEmergencyContacts)),
  notifications: JSON.parse(JSON.stringify(defaultNotifications))
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memorymate';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log('[Database] MongoDB Connected successfully.');

    // Seed database if empty
    await seedMongoIfEmpty();
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed (${error.message}).`);
    console.log('[Database] Activating Resilient In-Memory Data Store. All CRUD, Reminders, and Auth operations remain fully functional!');
    isConnected = false;
  }
};

const seedMongoIfEmpty = async () => {
  try {
    const Patient = require('../models/Patient');
    const User = require('../models/User');
    const FamilyMember = require('../models/FamilyMember');
    const Memory = require('../models/Memory');
    const Reminder = require('../models/Reminder');
    const DailyRoutine = require('../models/DailyRoutine');
    const EmergencyContact = require('../models/EmergencyContact');
    const Notification = require('../models/Notification');
    const bcrypt = require('bcryptjs');

    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log('[Database] Seeding initial compassionate patient data into MongoDB...');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultCaregiver.password, salt);
      await User.deleteMany({});
      await User.create({ ...defaultCaregiver, password: hashedPassword });

      await Patient.deleteMany({});
      await Patient.create(defaultPatient);

      await FamilyMember.deleteMany({});
      await FamilyMember.insertMany(defaultFamilyMembers);

      await Memory.deleteMany({});
      await Memory.insertMany(defaultMemories);

      await Reminder.deleteMany({});
      await Reminder.insertMany(defaultReminders);

      await DailyRoutine.deleteMany({});
      await DailyRoutine.insertMany(defaultRoutines);

      await EmergencyContact.deleteMany({});
      await EmergencyContact.insertMany(defaultEmergencyContacts);

      await Notification.deleteMany({});
      await Notification.insertMany(defaultNotifications);

      console.log('[Database] Initial data seeding complete!');
    }
  } catch (err) {
    console.error('[Database] Seeding error:', err.message);
  }
};

module.exports = {
  connectDB,
  isDBConnected: () => isConnected,
  getStore: () => inMemoryStore
};
