"use client";
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

type State = {
  completeProfile: boolean;
  createFirstProject: boolean;
  exploreDashboard: boolean;
  done: boolean;
};

export default function OnboardingChecklist() {
  const [state, setState] = useState<State | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/onboarding');
    if (res.ok) setState(await res.json());
  }

  async function save(patch: Partial<State>) {
    setSaving(true);
    const res = await fetch('/api/onboarding', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    setSaving(false);
    if (res.ok) setState(await res.json());
  }

  useEffect(() => { load(); }, []);

  if (!state || state.done) return null;

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Getting Started</h2>
        <div className="text-xs text-gray-600">{[state.completeProfile, state.createFirstProject, state.exploreDashboard].filter(Boolean).length}/3</div>
      </div>
      <Alert variant="info">
        Complete these steps to get the most out of PermitIQ.
      </Alert>
      <ul className="mt-3 space-y-2">
        <li className="flex items-center justify-between">
          <div>
            <input type="checkbox" checked={state.completeProfile} onChange={e => save({ completeProfile: e.target.checked })} className="mr-2" />
            <span className="text-sm">Complete your profile</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => (window.location.href = '/settings')}>Open</Button>
        </li>
        <li className="flex items-center justify-between">
          <div>
            <input type="checkbox" checked={state.createFirstProject} onChange={e => save({ createFirstProject: e.target.checked })} className="mr-2" />
            <span className="text-sm">Create your first project</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => (window.location.href = '/projects')}>New Project</Button>
        </li>
        <li className="flex items-center justify-between">
          <div>
            <input type="checkbox" checked={state.exploreDashboard} onChange={e => save({ exploreDashboard: e.target.checked })} className="mr-2" />
            <span className="text-sm">Explore the dashboard</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => save({ exploreDashboard: true })}>Mark Done</Button>
        </li>
      </ul>
    </div>
  );
}