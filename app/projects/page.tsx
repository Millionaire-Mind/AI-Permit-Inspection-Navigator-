"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProjectsPage() {
  return <ClientProjects />;
}

function ClientProjects() {
  type Project = {
    id: string;
    title: string;
    description?: string | null;
    location?: string | null;
  };
  const [projects, setProjects] = useState<Project[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch projects logic here
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects ?? []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (session) {
      fetchProjects();
    }
  }, [session]);

  if (!session) {
    return <div>Please log in to view projects.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p>No projects found. Create your first project!</p>
        ) : (
          projects.map((project: Project) => (
            <div key={project.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">{project.location}</p>
            </div>
          ))
        )}
      </div>
      
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={async () => {
          try {
            const payload = {
              title: `New Project ${new Date().toLocaleString()}`,
              description: 'Created from Projects page',
              location: 'Unknown',
            };
            const res = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              console.error('Failed to create project');
              return;
            }
            const { project } = await res.json();
            setProjects((prev: Project[]) => [project as Project, ...prev]);
          } catch (e) {
            console.error('Error creating project:', e);
          }
        }}
      >
        New Project
      </button>
    </div>
  );
}
