"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, SectionTitle } from "../UiPrimitives";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then(m => m.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });

export default function ForecastTrendGraph() {
const [data, setData] = useState<any[]>([]);

useEffect(() => {
(async () => {
const res = await fetch("/api/forecast/trend?horizon=30");
if (!res.ok) return;
const json = await res.json();
setData(json?.series ?? []);
})();
}, []);

return (

Forecast Trend
<div style={{ width: "100%", height: 260 }}>











);
}