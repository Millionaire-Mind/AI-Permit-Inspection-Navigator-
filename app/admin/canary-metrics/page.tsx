import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false });

async function fetchMetrics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/metrics/canary`, { cache: 'no-store' });
  if (!res.ok) return { cost: [], sla: [], retrain: [] };
  return res.json();
}

export default async function CanaryMetricsPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') return null;

  const data = await fetchMetrics();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Canary Metrics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded p-4 bg-white">
          <div className="font-semibold mb-2">Estimated Inference Cost (last 30 days)</div>
          <LineChart width={520} height={260} data={data.cost}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#2563eb" dot={false} />
          </LineChart>
        </div>
        <div className="border rounded p-4 bg-white">
          <div className="font-semibold mb-2">SLA Signals (tasks created)</div>
          <LineChart width={520} height={260} data={data.sla}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="openTasks" stroke="#16a34a" dot={false} />
          </LineChart>
        </div>
      </div>
      <div className="border rounded p-4 bg-white">
        <div className="font-semibold mb-2">Recent Retrain Jobs</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-1">Job ID</th>
              <th className="py-1">Status</th>
              <th className="py-1">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.retrain.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="py-1">{r.id.slice(0,8)}…</td>
                <td className="py-1">{r.status}</td>
                <td className="py-1">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}