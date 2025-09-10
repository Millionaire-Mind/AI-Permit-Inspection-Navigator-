"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [pending, setPending] = useState(0);
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const active = useMemo(() => pathname === href || pathname?.startsWith(href + "/"), [pathname, href]);
    return (
      <a
        href={href}
        className={`px-3 py-2 rounded-md transition-colors ${active ? "bg-accent/20 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`}
      >
        {label}
      </a>
    );
  };

  const refresh = useCallback(async () => {
    try {
      const controller = new AbortController();
      const res = await fetch("/api/appeals", { signal: controller.signal });
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const count = (json.appeals || []).filter((a: any) => a.status === "pending").length;
      setPending(count);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  useEffect(() => {
    let timer: any;
    let currentDelay = 15000; // 15s when visible
    const hiddenDelay = 60000; // 60s when hidden
    const maxDelay = 300000; // 5m backoff cap

    const schedule = (delay: number) => {
      clearInterval(timer);
      timer = setInterval(async () => {
        const ok = await refresh();
        if (!ok) {
          currentDelay = Math.min(currentDelay * 2, maxDelay);
          schedule(currentDelay);
        } else {
          currentDelay = document.visibilityState === "visible" ? 15000 : hiddenDelay;
          schedule(currentDelay);
        }
      }, delay);
    };

    const onVisibility = () => {
      currentDelay = document.visibilityState === "visible" ? 15000 : hiddenDelay;
      schedule(currentDelay);
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    const onFocus = () => { refresh(); };
    const onOnline = () => { refresh(); };

    // initial fetch and start
    refresh();
    schedule(currentDelay);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, [refresh]);

  return (
    <aside className="bg-sidebar text-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="opacity-80">Pending Appeals</div>
        <div className="inline-flex items-center gap-2 text-orange-300">
          <span className="inline-block h-2 w-2 rounded-full bg-status-progress" aria-hidden />
          <span>In Progress: {pending}</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {link("/dashboard", "Dashboard")}
        {link("/ask-ai", "Ask AI")}
        {link("/projects", "Projects")}
        {link("/forms", "Forms")}
        {link("/checklist", "Checklist")}
        {link("/billing", "Billing")}
        {link("/settings", "Settings")}
        {link("/moderator/review", "Moderator Review")}
        {link("/moderator/alerts", "Alerts")}
        {link("/admin", "Admin")}
        {link("/admin/audits", "Audit Trail")}
      </nav>
    </aside>
  );
}
