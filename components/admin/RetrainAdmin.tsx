"use client";
import { useEffect, useState } from "react";

export default function RetrainAdmin() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  async function fetchJobs() {
    const res = await fetch("/api/ml/retrain/status", { headers: { "x-user-role": "admin" } });
    const json = await res.json();
    setJobs(json);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function trigger() {
    setRunning(true);
    const res = await fetch("/api/ml/retrain/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "admin" },
      body: JSON.stringify({ triggeredBy: "admin_ui" })
    });
    const json = await res.json();
    setRunning(false);
    fetchJobs();
    alert("Retrain scheduled: " + JSON.stringify(json));
  }

  async function openJobDetails(jobId: string) {
    const res = await fetch(`/api/ml/retrain/job/${jobId}`, { headers: { "x-user-role": "admin" } });
    const json = await res.json();
    setSelectedJob(json);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Model Retrain Admin</h1>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={trigger} disabled={running} className="px-4 py-2 bg-blue-600 text-white rounded">{running ? "Scheduling..." : "Schedule Retrain Now"}</button>
        <button onClick={fetchJobs} className="px-3 py-2 border rounded">Refresh</button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left">
            <th className="p-2">Job ID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Samples</th>
            <th className="p-2">Model Version</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => {
            const trainingResult = j.metadata?.trainingResult || {};
            return (
              <tr key={j.id} className="border-t">
                <td className="p-2">{j.id.slice(0, 8)}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">{j.sampleCount}</td>
                <td className="p-2">{trainingResult.modelVersion ?? "-"}</td>
                <td className="p-2">{new Date(j.createdAt).toLocaleString()}</td>
                <td className="p-2"><button onClick={() => openJobDetails(j.id)} className="px-2 py-1 border rounded text-sm">Details</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold">Job Details: {selectedJob.id}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <p><strong>Status:</strong> {selectedJob.status}</p>
              <p><strong>Samples:</strong> {selectedJob.sampleCount}</p>
              <hr className="my-3" />
              <h3 className="font-medium">Training Result</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(selectedJob.metadata?.trainingResult, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
