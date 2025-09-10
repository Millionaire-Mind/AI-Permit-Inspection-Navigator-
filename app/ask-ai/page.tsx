import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hasActiveSubscription } from "@/lib/subscription";

export default async function AskAIPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session) {
    return <div className="p-6">Please sign in to access this page.</div>;
  }
  const ok = await hasActiveSubscription(session.user.id);
  if (!ok) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-2xl font-bold">Ask AI</h1>
        <div className="rounded-md bg-yellow-50 text-yellow-900 px-4 py-3 ring-1 ring-yellow-200">This feature requires an active subscription. <a className="underline" href="/billing">Manage billing</a>.</div>
      </div>
    );
  }

  // Use a client subcomponent for interactive UI
  return <ClientAskAI />;
}

"use client";
import { useState } from "react";
import PermitInfoBox from "@/components/PermitInfoBox";
import TipsPanel from "@/components/TipsPanel";

function ClientAskAI() {
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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <input className="border border-gray-200 rounded-md px-4 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Ask about permit requirements..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="px-5 py-3 bg-accent text-white rounded-md shadow hover:opacity-90 disabled:opacity-60" onClick={onSearch} disabled={loading}>{loading?"Search…":"Search"}</button>
        </div>
      </div>
      {info && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <PermitInfoBox permitType={info.permitType || "General"} requirements={info.requirements || []} timeline={info.timeline || "Varies"} fees={info.fees || "See schedule"} />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <TipsPanel tips={["Verify zoning first","Prepare site plan","Schedule inspection early"]} />
          </div>
        </div>
      )}
    </div>
  );
}

