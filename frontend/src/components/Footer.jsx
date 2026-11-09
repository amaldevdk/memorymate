import React from 'react';
import { Heart, Shield, Sparkles, PhoneCall } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 mt-20 border-t-4 border-teal-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center font-black">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <span className="text-2xl font-black text-white">MemoryMate</span>
          </div>
          <p className="text-slate-400 text-base leading-relaxed mb-4">
            Compassionate, AI-powered memory assistance designed with elderly patients and loving caregivers in mind. Helping loved ones stay recognized, oriented, and connected every single day.
          </p>
          <div className="text-xs font-semibold text-slate-500 border-l-2 border-slate-700 pl-3">
            Disclaimer: MemoryMate is a supportive memory aid, not a substitute for clinical healthcare diagnosis or treatment.
          </div>
        </div>

        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-wider mb-4">
            Care & Memory Pages
          </h4>
          <ul className="space-y-2.5 font-bold text-base">
            <li>
              <button onClick={() => onNavigate('who-is-this')} className="hover:text-teal-400 transition-colors cursor-pointer">
                Who Is This? (Face Recall)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('memories')} className="hover:text-teal-400 transition-colors cursor-pointer">
                My Life Memories Timeline
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('reminders')} className="hover:text-teal-400 transition-colors cursor-pointer">
                Today's Prescriptions & Reminders
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('routine')} className="hover:text-teal-400 transition-colors cursor-pointer">
                Daily Visual Routine Schedule
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('emergency')} className="hover:text-rose-400 transition-colors cursor-pointer">
                Emergency & Family Contacts
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-wider mb-4">
            Elderly Safety & Privacy
          </h4>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Shield className="w-5 h-5" />
              <span>Private & Consent Protected</span>
            </div>
            <p className="text-sm text-slate-400">
              All personal photos and family relations are securely managed by verified family caregivers. Data can be exported or purged at any time.
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-400">
            National Emergency Medical Helpline: <span className="text-white font-extrabold text-base">108</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
        MemoryMate &copy; {new Date().getFullYear()} – Dedicated to Alzheimer’s and Dementia Care.
      </div>
    </footer>
  );
};

export default Footer;
