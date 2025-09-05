"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400";
    case "secondary":
      return "border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800";
    case "ghost":
      return "text-gray-900 hover:bg-gray-100 disabled:text-gray-400 dark:text-gray-100 dark:hover:bg-gray-800";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400";
    default:
      return "bg-indigo-600 text-white";
  }
}

function sizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "px-2.5 py-1.5 text-sm";
    case "md":
      return "px-3.5 py-2 text-sm";
    case "lg":
      return "px-4 py-2.5 text-base";
    default:
      return "px-3.5 py-2 text-sm";
  }
}

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const computed = `${variantClasses(variant)} ${sizeClasses(size)} rounded transition-colors inline-flex items-center justify-center whitespace-nowrap ${className}`;
  return (
    <button className={computed} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}

