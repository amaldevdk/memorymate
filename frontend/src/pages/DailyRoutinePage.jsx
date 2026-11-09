import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Sun, Moon, Sparkles, Clock } from 'lucide-react';
import RoutineTimeline from '../components/RoutineTimeline';
import Modal from '../components/Modal';
import { routineService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VoiceButton from '../components/VoiceButton';

const DailyRoutinePage = () => {
  const { activePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);

  const [formData, setFormData] = useState({
    time: '07:00 AM',
    timeSlot: 'Morning',
    activity: '',
    malayalamActivity: '',
    icon: 'sun',
    description: '',
    order: 1
  });

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const data = await routineService.getAll(activePatient?._id);
      setRoutines(data || []);
    } catch (err) {
      console.error('Failed to load routines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutines();
  }, [activePatient]);

  const handleOpenAdd = () => {
    setEditingRoutine(null);
    setFormData({
      time: '09:00 AM',
      timeSlot: 'Morning',
      activity: 'Morning Walk in Garden',
      malayalamActivity: 'പൂന്തോട്ടത്തിൽ പ്രഭാത നടത്തം',
      icon: 'walk',
      description: '15-minute gentle stroll in the morning breeze.',
      order: routines.length + 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (routine) => {
    setEditingRoutine(routine);
    setFormData({
      time: routine.time,
      timeSlot: routine.timeSlot,
      activity: routine.activity,
      malayalamActivity: routine.malayalamActivity || '',
      icon: routine.icon || 'sun',
      description: routine.description || '',
      order: routine.order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this routine step?')) {
      try {
        await routineService.delete(id);
        setRoutines(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert('Failed to delete routine item');
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

      if (editingRoutine) {
        const updated = await routineService.update(editingRoutine._id, payload);
        setRoutines(prev => prev.map(r => (r._id === editingRoutine._id ? updated : r)));
      } else {
        const created = await routineService.create(payload);
        setRoutines(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving routine');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Daily Structure & Predictability
            </span>
            <span className="text-sm font-bold text-slate-500">
              {routines.length} Planned Routine Steps
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900">
            Daily Routine Schedule
          </h1>
          <p className="text-lg font-bold text-slate-600 mt-1 max-w-xl">
            A comforting, regular schedule helps keep daily rhythms clear and relaxed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceButton
            text="Here is your daily schedule: 7 AM wake up, 8 AM breakfast, 9:30 AM photo album time, 1 PM lunch, and 5:30 PM evening walk."
            malayalamText="നിങ്ങളുടെ ദിവസേനയുള്ള ചിട്ടയായ കാര്യങ്ങൾ ഇവിടെ കാണാം."
            label="Listen Daily Schedule"
            size="md"
          />

          {isCaregiver && (
            <button
              onClick={handleOpenAdd}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer touch-target-elderly"
            >
              <Plus className="w-5 h-5" />
              <span>Add Routine Step</span>
            </button>
          )}
        </div>
      </div>

      {/* Routine Timeline Presentation */}
      {loading ? (
        <div className="text-center py-16 text-xl font-bold text-slate-500">
          Loading routine schedule...
        </div>
      ) : (
        <RoutineTimeline
          routines={routines}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add / Edit Routine Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoutine ? 'Edit Routine Step' : 'Add Routine Step'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time (e.g. 08:00 AM)</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                placeholder="08:00 AM"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visual Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="sun">Sun (Wake up)</option>
                <option value="coffee">Tea / Coffee / Breakfast</option>
                <option value="walk">Walking / Garden</option>
                <option value="utensils">Lunch / Dinner</option>
                <option value="moon">Sleep / Bedtime</option>
                <option value="book">Reading / Albums</option>
                <option value="tv">Music / Television</option>
                <option value="users">Family Time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Activity Title</label>
            <input
              type="text"
              required
              value={formData.activity}
              onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
              placeholder="e.g. Breakfast & Morning Medicine"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Malayalam Title (Optional)</label>
            <input
              type="text"
              value={formData.malayalamActivity}
              onChange={(e) => setFormData(prev => ({ ...prev, malayalamActivity: e.target.value }))}
              placeholder="പ്രഭാതഭക്ഷണവും രാവിലെത്തെ മരുന്നും"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gentle Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Idli or oatmeal with Priya in the dining room."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
            />
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
              Save Routine Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DailyRoutinePage;
