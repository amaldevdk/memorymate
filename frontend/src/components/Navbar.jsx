import React from 'react';
import {
  Heart,
  Home,
  Users,
  Image as ImageIcon,
  Clock,
  Calendar,
  PhoneCall,
  Settings,
  Sparkles,
  Contrast,
  LogOut,
  UserCheck,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import EmergencySOSButton from './EmergencySOSButton';

const Navbar = ({ currentPage, onNavigate, onOpenAssistant }) => {
  const { role, switchRole, logout, activePatient } = useAuth();
  const { fontSize, setFontSize, highContrast, toggleHighContrast, language, setLanguage } = useAccessibility();

  const isCaregiver = role === 'caregiver';

  const patientNavLinks = [
    { id: 'patient-dashboard', label: 'Home', icon: Home },
    { id: 'who-is-this', label: 'Who Is This?', icon: Users },
    { id: 'memories', label: 'My Memories', icon: ImageIcon },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'routine', label: 'Daily Routine', icon: Calendar },
    { id: 'emergency', label: 'Call Family', icon: PhoneCall }
  ];

  const caregiverNavLinks = [
    { id: 'caregiver-dashboard', label: 'Caregiver Hub', icon: Home },
    { id: 'family-manager', label: 'Family & Faces', icon: Users },
    { id: 'memories', label: 'Memories', icon: ImageIcon },
    { id: 'reminders', label: 'Reminders & Meds', icon: Clock },
    { id: 'routine', label: 'Routine Schedule', icon: Calendar },
    { id: 'patient-profile', label: 'Patient Profile', icon: User },
    { id: 'caregiver-settings', label: 'Settings & Export', icon: Settings }
  ];

  const navLinks = isCaregiver ? caregiverNavLinks : patientNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm transition-all">
      {/* Top Accessibility & Role Control Bar */}
      <div className="bg-[#FEF9EE] border-b border-amber-200/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Active Patient Identity Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-slate-800">
              Active Patient: <span className="text-teal-800 underline decoration-teal-500 decoration-2">{activePatient?.fullName || 'Thomas Kurian'}</span>
            </span>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-500 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              {activePatient?.stage || 'Early'} Stage Care
            </span>
          </div>

          {/* Quick Accessibility Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Font Size Selector */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-xs">
              <span className="text-xs font-bold px-2 text-slate-500">Text:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg font-bold text-xs cursor-pointer ${fontSize === 'normal' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg font-bold text-sm cursor-pointer ${fontSize === 'large' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Large readable text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg font-extrabold text-base cursor-pointer ${fontSize === 'xlarge' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Extra large text size for seniors"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-1.5 rounded-xl border flex items-center gap-1 font-bold text-xs cursor-pointer transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle high contrast vision mode"
            >
              <Contrast className="w-4 h-4" />
              <span className="hidden md:inline">High Contrast</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${language === 'en' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ml')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${language === 'ml' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                മലയാളം
              </button>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => switchRole(isCaregiver ? 'patient' : 'caregiver')}
              className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                isCaregiver
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
              title="Switch role mode"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Role: {isCaregiver ? 'Caregiver View' : 'Patient View'} (Switch)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate(isCaregiver ? 'caregiver-dashboard' : 'patient-dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Heart className="w-7 h-7 fill-white/30" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              MemoryMate
            </span>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
              Personal Memory Aid
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`touch-target-elderly px-4 py-2.5 rounded-2xl font-extrabold text-base flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-sky-50 hover:text-sky-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Assistant + Emergency SOS */}
        <div className="flex items-center gap-2.5">
          {/* Voice Assistant Launcher */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black px-4 py-2.5 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer touch-target-elderly"
            title="Open Voice Assistant"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-base font-extrabold hidden sm:inline">Ask Assistant</span>
          </button>

          {/* Quick Emergency SOS Pill */}
          <EmergencySOSButton variant="pill" />
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden border-t border-slate-200 overflow-x-auto py-2 px-4 flex gap-2 no-scrollbar bg-slate-50">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
