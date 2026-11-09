import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, CheckCircle, X, ShieldAlert } from 'lucide-react';
import { emergencyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

const EmergencySOSButton = ({ variant = 'full' }) => {
  const { activePatient } = useAuth();
  const { speak } = useVoice();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);

  const handleTriggerSOS = async () => {
    setLoading(true);
    try {
      const res = await emergencyService.triggerSOS({
        patientId: activePatient?._id,
        triggerType: 'Patient Emergency Button',
        notes: 'Patient pressed red emergency assistance button on dashboard.'
      });

      setAlertStatus({
        success: true,
        message: 'Caregiver alerted immediately! Stay calm, Priya has received your alert.',
        timestamp: res.timestamp
      });

      speak('Emergency alert sent to your caregiver. Please stay calm, help is notified.', 'en');
    } catch {
      setAlertStatus({
        success: false,
        message: 'Could not send network alert. Please dial 108 or your family member directly.'
      });
      speak('Could not send online alert. Please call emergency services or your family directly.', 'en');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {variant === 'pill' ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 animate-warm-pulse cursor-pointer"
          title="Emergency SOS Assistance"
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-base tracking-wide">HELP / SOS</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xl md:text-2xl py-5 px-6 rounded-3xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-4 animate-warm-pulse cursor-pointer border-4 border-red-300"
        >
          <AlertTriangle className="w-9 h-9 flex-shrink-0" />
          <div className="text-left">
            <div className="leading-tight">EMERGENCY ASSISTANCE</div>
            <div className="text-sm font-semibold opacity-90">Press to notify family and caregivers immediately</div>
          </div>
        </button>
      )}

      {/* Confirmation Dialog / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-rose-500 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              Do you need immediate help?
            </h2>
            <p className="text-lg text-slate-700 mb-6">
              Pressing the button below will immediately sound an alarm on your family caregiver's device and log your request.
            </p>

            {alertStatus && (
              <div
                className={`p-4 rounded-2xl mb-6 text-left flex items-start gap-3 ${
                  alertStatus.success ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-red-50 border border-red-300 text-red-900'
                }`}
              >
                {alertStatus.success ? (
                  <CheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-lg">{alertStatus.message}</div>
                  {alertStatus.timestamp && (
                    <div className="text-sm text-slate-600 mt-1">Transmitted at {alertStatus.timestamp}</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTriggerSOS}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xl py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-6 h-6" />
                <span>{loading ? 'Alerting...' : 'YES, ALERT FAMILY'}</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setAlertStatus(null);
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg py-4 px-6 rounded-2xl transition-all cursor-pointer"
              >
                I am okay / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencySOSButton;
