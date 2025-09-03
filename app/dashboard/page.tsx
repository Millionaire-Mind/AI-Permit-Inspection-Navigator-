"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReportForm from "@/components/ReportForm";
import Link from "next/link";

type Report = { id: string; address: string | null; status: string; createdAt: string };

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) return;
        const json = await res.json();
        setReports(json.reports ?? []);
      } catch {}
    })();
  }, []);

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <Sidebar />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ReportForm />
        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Reports</h2>
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="border rounded px-3 py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.address ?? "(no address)"}</div>
                  <div className="text-sm text-gray-600">{r.status} · {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <Link className="text-blue-600" href={`/dashboard/reports/${r.id}`}>View</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
