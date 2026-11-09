import React, { useState, useEffect } from 'react';
import { User, Shield, Stethoscope, MapPin, Heart, Edit2, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/api';

const PatientProfilePage = () => {
  const { activePatient, setActivePatient, role } = useAuth();
  const isCaregiver = role === 'caregiver';

  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    age: 76,
    stage: 'Early',
    photoUrl: '',
    emergencyNotes: '',
    address: '',
    doctorName: '',
    doctorPhone: '',
    doctorClinic: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (activePatient) {
      setFormData({
        fullName: activePatient.fullName || 'Thomas Kurian',
        preferredName: activePatient.preferredName || 'Grandpa Tom',
        age: activePatient.age || 76,
        stage: activePatient.stage || 'Early',
        photoUrl: activePatient.photoUrl || '',
        emergencyNotes: activePatient.emergencyNotes || '',
        address: activePatient.address || '',
        doctorName: activePatient.primaryDoctor?.name || 'Dr. Elizabeth Roy (Neurologist)',
        doctorPhone: activePatient.primaryDoctor?.phone || '+91 98470 12345',
        doctorClinic: activePatient.primaryDoctor?.clinic || 'City Memorial Healthcare Center'
      });
    }
  }, [activePatient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        preferredName: formData.preferredName,
        age: Number(formData.age),
        stage: formData.stage,
        photoUrl: formData.photoUrl,
        emergencyNotes: formData.emergencyNotes,
        address: formData.address,
        primaryDoctor: {
          name: formData.doctorName,
          phone: formData.doctorPhone,
          clinic: formData.doctorClinic
        }
      };

      const updated = await patientService.update(activePatient?._id, payload);
      setActivePatient(updated.patient || payload);
      setIsEditing(false);
      setSuccessMsg('Patient profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to update patient profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Identity & Medical Record
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-2">
            Patient Care Profile
          </h1>
          <p className="text-lg font-bold text-slate-600 mt-1">
            Clinical background, doctor contacts, and personalized cues.
          </p>
        </div>

        {isCaregiver && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-md touch-target-elderly"
          >
            <Edit2 className="w-5 h-5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 font-bold">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Form / View */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border-2 border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Photo & Basic Details Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-100 border-4 border-teal-200 flex-shrink-0 shadow-md">
              <img
                src={formData.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'}
                alt={formData.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-3xl font-black text-slate-900">
                {formData.fullName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-sky-100 text-sky-900 font-extrabold text-sm px-3 py-1 rounded-full border border-sky-200">
                  Known As: "{formData.preferredName}"
                </span>
                <span className="bg-amber-100 text-amber-900 font-extrabold text-sm px-3 py-1 rounded-full border border-amber-200">
                  Age: {formData.age} Years
                </span>
                <span className="bg-purple-100 text-purple-900 font-extrabold text-sm px-3 py-1 rounded-full border border-purple-200">
                  Stage: {formData.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields (Enabled when Editing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Calling Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.preferredName}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                disabled={!isEditing}
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alzheimer's / Memory Stage</label>
              <select
                disabled={!isEditing}
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
              >
                <option value="Early">Early Stage</option>
                <option value="Moderate">Moderate Stage</option>
                <option value="Advanced">Advanced Stage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Home Address / Location</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Emergency & Reassurance Notes (Cues for caregivers & first responders)
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.emergencyNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyNotes: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 disabled:opacity-75"
            />
          </div>

          {/* Primary Doctor Section */}
          <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200">
            <div className="flex items-center gap-2 text-sky-900 font-black text-sm uppercase tracking-wider mb-3">
              <Stethoscope className="w-5 h-5 text-sky-700" />
              <span>Primary Neurologist / Physician</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.doctorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl font-bold text-slate-800 text-sm disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Phone</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.doctorPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorPhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl font-bold text-slate-800 text-sm disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.doctorClinic}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorClinic: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl font-bold text-slate-800 text-sm disabled:opacity-75"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-7 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientProfilePage;
