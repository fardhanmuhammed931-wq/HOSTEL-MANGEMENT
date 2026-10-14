import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none tracking-tight';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-xl',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-3xl',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] focus:ring-cyan-500',
    secondary:
      'bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 border border-black/5 dark:border-white/15 backdrop-blur-xl shadow-sm focus:ring-slate-400',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400',
    glass:
      'bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 text-slate-800 dark:text-white border border-white/40 dark:border-white/15 backdrop-blur-xl shadow-liquid focus:ring-cyan-400',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
