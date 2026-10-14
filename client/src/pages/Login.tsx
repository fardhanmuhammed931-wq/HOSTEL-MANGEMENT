import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Shield, Building2, UserCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login({ email, password });
      if (res.data?.success && res.data?.data) {
        login(res.data.data.token, res.data.data.user);
        navigate('/dashboard');
      } else {
        setErrorMessage(res.data?.message || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
        'Unable to connect to the backend server. Please verify the credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Blurred Campus Daylight Backdrop */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('./campus-bg.jpg')`,
          filter: 'blur(12px)',
        }}
      />
      {/* Soft daylight atmosphere tint */}
      <div className="fixed inset-0 z-0 bg-sky-200/25 dark:bg-slate-950/70 backdrop-blur-[4px] pointer-events-none" />

      {/* Main VisionOS Liquid Glass Login Card (Matching Top-Left Mockup) */}
      <div className="relative z-10 w-full max-w-[420px] rounded-[32px] p-8 sm:p-10 backdrop-blur-3xl bg-white/55 dark:bg-slate-900/60 border border-white/70 dark:border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.16)] transition-all duration-300">
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 dark:via-white/25 to-transparent pointer-events-none rounded-t-[32px]" />

        {/* Brand House Icon in Blue Squircle */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/35 border border-white/30 text-white mb-4">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Hostel Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 tracking-wider mt-1">
            Secure • Simple • Smart
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-rose-600 dark:text-rose-300 text-xs leading-relaxed animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-md shadow-inner transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 backdrop-blur-md shadow-inner transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl btn-gradient-blue text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/30 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin@hostel.com')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Footer Contact Admin */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Not a member?{' '}
          <Link
            to="/register"
            className="font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
          >
            Contact Admin
          </Link>
        </div>

        {/* Quick Demo Credentials Pills */}
        <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@hostel.com')}
              className="py-2 px-1 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 border border-white/70 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium text-center shadow-sm active:scale-95 transition-all"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('warden.boys@hostel.com')}
              className="py-2 px-1 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 border border-white/70 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium text-center shadow-sm active:scale-95 transition-all"
            >
              Warden
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('rahul.sharma@hostel.com')}
              className="py-2 px-1 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 border border-white/70 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium text-center shadow-sm active:scale-95 transition-all"
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
