"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("system");
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="border rounded p-4 bg-white space-y-3 max-w-xl">
        <label className="block text-sm">
          <span className="text-gray-700">Email</span>
          <input className="border rounded px-3 py-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)} />
          <span>Enable notifications</span>
        </label>
        <label className="block text-sm">
          <span className="text-gray-700">Theme</span>
          <select className="border rounded px-3 py-2 w-full" value={theme} onChange={e=>setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

