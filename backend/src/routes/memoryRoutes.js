const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/memories?patientId=...&category=...
router.get('/', async (req, res) => {
  try {
    const { patientId, category } = req.query;
    const memories = await DataStore.getMemories(patientId, category);
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving memories', error: err.message });
  }
});

// POST /api/memories (Caregiver adds memory)
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientId,
      title,
      category,
      date,
      location,
      photoUrl,
      description,
      malayalamDescription,
      peopleTagged,
      audioText,
      favorite
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const defaultAudio = audioText || `${title}. In ${location || 'familiar places'}. ${description}`;

    const newMemory = await DataStore.createMemory({
      patientId: patientId || '67cf00000000000000000001',
      title,
      category: category || 'Family',
      date: date || '',
      location: location || '',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
      description,
      malayalamDescription: malayalamDescription || '',
      peopleTagged: Array.isArray(peopleTagged) ? peopleTagged : (peopleTagged ? peopleTagged.split(',').map(s => s.trim()) : []),
      audioText: defaultAudio,
      favorite: Boolean(favorite)
    });

    res.status(201).json(newMemory);
  } catch (err) {
    res.status(500).json({ message: 'Error creating memory', error: err.message });
  }
});

// PUT /api/memories/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updateMemory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Memory not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating memory', error: err.message });
  }
});

// DELETE /api/memories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await DataStore.deleteMemory(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Memory not found' });
    res.json({ message: 'Memory deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting memory', error: err.message });
  }
});

// Upload image for memory
router.post('/upload-photo', auth, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ photoUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

module.exports = router;
