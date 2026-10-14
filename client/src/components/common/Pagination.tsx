import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
  limit?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  limit,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-black/5 dark:border-white/5 text-sm text-slate-500 dark:text-slate-400">
      <div>
        {totalRecords !== undefined && limit !== undefined && (
          <span className="text-xs sm:text-sm">
            Showing <strong className="text-slate-900 dark:text-white font-semibold">{(currentPage - 1) * limit + 1}</strong> to{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">
              {Math.min(currentPage * limit, totalRecords)}
            </strong>{' '}
            of <strong className="text-slate-900 dark:text-white font-semibold">{totalRecords}</strong> entries
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={page}>
                {prev && page - prev > 1 && <span className="px-2 text-slate-400">...</span>}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 border active:scale-95 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white/20 shadow-md shadow-cyan-500/25'
                      : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/30'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
