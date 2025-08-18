"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

export default function ReportTimeline({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/reports/${reportId}`).then(r=>r.json()).then(setReport);
  }, [reportId]);

  if (!report) return <div>Loading timeline…</div>;

  const r = report.report;
  return (
    <Card>
      <SectionTitle>Timeline</SectionTitle>
      <div className="text-sm">Report: {r.id} — Status: {r.status}</div>
      <ul className="mt-2 space-y-2">
        {r.moderations.map((m: any) => (
          <li key={m.id} className="border rounded p-2">
            <div><b>Action:</b> {m.action} <span className="text-gray-600">({new Date(m.createdAt).toLocaleString()})</span></div>
            {m.note && <div className="text-sm text-gray-700">{m.note}</div>}
          </li>
        ))}
        {r.appeals.map((a: any) => (
          <li key={a.id} className="border rounded p-2">
            <div><b>Appeal:</b> {a.status} <span className="text-gray-600">({new Date(a.createdAt).toLocaleString()})</span></div>
            <div className="text-sm">{a.reason}</div>
            {a.notes?.length ? <div className="text-xs text-gray-600 mt-1">Notes: {a.notes.map((n:any)=>n.content).join("; ")}</div> : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
