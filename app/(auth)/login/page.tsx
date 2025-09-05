"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) window.location.href = "/dashboard";
    else alert("Invalid credentials");
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={login} className="space-y-3">
        <div className="flex flex-col">
          <label className="text-sm">Email</label>
          <input className="border px-2 py-1" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Password</label>
          <input type="password" className="border px-2 py-1" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">{loading?"Signing in...":"Sign in"}</button>
      </form>
      <div className="pt-2">
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="px-3 py-2 bg-red-600 text-white rounded">Continue with Google</button>
      </div>
    </main>
  );
}
