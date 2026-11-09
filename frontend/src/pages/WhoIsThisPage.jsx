import React, { useState, useEffect } from 'react';
import { Users, Eye, ArrowLeft, ArrowRight, Phone, Volume2, Sparkles, Heart } from 'lucide-react';
import { familyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { useAccessibility } from '../context/AccessibilityContext';
import VoiceButton from '../components/VoiceButton';

const WhoIsThisPage = () => {
  const { activePatient } = useAuth();
  const { speak } = useVoice();
  const { language } = useAccessibility();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setLoading(true);
        const data = await familyService.getAll(activePatient?._id);
        setFamilyMembers(data || []);
      } catch (err) {
        console.error('Error fetching people:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [activePatient]);

  const currentPerson = familyMembers[currentIndex];

  const handleReveal = () => {
    setRevealed(true);
    if (currentPerson) {
      const voiceText = (language === 'ml' && currentPerson.malayalamVoicePrompt)
        ? currentPerson.malayalamVoicePrompt
        : currentPerson.voicePrompt || `This is ${currentPerson.name}. ${currentPerson.name} is your ${currentPerson.relationship}.`;
      speak(voiceText, language);
    }
  };

  const handleNext = () => {
    setRevealed(false);
    setCurrentIndex(prev => (prev + 1) % familyMembers.length);
  };

  const handlePrev = () => {
    setRevealed(false);
    setCurrentIndex(prev => (prev - 1 + familyMembers.length) % familyMembers.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Reassurance Banner */}
      <div className="text-center space-y-2">
        <span className="bg-teal-100 text-teal-800 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full inline-block border border-teal-200 uppercase tracking-wider">
          Memory Recognition Assistant
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Who Is This?
        </h1>
        <p className="text-lg sm:text-xl font-bold text-slate-600 max-w-xl mx-auto">
          Look at the photograph. Take your time. Tap below whenever you want to know who they are!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-2xl font-bold text-slate-500">
          Loading family photos...
        </div>
      ) : !currentPerson ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">No family members found yet</h3>
          <p className="text-slate-500 mt-2">Caregivers can add family photos in the Caregiver Hub.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-3 border-sky-200 flex flex-col items-center text-center relative overflow-hidden">
          {/* Card Carousel Counter */}
          <div className="flex items-center justify-between w-full mb-4 px-2">
            <span className="text-sm font-black text-slate-400">
              Person {currentIndex + 1} of {familyMembers.length}
            </span>
            <span className="bg-sky-100 text-sky-800 font-extrabold text-xs px-3 py-1 rounded-full border border-sky-200">
              Photo Memory Aid
            </span>
          </div>

          {/* Big Photo Container */}
          <div className="w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl mb-6 relative group">
            <img
              src={currentPerson.photoUrl}
              alt={currentPerson.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
              }}
            />

            {!revealed && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4">
                <button
                  onClick={handleReveal}
                  className="bg-sky-600/95 hover:bg-sky-700 text-white font-black text-xl md:text-2xl py-4 px-8 rounded-2xl shadow-2xl flex items-center gap-3 transform active:scale-95 transition-all cursor-pointer animate-bounce"
                >
                  <Eye className="w-7 h-7" />
                  <span>Reveal Who This Is</span>
                </button>
              </div>
            )}
          </div>

          {/* Revealed Information Box */}
          {revealed ? (
            <div className="w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95">
              {/* Bold Name & Relationship Badge */}
              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-base md:text-lg px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-700 fill-emerald-600" />
                  <span>{currentPerson.relationship}</span>
                </span>

                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {currentPerson.name}
                </h2>
              </div>

              {/* Speech Prompt Clarification */}
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-sky-950 text-xl md:text-2xl font-extrabold leading-snug">
                "{currentPerson.voicePrompt || `This is ${currentPerson.name}. ${currentPerson.name} is your ${currentPerson.relationship}.`}"
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {currentPerson.description}
              </p>

              {/* Voice + Phone Action */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <VoiceButton
                  text={currentPerson.voicePrompt + ' ' + currentPerson.description}
                  malayalamText={currentPerson.malayalamVoicePrompt || currentPerson.malayalamDescription}
                  label="Listen Again"
                  size="lg"
                />

                {currentPerson.phoneNumber && (
                  <a
                    href={`tel:${currentPerson.phoneNumber}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 touch-target-elderly"
                  >
                    <Phone className="w-6 h-6" />
                    <span>Call {currentPerson.name}</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="py-2">
              <button
                onClick={handleReveal}
                className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xl py-4 px-8 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer touch-target-elderly"
              >
                Tap Here to Learn Their Name
              </button>
            </div>
          )}

          {/* Carousel Next & Previous Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-md pt-8 mt-6 border-t border-slate-100">
            <button
              onClick={handlePrev}
              className="touch-target-elderly bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="touch-target-elderly bg-teal-600 hover:bg-teal-700 text-white font-black text-lg px-7 py-3.5 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <span>Next Person</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoIsThisPage;
