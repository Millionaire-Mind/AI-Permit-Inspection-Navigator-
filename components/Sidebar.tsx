"use client";

import { useEffect, useMemo, useState } from "react";
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

  async function refresh() {
    const res = await fetch("/api/appeals");
    const json = await res.json();
    const count = (json.appeals || []).filter((a: any) => a.status === "pending").length;
    setPending(count);
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, []);

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
        {link("/(billing)/billing", "Billing")}
        {link("/settings", "Settings")}
        {link("/moderator/review", "Moderator Review")}
        {link("/moderator/alerts", "Alerts")}
        {link("/admin", "Admin")}
        {link("/admin/audits", "Audit Trail")}
      </nav>
    </aside>
  );
}
