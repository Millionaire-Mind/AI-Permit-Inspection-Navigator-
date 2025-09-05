"use client";
import { useState, useEffect } from "react";

const plans = [
  { id: "price_monthly", name: "Pro Monthly", price: "$29", cycle: "/month", features: ["Unlimited projects", "Priority support", "Exports" ] },
  { id: "price_yearly", name: "Pro Yearly", price: "$290", cycle: "/year", badge: "2 months free", features: ["Unlimited projects", "Priority support", "Exports" ] },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string>("");
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/billing/summary");
      if (res.ok) {
        const json = await res.json();
        setSub(json.subscription || null);
      }
    })();
  }, []);

  async function goCheckout(priceId?: string) {
    setLoading(priceId || "checkout");
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const json = await res.json();
    setLoading("");
    if (json.url) window.location.href = json.url;
  }

  async function managePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: sub?.stripeCustomerId }) });
    const json = await res.json();
    setLoading("");
    if (json.url) window.location.href = json.url;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="text-gray-600">Simple pricing for growing teams</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(p => (
          <div key={p.id} className="border rounded-lg p-6 shadow-sm bg-white">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              {p.badge && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{p.badge}</span>}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{p.price}</span>
              <span className="text-gray-500">{p.cycle}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
              {p.features.map((f) => (<li key={f}>{f}</li>))}
            </ul>
            <div className="mt-6">
              {sub?.status && sub.status !== 'canceled' ? (
                <button onClick={managePortal} className="w-full px-4 py-2 border rounded" disabled={!!loading}>
                  {loading === 'portal' ? 'Opening…' : 'Manage Subscription'}
                </button>
              ) : (
                <button onClick={() => goCheckout(p.id)} className="w-full px-4 py-2 bg-indigo-600 text-white rounded" disabled={!!loading}>
                  {loading === p.id ? 'Redirecting…' : 'Get Started'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}