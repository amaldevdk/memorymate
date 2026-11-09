const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// GET /api/patient (Get active patient)
router.get('/', async (req, res) => {
  try {
    const patients = await DataStore.getPatients();
    const active = patients.length > 0 ? patients[0] : null;
    res.json(active);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving patient profile', error: err.message });
  }
});

// GET /api/patient/:id
router.get('/:id', async (req, res) => {
  try {
    const patient = await DataStore.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient', error: err.message });
  }
});

// PUT /api/patient/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient profile updated successfully', patient: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating patient', error: err.message });
  }
});

// POST /api/patient
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, age, stage, photoUrl, emergencyNotes, address, preferredLanguage, fontSize } = req.body;
    if (!fullName || !age) {
      return res.status(400).json({ message: 'Full name and age are required' });
    }

    const { isDBConnected, getStore } = require('../config/db');
    const Patient = require('../models/Patient');

    let newPatient;
    if (isDBConnected()) {
      newPatient = await Patient.create({
        caregiverId: req.user.id || req.user._id,
        fullName,
        age,
        stage: stage || 'Early',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        emergencyNotes: emergencyNotes || '',
        address: address || '',
        preferredLanguage: preferredLanguage || 'en',
        fontSize: fontSize || 'large'
      });
    } else {
      const store = getStore();
      const id = '67cf' + Date.now().toString(16).padEnd(20, '0');
      newPatient = {
        _id: id,
        caregiverId: req.user.id || req.user._id,
        fullName,
        age,
        stage: stage || 'Early',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        emergencyNotes: emergencyNotes || '',
        address: address || '',
        preferredLanguage: preferredLanguage || 'en',
        fontSize: fontSize || 'large',
        createdAt: new Date()
      };
      store.patients.push(newPatient);
    }

    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: 'Error creating patient', error: err.message });
  }
});

module.exports = router;
