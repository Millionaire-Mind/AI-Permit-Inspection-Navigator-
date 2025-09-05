"use client";
import { useEffect, useState } from "react";

type InspectionItem = {
  id: string;
  type: string;
  requiredAfter?: string | null;
  orderIndex: number;
  notes?: string | null;
};

export default function InspectionsTimeline({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/inspections/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setItems((json.items || []).sort((a: any, b: any) => a.orderIndex - b.orderIndex));
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load inspections");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (projectId) load();
    return () => { mounted = false; };
  }, [projectId]);

  if (loading) return <div className="text-sm text-gray-500">Loading inspections…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!items.length) return <div className="text-sm text-gray-500">No inspections scheduled yet.</div>;

  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {items.map((it, idx) => (
        <li key={it.id} className="mb-8 ms-6">
          <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          </span>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{it.type}</h3>
            <span className="text-xs text-gray-500">Step {it.orderIndex + 1}</span>
          </div>
          {it.requiredAfter && <p className="mt-1 text-sm text-gray-600">{it.requiredAfter}</p>}
          {it.notes && <p className="mt-1 text-xs text-gray-500">{it.notes}</p>}
        </li>
      ))}
    </ol>
  );
}