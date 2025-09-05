import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const styles =
    variant === "success"
      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      : variant === "warning"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
      : variant === "danger"
      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles} ${className}`}>{children}</span>
  );
}

