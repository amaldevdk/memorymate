import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, MessageSquare, Heart, Bell, Calendar } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const VoiceAssistantModal = ({ isOpen, onClose, onNavigate }) => {
  const { speak, stopSpeaking, startListening, stopListening, isListening, transcript, hasSpeechRecognition } = useVoice();
  const { language, setLanguage } = useAccessibility();
  const { activePatient } = useAuth();
  const [assistantResponse, setAssistantResponse] = useState('Hello! I am your MemoryMate voice assistant. How can I help you remember today?');

  if (!isOpen) return null;

  const handleVoiceCommand = (command) => {
    const lower = command.toLowerCase();

    if (lower.includes('rahul') || lower.includes('son')) {
      const resp = 'Rahul is your elder son. He is an engineer in Bangalore and loves to visit you every Sunday.';
      setAssistantResponse(resp);
      speak(resp, language);
    } else if (lower.includes('priya') || lower.includes('daughter') || lower.includes('caregiver')) {
      const resp = 'Priya is your daughter and caring family member who lives with you in Kochi. She is always here to take care of you.';
      setAssistantResponse(resp);
      speak(resp, language);
    } else if (lower.includes('ananya') || lower.includes('granddaughter')) {
      const resp = 'Ananya is your 8-year-old granddaughter. She loves drawing pictures for you!';
      setAssistantResponse(resp);
      speak(resp, language);
    } else if (lower.includes('medicine') || lower.includes('pill') || lower.includes('reminder') || lower.includes('tablets')) {
      const resp = 'Your primary morning medication is your blood pressure tablet taken with warm water after breakfast.';
      setAssistantResponse(resp);
      speak(resp, language);
    } else if (lower.includes('routine') || lower.includes('schedule') || lower.includes('today')) {
      const resp = 'Today’s routine includes morning breakfast, memory photo time, fresh lunch at 1:00 PM, and a pleasant evening garden walk.';
      setAssistantResponse(resp);
      speak(resp, language);
    } else if (lower.includes('emergency') || lower.includes('help') || lower.includes('call')) {
      const resp = 'Emergency assistance is ready. You can press the red SOS button or call Priya at 98471 23456.';
      setAssistantResponse(resp);
      speak(resp, language);
      if (onNavigate) onNavigate('emergency');
    } else {
      const resp = `I heard: "${command}". You can ask me about Rahul, Priya, your morning medication, or daily routine!`;
      setAssistantResponse(resp);
      speak(resp, language);
    }
  };

  const handleListenClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        handleVoiceCommand(text);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border-4 border-sky-300 relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
          aria-label="Close voice assistant"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900">
              MemoryMate Voice Assistant
            </h3>
            <p className="text-slate-500 font-semibold">
              Tap the microphone to speak, or tap any question below
            </p>
          </div>
        </div>

        {/* Assistant Response Balloon */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-5 mb-6 text-sky-950 text-xl font-bold leading-relaxed shadow-inner">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
            <div>
              <p>{assistantResponse}</p>
              {transcript && (
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Heard: "{transcript}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Microphone Button */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            onClick={handleListenClick}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-ping ring-8 ring-rose-200'
                : 'bg-gradient-to-tr from-sky-600 to-teal-500 text-white hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
          <div className="mt-3 font-extrabold text-lg text-slate-700">
            {isListening ? 'Listening to you... Speak now' : 'Tap to Speak'}
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm font-bold text-slate-600">Voice Language:</span>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm cursor-pointer ${
              language === 'en' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ml')}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm cursor-pointer ${
              language === 'ml' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            മലയാളം (Malayalam)
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="border-t border-slate-100 pt-4">
          <div className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            Quick Questions:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Who is Rahul?', query: 'who is rahul' },
              { label: 'Who is Priya?', query: 'who is priya' },
              { label: 'What is my medicine today?', query: 'what is my medicine today' },
              { label: 'What is my daily routine?', query: 'what is my daily routine' },
              { label: 'Emergency Contact', query: 'emergency help' }
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => handleVoiceCommand(q.query)}
                className="bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-800 text-base font-bold px-4 py-2 rounded-2xl transition-all cursor-pointer border border-slate-200 active:scale-95"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
