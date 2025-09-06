import "./globals.css";
import { ReactNode } from "react";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
import { Providers } from "./providers";

export const metadata = {
  title: "AI Permit & Inspection Navigator",
  description: "Trust-first permitting assistant for contractors & moderators"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-content text-gray-900 font-body dark:bg-gray-900 dark:text-gray-50">
        <Providers>
          <div className="max-w-7xl mx-auto p-4">{children}</div>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
