import React from 'react';
import { Sun, Coffee, Footprints, Utensils, Users, Pill, BookOpen, Tv, Moon, Music, Clock, Sparkles } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const iconMap = {
  sun: Sun,
  coffee: Coffee,
  walk: Footprints,
  utensils: Utensils,
  users: Users,
  pill: Pill,
  book: BookOpen,
  tv: Tv,
  moon: Moon,
  music: Music
};

const RoutineTimeline = ({ routines = [], onEdit, onDelete }) => {
  const { language } = useAccessibility();
  const { role } = useAuth();
  const isCaregiver = role === 'caregiver';

  // Determine current active item approximately
  const now = new Date();
  const currentHours = now.getHours();

  return (
    <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:inset-0 before:left-3 md:before:left-5 before:w-1 before:bg-sky-200">
      {routines.map((item, index) => {
        const IconComponent = iconMap[item.icon] || Sun;
        const activityText = (language === 'ml' && item.malayalamActivity)
          ? item.malayalamActivity
          : item.activity;

        // Approximate current slot
        const isCurrent = (currentHours >= 6 && currentHours < 12 && item.timeSlot === 'Morning' && index === 1) ||
                          (currentHours >= 12 && currentHours < 16 && item.timeSlot === 'Afternoon') ||
                          (currentHours >= 16 && currentHours < 20 && item.timeSlot === 'Evening') ||
                          (currentHours >= 20 && item.timeSlot === 'Night');

        return (
          <div key={item._id || index} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-9 md:-left-13 top-5 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-4 shadow-md transition-all ${
              isCurrent
                ? 'bg-amber-400 text-amber-950 border-white ring-4 ring-amber-300 animate-bounce'
                : 'bg-sky-100 text-sky-800 border-white'
            }`}>
              <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
            </div>

            {/* Routine Card */}
            <div className={`rounded-3xl p-5 md:p-6 transition-all border-2 ml-4 ${
              isCurrent
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-lg'
                : 'bg-white border-slate-200 hover:border-sky-200 shadow-sm'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-100 text-sky-900 font-black text-lg md:text-xl px-3.5 py-1 rounded-xl flex items-center gap-1.5 border border-sky-200">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span>{item.time}</span>
                  </span>

                  <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
                    {item.timeSlot}
                  </span>

                  {isCurrent && (
                    <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Current Schedule</span>
                    </span>
                  )}
                </div>

                {isCaregiver && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(item._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                {activityText}
              </h4>

              {item.description && (
                <p className="text-slate-600 text-base md:text-lg mb-3">
                  {item.description}
                </p>
              )}

              <div className="pt-2">
                <VoiceButton
                  text={`${item.time}: ${item.activity}. ${item.description || ''}`}
                  malayalamText={`${item.time}: ${item.malayalamActivity || item.activity}`}
                  label="Listen"
                  size="sm"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineTimeline;
