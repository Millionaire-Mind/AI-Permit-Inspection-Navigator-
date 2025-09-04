"use client";
import { useEffect, useState } from "react";

type Rule = { id?: string; scope?: string; scopeRef?: string | null; kind?: string; threshold?: number; windowHours?: number; active?: boolean };

export default function AlertsEditor() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState<Rule>({ scope: "global", scopeRef: null, kind: "forecast_spike", threshold: 0.2, windowHours: 24, active: true });

  async function load() {
    const res = await fetch("/api/alerts/rules", { headers: { "x-user-role": "admin" } });
    const json = await res.json();
    setRules(json.rules || []);
  }

  useEffect(() => { load(); }, []);

  async function createRule() {
    await fetch("/api/alerts/rules", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": "admin" }, body: JSON.stringify(form) });
    await load();
  }

  async function updateRule(rule: Rule) {
    await fetch("/api/alerts/rules", { method: "PUT", headers: { "Content-Type": "application/json", "x-user-role": "admin" }, body: JSON.stringify(rule) });
    await load();
  }

  async function deleteRule(id?: string) {
    if (!id) return;
    await fetch(`/api/alerts/rules?id=${id}`, { method: "DELETE", headers: { "x-user-role": "admin" } });
    await load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Alerts - Rules Editor</h1>
      <div className="border rounded p-3 space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <input className="border px-2 py-1" placeholder="scope" value={form.scope ?? ""} onChange={e=>setForm(f=>({...f, scope: e.target.value}))} />
          <input className="border px-2 py-1" placeholder="scopeRef" value={form.scopeRef ?? ""} onChange={e=>setForm(f=>({...f, scopeRef: e.target.value || null}))} />
          <input className="border px-2 py-1" placeholder="kind" value={form.kind ?? ""} onChange={e=>setForm(f=>({...f, kind: e.target.value}))} />
          <input className="border px-2 py-1" placeholder="threshold" type="number" step="0.01" value={form.threshold ?? 0} onChange={e=>setForm(f=>({...f, threshold: Number(e.target.value)}))} />
          <input className="border px-2 py-1" placeholder="windowHours" type="number" value={form.windowHours ?? 0} onChange={e=>setForm(f=>({...f, windowHours: Number(e.target.value)}))} />
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={createRule}>Add Rule</button>
        </div>
      </div>

      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Scope</th>
            <th className="p-2">Ref</th>
            <th className="p-2">Kind</th>
            <th className="p-2">Threshold</th>
            <th className="p-2">Window (h)</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.scope}</td>
              <td className="p-2">{r.scopeRef ?? "—"}</td>
              <td className="p-2">{r.kind}</td>
              <td className="p-2">{r.threshold}</td>
              <td className="p-2">{r.windowHours}</td>
              <td className="p-2">{String(r.active ?? true)}</td>
              <td className="p-2 space-x-2">
                <button className="px-2 py-1 border rounded text-sm" onClick={()=>updateRule({ ...r, active: !(r.active ?? true) })}>{(r.active ?? true) ? "Disable" : "Enable"}</button>
                <button className="px-2 py-1 border rounded text-sm" onClick={()=>deleteRule(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

