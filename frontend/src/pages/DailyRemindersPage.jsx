import React, { useState, useEffect } from 'react';
import { Clock, Plus, AlertTriangle, CheckCircle2, Pill, Droplets, Utensils, Stethoscope, Activity, ShieldCheck } from 'lucide-react';
import ReminderCard from '../components/ReminderCard';
import Modal from '../components/Modal';
import { reminderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';

const DailyRemindersPage = () => {
  const { activePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'medication',
    time: '08:30',
    dosageOrInstruction: '',
    audioPrompt: '',
    malayalamAudioPrompt: '',
    repeat: 'daily',
    notes: '',
    medicalDisclaimerConfirmed: true
  });

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getAll(activePatient?._id);
      setReminders(data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [activePatient]);

  const handleToggleComplete = async (id, status) => {
    try {
      const updated = await reminderService.toggleComplete(id, status);
      setReminders(prev => prev.map(r => (r._id === id ? updated : r)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingReminder(null);
    setFormData({
      title: '',
      category: 'medication',
      time: '08:30',
      dosageOrInstruction: '1 tablet after breakfast',
      audioPrompt: '',
      malayalamAudioPrompt: '',
      repeat: 'daily',
      notes: 'Prescribed by neurologist Dr. Elizabeth Roy',
      medicalDisclaimerConfirmed: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      category: reminder.category,
      time: reminder.time,
      dosageOrInstruction: reminder.dosageOrInstruction || '',
      audioPrompt: reminder.audioPrompt || '',
      malayalamAudioPrompt: reminder.malayalamAudioPrompt || '',
      repeat: reminder.repeat || 'daily',
      notes: reminder.notes || '',
      medicalDisclaimerConfirmed: true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      try {
        await reminderService.delete(id);
        setReminders(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert('Failed to delete reminder');
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

      if (editingReminder) {
        const updated = await reminderService.update(editingReminder._id, payload);
        setReminders(prev => prev.map(r => (r._id === editingReminder._id ? updated : r)));
      } else {
        const created = await reminderService.create(payload);
        setReminders(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving reminder');
    }
  };

  const completedCount = reminders.filter(r => r.completed).length;
  const missedCount = reminders.filter(r => r.missed && !r.completed).length;

  const filteredReminders = reminders.filter(r => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'completed') return r.completed;
    if (filterCategory === 'pending') return !r.completed;
    if (filterCategory === 'missed') return r.missed && !r.completed;
    return r.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Care & Routine Reminders
            </span>
            <span className="text-sm font-bold text-slate-500">
              {completedCount} of {reminders.length} Done
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900">
            Daily Reminders
          </h1>
          <p className="text-lg font-bold text-slate-600 mt-1 max-w-xl">
            Gentle reminders for medication, hydration, and healthy meals throughout the day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceButton
            text={`You have ${reminders.length - completedCount} reminders remaining for today. Please remember to take your medication and drink water.`}
            malayalamText="ഇന്നത്തെ മരുന്നുകളും വെള്ളം കുടിക്കാനുള്ള ഓർമ്മപ്പെടുത്തലുകളും ഇവിടെ കാണാം."
            label="Read Today's Tasks"
            size="md"
          />

          {isCaregiver && (
            <button
              onClick={handleOpenAdd}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer touch-target-elderly"
            >
              <Plus className="w-5 h-5" />
              <span>Add Reminder</span>
            </button>
          )}
        </div>
      </div>

      {/* Missed Reminder Banner for Caregiver Attention */}
      {missedCount > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center gap-3 text-rose-900">
          <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div className="font-bold text-base">
            <span className="font-extrabold">{missedCount} reminder(s) are past their scheduled time.</span>{' '}
            Please gently check in with {activePatient?.preferredName || 'the patient'} to confirm they took their water or medication.
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: `All (${reminders.length})` },
          { id: 'pending', label: `To Do (${reminders.length - completedCount})` },
          { id: 'completed', label: `Done (${completedCount})` },
          { id: 'medication', label: 'Medications Only' },
          { id: 'water', label: 'Hydration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`touch-target-elderly px-5 py-2.5 rounded-2xl font-black text-base flex-shrink-0 transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      {loading ? (
        <div className="text-center py-16 text-xl font-bold text-slate-500">
          Loading daily reminders...
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">All tasks in this view are completed!</h3>
          <p className="text-slate-500 mt-1">Great job maintaining today's healthy schedule.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReminders.map(reminder => (
            <ReminderCard
              key={reminder._id}
              reminder={reminder}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReminder ? 'Edit Reminder' : 'Add Scheduled Reminder'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Morning Blood Pressure Medication"
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
                <option value="medication">Prescribed Medication</option>
                <option value="water">Drink Water / Hydration</option>
                <option value="meals">Breakfast / Lunch / Dinner</option>
                <option value="doctor">Doctor Visit / Clinic</option>
                <option value="activity">Daily Activity / Walk</option>
                <option value="general">General Reminder</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Time (HH:MM)</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                placeholder="08:30"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Repeat Frequency</label>
              <select
                value={formData.repeat}
                onChange={(e) => setFormData(prev => ({ ...prev, repeat: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="once">Once Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dosage or Specific Instructions
            </label>
            <input
              type="text"
              value={formData.dosageOrInstruction}
              onChange={(e) => setFormData(prev => ({ ...prev, dosageOrInstruction: e.target.value }))}
              placeholder="e.g. 1 Tablet (Amlodipine 5mg) with warm water after breakfast"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Voice Audio Announcement</label>
              <input
                type="text"
                value={formData.audioPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, audioPrompt: e.target.value }))}
                placeholder="Good morning Thomas. Please take your blood pressure tablet."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Malayalam Audio Announcement</label>
              <input
                type="text"
                value={formData.malayalamAudioPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, malayalamAudioPrompt: e.target.value }))}
                placeholder="രാവിലെത്തെ മരുന്ന് കഴിക്കാൻ സമയമായി..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Medical Safety Disclaimer & Caregiver Confirmation */}
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-sm text-amber-950">
                  Medical Compliance Safety Notice
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  MemoryMate does not prescribe or alter medication schedules. Caregivers certify that all recorded dosages strictly mirror prescriptions provided by the patient's physician.
                </p>
                <label className="flex items-center gap-2 mt-2 cursor-pointer font-bold text-xs text-amber-950">
                  <input
                    type="checkbox"
                    required
                    checked={formData.medicalDisclaimerConfirmed}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalDisclaimerConfirmed: e.target.checked }))}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>I confirm this reminder aligns with verified medical guidance.</span>
                </label>
              </div>
            </div>
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
              {editingReminder ? 'Update Reminder' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DailyRemindersPage;
