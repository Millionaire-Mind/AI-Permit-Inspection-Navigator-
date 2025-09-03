"use client";
import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState<string>("");

  async function goCheckout() {
    setLoading("checkout");
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const json = await res.json();
    setLoading("");
    if (json.url) window.location.href = json.url;
  }

  async function goPortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: "replace_with_customer_id" }) });
    const json = await res.json();
    setLoading("");
    if (json.url) window.location.href = json.url;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Billing</h1>
      <div className="space-x-3">
        <button onClick={goCheckout} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={!!loading}>{loading==="checkout"?"Redirecting...":"Subscribe"}</button>
        <button onClick={goPortal} className="px-4 py-2 border rounded" disabled={!!loading}>{loading==="portal"?"Opening...":"Manage Subscription"}</button>
      </div>
    </div>
  );
}

