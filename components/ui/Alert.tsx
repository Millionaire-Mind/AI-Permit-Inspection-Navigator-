import React from "react";

type AlertProps = {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Alert({ variant = "info", title, children, className = "" }: AlertProps) {
  const color =
    variant === "success"
      ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900"
      : variant === "warning"
      ? "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900"
      : variant === "error"
      ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
      : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
  return (
    <div className={`border rounded px-3 py-2 text-sm ${color} ${className}`} role="alert">
      {title && <div className="font-medium mb-0.5">{title}</div>}
      {children}
    </div>
  );
}

