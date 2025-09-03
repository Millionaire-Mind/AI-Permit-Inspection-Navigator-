"use client";
import { useEffect, useState } from "react";

export function ForecastLogCard() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/audit/forecast-log", { headers: { "x-user-role": "admin" } })
      .then((r) => r.json())
      .then(setLogs);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Forecast Runs</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Time</th>
            <th className="p-2">Scheduled Tasks</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b">
              <td className="p-2">{new Date(log.triggeredAt).toLocaleString()}</td>
              <td className="p-2">{Array.isArray(log.results) ? log.results.length : 0} scheduled</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
