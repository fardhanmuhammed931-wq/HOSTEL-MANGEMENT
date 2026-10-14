import React from 'react';

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const norm = status.toLowerCase();

  // Status mapping with soft pastel translucent fills, specular rim, and glowing dot
  let bg = 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/20';
  let dotColor = 'bg-slate-400';

  if (['active', 'available', 'paid', 'resolved', 'closed', 'present'].includes(norm)) {
    bg = 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.2)]';
    dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
  } else if (['partially_occupied', 'partially_paid', 'in_progress', 'medium', 'warden', 'on_leave'].includes(norm)) {
    bg = 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.2)]';
    dotColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
  } else if (['full', 'overdue', 'high', 'emergency', 'absent', 'suspended'].includes(norm)) {
    bg = 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.2)]';
    dotColor = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
  } else if (['under_maintenance', 'pending', 'submitted', 'low', 'inactive', 'not_marked'].includes(norm)) {
    bg = 'bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/25 shadow-[0_2px_8px_-2px_rgba(14,165,233,0.2)]';
    dotColor = 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]';
  } else if (['admin'].includes(norm)) {
    bg = 'bg-purple-500/12 text-purple-700 dark:text-purple-300 border-purple-500/25 shadow-[0_2px_8px_-2px_rgba(168,85,247,0.2)]';
    dotColor = 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]';
  } else if (['student'].includes(norm)) {
    bg = 'bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 border-cyan-500/25 shadow-[0_2px_8px_-2px_rgba(6,182,212,0.2)]';
    dotColor = 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]';
  }

  const displayText = label || norm.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-xl uppercase tracking-wider ${sizeClass} ${bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{displayText}</span>
    </span>
  );
};
