const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// GET /api/settings/export (Export all patient data as JSON)
router.get('/export', auth, async (req, res) => {
  try {
    const patientId = req.query.patientId || req.user.patientProfile || '67cf00000000000000000001';
    const exportData = await DataStore.exportPatientData(patientId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=memorymate-export-${patientId}-${Date.now()}.json`);
    res.json(exportData);
  } catch (err) {
    res.status(500).json({ message: 'Error exporting patient data', error: err.message });
  }
});

// POST /api/settings/consent (Update consent record)
router.post('/consent', auth, async (req, res) => {
  try {
    const { patientId, consentGiven } = req.body;
    const targetId = patientId || req.user.patientProfile || '67cf00000000000000000001';

    const updated = await DataStore.updatePatient(targetId, {
      consentGiven: Boolean(consentGiven)
    });

    res.json({
      message: 'Privacy and data processing consent preference updated',
      patient: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating consent', error: err.message });
  }
});

module.exports = router;
