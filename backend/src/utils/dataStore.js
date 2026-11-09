const { isDBConnected, getStore } = require('../config/db');
const User = require('../models/User');
const Patient = require('../models/Patient');
const FamilyMember = require('../models/FamilyMember');
const Memory = require('../models/Memory');
const Reminder = require('../models/Reminder');
const DailyRoutine = require('../models/DailyRoutine');
const EmergencyContact = require('../models/EmergencyContact');
const Notification = require('../models/Notification');

const generateId = () => {
  return '67cf' + Math.floor(Math.random() * 1e16).toString(16).padStart(20, '0');
};

const DataStore = {
  // --- USERS ---
  async findUserByEmail(email) {
    if (isDBConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const store = getStore();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isDBConnected()) {
      return await User.findById(id).select('-password');
    }
    const store = getStore();
    const user = store.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    if (isDBConnected()) {
      return await User.create(userData);
    }
    const store = getStore();
    const newUser = {
      _id: generateId(),
      ...userData,
      createdAt: new Date()
    };
    store.users.push(newUser);
    return newUser;
  },

  // --- PATIENTS ---
  async getPatients() {
    if (isDBConnected()) {
      return await Patient.find();
    }
    return getStore().patients;
  },

  async getPatientById(id) {
    if (isDBConnected()) {
      return await Patient.findById(id);
    }
    const store = getStore();
    return store.patients.find(p => p._id === id || p.id === id) || null;
  },

  async updatePatient(id, updateData) {
    if (isDBConnected()) {
      return await Patient.findByIdAndUpdate(id, updateData, { new: true });
    }
    const store = getStore();
    const index = store.patients.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    store.patients[index] = { ...store.patients[index], ...updateData };
    return store.patients[index];
  },

  // --- FAMILY MEMBERS ---
  async getFamilyMembers(patientId) {
    if (isDBConnected()) {
      const query = patientId ? { patientId } : {};
      return await FamilyMember.find(query).sort({ frequentVisitor: -1, name: 1 }).lean();
    }
    const store = getStore();
    return store.familyMembers.filter(m => !patientId || m.patientId === patientId);
  },

  async getFamilyMemberById(id) {
    if (isDBConnected()) {
      return await FamilyMember.findById(id).lean();
    }
    return getStore().familyMembers.find(m => m._id === id) || null;
  },

  async createFamilyMember(data) {
    if (isDBConnected()) {
      return await FamilyMember.create(data);
    }
    const store = getStore();
    const newMember = {
      _id: generateId(),
      voicePrompt: data.voicePrompt || `This is ${data.name}. ${data.relationship === 'Self' ? 'This is you.' : `${data.name} is your ${data.relationship}.`}`,
      ...data,
      createdAt: new Date()
    };
    store.familyMembers.push(newMember);
    return newMember;
  },

  async updateFamilyMember(id, data) {
    if (isDBConnected()) {
      return await FamilyMember.findByIdAndUpdate(id, data, { new: true });
    }
    const store = getStore();
    const idx = store.familyMembers.findIndex(m => m._id === id);
    if (idx === -1) return null;
    store.familyMembers[idx] = { ...store.familyMembers[idx], ...data };
    return store.familyMembers[idx];
  },

  async deleteFamilyMember(id) {
    if (isDBConnected()) {
      return await FamilyMember.findByIdAndDelete(id);
    }
    const store = getStore();
    const idx = store.familyMembers.findIndex(m => m._id === id);
    if (idx === -1) return null;
    const removed = store.familyMembers.splice(idx, 1);
    return removed[0];
  },

  // --- MEMORIES ---
  async getMemories(patientId, category) {
    if (isDBConnected()) {
      const query = {};
      if (patientId) query.patientId = patientId;
      if (category && category !== 'All') query.category = category;
      return await Memory.find(query).sort({ createdAt: -1 }).lean();
    }
    let list = getStore().memories;
    if (patientId) list = list.filter(m => m.patientId === patientId);
    if (category && category !== 'All') list = list.filter(m => m.category === category);
    return list;
  },

  async createMemory(data) {
    if (isDBConnected()) {
      return await Memory.create(data);
    }
    const store = getStore();
    const newMemory = {
      _id: generateId(),
      ...data,
      createdAt: new Date()
    };
    store.memories.unshift(newMemory);
    return newMemory;
  },

  async updateMemory(id, data) {
    if (isDBConnected()) {
      return await Memory.findByIdAndUpdate(id, data, { new: true });
    }
    const store = getStore();
    const idx = store.memories.findIndex(m => m._id === id);
    if (idx === -1) return null;
    store.memories[idx] = { ...store.memories[idx], ...data };
    return store.memories[idx];
  },

  async deleteMemory(id) {
    if (isDBConnected()) {
      return await Memory.findByIdAndDelete(id);
    }
    const store = getStore();
    const idx = store.memories.findIndex(m => m._id === id);
    if (idx === -1) return null;
    return store.memories.splice(idx, 1)[0];
  },

  // --- REMINDERS ---
  async getReminders(patientId) {
    if (isDBConnected()) {
      const query = patientId ? { patientId } : {};
      return await Reminder.find(query).sort({ time: 1 }).lean();
    }
    const list = getStore().reminders;
    return patientId ? list.filter(r => r.patientId === patientId) : list;
  },

  async createReminder(data) {
    if (isDBConnected()) {
      return await Reminder.create(data);
    }
    const store = getStore();
    const newReminder = {
      _id: generateId(),
      completed: false,
      missed: false,
      date: new Date().toISOString().split('T')[0],
      ...data,
      createdAt: new Date()
    };
    store.reminders.push(newReminder);
    return newReminder;
  },

  async updateReminder(id, data) {
    if (isDBConnected()) {
      return await Reminder.findByIdAndUpdate(id, data, { new: true });
    }
    const store = getStore();
    const idx = store.reminders.findIndex(r => r._id === id);
    if (idx === -1) return null;
    store.reminders[idx] = { ...store.reminders[idx], ...data };
    return store.reminders[idx];
  },

  async toggleCompleteReminder(id, completed) {
    const update = {
      completed,
      completedAt: completed ? new Date() : null,
      missed: false
    };
    return await this.updateReminder(id, update);
  },

  async deleteReminder(id) {
    if (isDBConnected()) {
      return await Reminder.findByIdAndDelete(id);
    }
    const store = getStore();
    const idx = store.reminders.findIndex(r => r._id === id);
    if (idx === -1) return null;
    return store.reminders.splice(idx, 1)[0];
  },

  // --- ROUTINES ---
  async getRoutines(patientId) {
    if (isDBConnected()) {
      const query = patientId ? { patientId } : {};
      return await DailyRoutine.find(query).sort({ order: 1 }).lean();
    }
    const list = getStore().routines;
    return patientId ? list.filter(r => r.patientId === patientId) : list;
  },

  async createRoutine(data) {
    if (isDBConnected()) {
      return await DailyRoutine.create(data);
    }
    const store = getStore();
    const newRoutine = {
      _id: generateId(),
      ...data,
      createdAt: new Date()
    };
    store.routines.push(newRoutine);
    return newRoutine;
  },

  async updateRoutine(id, data) {
    if (isDBConnected()) {
      return await DailyRoutine.findByIdAndUpdate(id, data, { new: true }).lean();
    }
    const store = getStore();
    const idx = store.routines.findIndex(r => r._id === id);
    if (idx === -1) return null;
    store.routines[idx] = { ...store.routines[idx], ...data };
    return store.routines[idx];
  },

  async deleteRoutine(id) {
    if (isDBConnected()) {
      return await DailyRoutine.findByIdAndDelete(id).lean();
    }
    const store = getStore();
    const idx = store.routines.findIndex(r => r._id === id);
    if (idx === -1) return null;
    return store.routines.splice(idx, 1)[0];
  },

  // --- EMERGENCY CONTACTS ---
  async getEmergencyContacts(patientId) {
    if (isDBConnected()) {
      const query = patientId ? { patientId } : {};
      return await EmergencyContact.find(query).sort({ priority: 1 }).lean();
    }
    const list = getStore().emergencyContacts;
    return patientId ? list.filter(c => c.patientId === patientId) : list;
  },

  async createEmergencyContact(data) {
    if (isDBConnected()) {
      return await EmergencyContact.create(data);
    }
    const store = getStore();
    const newContact = {
      _id: generateId(),
      ...data,
      createdAt: new Date()
    };
    store.emergencyContacts.push(newContact);
    return newContact;
  },

  async updateEmergencyContact(id, data) {
    if (isDBConnected()) {
      return await EmergencyContact.findByIdAndUpdate(id, data, { new: true }).lean();
    }
    const store = getStore();
    const idx = store.emergencyContacts.findIndex(c => c._id === id);
    if (idx === -1) return null;
    store.emergencyContacts[idx] = { ...store.emergencyContacts[idx], ...data };
    return store.emergencyContacts[idx];
  },

  async deleteEmergencyContact(id) {
    if (isDBConnected()) {
      return await EmergencyContact.findByIdAndDelete(id).lean();
    }
    const store = getStore();
    const idx = store.emergencyContacts.findIndex(c => c._id === id);
    if (idx === -1) return null;
    return store.emergencyContacts.splice(idx, 1)[0];
  },

  // --- NOTIFICATIONS ---
  async getNotifications(patientId) {
    if (isDBConnected()) {
      const query = patientId ? { patientId } : {};
      return await Notification.find(query).sort({ createdAt: -1 }).lean();
    }
    const list = getStore().notifications;
    return patientId ? list.filter(n => n.patientId === patientId) : list;
  },

  async createNotification(data) {
    if (isDBConnected()) {
      return await Notification.create(data);
    }
    const store = getStore();
    const newNotification = {
      _id: generateId(),
      isRead: false,
      ...data,
      createdAt: new Date()
    };
    store.notifications.unshift(newNotification);
    return newNotification;
  },

  async markNotificationRead(id) {
    if (isDBConnected()) {
      return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }
    const store = getStore();
    const item = store.notifications.find(n => n._id === id);
    if (item) item.isRead = true;
    return item;
  },

  // --- FULL DATA EXPORT ---
  async exportPatientData(patientId) {
    const patient = await this.getPatientById(patientId);
    const family = await this.getFamilyMembers(patientId);
    const memories = await this.getMemories(patientId);
    const reminders = await this.getReminders(patientId);
    const routines = await this.getRoutines(patientId);
    const emergencyContacts = await this.getEmergencyContacts(patientId);

    return {
      exportDate: new Date().toISOString(),
      patient,
      familyMembers: family,
      memories,
      reminders,
      dailyRoutines: routines,
      emergencyContacts
    };
  }
};

module.exports = DataStore;
