const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');

// GET /api/routines?patientId=...
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const routines = await DataStore.getRoutines(patientId);
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving routines', error: err.message });
  }
});

// POST /api/routines
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, time, timeSlot, activity, malayalamActivity, icon, description, order } = req.body;
    if (!time || !activity) {
      return res.status(400).json({ message: 'Time and activity are required' });
    }

    const newRoutine = await DataStore.createRoutine({
      patientId: patientId || '67cf00000000000000000001',
      time,
      timeSlot: timeSlot || 'Morning',
      activity,
      malayalamActivity: malayalamActivity || '',
      icon: icon || 'sun',
      description: description || '',
      order: Number(order) || 10
    });

    const io = req.app.get('io');
    if (io) io.emit('routine_updated', { type: 'new', routine: newRoutine });

    res.status(201).json(newRoutine);
  } catch (err) {
    res.status(500).json({ message: 'Error adding routine item', error: err.message });
  }
});

// PUT /api/routines/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updateRoutine(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Routine item not found' });

    const io = req.app.get('io');
    if (io) io.emit('routine_updated', { type: 'update', routine: updated });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating routine', error: err.message });
  }
});

// DELETE /api/routines/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await DataStore.deleteRoutine(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Routine item not found' });

    const io = req.app.get('io');
    if (io) io.emit('routine_updated', { type: 'delete', id: req.params.id });

    res.json({ message: 'Routine item removed', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting routine', error: err.message });
  }
});

module.exports = router;
