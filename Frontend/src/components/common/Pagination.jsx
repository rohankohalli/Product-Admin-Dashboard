import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Custom Pagination component built from scratch
 * Zero external pagination dependencies
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Range text calculation: "Showing 21–40 of 194"
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  /**
   * Generates intelligent page pills with ellipsis windowing
   */
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safePage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (safePage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 text-sm select-none">
      {/* Left section: Item range & Page size selector */}
      <div className="flex flex-wrap items-center gap-4 text-zinc-600">
        <span className="tabular-nums font-medium text-zinc-700">
          Showing <span className="font-semibold text-zinc-900">{startItem}</span>–
          <span className="font-semibold text-zinc-900">{endItem}</span> of{' '}
          <span className="font-semibold text-zinc-900">{totalItems}</span>
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size-select" className="text-xs text-zinc-500">
            Per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            disabled={isLoading}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="text-xs font-medium bg-white text-zinc-800 border border-zinc-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right section: Prev, Page Pills, Next */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(safePage - 1)}
          disabled={safePage <= 1 || isLoading}
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Pills */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-zinc-400 select-none"
                >
                  •••
                </span>
              );
            }

            const isCurrent = p === safePage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange?.(p)}
                disabled={isLoading}
                className={`min-w-8 h-8 px-2 text-xs font-medium rounded-lg transition-all tabular-nums cursor-pointer ${
                  isCurrent
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200/80'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange?.(safePage + 1)}
          disabled={safePage >= totalPages || isLoading}
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
