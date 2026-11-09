const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'memorymate_super_secret_jwt_key_2026_elderly_care';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, patientName, patientAge, stage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await DataStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If caregiver registered and provided patient info, create patient profile
    let patientProfileId = null;
    if (role !== 'patient' && patientName) {
      const Patient = require('../models/Patient');
      const { isDBConnected, getStore } = require('../config/db');
      const patientData = {
        fullName: patientName,
        preferredName: patientName.split(' ')[0],
        age: Number(patientAge) || 75,
        stage: stage || 'Early',
        emergencyNotes: 'Early-stage Alzheimer’s patient profile created by family caregiver.',
        consentGiven: true
      };

      if (isDBConnected()) {
        const newPatient = await Patient.create({
          caregiverId: new (require('mongoose').Types.ObjectId)(),
          ...patientData
        });
        patientProfileId = newPatient._id;
      } else {
        const newId = '67cf' + Date.now().toString(16).padEnd(20, '0');
        const newPatient = { _id: newId, caregiverId: 'pending', ...patientData, createdAt: new Date() };
        getStore().patients.push(newPatient);
        patientProfileId = newId;
      }
    }

    const newUser = await DataStore.createUser({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role || 'caregiver',
      patientProfile: patientProfileId
    });

    const token = signToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      patientProfile: newUser.patientProfile
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        patientProfile: newUser.patientProfile
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await DataStore.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Support bcrypt check or plain password comparison for initial seed caregiver
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      patientProfile: user.patientProfile
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientProfile: user.patientProfile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// POST /api/auth/demo-login
// Fast 1-click login for testing: role = 'patient' or 'caregiver'
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body;
    const defaultPatientId = '67cf00000000000000000001';

    if (role === 'patient') {
      const token = signToken({
        id: defaultPatientId,
        name: 'Thomas Kurian',
        email: 'thomas@memorymate.local',
        role: 'patient',
        patientProfile: defaultPatientId
      });

      return res.json({
        message: 'Patient demo session active',
        token,
        user: {
          id: defaultPatientId,
          name: 'Thomas Kurian',
          role: 'patient',
          patientProfile: defaultPatientId
        }
      });
    } else {
      // Caregiver role
      const token = signToken({
        id: '67cf00000000000000000002',
        name: 'Priya Thomas',
        email: 'priya@example.com',
        role: 'caregiver',
        patientProfile: defaultPatientId
      });

      return res.json({
        message: 'Caregiver demo session active',
        token,
        user: {
          id: '67cf00000000000000000002',
          name: 'Priya Thomas',
          email: 'priya@example.com',
          role: 'caregiver',
          patientProfile: defaultPatientId
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Demo login error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await DataStore.findUserById(req.user.id || req.user._id);
    if (!user) {
      // Return token decoded user if patient or mock
      return res.json({ user: req.user });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
