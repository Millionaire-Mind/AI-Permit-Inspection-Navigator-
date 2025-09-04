"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminFilters } from "@/components/admin/AdminFilters";

type TimelineEvent = {
  id: string;
  at: string;
  kind?: string;
  scope?: string;
  level?: string;
  message: string;
  source: "alert" | "audit";
  notifications?: string[];
};

export default function AlertTimeline({ filters }: { filters?: AdminFilters }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.slaBreachOnly) params.append("slaBreachOnly", "1");
    const res = await fetch(`/api/alerts/timeline?${params.toString()}`, { headers: { "x-user-role": "admin" } });
    const json = await res.json();
    setEvents(json.events || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filters?.from, filters?.to, filters?.status, filters?.userId, filters?.slaBreachOnly]);

  const grouped = useMemo(() => {
    const byDay: Record<string, TimelineEvent[]> = {};
    for (const e of events) {
      const day = new Date(e.at).toISOString().slice(0, 10);
      (byDay[day] ||= []).push(e);
    }
    return byDay;
  }, [events]);

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Alert Timeline</h2>
        <button onClick={load} className="text-sm px-2 py-1 border rounded">Refresh</button>
      </div>
      {loading ? (
        <div className="text-sm">Loading…</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).sort(([a],[b]) => a < b ? 1 : -1).map(([day, list]) => (
            <div key={day}>
              <div className="text-xs text-gray-500 mb-1">{new Date(day).toDateString()}</div>
              <div className="space-y-2">
                {list.sort((a,b)=>+new Date(b.at)-+new Date(a.at)).map(e => (
                  <div key={e.id} className="border rounded p-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">{e.kind || e.level || e.source}</span>
                        <span className="ml-2 text-gray-600">{e.message}</span>
                        {e.scope && <span className="ml-2 text-xs text-gray-500">[{e.scope}]</span>}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(e.at).toLocaleTimeString()}</div>
                    </div>
                    {e.notifications && e.notifications.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">Notified: {e.notifications.join(", ")}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {events.length === 0 && <div className="text-sm text-gray-600">No events</div>}
        </div>
      )}
    </div>
  );
}

