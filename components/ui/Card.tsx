import React from "react";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className = "", children }: CardProps) {
  return (
    <div className={`bg-white border rounded shadow-sm dark:bg-gray-900 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: CardProps) {
  return <div className={`px-4 py-3 border-b dark:border-gray-800 ${className}`}>{children}</div>;
}

export function CardBody({ className = "", children }: CardProps) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: CardProps) {
  return <div className={`px-4 py-3 border-t dark:border-gray-800 ${className}`}>{children}</div>;
}

