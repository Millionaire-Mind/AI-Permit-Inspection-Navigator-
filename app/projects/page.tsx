"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const json = await res.json();
    setProjects(json.projects || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      {loading ? <div>Loading…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="border rounded p-4 bg-white">
              <div className="font-medium">{p.name || `Project ${p.id.slice(0,8)}`}</div>
              <div className="text-sm text-gray-600">Jurisdiction: {p.jurisdictionId || "—"}</div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-sm text-gray-600">No projects yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

