"use client";

import { useEffect, useState } from "react";

export default function Sidebar() {
  const [pending, setPending] = useState(0);

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
    <aside className="space-y-4">
      <div className="badge" title={`${pending} pending appeals`}>
        <span className="badge-dot" aria-hidden />
        <span>Pending Appeals ({pending})</span>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        <a href="/dashboard">Dashboard</a>
        <a href="/moderator/review">Moderator Review</a>
        <a href="/moderator/alerts">Alerts</a>
        <a href="/admin">Admin</a>
        <a href="/admin/audits">Audit Trail</a>
      </nav>
    </aside>
  );
}
