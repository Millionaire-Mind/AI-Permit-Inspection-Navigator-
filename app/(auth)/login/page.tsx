"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.ok) {
      router.replace(res.url ?? callbackUrl);
    } else {
      setError(res?.error ?? "Invalid credentials");
    }
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
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
    </main>
  );
}
