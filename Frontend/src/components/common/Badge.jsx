import React from 'react';

/**
 * Reusable Badge component for status indicators, categories, and tags
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const dotColors = {
    default: 'bg-zinc-500',
    primary: 'bg-indigo-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.default}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
