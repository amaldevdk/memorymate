import React, { useState, useEffect } from 'react';
import { PhoneCall, AlertTriangle, Plus, Phone, ShieldAlert, CheckCircle, User, Heart } from 'lucide-react';
import EmergencySOSButton from '../components/EmergencySOSButton';
import Modal from '../components/Modal';
import { emergencyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';

const EmergencyContactsPage = () => {
  const { activePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Family Member',
    phoneNumber: '',
    priority: 1,
    isPrimaryCaregiver: false,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    notes: ''
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await emergencyService.getContacts(activePatient?._id);
      setContacts(data || []);
    } catch (err) {
      console.error('Failed to load emergency contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [activePatient]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this emergency contact?')) {
      try {
        await emergencyService.deleteContact(id);
        setContacts(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete contact');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await emergencyService.createContact({
        patientId: activePatient?._id,
        ...formData
      });
      setContacts(prev => [...prev, created]);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to create emergency contact');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Emergency SOS Master Trigger */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-3 border-rose-300 rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Need Help Immediately?
              </h2>
              <p className="text-base md:text-lg font-bold text-slate-600">
                Press the big red button below to send an emergency alert to Priya and your family.
              </p>
            </div>
          </div>

          <VoiceButton
            text="If you feel unwell or need help, tap the red button below or tap the green call button next to Priya's name."
            malayalamText="സഹായം ആവശ്യമെങ്കിൽ താഴെയുള്ള ചുവന്ന ബട്ടണിൽ അമർത്തുക."
            label="Listen Help Instructions"
            size="md"
          />
        </div>

        <EmergencySOSButton variant="full" />
      </div>

      {/* Contacts List Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900">
            Registered Family & Emergency Contacts
          </h3>
          <p className="text-slate-500 font-bold">
            Tap the green Call button to speak directly with each person
          </p>
        </div>

        {isCaregiver && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Contacts Cards */}
      {loading ? (
        <div className="text-center py-12 font-bold text-slate-400">Loading contacts...</div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`bg-white rounded-3xl p-6 shadow-md border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
                contact.priority === 1 ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0 shadow-sm">
                  {contact.photoUrl ? (
                    <img
                      src={contact.photoUrl}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-600">
                      Priority #{contact.priority}
                    </span>
                    {contact.isPrimaryCaregiver && (
                      <span className="text-xs font-extrabold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                        Primary Living Caregiver
                      </span>
                    )}
                  </div>

                  <h4 className="text-2xl font-black text-slate-900 leading-snug">
                    {contact.name}
                  </h4>

                  <p className="text-slate-600 font-semibold text-base">
                    {contact.relationship} &bull; <span className="font-mono font-bold text-slate-900">{contact.phoneNumber}</span>
                  </p>

                  {contact.notes && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Dial Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`tel:${contact.phoneNumber}`}
                  className="touch-target-elderly flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl px-7 py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <PhoneCall className="w-6 h-6" />
                  <span>Call Now</span>
                </a>

                {isCaregiver && (
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Remove Contact"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Priya Thomas"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                required
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="e.g. Daughter / Living at home"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+91 98471 23456"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority Order</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value={1}>Priority 1 (Highest / Dial First)</option>
                <option value={2}>Priority 2 (Secondary Family)</option>
                <option value={3}>Priority 3 (Doctor / Healthcare)</option>
                <option value={4}>Priority 4 (Ambulance / Emergency)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Photo URL</label>
            <input
              type="url"
              value={formData.photoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Care Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Lives at home; responds immediately to calls."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.isPrimaryCaregiver}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrimaryCaregiver: e.target.checked }))}
                className="w-5 h-5 accent-teal-600 rounded"
              />
              <span>Primary Caregiver (Lives in same residence)</span>
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
              Save Contact
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyContactsPage;
