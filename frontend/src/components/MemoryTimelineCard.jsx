import React from 'react';
import { Calendar, MapPin, Users, Heart, Edit2, Trash2 } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Family: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Friends: 'bg-purple-100 text-purple-900 border-purple-300',
  Childhood: 'bg-amber-100 text-amber-900 border-amber-300',
  Education: 'bg-blue-100 text-blue-900 border-blue-300',
  'Special Events': 'bg-rose-100 text-rose-900 border-rose-300'
};

const MemoryTimelineCard = ({ memory, onEdit, onDelete }) => {
  const { language } = useAccessibility();
  const { role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const storyText = (language === 'ml' && memory.malayalamDescription)
    ? memory.malayalamDescription
    : memory.description;

  const audioPrompt = memory.audioText || `${memory.title}. ${memory.description}`;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-100 hover:border-teal-200 transition-all flex flex-col md:flex-row gap-6 relative">
      {/* Photo Column */}
      {memory.photoUrl && (
        <div className="md:w-5/12 flex-shrink-0">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-sm relative group">
            <img
              src={memory.photoUrl}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {memory.favorite && (
              <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Narrative & Details Column */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm md:text-base font-extrabold px-3 py-1 rounded-full border ${categoryColors[memory.category] || 'bg-slate-100 text-slate-800'}`}>
                {memory.category}
              </span>

              {memory.date && (
                <span className="flex items-center gap-1.5 text-slate-600 text-sm md:text-base font-bold bg-slate-100 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{memory.date}</span>
                </span>
              )}
            </div>

            {isCaregiver && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(memory)}
                  className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                  title="Edit Memory"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(memory._id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Delete Memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
            {memory.title}
          </h3>

          {/* Location & People */}
          <div className="flex flex-wrap gap-4 text-sm md:text-base text-slate-600 font-semibold mb-4">
            {memory.location && (
              <div className="flex items-center gap-1.5 text-sky-800">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{memory.location}</span>
              </div>
            )}
            {memory.peopleTagged && memory.peopleTagged.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Users className="w-4 h-4 text-slate-500" />
                <span>With {memory.peopleTagged.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Story Narrative with large comfortable typography */}
          <p className="text-slate-800 text-lg md:text-xl leading-relaxed mb-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/60 font-medium">
            "{storyText}"
          </p>
        </div>

        {/* Audio Listen Button */}
        <div className="pt-2 flex items-center justify-between">
          <VoiceButton
            text={audioPrompt}
            malayalamText={memory.malayalamDescription || memory.title}
            label="Listen to this Story"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MemoryTimelineCard;
