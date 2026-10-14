import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
      {/* Deep Spatial Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/60 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Ultra-frosted Liquid Glass Modal Sheet */}
      <div
        className={`
          relative w-full ${sizeClasses[size]} rounded-3xl
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl backdrop-saturate-[200%]
          border border-white/70 dark:border-white/15
          p-6 sm:p-8 shadow-2xl z-10 transition-all transform scale-100
          animate-in fade-in zoom-in-95 duration-200
          text-slate-900 dark:text-slate-100
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/25 to-transparent pointer-events-none rounded-t-3xl" />

        <div className="flex items-start justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
