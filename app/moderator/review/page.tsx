"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AlertsPanel from "@/components/AlertsPanel";

type Appeal = {
  id: string; status: string; reason: string; reportId: string; createdAt: string;
};

export default function ModeratorReview() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [sort, setSort] = useState("newest");
  const [severity, setSeverity] = useState("all");
  const [lastLoginAt] = useState<string>(new Date(Date.now()-1000*60*60*8).toISOString());

  async function load() {
    const res = await fetch("/api/appeals", { cache: "no-store" });
    const json = await res.json();
    const list = json.appeals || [];
    setAppeals(list);
    setPendingCount(list.filter((a: Appeal) => a.status === "pending").length);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = [...appeals];
    if (severity !== "all") {
      // demo filter: treat "severity" by string length just to wire UI
      list = list.filter(a => severity === "high" ? a.reason.length > 80 : a.reason.length <= 80);
    }
    if (sort === "newest") list.sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "oldest") list.sort((a,b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    return list;
  }, [appeals, sort, severity]);

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="badge" title={`${pendingCount} pending appeals`}>
          <span className="badge-dot" aria-hidden />
          <span>Pending Appeals ({pendingCount})</span>
        </div>
        <div className="space-y-2">
          <label className="block">Sort
            <select value={sort} onChange={e=>setSort(e.target.value)} className="border w-full px-2 py-1">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
          <label className="block">Severity
            <select value={severity} onChange={e=>setSeverity(e.target.value)} className="border w-full px-2 py-1">
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <div className="text-xs text-gray-600">Last login: {new Date(lastLoginAt).toLocaleString()}</div>
        <AlertsPanel />
      </aside>

      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Moderator Review</h1>
        {filtered.map(a => (
          <div key={a.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Appeal #{a.id.slice(0,8)} – Report <Link className="underline" href={`/dashboard/reports/${a.reportId}`}>{a.reportId.slice(0,8)}</Link></div>
                <div className="font-medium">Status: {a.status}</div>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => fetch(`/api/appeals/${a.id}`, {method:"PATCH", body: JSON.stringify({ action:"approve" })})}>Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => fetch(`/api/appeals/${a.id}`, {method:"PATCH", body: JSON.stringify({ action:"reject" })})}>Reject</button>
                <button className="px-3 py-1 bg-gray-700 text-white rounded" onClick={() => fetch(`/api/appeals/${a.id}`, {method:"PATCH", body: JSON.stringify({ action:"reviewed" })})}>Mark Reviewed</button>
              </div>
            </div>
            <p className="mt-2 text-sm">{a.reason}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
