import React from 'react';
import { Phone, Heart, Edit2, Trash2, User } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const PersonCard = ({ person, onEdit, onDelete }) => {
  const { language } = useAccessibility();
  const { role } = useAuth();

  const isCaregiver = role === 'caregiver';
  const descriptionText = (language === 'ml' && person.malayalamDescription)
    ? person.malayalamDescription
    : person.description;

  const voicePromptText = (language === 'ml' && person.malayalamVoicePrompt)
    ? person.malayalamVoicePrompt
    : person.voicePrompt || `This is ${person.name}. ${person.relationship === 'Self' ? 'This is you.' : `${person.name} is your ${person.relationship}.`}`;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-md border-2 border-slate-100 hover:border-sky-300 transition-all flex flex-col justify-between relative overflow-hidden group">
      {/* Top Banner with Relationship Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="bg-teal-100 text-teal-900 border border-teal-200 text-sm md:text-base font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-teal-700 fill-teal-600" />
            <span>{person.relationship}</span>
          </span>

          {person.frequentVisitor && (
            <span className="bg-amber-100 text-amber-900 text-xs md:text-sm font-bold px-2.5 py-1 rounded-full border border-amber-200">
              Frequent Visitor
            </span>
          )}

          {isCaregiver && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(person)}
                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                title="Edit family member details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(person._id)}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                title="Remove person"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Photo with rounded friendly frame */}
        <div className="relative mb-4 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-inner flex items-center justify-center">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <User className="w-20 h-20 text-slate-300" />
          )}

          {/* Bold Name Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-3 pt-6 text-white">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {person.name}
            </h3>
          </div>
        </div>

        {/* Reassuring Relationship Clarification */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3.5 mb-3 text-sky-950">
          <p className="text-base md:text-lg font-bold leading-snug">
            "{voicePromptText}"
          </p>
        </div>

        {/* Detailed Description */}
        <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-4">
          {descriptionText}
        </p>
      </div>

      {/* Action Footer: Voice + Call */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
        <VoiceButton
          text={voicePromptText + ' ' + (person.description || '')}
          malayalamText={person.malayalamVoicePrompt || person.malayalamDescription}
          label="Listen Voice"
          size="md"
        />

        {person.phoneNumber && (
          <a
            href={`tel:${person.phoneNumber}`}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-2xl text-base shadow-sm transition-all active:scale-95 touch-target-elderly"
            title={`Call ${person.name}`}
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
