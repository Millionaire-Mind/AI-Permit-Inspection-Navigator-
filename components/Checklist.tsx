"use client";

import { useState } from "react";

export type ChecklistItem = { id: string; label: string; done?: boolean };

export default function Checklist({ items: initial }: { items: ChecklistItem[] }) {
  const [items, setItems] = useState<ChecklistItem[]>(initial);
  function toggle(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Checklist</h3>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="flex items-center gap-2 text-sm">
            <input id={i.id} type="checkbox" checked={!!i.done} onChange={() => toggle(i.id)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <label htmlFor={i.id} className={i.done?"line-through text-gray-500":""}>{i.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

