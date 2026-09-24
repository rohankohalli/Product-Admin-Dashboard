import React from 'react';

export function TableRowSkeleton({ _columns = 6 }) {
  return (
    <tr className="animate-pulse border-b border-zinc-100">
      {/* Product Image & Title */}
      <td className="py-3.5 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-200 shrink-0" />
          <div className="space-y-1.5 w-full max-w-[200px]">
            <div className="h-4 bg-zinc-200 rounded w-3/4" />
            <div className="h-3 bg-zinc-100 rounded w-1/2" />
          </div>
        </div>
      </td>
      {/* Category */}
      <td className="px-3 py-3.5">
        <div className="h-5 bg-zinc-200 rounded-full w-20" />
      </td>
      {/* Price */}
      <td className="px-3 py-3.5">
        <div className="h-4 bg-zinc-200 rounded w-16" />
      </td>
      {/* Rating */}
      <td className="px-3 py-3.5">
        <div className="h-4 bg-zinc-200 rounded w-12" />
      </td>
      {/* Stock */}
      <td className="px-3 py-3.5">
        <div className="h-5 bg-zinc-200 rounded-full w-18" />
      </td>
      {/* Actions */}
      <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
        <div className="inline-flex gap-2">
          <div className="w-7 h-7 bg-zinc-200 rounded" />
          <div className="w-7 h-7 bg-zinc-200 rounded" />
          <div className="w-7 h-7 bg-zinc-200 rounded" />
        </div>
      </td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
      <div className="w-full h-44 bg-zinc-200 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-3 bg-zinc-100 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
        <div className="h-5 bg-zinc-200 rounded w-16" />
        <div className="h-5 bg-zinc-200 rounded-full w-20" />
      </div>
    </div>
  );
}
