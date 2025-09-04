"use client";
import { useEffect, useState } from "react";

export default function AdminBillingPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/admin/billing", { headers: { "x-user-role": "admin" } });
      const json = await res.json();
      setRows(json.items || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Billing Oversight</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Status</th>
                <th className="p-2">Plan</th>
                <th className="p-2">Renews</th>
                <th className="p-2">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.userId} className="border-b">
                  <td className="p-2">{r.name || "—"}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.customerId || "—"}</td>
                  <td className="p-2">{r.status || "inactive"}</td>
                  <td className="p-2">{r.planId || "—"}</td>
                  <td className="p-2">{r.currentPeriodEnd ? new Date(r.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                  <td className="p-2">{r.invoiceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

