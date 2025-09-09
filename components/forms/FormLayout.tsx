"use client";

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

type FormLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  successMessage?: string;
  errorMessage?: string;
  submitLabel?: string;
  submitting?: boolean;
  titleIcon?: React.ReactNode;
};

export default function FormLayout({
  title,
  description,
  children,
  onSubmit,
  successMessage,
  errorMessage,
  submitLabel = "Submit",
  submitting = false,
  titleIcon,
}: FormLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="mb-3">
        <Link href="/forms" className="text-sm text-gray-600 hover:text-gray-900">← Forms</Link>
      </div>
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          {titleIcon}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 text-green-800 px-4 py-3 ring-1 ring-green-200">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 text-red-800 px-4 py-3 ring-1 ring-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="pt-2">
          <Button type="submit" loading={submitting} disabled={submitting}>
            {submitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

