import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  gradient?: 'blue' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'none';
  variant?: 'primary' | 'subtle' | 'well';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  gradient = 'none',
  variant = 'primary',
  ...props
}) => {
  let gradientClass = '';
  if (gradient === 'blue') gradientClass = 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent';
  else if (gradient === 'purple') gradientClass = 'bg-gradient-to-br from-purple-500/10 via-transparent to-transparent';
  else if (gradient === 'cyan') gradientClass = 'bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent';
  else if (gradient === 'emerald') gradientClass = 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent';
  else if (gradient === 'amber') gradientClass = 'bg-gradient-to-br from-amber-500/10 via-transparent to-transparent';
  else if (gradient === 'rose') gradientClass = 'bg-gradient-to-br from-rose-500/10 via-transparent to-transparent';

  const baseVariant = 
    variant === 'subtle' ? 'liquid-glass-subtle' :
    variant === 'well' ? 'liquid-well' :
    'liquid-glass';

  return (
    <div
      className={`
        relative rounded-3xl p-6 sm:p-7
        ${baseVariant}
        text-slate-900 dark:text-slate-100
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-liquid-hover cursor-pointer' : ''}
        ${glow ? 'shadow-liquid-glow border-cyan-400/40 dark:border-cyan-400/30' : ''}
        ${gradientClass}
        ${className}
      `}
      {...props}
    >
      {/* Specular sheen gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />
      {children}
    </div>
  );
};
