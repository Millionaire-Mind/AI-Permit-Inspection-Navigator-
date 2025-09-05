"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "./UiPrimitives";

type Item = {
  id: string;
  title: string;
  at: string;
  status?: string;
  description?: string;
};

export default function InspectionsTimeline() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Placeholder: In future, fetch from /api/inspections timeline
    setItems([
      { id: "1", title: "Rough electrical inspection", at: new Date().toISOString(), status: "Scheduled", description: "Unit A, panel #2" },
      { id: "2", title: "Framing inspection", at: new Date(Date.now() - 86400000).toISOString(), status: "Passed", description: "Main structure" },
      { id: "3", title: "Mechanical inspection", at: new Date(Date.now() - 2*86400000).toISOString(), status: "Failed", description: "Vent duct clearance" },
    ]);
  }, []);

  return (
    <Card>
      <SectionTitle>Inspections Timeline</SectionTitle>
      <ul className="mt-2 space-y-2">
        {items.map((i) => (
          <li key={i.id} className="border rounded p-2 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{i.title}</div>
              <div className="text-gray-600">{new Date(i.at).toLocaleString()}</div>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">{i.description || ""}</div>
            {i.status && <div className="text-xs mt-1">Status: {i.status}</div>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

