import React, { useState } from 'react';
import { Heart, User, Mail, Lock, Phone, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    patientName: '',
    patientAge: '76',
    stage: 'Early'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...formData,
        role: 'caregiver'
      });
      onNavigate('caregiver-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-slate-200 max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Heart className="w-9 h-9 fill-white/20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Caregiver Registration
          </h2>
          <p className="text-slate-600 font-semibold mt-1">
            Create an account to manage your loved one's memory profile safely
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-900 p-3.5 rounded-2xl mb-6 flex items-center gap-2 text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
            <div className="text-xs font-black uppercase tracking-wider text-teal-800 mb-3">
              1. Caregiver Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Priya Thomas"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98471 23456"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 mb-6">
            <div className="text-xs font-black uppercase tracking-wider text-sky-800 mb-3">
              2. Patient Profile to Support
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Thomas Kurian"
                  className="w-full px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  placeholder="76"
                  className="w-full px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl font-semibold text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Alzheimer's / Memory Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl font-semibold text-slate-800 text-sm"
              >
                <option value="Early">Early Stage (Mild memory loss, high independence)</option>
                <option value="Moderate">Moderate Stage (Needs daily routine guidance and cues)</option>
                <option value="Advanced">Advanced Stage (High supervision & gentle familiarity)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration & Start'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-slate-600">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-teal-700 font-extrabold hover:underline cursor-pointer"
          >
            Log In Here &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
