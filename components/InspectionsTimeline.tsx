"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

type Item = {
  id: string;
  title: string;
  at: string;
  status?: string;
  description?: string;
  confidence?: number;
};

export default function InspectionsTimeline({ projectId }: { projectId?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // If projectId is provided, request a plan for that project; otherwise fallback to demo static items
        if (projectId) {
          const res = await fetch("/api/inspections/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId }),
          });
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          const json = await res.json();
          if (ignore) return;
          const mapped: Item[] = (json.items || []).map((it: any) => ({
            id: it.id,
            title: it.type,
            at: it.requiredAfter || new Date().toISOString(),
            status: `#${it.orderIndex + 1}`,
            description: it.notes,
            confidence: typeof json.confidence?.score === 'number' ? Number(json.confidence.score) : undefined,
          }));
          setItems(mapped);
        } else {
          setItems([
            { id: "1", title: "Rough electrical inspection", at: new Date().toISOString(), status: "Scheduled", description: "Unit A, panel #2" },
            { id: "2", title: "Framing inspection", at: new Date(Date.now() - 86400000).toISOString(), status: "Passed", description: "Main structure" },
            { id: "3", title: "Mechanical inspection", at: new Date(Date.now() - 2*86400000).toISOString(), status: "Failed", description: "Vent duct clearance" },
          ]);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [projectId]);

  return (
    <Card>
      <SectionTitle>Inspections Timeline</SectionTitle>
      {loading && <div className="text-sm text-gray-600">Loading inspections…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <ul className="mt-2 space-y-2">
        {items.map((i) => (
          <li key={i.id} className="border rounded p-2 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{i.title}</div>
              <div className="text-gray-600">{new Date(i.at).toLocaleString()}</div>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">{i.description || ""}</div>
            {i.status && <div className="text-xs mt-1">Status: {i.status}</div>}
            {typeof i.confidence === 'number' && (
              <div className="text-xs text-gray-600">Confidence: {Math.round(i.confidence * 100)}%</div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

