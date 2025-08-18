import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export function ForecastTrendGraph() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/audit/forecast-trend", { headers: { "x-user-role": "admin" } })
      .then((r) => r.json())
      .then((d) => setData(d.map((x: any) => ({ date: new Date(x.date).toLocaleDateString(), count: x.count }))));
  }, []);
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Historical Forecast Volume</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
