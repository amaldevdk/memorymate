import React, { useState } from 'react';
import { Download, Shield, ShieldCheck, Trash2, Volume2, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { settingsService } from '../services/api';

const CaregiverSettingsPage = () => {
  const { activePatient } = useAuth();
  const { autoVoice, toggleAutoVoice, language, setLanguage } = useAccessibility();

  const [consentGiven, setConsentGiven] = useState(activePatient?.consentGiven !== false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleExportData = async () => {
    try {
      setDownloading(true);
      const blob = await settingsService.exportData(activePatient?._id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `memorymate-backup-${activePatient?._id || 'patient'}-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatusMessage('Patient data exported successfully!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert('Failed to export patient data. Please ensure backend is running.');
    } finally {
      setDownloading(false);
    }
  };

  const handleToggleConsent = async () => {
    const nextConsent = !consentGiven;
    setConsentGiven(nextConsent);
    try {
      await settingsService.updateConsent({
        patientId: activePatient?._id,
        consentGiven: nextConsent
      });
      setStatusMessage(nextConsent ? 'Consent acknowledged and saved.' : 'Consent revoked.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error('Consent update error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
        <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Compliance & Caregiver Administration
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-2">
          Settings, Privacy & Data Export
        </h1>
        <p className="text-lg font-bold text-slate-600 mt-1">
          Manage patient privacy consent, export full data archives, and adjust voice narration settings.
        </p>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 font-bold">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Data Export Box (Requirement 7) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Download className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900">
              Export Complete Patient Record
            </h3>
            <p className="text-slate-600 font-semibold text-base mt-1 leading-relaxed">
              Export an official JSON archive of all saved personal memories, family photographs, routine events, and emergency contacts. Authorized family members retain 100% data ownership.
            </p>

            <button
              onClick={handleExportData}
              disabled={downloading}
              className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>{downloading ? 'Preparing Archive...' : 'Download Full JSON Archive'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy and Consent Management (Requirement 7) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900">
              Photographs & Memory Consent
            </h3>
            <p className="text-slate-600 font-semibold text-base mt-1 leading-relaxed">
              In accordance with senior privacy guidelines, personal photographs and family voice recordings are only retained with verified family or healthcare proxy consent.
            </p>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="font-extrabold text-slate-900">
                  Data Processing & Memory Storage Consent
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Caregiver authorized for {activePatient?.fullName || 'the patient'}
                </div>
              </div>

              <button
                onClick={handleToggleConsent}
                className={`px-5 py-2.5 rounded-xl font-black text-sm cursor-pointer transition-all ${
                  consentGiven
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {consentGiven ? 'Consent Granted' : 'Consent Suspended'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Speech & Language Preferences */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900">
              Voice & Audio Preferences
            </h3>
            <p className="text-slate-600 font-semibold text-base mt-1 leading-relaxed">
              Configure Web Speech API text-to-speech synthesis speed and regional language toggles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Default Audio Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="en">English (Indian English / Calm)</option>
                  <option value="ml">മലയാളം (Malayalam Narration)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">Auto-Read on Open</div>
                  <div className="text-xs text-slate-500">Read memory descriptions aloud automatically</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoVoice}
                  onChange={toggleAutoVoice}
                  className="w-6 h-6 accent-teal-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverSettingsPage;
