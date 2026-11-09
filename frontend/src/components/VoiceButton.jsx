import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAccessibility } from '../context/AccessibilityContext';

const VoiceButton = ({ text, malayalamText, label = 'Listen', size = 'md', className = '' }) => {
  const { speak, stopSpeaking, isSpeaking } = useVoice();
  const { language } = useAccessibility();

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const textToRead = (language === 'ml' && malayalamText) ? malayalamText : text;
      speak(textToRead, language);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg font-bold gap-3 min-h-[54px]'
  };

  return (
    <button
      onClick={handleSpeak}
      type="button"
      className={`inline-flex items-center justify-center font-bold rounded-2xl transition-all cursor-pointer shadow-sm active:scale-95 touch-target-elderly ${
        isSpeaking
          ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-200'
          : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={isSpeaking ? 'Stop speaking' : `Read aloud: "${text}"`}
      aria-label={label}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-5 h-5 text-white" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-sky-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default VoiceButton;
