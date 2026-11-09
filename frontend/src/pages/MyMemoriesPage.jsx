import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Filter, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';
import MemoryTimelineCard from '../components/MemoryTimelineCard';
import Modal from '../components/Modal';
import { memoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';

const categories = ['All', 'Family', 'Special Events', 'Childhood', 'Education', 'Friends'];

const MyMemoriesPage = () => {
  const { activePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [memories, setMemories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Family',
    date: '',
    location: '',
    photoUrl: '',
    description: '',
    malayalamDescription: '',
    peopleTagged: '',
    audioText: '',
    favorite: false
  });

  const loadMemories = async () => {
    try {
      setLoading(true);
      const data = await memoryService.getAll(activePatient?._id, selectedCategory);
      setMemories(data || []);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [activePatient, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setFormData({
      title: '',
      category: 'Family',
      date: '',
      location: 'Kochi, Kerala',
      photoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
      description: '',
      malayalamDescription: '',
      peopleTagged: '',
      audioText: '',
      favorite: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      category: memory.category,
      date: memory.date || '',
      location: memory.location || '',
      photoUrl: memory.photoUrl || '',
      description: memory.description,
      malayalamDescription: memory.malayalamDescription || '',
      peopleTagged: Array.isArray(memory.peopleTagged) ? memory.peopleTagged.join(', ') : '',
      audioText: memory.audioText || '',
      favorite: Boolean(memory.favorite)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this memory?')) {
      try {
        await memoryService.delete(id);
        setMemories(prev => prev.filter(m => m._id !== id));
      } catch (err) {
        alert('Failed to delete memory');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientId: activePatient?._id,
        ...formData
      };

      if (editingMemory) {
        const updated = await memoryService.update(editingMemory._id, payload);
        setMemories(prev => prev.map(m => (m._id === editingMemory._id ? updated : m)));
      } else {
        const created = await memoryService.create(payload);
        setMemories(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving memory');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Life Story Timeline
            </span>
            <span className="text-sm font-bold text-slate-500">
              {memories.length} Cherished Memories
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900">
            My Life Memories
          </h1>
          <p className="text-lg font-bold text-slate-600 mt-1 max-w-2xl">
            A journey through your life stories, weddings, children's achievements, and happiest days.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceButton
            text="Welcome to your personal memory timeline. You can explore memories of your family, wedding day, and childhood."
            malayalamText="നിങ്ങളുടെ ജീവിതത്തിലെ മനോഹരമായ ഓർമ്മകൾ ഇവിടെ കാണാം."
            label="Listen Overview"
            size="md"
          />

          {isCaregiver && (
            <button
              onClick={handleOpenAdd}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer touch-target-elderly"
            >
              <Plus className="w-5 h-5" />
              <span>Add Memory</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`touch-target-elderly px-5 py-2.5 rounded-2xl font-black text-base flex-shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline Cards */}
      {loading ? (
        <div className="text-center py-16 text-xl font-bold text-slate-500">
          Loading memories timeline...
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 max-w-md mx-auto">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">No memories found</h3>
          <p className="text-slate-500 mt-1">Select another category or add a new memory card.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {memories.map((memory) => (
            <MemoryTimelineCard
              key={memory._id}
              memory={memory}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMemory ? 'Edit Memory' : 'Add New Life Memory'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Memory Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Wedding Day in Alappuzha"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="Family">Family</option>
                <option value="Special Events">Special Events</option>
                <option value="Childhood">Childhood</option>
                <option value="Education">Education</option>
                <option value="Friends">Friends</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date / Year</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                placeholder="e.g. May 14, 1978"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Alappuzha, Kerala"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Photo URL</label>
            <input
              type="url"
              required
              value={formData.photoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Memory Narrative Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A beautiful sunny Sunday when you and Mary exchanged rings..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Malayalam Narrative (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.malayalamDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, malayalamDescription: e.target.value }))}
              placeholder="ആലപ്പുഴയിൽ വെച്ച് നടന്ന നിങ്ങളുടെ മനോഹരമായ വിവാഹ ദിനം..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">People in this photo (comma-separated)</label>
              <input
                type="text"
                value={formData.peopleTagged}
                onChange={(e) => setFormData(prev => ({ ...prev, peopleTagged: e.target.value }))}
                placeholder="Mary Thomas, Rahul"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Audio Readout Text</label>
              <input
                type="text"
                value={formData.audioText}
                onChange={(e) => setFormData(prev => ({ ...prev, audioText: e.target.value }))}
                placeholder="This is your wedding day in Alappuzha..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) => setFormData(prev => ({ ...prev, favorite: e.target.checked }))}
                className="w-5 h-5 accent-rose-600 rounded"
              />
              <span>Mark as Cherished Favorite Memory</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              {editingMemory ? 'Update Memory' : 'Save Memory'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyMemoriesPage;
