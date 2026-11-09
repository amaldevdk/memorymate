import React from 'react';
import { Heart, Users, Clock, ShieldAlert, Sparkles, Image, ArrowRight, UserCheck, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = ({ onNavigate }) => {
  const { demoLogin } = useAuth();

  const handlePatientQuickStart = () => {
    demoLogin('patient');
    onNavigate('patient-dashboard');
  };

  const handleCaregiverQuickStart = () => {
    demoLogin('caregiver');
    onNavigate('caregiver-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between">
      {/* Hero Header */}
      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto text-center">
        {/* Supportive Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-5 py-2 rounded-full font-black text-sm md:text-base border border-teal-200 mb-6 shadow-xs">
          <Heart className="w-5 h-5 text-teal-700 fill-teal-600" />
          <span>Compassionate Alzheimer's & Memory Care Companion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Never feel alone in remembering the people and moments you love.
        </h1>

        <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto mb-10 leading-relaxed font-semibold">
          MemoryMate brings gentle voice reminders, familiar faces, cherished life stories, and an instant safety lifeline together for seniors and their families.
        </p>

        {/* Big Dual-Portal Doors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Patient Portal Card */}
          <div className="bg-gradient-to-b from-sky-50 to-white p-8 rounded-3xl border-3 border-sky-300 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col justify-between relative group">
            <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Heart className="w-9 h-9 fill-white/20" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                For Loved Ones & Seniors
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">
                Patient Mode
              </h2>
              <p className="text-lg text-slate-600 font-semibold mb-6">
                Extra-large buttons, voice narration in English and Malayalam, simple photos of family, and clear daily routines without complex menus.
              </p>
            </div>

            <button
              onClick={handlePatientQuickStart}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black text-xl py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer touch-target-elderly"
            >
              <span>Enter Patient Dashboard</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caregiver Portal Card */}
          <div className="bg-gradient-to-b from-teal-50 to-white p-8 rounded-3xl border-3 border-teal-300 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col justify-between relative group">
            <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Users className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                For Family & Caregivers
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">
                Caregiver Hub
              </h2>
              <p className="text-lg text-slate-600 font-semibold mb-6">
                Manage family profiles, schedule doctor and medication reminders, track missed tasks, receive real-time SOS alerts, and export data.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCaregiverQuickStart}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xl py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer touch-target-elderly"
              >
                <span>Caregiver Dashboard</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="text-center pt-1">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-bold text-teal-800 hover:underline cursor-pointer"
                >
                  Or Log In with Email & Password &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Built from the ground up for memory care and safety
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">Who Is This?</h4>
              <p className="text-slate-600 font-medium">
                Photo cards that gently reinforce who family members are: "This is Rahul, he is your son."
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mb-4">
                <Image className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">Life Memories</h4>
              <p className="text-slate-600 font-medium">
                Visual timeline celebrating childhood, weddings, and milestones with soothing audio stories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">Daily Reminders</h4>
              <p className="text-slate-600 font-medium">
                Large, reassuring audio alerts for hydration, meals, and caregiver-recorded prescriptions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">1-Touch Emergency</h4>
              <p className="text-slate-600 font-medium">
                Immediate family alerting via Socket.io with phone dial buttons and confirmation status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
