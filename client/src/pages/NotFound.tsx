import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <GlassCard className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl border border-black/5 dark:border-white/12 shadow-2xl relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 mx-auto flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500 font-mono tracking-tight">404</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8 leading-relaxed">
          The requested hostel management portal module or page could not be located.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
