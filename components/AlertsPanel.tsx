"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

export default function AlertsPanel() {
  const [rules, setRules] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => { fetch("/api/alerts/rules").then(r=>r.json()).then(j=>setRules(j.rules || [])); }, []);

  async function run() {
    const res = await fetch("/api/alerts/run", { method: "POST" });
    const json = await res.json();
    setMessage(`Triggered: ${json.created ?? 0} events`);
  }

  return (
    <Card>
      <SectionTitle>Alerts</SectionTitle>
      <div className="text-sm">Active Rules: {rules.length}</div>
      <button className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded" onClick={run}>Run Sweep</button>
      {message && <div className="text-sm mt-2">{message}</div>}
    </Card>
  );
}
