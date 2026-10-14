import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, Shield, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        'Unable to connect to the backend server. Please verify the API and MySQL database are active.'
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-slate-900 dark:bg-[#040711] text-slate-100">
      {/* Dynamic Multi-layered Ambient Light Spheres */}
      <div className="absolute top-1/6 left-1/5 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/6 right-1/5 w-[550px] h-[550px] bg-indigo-600/25 rounded-full blur-[150px] pointer-events-none animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Main VisionOS Liquid Glass Login Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 dark:border-white/12 bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl backdrop-saturate-[200%] p-8 sm:p-10 shadow-2xl shadow-black/40 z-10 transition-all duration-300">
        {/* Specular Top-Edge Rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/25 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 shadow-xl shadow-cyan-500/30 border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5)] mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            HostelSync ERP
          </h2>
          <p className="text-sm text-slate-300/80 mt-1 tracking-tight">
            Enterprise Residential & Hostel Management
          </p>
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>Interactive Live Engine Active</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs leading-relaxed animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@hostel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            isPassword
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-sm font-semibold shadow-xl shadow-cyan-500/25 mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-300/80">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Sign Up / Create Account
            </Link>
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div className="mt-7 pt-5 border-t border-white/10">
          <div className="flex items-center gap-1.5 justify-center text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Credentials</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@hostel.com')}
              className="px-2.5 py-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-300 text-xs font-semibold transition-all duration-200 active:scale-95 text-center shadow-sm"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('warden.boys@hostel.com')}
              className="px-2.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 text-xs font-semibold transition-all duration-200 active:scale-95 text-center shadow-sm"
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span>Warden</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alex.turner@hostel.com')}
              className="px-2.5 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-xs font-semibold transition-all duration-200 active:scale-95 text-center shadow-sm"
            >
              <User className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <span>Student</span>
            </button>
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-3">
            Default password: <code className="text-slate-200 font-mono px-1.5 py-0.5 rounded bg-white/10">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
