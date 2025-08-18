import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AIPerformanceDashboard() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>({ start: null, end: null });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  async function fetchData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateRange.start && dateRange.end) {
      params.append("start", dateRange.start.toISOString());
      params.append("end", dateRange.end.toISOString());
    }
    const res = await fetch(`/api/moderation/ai-feedback/list?${params.toString()}`, { headers: { "x-user-role": "admin" } });
    const data = await res.json();
    setFeedback(data);
    setLoading(false);
  }

  const chartData = [
    { name: "Accepted", count: feedback.filter((f) => f.accepted).length },
    { name: "Rejected", count: feedback.filter((f) => !f.accepted).length }
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">AI Performance Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Suggestion Acceptance Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Detailed Feedback Logs</h2>
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-sm">
            <thead><tr><th>Appeal ID</th><th>Accepted</th><th>Moderator</th><th>Comments</th><th>Date</th></tr></thead>
            <tbody>
              {feedback.map((f) => (
                <tr key={f.id}>
                  <td>{f.appealId}</td>
                  <td>{f.accepted ? "✅" : "❌"}</td>
                  <td>{f.moderatorId}</td>
                  <td>{f.comments || "-"}</td>
                  <td>{new Date(f.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
