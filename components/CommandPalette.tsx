"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

type Command = {
  id: string;
  label: string;
  href: string;
  keywords?: string[];
};

const DEFAULT_COMMANDS: Command[] = [
  { id: "dashboard", label: "Go to Dashboard", href: "/dashboard", keywords: ["home", "overview"] },
  { id: "ask-ai", label: "Ask AI", href: "/ask-ai", keywords: ["search", "permit", "ai"] },
  { id: "projects", label: "Projects", href: "/projects", keywords: ["reports", "work"] },
  { id: "forms", label: "Forms", href: "/forms", keywords: ["applications"] },
  { id: "checklist", label: "Checklist", href: "/checklist", keywords: ["tasks"] },
  { id: "billing", label: "Billing", href: "/(billing)/billing", keywords: ["plans", "stripe"] },
  { id: "settings", label: "Settings", href: "/settings", keywords: ["preferences", "notifications"] },
  { id: "moderator", label: "Moderator Review", href: "/moderator/review", keywords: ["appeals", "moderation"] },
  { id: "alerts", label: "Alerts", href: "/moderator/alerts", keywords: ["events"] },
  { id: "admin", label: "Admin", href: "/admin", keywords: ["ops"] },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQ("");
        setActiveIndex(0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return DEFAULT_COMMANDS;
    return DEFAULT_COMMANDS.filter((c) =>
      c.label.toLowerCase().includes(term) || (c.keywords || []).some((k) => k.includes(term))
    );
  }, [q]);

  function onEnter() {
    const cmd = filtered[activeIndex];
    if (cmd) window.location.href = cmd.href;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <Button variant="secondary" onClick={() => setOpen(true)} aria-label="Open Command Palette">
          ⌘K Command
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Command Palette">
        <div className="space-y-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
              if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
              if (e.key === "Enter") onEnter();
            }}
            placeholder="Type a command or search for a page..."
            className="w-full rounded border px-3 py-2"
          />
          <div className="max-h-72 overflow-auto rounded border">
            {filtered.length === 0 && (
              <div className="p-3 text-sm text-gray-600">No results</div>
            )}
            {filtered.map((c, i) => (
              <button
                key={c.id}
                onClick={() => (window.location.href = c.href)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  i === activeIndex ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                {c.label}
                <span className="ml-2 text-xs text-gray-500">{c.href}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

