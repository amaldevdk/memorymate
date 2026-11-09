const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// GET /api/emergency/contacts?patientId=...
router.get('/contacts', async (req, res) => {
  try {
    const { patientId } = req.query;
    const contacts = await DataStore.getEmergencyContacts(patientId);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving emergency contacts', error: err.message });
  }
});

// POST /api/emergency/contacts (Caregiver adds emergency contact)
router.post('/contacts', auth, async (req, res) => {
  try {
    const { patientId, name, relationship, phoneNumber, photoUrl, priority, isPrimaryCaregiver, notes } = req.body;
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    const newContact = await DataStore.createEmergencyContact({
      patientId: patientId || '67cf00000000000000000001',
      name,
      relationship: relationship || 'Family',
      phoneNumber,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      priority: Number(priority) || 1,
      isPrimaryCaregiver: Boolean(isPrimaryCaregiver),
      notes: notes || ''
    });

    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: 'Error creating emergency contact', error: err.message });
  }
});

// PUT /api/emergency/contacts/:id
router.put('/contacts/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updateEmergencyContact(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Emergency contact not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating emergency contact', error: err.message });
  }
});

// DELETE /api/emergency/contacts/:id
router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    const deleted = await DataStore.deleteEmergencyContact(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Emergency contact deleted', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting contact', error: err.message });
  }
});

// POST /api/emergency/trigger (Patient presses SOS or notify caregiver)
// Emits real-time socket alert + creates high-priority notification record
router.post('/trigger', async (req, res) => {
  try {
    const { patientId, triggerType, locationInfo, notes } = req.body;
    const targetPatientId = patientId || '67cf00000000000000000001';

    const patient = await DataStore.getPatientById(targetPatientId);
    const patientName = patient ? patient.fullName : 'Patient';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Create high-severity notification
    const alertRecord = await DataStore.createNotification({
      patientId: targetPatientId,
      type: 'emergency',
      title: `EMERGENCY SOS: ${patientName}`,
      message: `${patientName} triggered the emergency assistance alert at ${timestamp}. Immediate check-in advised!`,
      severity: 'critical',
      metadata: {
        triggerType: triggerType || 'SOS Button',
        locationInfo: locationInfo || (patient ? patient.address : 'Home'),
        notes: notes || '',
        timestamp: new Date()
      }
    });

    // Real-time broadcast through Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency_alert', {
        id: alertRecord._id,
        patientName,
        patientId: targetPatientId,
        message: alertRecord.message,
        timestamp,
        severity: 'critical'
      });
      console.log(`[Socket.io] Real-time emergency alert broadcast for ${patientName}`);
    }

    res.json({
      success: true,
      delivered: true,
      message: 'Emergency alert successfully transmitted to family caregivers and logged.',
      timestamp,
      alert: alertRecord
    });
  } catch (err) {
    console.error('Emergency trigger error:', err);
    res.status(500).json({
      success: false,
      delivered: false,
      message: 'Failed to broadcast emergency alert. Please call emergency services directly.',
      error: err.message
    });
  }
});

module.exports = router;
