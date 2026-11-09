import React from 'react';
import { CheckCircle2, Circle, Clock, Pill, Droplets, Utensils, Stethoscope, Activity, Bell, Edit2, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import VoiceButton from './VoiceButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  medication: { icon: Pill, color: 'bg-rose-100 text-rose-700 border-rose-300', label: 'Medication' },
  water: { icon: Droplets, color: 'bg-sky-100 text-sky-700 border-sky-300', label: 'Drink Water' },
  meals: { icon: Utensils, color: 'bg-emerald-100 text-emerald-700 border-emerald-300', label: 'Meal' },
  doctor: { icon: Stethoscope, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', label: 'Doctor Visit' },
  activity: { icon: Activity, color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Daily Activity' },
  general: { icon: Bell, color: 'bg-slate-100 text-slate-700 border-slate-300', label: 'Reminder' }
};

const ReminderCard = ({ reminder, onToggleComplete, onEdit, onDelete }) => {
  const { language } = useAccessibility();
  const { role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const catMeta = categoryIcons[reminder.category] || categoryIcons.general;
  const IconComp = catMeta.icon;

  const handleToggle = (e) => {
    e.stopPropagation();
    const newStatus = !reminder.completed;
    if (newStatus) {
      // Gentle celebratory confetti for elderly encouragement
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onToggleComplete(reminder._id, newStatus);
  };

  const audioText = reminder.audioPrompt || `${reminder.title}. Scheduled for ${reminder.time}. ${reminder.dosageOrInstruction || ''}`;

  return (
    <div
      className={`rounded-3xl p-5 md:p-6 transition-all border-3 relative ${
        reminder.completed
          ? 'bg-emerald-50/70 border-emerald-300 opacity-90'
          : reminder.missed
          ? 'bg-rose-50 border-rose-400 shadow-lg'
          : 'bg-white border-slate-200 hover:border-sky-300 shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {/* Category & Scheduled Time */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-extrabold text-sm border ${catMeta.color}`}>
            <IconComp className="w-4 h-4" />
            <span>{catMeta.label}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3.5 py-1.5 rounded-full font-black text-base border border-slate-200">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>{reminder.time}</span>
          </span>

          {reminder.missed && !reminder.completed && (
            <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
              Attention: Missed Time
            </span>
          )}
        </div>

        {/* Caregiver edit/delete */}
        {isCaregiver && (
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => onEdit(reminder)}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
              title="Edit Reminder"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(reminder._id)}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="Delete Reminder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mb-4">
        <h4 className={`text-2xl md:text-3xl font-extrabold mb-1.5 leading-snug ${reminder.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
          {reminder.title}
        </h4>

        {reminder.dosageOrInstruction && (
          <p className="text-lg md:text-xl font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {reminder.dosageOrInstruction}
          </p>
        )}

        {reminder.notes && (
          <p className="text-sm md:text-base text-slate-500 mt-2 italic">
            Caregiver Note: {reminder.notes}
          </p>
        )}
      </div>

      {/* Footer Controls: Big Checkbox + Audio Read */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Large Tactile Completion Button */}
        <button
          onClick={handleToggle}
          type="button"
          className={`touch-target-elderly px-5 py-3 rounded-2xl font-black text-lg flex items-center gap-3 transition-all cursor-pointer active:scale-95 shadow-sm ${
            reminder.completed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300'
          }`}
        >
          {reminder.completed ? (
            <>
              <CheckCircle2 className="w-7 h-7 text-white" />
              <span>Completed!</span>
            </>
          ) : (
            <>
              <Circle className="w-7 h-7 text-slate-400" />
              <span>Tap to Mark as Done</span>
            </>
          )}
        </button>

        {/* Audio Speaker */}
        <VoiceButton
          text={audioText}
          malayalamText={reminder.malayalamAudioPrompt}
          label="Read Reminder"
          size="md"
        />
      </div>
    </div>
  );
};

export default ReminderCard;
