"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";
import type { AdminFilters } from "@/components/admin/AdminFilters";

export default function SLAWidgets({ filters }: { filters?: AdminFilters }) {
  const [stats, setStats] = useState<any>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.slaBreachOnly) params.append("slaBreachOnly", "1");
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [filters?.userId, filters?.status, filters?.slaBreachOnly, filters?.from, filters?.to]);

  useEffect(() => { fetch(`/api/sla/stats${query}`).then(r=>r.json()).then(setStats); }, [query]);

  if (!stats) return <Card>Loading SLA…</Card>;

  const statusColor = (breaches: number) => breaches <= 2 ? "bg-green-100" : breaches <= 5 ? "bg-yellow-100" : "bg-red-100";

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <SectionTitle>Totals</SectionTitle>
        <div>Appeals: {stats.totals.appeals}</div>
        <div>Handled: {stats.totals.handled}</div>
        <div className={`${statusColor(stats.totals.slaBreaches)} inline-block px-2 rounded`}>Breaches: {stats.totals.slaBreaches}</div>
      </Card>
      <Card>
        <SectionTitle>Per Category</SectionTitle>
        {stats.perCategory.map((c: any) => (
          <div key={c.category} className="text-sm flex justify-between">
            <span>{c.category}</span>
            <span>{c.avgResponseMin} min, breaches {c.slaBreaches}</span>
          </div>
        ))}
      </Card>
      <Card>
        <SectionTitle>Exports</SectionTitle>
        <a className="underline" href="/api/exports/csv">Download CSV</a>
        <div className="mt-2 text-sm text-gray-600">PDFs are per report from the detail screen.</div>
        <div className="mt-3">
          <button
            className="px-3 py-2 border rounded text-sm"
            onClick={async () => {
              const key = prompt("Enter export key (from PDF response)")?.trim();
              if (!key) return;
              const r = await fetch(`/api/exports/signed-url?key=${encodeURIComponent(key)}`);
              const j = await r.json();
              if (j.url) window.open(j.url, '_blank');
              else alert('Failed to generate signed URL');
            }}
          >
            Get Signed PDF Link
          </button>
        </div>
      </Card>
    </div>
  );
}
