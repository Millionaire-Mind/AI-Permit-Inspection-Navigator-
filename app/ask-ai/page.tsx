"use client";

import { useState } from "react";
import PermitInfoBox from "@/components/PermitInfoBox";
import TipsPanel from "@/components/TipsPanel";

export default function AskAIPage() {
  const [q, setQ] = useState("");
  const [info, setInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch() {
    if (!q.trim()) return;
    setLoading(true);
    // Demo: call permits check or a placeholder AI endpoint in future
    const res = await fetch("/api/permits/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: q.trim() })});
    const json = await res.json();
    setLoading(false);
    setInfo(json || null);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ask AI</h1>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2 w-full" placeholder="Ask about permit requirements..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={onSearch} disabled={loading}>{loading?"Searching...":"Search"}</button>
      </div>
      {info && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <PermitInfoBox permitType={info.permitType || "General"} requirements={info.requirements || []} timeline={info.timeline || "Varies"} fees={info.fees || "See schedule"} />
          </div>
          <TipsPanel tips={["Verify zoning first","Prepare site plan","Schedule inspection early"]} />
        </div>
      )}
    </div>
  );
}

