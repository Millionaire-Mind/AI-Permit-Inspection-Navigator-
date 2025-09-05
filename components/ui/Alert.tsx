"use client";
import React from 'react';
import clsx from 'clsx';

type Variant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = {
  variant?: Variant;
  title?: string;
  children?: React.ReactNode;
};

const styles: Record<Variant, string> = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

export function Alert({ variant = 'info', title, children }: AlertProps) {
  return (
    <div className={clsx('border rounded p-3 text-sm', styles[variant])} role="status" aria-live="polite">
      {title && <div className="font-medium mb-0.5">{title}</div>}
      {children && <div>{children}</div>}
    </div>
  );
}

