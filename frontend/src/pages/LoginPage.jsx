import React, { useState } from 'react';
import { Heart, Lock, Mail, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.user?.role === 'caregiver') {
        onNavigate('caregiver-dashboard');
      } else {
        onNavigate('patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCaregiver = async () => {
    await demoLogin('caregiver');
    onNavigate('caregiver-dashboard');
  };

  const handleDemoPatient = async () => {
    await demoLogin('patient');
    onNavigate('patient-dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-slate-200 max-w-lg w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-sky-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Heart className="w-9 h-9 fill-white/20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Welcome to MemoryMate
          </h2>
          <p className="text-slate-600 font-semibold mt-1">
            Sign in to access caregiver controls or patient aid
          </p>
        </div>

        {/* Fast Demo Shortcuts */}
        <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant 1-Click Evaluation Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoCaregiver}
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
            >
              Caregiver View
            </button>
            <button
              onClick={handleDemoPatient}
              type="button"
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
            >
              Patient View
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-900 p-3.5 rounded-2xl mb-6 flex items-center gap-2 text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-all text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-all text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-slate-600">
          New caregiver family member?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-teal-700 font-extrabold hover:underline cursor-pointer"
          >
            Register Here &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
