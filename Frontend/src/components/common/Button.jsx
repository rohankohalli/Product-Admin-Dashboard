import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable accessible Button component
 * @param {'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} isLoading
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg select-none';

  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 focus:ring-zinc-900/30 border border-transparent shadow-xs',
    secondary: 'bg-white text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-300 focus:ring-zinc-400/20 shadow-2xs',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500/30 border border-transparent shadow-xs',
    ghost: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 focus:ring-zinc-400/20',
    outline: 'border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-400/20',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
