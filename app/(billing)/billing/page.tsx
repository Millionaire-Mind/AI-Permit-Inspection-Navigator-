"use client";
import { useState, useEffect } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState<string>("");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/billing/summary");
      if (res.ok) setSummary(await res.json());
    })();
  }, []);

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
      {summary && (
        <div className="border rounded p-3">
          <div className="text-sm">Plan: {summary.subscription?.planId ?? "—"}</div>
          <div className="text-sm">Status: {summary.subscription?.status ?? "inactive"}</div>
          <div className="text-sm">Renews: {summary.subscription?.currentPeriodEnd ? new Date(summary.subscription.currentPeriodEnd).toLocaleString() : "—"}</div>
          <div className="mt-2 text-sm font-medium">Recent Invoices</div>
          <ul className="list-disc pl-5 text-sm">
            {(summary.invoices ?? []).slice(0,5).map((i: any) => (
              <li key={i.stripeInvoiceId}><a href={i.hostedInvoiceUrl} className="text-blue-600 underline">{i.amountTotal/100} {i.currency?.toUpperCase()} - {i.status}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-x-3">
        <button onClick={goCheckout} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={!!loading}>{loading==="checkout"?"Redirecting...":"Subscribe"}</button>
        <button onClick={goPortal} className="px-4 py-2 border rounded" disabled={!!loading}>{loading==="portal"?"Opening...":"Manage Subscription"}</button>
      </div>
    </div>
  );
}

