"use client";
import { useEffect, useState } from "react";

type Suggestion = {
  id: string;
  appealId: string;
  moderatorId: string;
  suggestedCategory: string;
  confidence: number;
  rationale: string;
  slaUrgency: string;
  createdAt: string;
};

export default function SuggestionsPage() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/moderation/suggestions", { cache: "no-store" });
        const json = await res.json();
        setItems(json.suggestions ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function act(reportId: string, action: "approve" | "reject") {
    await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, action }),
    });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI Suggestions</h1>
      {loading ? <div>Loading…</div> : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.suggestedCategory} ({Math.round(s.confidence * 100)}%)</div>
                <div className="text-sm text-gray-600">Appeal {s.appealId.slice(0,8)} · {new Date(s.createdAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">{s.rationale}</div>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => act(s.appealId, "approve")}>Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => act(s.appealId, "reject")}>Reject</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

