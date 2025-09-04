"use client";

import { useEffect, useMemo, useState } from "react";

export type AdminFilters = {
  userId?: string;
  status?: string;
  slaBreachOnly?: boolean;
  from?: string;
  to?: string;
};

export default function AdminFilters({ onChange }: { onChange?: (f: AdminFilters) => void }) {
  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [slaBreachOnly, setSlaBreachOnly] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filters = useMemo<AdminFilters>(() => ({
    userId: userId.trim() || undefined,
    status: status === "all" ? undefined : status,
    slaBreachOnly,
    from: from || undefined,
    to: to || undefined,
  }), [userId, status, slaBreachOnly, from, to]);

  useEffect(() => { onChange?.(filters); }, [filters, onChange]);

  return (
    <div className="border rounded p-3 bg-white">
      <div className="font-semibold mb-2">Filters</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
        <label className="block">
          <div className="text-gray-600 mb-1">User ID</div>
          <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="optional" className="border w-full px-2 py-1 rounded" />
        </label>
        <label className="block">
          <div className="text-gray-600 mb-1">Status</div>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="border w-full px-2 py-1 rounded">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="block">
          <div className="text-gray-600 mb-1">From</div>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border w-full px-2 py-1 rounded" />
        </label>
        <label className="block">
          <div className="text-gray-600 mb-1">To</div>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border w-full px-2 py-1 rounded" />
        </label>
        <label className="flex items-end gap-2">
          <input id="slaOnly" type="checkbox" checked={slaBreachOnly} onChange={e=>setSlaBreachOnly(e.target.checked)} />
          <span className="text-gray-800">SLA Breaches only</span>
        </label>
      </div>
    </div>
  );
}

