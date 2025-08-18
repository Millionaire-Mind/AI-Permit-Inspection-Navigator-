"use client";

import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("user");

  async function setCookie() {
    await fetch("/logout", { method: "POST" }); // clear any
    document.cookie = `role=${role}; path=/;`;
    window.location.href = "/dashboard";
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Login (Demo)</h1>
      <p>Pick a role to simulate auth. You can later swap to Supabase/Auth0.</p>
      <select value={role} onChange={e => setRole(e.target.value)} className="border px-2 py-1">
        <option value="user">user</option>
        <option value="moderator">moderator</option>
        <option value="admin">admin</option>
      </select>
      <div>
        <button onClick={setCookie} className="px-3 py-2 bg-blue-600 text-white rounded">Continue</button>
      </div>
    </main>
  );
}
