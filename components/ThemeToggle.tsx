"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mode, setMode] = useState<string>("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setMode(saved);
    applyTheme(saved);
  }, []);

  function applyTheme(next: string) {
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else if (next === "light") root.classList.remove("dark");
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add("dark"); else root.classList.remove("dark");
    }
  }

  function cycle() {
    const order = ["system", "light", "dark"] as const;
    const idx = order.indexOf(mode as any);
    const next = order[(idx + 1) % order.length];
    localStorage.setItem("theme", next);
    setMode(next);
    applyTheme(next);
  }

  const label = mode === "system" ? "System" : mode === "light" ? "Light" : "Dark";
  return (
    <button onClick={cycle} className="rounded border px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="Toggle theme">
      Theme: {label}
    </button>
  );
}

