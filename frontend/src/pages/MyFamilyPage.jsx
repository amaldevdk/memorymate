import React, { useState, useEffect } from 'react';
import { Users, Plus, Heart, Search, Filter } from 'lucide-react';
import PersonCard from '../components/PersonCard';
import Modal from '../components/Modal';
import { familyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';

const MyFamilyPage = () => {
  const { activePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Son',
    photoUrl: '',
    phoneNumber: '',
    description: '',
    malayalamDescription: '',
    voicePrompt: '',
    malayalamVoicePrompt: '',
    frequentVisitor: true,
    isEmergencyContact: false
  });

  const loadFamily = async () => {
    try {
      setLoading(true);
      const data = await familyService.getAll(activePatient?._id);
      setFamilyMembers(data || []);
    } catch (err) {
      console.error('Failed to load family members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, [activePatient]);

  const handleOpenAdd = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      relationship: 'Son',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      phoneNumber: '',
      description: '',
      malayalamDescription: '',
      voicePrompt: '',
      malayalamVoicePrompt: '',
      frequentVisitor: true,
      isEmergencyContact: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      relationship: person.relationship,
      photoUrl: person.photoUrl,
      phoneNumber: person.phoneNumber || '',
      description: person.description,
      malayalamDescription: person.malayalamDescription || '',
      voicePrompt: person.voicePrompt || '',
      malayalamVoicePrompt: person.malayalamVoicePrompt || '',
      frequentVisitor: Boolean(person.frequentVisitor),
      isEmergencyContact: Boolean(person.isEmergencyContact)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      try {
        await familyService.delete(id);
        setFamilyMembers(prev => prev.filter(m => m._id !== id));
      } catch (err) {
        alert('Failed to delete family member');
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

      if (editingPerson) {
        const updated = await familyService.update(editingPerson._id, payload);
        setFamilyMembers(prev => prev.map(m => (m._id === editingPerson._id ? updated : m)));
      } else {
        const created = await familyService.create(payload);
        setFamilyMembers(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving family member');
    }
  };

  const filteredMembers = familyMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title & Navigation Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Family & Relationships
            </span>
            <span className="text-sm font-bold text-slate-500">
              {familyMembers.length} Familiar People
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900">
            People Who Love You
          </h1>
          <p className="text-lg font-bold text-slate-600 mt-1 max-w-2xl">
            Here are photographs and voices of your family members, children, and close friends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceButton
            text={`Here are the photographs of your loving family members, including your daughter Priya, your son Rahul, and your granddaughter Ananya.`}
            malayalamText="ഇവിടെ നിങ്ങളുടെ പ്രിയപ്പെട്ട കുടുംബാംഗങ്ങളുടെ ചിത്രങ്ങളും വിവരങ്ങളും ഉണ്ട്."
            label="Listen Overview"
            size="md"
          />

          {isCaregiver && (
            <button
              onClick={handleOpenAdd}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer touch-target-elderly"
            >
              <Plus className="w-5 h-5" />
              <span>Add Family Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border-2 border-slate-200 shadow-xs max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name (Rahul, Priya...)"
          className="w-full bg-transparent font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden text-base"
        />
      </div>

      {/* People Grid */}
      {loading ? (
        <div className="text-center py-16 text-xl font-bold text-slate-500">
          Loading familiar faces...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 max-w-md mx-auto">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">No faces found</h3>
          <p className="text-slate-500 mt-1">Try another search term or add a new family member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMembers.map((person) => (
            <PersonCard
              key={person._id}
              person={person}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPerson ? 'Edit Family Member' : 'Add New Family Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Rahul Kurian"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Granddaughter">Granddaughter</option>
                <option value="Grandson">Grandson</option>
                <option value="Spouse">Spouse (Wife/Husband)</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Caregiver">Primary Caregiver</option>
                <option value="Friend">Close Friend</option>
                <option value="Doctor">Doctor / Physician</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Photograph URL</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+91 98471 23456"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description (Easy for patient to recognize)
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Rahul is your elder son. He lives in Kochi and visits every Sunday with your granddaughter."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Malayalam Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.malayalamDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, malayalamDescription: e.target.value }))}
              placeholder="ഇത് നിങ്ങളുടെ മകൻ രാഹുൽ ആണ്..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Voice Prompt (English)</label>
              <input
                type="text"
                value={formData.voicePrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, voicePrompt: e.target.value }))}
                placeholder="This is Rahul. He is your son."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Voice Prompt (Malayalam)</label>
              <input
                type="text"
                value={formData.malayalamVoicePrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, malayalamVoicePrompt: e.target.value }))}
                placeholder="ഇത് രാഹുൽ. നിങ്ങളുടെ മകനാണ്."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.frequentVisitor}
                onChange={(e) => setFormData(prev => ({ ...prev, frequentVisitor: e.target.checked }))}
                className="w-5 h-5 accent-teal-600 rounded"
              />
              <span>Frequent Visitor</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.isEmergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, isEmergencyContact: e.target.checked }))}
                className="w-5 h-5 accent-rose-600 rounded"
              />
              <span>Show in Emergency SOS</span>
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
              {editingPerson ? 'Update Person' : 'Save Family Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyFamilyPage;
