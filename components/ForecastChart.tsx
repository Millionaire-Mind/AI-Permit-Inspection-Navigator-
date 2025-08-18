"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import { Card, SectionTitle } from "./UiPrimitives";

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
        const date = (json.forecast[i] ?? {}).date;
        if (!date) return;
        const row = map.get(date) ?? { date };
        row.lower = b.value;
        map.set(date, row);
      });
      (json.upper || []).forEach((b: any, i: number) => {
        const date = (json.forecast[i] ?? {}).date;
        if (!date) return;
        const row = map.get(date) ?? { date };
        row.upper = b.value;
        map.set(date, row);
      });
      map.forEach(v => rows.push(v));
      rows.sort((a,b) => a.date.localeCompare(b.date));
      setSeries(rows);
    })();
  }, []);

  return (
    <Card>
      <SectionTitle>Appeal Forecast (with Uncertainty)</SectionTitle>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={series}>
            <defs>
              <linearGradient id="range" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="upper" stroke="#60a5fa" fillOpacity={0} />
            <Area type="monotone" dataKey="lower" stroke="#60a5fa" fillOpacity={1} fill="url(#range)" />
            <Line type="monotone" dataKey="history" stroke="#111827" dot={false} />
            <Line type="monotone" dataKey="forecast" stroke="#2563eb" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
