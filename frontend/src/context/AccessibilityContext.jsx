import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(localStorage.getItem('mm_font_size') || 'large');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('mm_high_contrast') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('mm_language') || 'en');
  const [autoVoice, setAutoVoice] = useState(localStorage.getItem('mm_auto_voice') === 'true');

  useEffect(() => {
    localStorage.setItem('mm_font_size', fontSize);
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    root.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('mm_high_contrast', highContrast);
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('mm_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mm_auto_voice', autoVoice);
  }, [autoVoice]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleAutoVoice = () => setAutoVoice(prev => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
        language,
        setLanguage,
        autoVoice,
        toggleAutoVoice
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
