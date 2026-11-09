import React, { useState, useEffect } from 'react';
import {
  Users,
  Image as ImageIcon,
  Clock,
  Calendar,
  PhoneCall,
  Sparkles,
  Sun,
  Moon,
  CloudSun,
  Heart,
  Volume2,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { useAccessibility } from '../context/AccessibilityContext';
import EmergencySOSButton from '../components/EmergencySOSButton';
import VoiceButton from '../components/VoiceButton';

const PatientDashboard = ({ onNavigate, onOpenAssistant }) => {
  const { activePatient } = useAuth();
  const { speak } = useVoice();
  const { language } = useAccessibility();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  let timeOfDay = 'Morning';
  let greeting = 'Good Morning';
  let TimeIcon = Sun;
  let bgSlot = 'from-amber-100/60 to-orange-50';

  if (hours >= 12 && hours < 17) {
    timeOfDay = 'Afternoon';
    greeting = 'Good Afternoon';
    TimeIcon = CloudSun;
    bgSlot = 'from-sky-100/70 to-blue-50';
  } else if (hours >= 17 && hours < 21) {
    timeOfDay = 'Evening';
    greeting = 'Good Evening';
    TimeIcon = Sun;
    bgSlot = 'from-rose-100/60 to-amber-50';
  } else if (hours >= 21 || hours < 6) {
    timeOfDay = 'Night';
    greeting = 'Good Night';
    TimeIcon = Moon;
    bgSlot = 'from-indigo-100/60 to-slate-50';
  }

  const patientName = activePatient?.preferredName || activePatient?.fullName?.split(' ')[0] || 'Thomas';
  const orientationText = `${greeting}, ${patientName}! You are safe and comfortable at home in Kochi. Today is ${currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
  const malayalamOrientation = `സുപ്രഭാതം ${patientName}! നിങ്ങൾ കൊച്ചിയിലെ വീട്ടിൽ സുരക്ഷിതനാണ്. ഇന്ന് ${currentTime.toLocaleDateString('ml-IN', { weekday: 'long', month: 'long', day: 'numeric' })} ആണ്.`;

  const dashboardCards = [
    {
      id: 'who-is-this',
      title: 'Who Is This?',
      malayalamTitle: 'ഇതാരാണ്?',
      subtitle: 'See pictures and names of your family & friends',
      icon: Users,
      bgColor: 'bg-emerald-500 hover:bg-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-950'
    },
    {
      id: 'memories',
      title: 'My Memories',
      malayalamTitle: 'എന്റെ ഓർമ്മകൾ',
      subtitle: 'Look back at your happy wedding, trips & childhood',
      icon: ImageIcon,
      bgColor: 'bg-teal-600 hover:bg-teal-700',
      badgeColor: 'bg-teal-100 text-teal-900',
      borderColor: 'border-teal-300',
      textColor: 'text-teal-950'
    },
    {
      id: 'reminders',
      title: 'Today’s Reminders',
      malayalamTitle: 'ഇന്നത്തെ ഓർമ്മപ്പെടുത്തലുകൾ',
      subtitle: 'Medication tablets, drinking water & meals',
      icon: Clock,
      bgColor: 'bg-sky-600 hover:bg-sky-700',
      badgeColor: 'bg-sky-100 text-sky-900',
      borderColor: 'border-sky-300',
      textColor: 'text-sky-950'
    },
    {
      id: 'routine',
      title: 'Daily Schedule',
      malayalamTitle: 'ദിവസേനയുള്ള കാര്യങ്ങൾ',
      subtitle: 'What time is tea, lunch, and your garden walk',
      icon: Calendar,
      bgColor: 'bg-amber-500 hover:bg-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-950'
    },
    {
      id: 'emergency',
      title: 'Call Family',
      malayalamTitle: 'കുടുംബത്തെ വിളിക്കുക',
      subtitle: 'Call Priya, Rahul, or your doctor with one tap',
      icon: PhoneCall,
      bgColor: 'bg-indigo-600 hover:bg-indigo-700',
      badgeColor: 'bg-indigo-100 text-indigo-900',
      borderColor: 'border-indigo-300',
      textColor: 'text-indigo-950'
    },
    {
      id: 'assistant',
      title: 'Voice Assistant',
      malayalamTitle: 'ശബ്ദ സഹായി',
      subtitle: 'Speak or tap to ask questions anytime',
      icon: Sparkles,
      bgColor: 'bg-purple-600 hover:bg-purple-700',
      badgeColor: 'bg-purple-100 text-purple-900',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-950',
      action: onOpenAssistant
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Friendly Reassuring Header Banner */}
      <div className={`p-6 md:p-10 rounded-3xl bg-gradient-to-r ${bgSlot} border-3 border-amber-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-md border-2 border-amber-200 flex-shrink-0 flex items-center justify-center text-amber-500">
            <TimeIcon className="w-12 h-12" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-extrabold text-amber-900 uppercase tracking-widest bg-amber-200/80 px-3 py-0.5 rounded-full">
                {timeOfDay} Orientation
              </span>
              <span className="text-sm font-bold text-slate-600 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-500" />
                Rose Villa, Kochi
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {greeting}, {patientName}!
            </h1>

            <p className="text-lg sm:text-xl font-bold text-slate-700 mt-2 max-w-2xl">
              Today is {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
            </p>
          </div>
        </div>

        {/* Digital Time & Audio Play */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="bg-white/90 px-6 py-3 rounded-2xl border-2 border-amber-300/60 shadow-xs text-center w-full sm:w-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Time</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <VoiceButton
            text={orientationText}
            malayalamText={malayalamOrientation}
            label="Read Aloud"
            size="lg"
            className="w-full sm:w-auto shadow-md"
          />
        </div>
      </div>

      {/* 6 Large Action Touch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {dashboardCards.map((card) => {
          const IconComp = card.icon;
          const cardTitle = (language === 'ml' && card.malayalamTitle) ? card.malayalamTitle : card.title;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (card.action) card.action();
                else onNavigate(card.id);
              }}
              className={`bg-white rounded-3xl p-7 md:p-8 border-3 ${card.borderColor} shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-98 cursor-pointer flex flex-col justify-between min-h-[220px] group`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className={`w-16 h-16 ${card.bgColor} text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-9 h-9" />
                  </div>
                  <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${card.badgeColor}`}>
                    Tap to Open
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
                  {cardTitle}
                </h3>

                <p className="text-base md:text-lg font-bold text-slate-600 leading-snug">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between font-black text-base text-slate-800 group-hover:text-sky-700">
                <span>View Details</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Visibility Emergency Section */}
      <div className="pt-4">
        <EmergencySOSButton variant="full" />
      </div>
    </div>
  );
};

export default PatientDashboard;
