import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, User, Phone, ArrowRight, Shield, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    gender: 'male',
    department: 'Computer Science',
    course: 'B.Tech CS',
    academicYear: '1st Year',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        gender: formData.gender,
        department: formData.department,
        course: formData.course,
        academic_year: formData.academicYear,
      });

      if (res.data.success && res.data.data) {
        success('Account created successfully! Welcome to HostelSync ERP.');
        // Automatically log the user in with token and user object
        login(res.data.data.token, res.data.data.user);
        navigate('/');
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create account. Please try again.';
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-900 dark:bg-[#040711] text-slate-100">
      {/* Background Ambient Spheres */}
      <div className="absolute top-1/5 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/5 right-1/4 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Main VisionOS Liquid Glass Card */}
      <div className="relative w-full max-w-xl rounded-3xl border border-white/20 dark:border-white/12 bg-white/10 dark:bg-slate-900/60 backdrop-blur-3xl backdrop-saturate-[200%] p-8 sm:p-10 shadow-2xl shadow-black/40 z-10 my-8 transition-all">
        {/* Specular Top-Edge Rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/25 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 shadow-xl shadow-cyan-500/30 border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5)] mb-3.5">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            Create Your Account
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </h1>
          <p className="text-sm text-slate-300/80 mt-1 tracking-tight">
            Join the HostelSync ERP Residential Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold tracking-tight text-slate-300 mb-2">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'warden', label: 'Warden', icon: Building2 },
              { id: 'admin', label: 'Admin', icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFormData({ ...formData, role: id })}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
                  formData.role === id
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="e.g. John Doe"
            value={formData.fullName}
            onChange={handleChange}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. user@hostel.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          {/* Student Specific Fields */}
          {formData.role === 'student' && (
            <div className="p-4 rounded-3xl bg-black/20 dark:bg-white/5 border border-white/10 space-y-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic Profile</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Degree / Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CS"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-400 placeholder-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Password"
              name="password"
              isPassword
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              isPassword
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-sm font-semibold shadow-xl shadow-cyan-500/25 mt-3"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Sign In
          </Button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-slate-300/80">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
