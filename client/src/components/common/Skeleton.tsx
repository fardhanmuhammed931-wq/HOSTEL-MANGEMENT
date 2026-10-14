import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/5 ${className}`}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-7 space-y-4 animate-pulse">
    <div className="h-4 w-28 bg-black/[0.06] dark:bg-white/10 rounded-xl" />
    <div className="h-8 w-44 bg-black/[0.08] dark:bg-white/15 rounded-xl" />
    <div className="h-3 w-36 bg-black/[0.04] dark:bg-white/5 rounded-xl" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3 w-full">
    <div className="h-11 bg-black/[0.04] dark:bg-white/[0.05] rounded-2xl" />
    {Array.from({ length: rows }).map((_, rIdx) => (
      <div key={rIdx} className="flex gap-4 py-3.5 border-b border-black/5 dark:border-white/5">
        {Array.from({ length: cols }).map((_, cIdx) => (
          <div key={cIdx} className="h-5 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl flex-1" />
        ))}
      </div>
    ))}
  </div>
);
