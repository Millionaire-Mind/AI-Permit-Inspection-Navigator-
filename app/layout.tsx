import "./globals.css";
import { ReactNode } from "react";
try { require("@/sentry.client.config"); } catch {}

export const metadata = {
  title: "AI Permit & Inspection Navigator",
  description: "Trust-first permitting assistant for contractors & moderators"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
