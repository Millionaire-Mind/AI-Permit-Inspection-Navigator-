"use client";
import { useEffect, useState } from "react";

export default function ModelCanary() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/ml/retrain/status", { headers: { "x-user-role": "admin" } })
      .then((r) => r.json())
      .then(setJobs);
  }, []);

  async function deployCanary(modelVersion: string) {
    if (!confirm(`Deploy ${modelVersion} to canary?`)) return;
    const res = await fetch("/api/ml/model/canary", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": "admin" }, body: JSON.stringify({ modelVersion }) });
    const json = await res.json();
    if (res.ok) alert("Canary deployed");
    else alert("Error: " + JSON.stringify(json));
  }

  async function promoteProduction(modelVersion: string) {
    if (!confirm(`Promote ${modelVersion} to PRODUCTION?`)) return;
    const res = await fetch("/api/ml/model/promote", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": "admin" }, body: JSON.stringify({ modelVersion, approve: true }) });
    const json = await res.json();
    if (res.ok) alert("Promoted to production");
    else alert("Promote failed: " + JSON.stringify(json));
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Model Canary & Promotion</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Retrain Jobs</h2>
          <div className="space-y-2">
            {jobs.map((j) => {
              const tr = j.metadata?.trainingResult || {};
              const validation = tr.validation || {};
              return (
                <div key={j.id} className="border rounded p-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{tr.modelVersion ?? "—"}</div>
                      <div className="text-xs text-gray-500">Job: {j.id.slice(0, 8)} • Samples: {j.sampleCount}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => setSelected(j)} className="px-2 py-1 border rounded text-sm">View</button>
                      <button onClick={() => deployCanary(tr.modelVersion)} className="px-2 py-1 bg-yellow-100 rounded text-sm">Deploy Canary</button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">Validation F1: {typeof validation.f1 === "number" ? validation.f1.toFixed(3) : "-"}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Canary / Production Controls</h2>
          <p className="text-sm text-gray-600 mb-3">Select a retrain job above and deploy a canary model, then promote to production after validation checks.</p>
          {selected ? (
            <div className="border rounded p-3">
              <div className="mb-2"><strong>Job:</strong> {selected.id}</div>
              <div className="mb-2"><strong>Model:</strong> {selected.metadata?.trainingResult?.modelVersion}</div>
              <div className="mb-2"><strong>Validation:</strong>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1">{JSON.stringify(selected.metadata?.trainingResult?.validation, null, 2)}</pre>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => deployCanary(selected.metadata?.trainingResult?.modelVersion)} className="px-3 py-1 bg-yellow-500 text-white rounded">Deploy Canary</button>
                <button onClick={() => promoteProduction(selected.metadata?.trainingResult?.modelVersion)} className="px-3 py-1 bg-green-600 text-white rounded">Promote to Production</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Pick a retrain job to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
