const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// GET /api/notifications?patientId=...
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const notifications = await DataStore.getNotifications(patientId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications', error: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const updated = await DataStore.markNotificationRead(req.params.id);
    res.json({ success: true, notification: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

module.exports = router;
