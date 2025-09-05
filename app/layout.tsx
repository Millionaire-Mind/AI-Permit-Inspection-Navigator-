import "./globals.css";
import { ReactNode } from "react";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
try { (0, eval)("require")("@/sentry.client.config"); } catch {}

export const metadata = {
  title: "AI Permit & Inspection Navigator",
  description: "Trust-first permitting assistant for contractors & moderators"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <div className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-gray-900/70">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="font-semibold">AI Permit & Inspection Navigator</div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-4">{children}</div>
        <CommandPalette />
      </body>
    </html>
  );
}
