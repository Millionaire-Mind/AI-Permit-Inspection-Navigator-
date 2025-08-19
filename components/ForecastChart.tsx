"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, SectionTitle } from "./UiPrimitives";

// Dynamically import Recharts pieces so they only load on the client
const ResponsiveContainer = dynamic(
() => import("recharts").then(m => m.ResponsiveContainer),
{ ssr: false }
);
const AreaChart = dynamic(
() => import("recharts").then(m => m.AreaChart),
{ ssr: false }
);
const Area = dynamic(
() => import("recharts").then(m => m.Area),
{ ssr: false }
);
const CartesianGrid = dynamic(
() => import("recharts").then(m => m.CartesianGrid),
{ ssr: false }
);
const XAxis = dynamic(
() => import("recharts").then(m => m.XAxis),
{ ssr: false }
);
const YAxis = dynamic(
() => import("recharts").then(m => m.YAxis),
{ ssr: false }
);
const Tooltip = dynamic(
() => import("recharts").then(m => m.Tooltip),
{ ssr: false }
);
const Legend = dynamic(
() => import("recharts").then(m => m.Legend),
{ ssr: false }
);
const Line = dynamic(
() => import("recharts").then(m => m.Line),
{ ssr: false }
);

export default function ForecastChart() {
const [series, setSeries] = useState<any[]>([]);

useEffect(() => {
(async () => {
const res = await fetch("/api/forecast/appeals?horizon=14");
const json = await res.json();
const rows: any[] = [];
const map = new Map<string, any>();

  (json.history || []).forEach((h: any) => map.set(h.date, { date: h.date, history: h.value }));

  (json.forecast || []).forEach((f: any) => {
    const row = map.get(f.date) ?? { date: f.date };
    row.forecast = f.value;
    map.set(f.date, row);
  });

  (json.lower || []).forEach((b: any, i: number) => {
    const date = (json.forecast?.[i] ?? {}).date;
    if (!date) return;
    const row = map.get(date) ?? { date };
    row.lower = b.value;
    map.set(date, row);
  });

  (json.upper || []).forEach((b: any, i: number) => {
    const date = (json.forecast?.[i] ?? {}).date;
    if (!date) return;
    const row = map.get(date) ?? { date };
    row.upper = b.value;
    map.set(date, row);
  });

  map.forEach(v => rows.push(v));
  rows.sort((a, b) => a.date.localeCompare(b.date));
  setSeries(rows);
})();
}, []);

return (

Appeal Forecast (with Uncertainty)
<div style={{ width: "100%", height: 300 }}>





















);
}