"use client";

import { useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

export default function ReportForm() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ userId: "demo-user", address })
    });
    setStatus(res.ok ? "Created" : "Error");
  }

  return (
    <Card>
      <SectionTitle>Create Report</SectionTitle>
      <div className="space-y-2">
        <input className="border w-full px-2 py-1" placeholder="Project address" value={address} onChange={e=>setAddress(e.target.value)} />
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={submit}>Submit</button>
        {status && <div className="text-sm text-gray-700">Status: {status}</div>}
      </div>
    </Card>
  );
}
