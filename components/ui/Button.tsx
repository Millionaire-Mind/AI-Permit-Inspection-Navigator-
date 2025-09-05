"use client";
import clsx from 'clsx';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const base = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 focus:ring-gray-300',
};
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function Button({ variant = 'primary', size = 'md', loading, className, children, ...props }: ButtonProps) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} aria-busy={loading} {...props}>
      {loading ? '…' : children}
    </button>
  );
}

export default Button;

