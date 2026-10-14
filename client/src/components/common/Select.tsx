import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold tracking-tight text-slate-600 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full rounded-2xl bg-black/[0.03] dark:bg-slate-900/80
            backdrop-blur-xl border border-black/10 dark:border-white/12
            text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 transition-all duration-300 ease-spring
            shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]
            focus:outline-none focus:border-cyan-500/80 focus:ring-4 focus:ring-cyan-500/15
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-rose-500 focus:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
