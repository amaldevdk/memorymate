const express = require('express');
const router = express.Router();
const DataStore = require('../utils/dataStore');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/family?patientId=...
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const members = await DataStore.getFamilyMembers(patientId);
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving family members', error: err.message });
  }
});

// GET /api/family/:id
router.get('/:id', async (req, res) => {
  try {
    const member = await DataStore.getFamilyMemberById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Person not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving family member', error: err.message });
  }
});

// POST /api/family (Caregiver adds family member)
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientId,
      name,
      relationship,
      photoUrl,
      phoneNumber,
      description,
      malayalamDescription,
      voicePrompt,
      malayalamVoicePrompt,
      frequentVisitor,
      isEmergencyContact
    } = req.body;

    if (!name || !relationship) {
      return res.status(400).json({ message: 'Name and relationship are required' });
    }

    const defaultVoice = `This is ${name}. ${relationship === 'Self' ? 'This is you.' : `${name} is your ${relationship}.`}`;

    const newMember = await DataStore.createFamilyMember({
      patientId: patientId || '67cf00000000000000000001',
      name,
      relationship,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      phoneNumber: phoneNumber || '',
      description: description || `${name} is your ${relationship}.`,
      malayalamDescription: malayalamDescription || '',
      voicePrompt: voicePrompt || defaultVoice,
      malayalamVoicePrompt: malayalamVoicePrompt || '',
      frequentVisitor: Boolean(frequentVisitor),
      isEmergencyContact: Boolean(isEmergencyContact)
    });

    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: 'Error adding family member', error: err.message });
  }
});

// PUT /api/family/:id (Caregiver updates family member)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await DataStore.updateFamilyMember(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Family member not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating family member', error: err.message });
  }
});

// DELETE /api/family/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await DataStore.deleteFamilyMember(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Family member not found' });
    res.json({ message: 'Family member removed successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting family member', error: err.message });
  }
});

// POST /api/family/upload-photo (Optional image file upload)
router.post('/upload-photo', auth, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    res.json({ photoUrl });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

module.exports = router;
