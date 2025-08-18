"use client";

import { useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

export default function AppealForm({ reportId }: { reportId: string }) {
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    const res = await fetch("/api/appeals", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ userId: "demo-user", reportId, reason })
    });
    setMsg(res.ok ? "Appeal submitted" : "Error");
  }

  return (
    <Card>
      <SectionTitle>Appeal Decision</SectionTitle>
      <textarea className="border w-full px-2 py-1" rows={4} placeholder="Explain why you appeal..." value={reason} onChange={e=>setReason(e.target.value)} />
      <div className="mt-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={submit}>Submit Appeal</button>
      </div>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </Card>
  );
}
