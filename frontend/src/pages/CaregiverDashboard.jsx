import React, { useState, useEffect } from 'react';
import {
  Users,
  Image as ImageIcon,
  Clock,
  Calendar,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Bell,
  Heart,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { reminderService, familyService, memoryService, notificationService } from '../services/api';

const CaregiverDashboard = ({ onNavigate, onOpenAddFamily, onOpenAddMemory, onOpenAddReminder }) => {
  const { activePatient } = useAuth();
  const { emergencyAlert, clearEmergencyAlert } = useSocket();
  const [reminders, setReminders] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, fRes, mRes, nRes] = await Promise.all([
          reminderService.getAll(activePatient?._id),
          familyService.getAll(activePatient?._id),
          memoryService.getAll(activePatient?._id),
          notificationService.getAll(activePatient?._id)
        ]);
        setReminders(rRes || []);
        setFamilyMembers(fRes || []);
        setMemories(mRes || []);
        setNotifications(nRes || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePatient]);

  const completedCount = reminders.filter(r => r.completed).length;
  const missedCount = reminders.filter(r => r.missed && !r.completed).length;
  const pendingCount = reminders.length - completedCount;
  const complianceRate = reminders.length > 0 ? Math.round((completedCount / reminders.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Real-time Emergency SOS Alert Banner if triggered */}
      {emergencyAlert && (
        <div className="bg-rose-600 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-rose-300 animate-warm-pulse flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white text-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest bg-white/20 inline-block px-3 py-1 rounded-full mb-1">
                Active SOS Alert Received
              </div>
              <h3 className="text-2xl md:text-3xl font-black">
                {emergencyAlert.message || 'Emergency assistance requested by patient!'}
              </h3>
              <p className="text-rose-100 font-bold mt-1">
                Time: {emergencyAlert.timestamp} | Patient: {emergencyAlert.patientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('emergency')}
              className="bg-white text-rose-700 hover:bg-rose-50 font-black px-6 py-3.5 rounded-2xl text-lg shadow-md cursor-pointer"
            >
              Open Contacts & Dial
            </button>
            <button
              onClick={clearEmergencyAlert}
              className="bg-rose-800 hover:bg-rose-900 text-white font-bold px-4 py-3.5 rounded-2xl text-base cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Patient Overview Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 flex-shrink-0 bg-slate-100 shadow-sm">
            <img
              src={activePatient?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'}
              alt={activePatient?.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-0.5 rounded-full border border-teal-200">
                Active Patient Profile
              </span>
              <span className="text-xs font-bold text-slate-500">
                Age: {activePatient?.age || 76}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              {activePatient?.fullName || 'Thomas Kurian'}
            </h2>

            <p className="text-slate-600 font-semibold text-sm md:text-base mt-1">
              {activePatient?.emergencyNotes || 'Mild Alzheimer’s. Caring family supervision.'}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => onNavigate('patient-dashboard')}
            className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-extrabold px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-sky-600" />
            <span>Preview Patient View</span>
          </button>

          <button
            onClick={() => onNavigate('reminders')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Reminders</span>
          </button>
        </div>
      </div>

      {/* Daily Metrics / Compliance Rate Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Adherence</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-4xl font-black text-slate-900 mb-1">{complianceRate}%</div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${complianceRate}%` }}></div>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {completedCount} of {reminders.length} tasks completed today
          </div>
        </div>

        {/* Completed Reminders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Tasks</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-4xl font-black text-emerald-600 mb-1">{completedCount}</div>
          <div className="text-xs font-semibold text-slate-500">Water & medication taken</div>
        </div>

        {/* Missed / Overdue Alert */}
        <div className={`rounded-3xl p-6 shadow-sm border-2 ${missedCount > 0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue / Missed</span>
            <AlertTriangle className={`w-5 h-5 ${missedCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-4xl font-black mb-1 ${missedCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {missedCount}
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {missedCount > 0 ? 'Requires caregiver check-in' : 'All scheduled tasks on track'}
          </div>
        </div>

        {/* Saved Memories & People */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Memory Assets</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-4xl font-black text-slate-900 mb-1">
            {familyMembers.length + memories.length}
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {familyMembers.length} faces & {memories.length} stories recorded
          </div>
        </div>
      </div>

      {/* Main Grid: Reminders List & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Reminders & Medications Schedule (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Today's Schedule & Prescriptions</h3>
              <p className="text-sm text-slate-500 font-semibold">
                Caregiver managed daily checklist
              </p>
            </div>
            <button
              onClick={() => onNavigate('reminders')}
              className="text-sm font-extrabold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {reminders.slice(0, 5).map((r) => (
              <div
                key={r._id}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                  r.completed
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : r.missed
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    r.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {r.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-extrabold text-lg text-slate-900">{r.title}</div>
                    <div className="text-sm font-semibold text-slate-500">
                      {r.time} &bull; {r.dosageOrInstruction || r.category}
                    </div>
                  </div>
                </div>

                <div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    r.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.missed
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.completed ? 'Completed' : r.missed ? 'Overdue' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Caregiver Notification Activity Stream (1 Col) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h3 className="text-xl font-black text-slate-900">Activity Alerts</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Real-time
              </span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                    <span className="capitalize">{n.type.replace('_', ' ')}</span>
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{n.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('caregiver-settings')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3 rounded-2xl text-sm transition-all cursor-pointer"
            >
              Data Export & Privacy Settings &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
