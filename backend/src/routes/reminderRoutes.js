const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// Helper to determine if a reminder is missed
const computeMissedStatus = (reminders) => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  return reminders.map(rawDoc => {
    const r = rawDoc.toObject ? rawDoc.toObject() : rawDoc;
    let isMissed = false;
    if (!r.completed && r.time) {
      // parse "HH:MM"
      const parts = r.time.replace(/[^0-9:]/g, '').split(':');
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10);
        if (r.time.toLowerCase().includes('pm') && h < 12) h += 12;
        if (r.time.toLowerCase().includes('am') && h === 12) h = 0;
        const reminderTimeVal = h * 60 + m;
        // If more than 30 minutes past scheduled time and not marked completed
        if (currentTimeVal > reminderTimeVal + 30) {
          isMissed = true;
        }
      }
    }
    return { ...r, missed: isMissed };
  });
};

// GET /api/reminders?patientId=...
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const reminders = await DataStore.getReminders(patientId);
    const withMissed = computeMissedStatus(reminders);
    res.json(withMissed);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reminders', error: err.message });
  }
});

// POST /api/reminders (Caregiver creates reminder)
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientId,
      title,
      category,
      time,
      dosageOrInstruction,
      audioPrompt,
      malayalamAudioPrompt,
      repeat,
      notes,
      medicalDisclaimerConfirmed
    } = req.body;

    if (!title || !time) {
      return res.status(400).json({ message: 'Title and time are required' });
    }

    // Explicit compliance check: Medical disclaimer acknowledgment
    if (category === 'medication' && medicalDisclaimerConfirmed === false) {
      return res.status(400).json({
        message: 'Caregiver must confirm that medication instructions are recorded according to medical prescription.'
      });
    }

    const defaultAudio = audioPrompt || `Reminder for ${title}. Scheduled for ${time}. ${dosageOrInstruction || ''}`;

    const newReminder = await DataStore.createReminder({
      patientId: patientId || '67cf00000000000000000001',
      createdBy: req.user.id || req.user._id,
      title,
      category: category || 'general',
      time,
      dosageOrInstruction: dosageOrInstruction || '',
      audioPrompt: defaultAudio,
      malayalamAudioPrompt: malayalamAudioPrompt || '',
      repeat: repeat || 'daily',
      notes: notes || '',
      medicalDisclaimerConfirmed: Boolean(medicalDisclaimerConfirmed ?? true)
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('reminder_updated', { type: 'new', reminder: newReminder });
    }

    res.status(201).json(newReminder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating reminder', error: err.message });
  }
});

// PUT /api/reminders/:id/complete (Patient or caregiver marks complete)
router.put('/:id/complete', async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await DataStore.toggleCompleteReminder(req.params.id, completed !== undefined ? completed : true);
    if (!updated) return res.status(404).json({ message: 'Reminder not found' });

    // Create caregiver notification log
    if (completed) {
      await DataStore.createNotification({
        patientId: updated.patientId,
        type: 'completed_reminder',
        title: 'Reminder Completed',
        message: `Task completed: "${updated.title}" at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        severity: 'success',
        metadata: { reminderId: updated._id }
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('reminder_status_changed', { reminder: updated });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating reminder status', error: err.message });
  }
});

// PUT /api/reminders/:id (Caregiver edits reminder)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updateReminder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Reminder not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('reminder_updated', { type: 'update', reminder: updated });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating reminder', error: err.message });
  }
});

// DELETE /api/reminders/:id (Caregiver deletes reminder)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await DataStore.deleteReminder(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Reminder not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('reminder_updated', { type: 'delete', id: req.params.id });
    }

    res.json({ message: 'Reminder removed', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reminder', error: err.message });
  }
});

module.exports = router;
