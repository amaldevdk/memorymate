import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityContext';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const { language: defaultLang } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Gentle synthesizer chime to alert elderly user before speech starts
  const playGentleChime = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5 note

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  const speak = (text, customLang = null) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    playGentleChime();

    const lang = customLang || defaultLang || 'en';
    const utterance = new SpeechSynthesisUtterance(text);

    // Slower speed for elderly comprehension
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    // Pick best matching voice
    if (lang === 'ml') {
      utterance.lang = 'ml-IN';
      const mlVoice = voices.find(v => v.lang.includes('ml') || v.name.toLowerCase().includes('malayalam'));
      if (mlVoice) utterance.voice = mlVoice;
    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Optional Voice Input (Web Speech API)
  const startListening = (onCommandRecognized) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = defaultLang === 'ml' ? 'ml-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        if (onCommandRecognized) {
          onCommandRecognized(spokenText);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        speak,
        stopSpeaking,
        isSpeaking,
        startListening,
        stopListening,
        isListening,
        transcript,
        hasVoiceSupport: 'speechSynthesis' in window,
        hasSpeechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
