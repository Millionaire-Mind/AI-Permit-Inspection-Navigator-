import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function updateSchedule(formData: FormData) {
  'use server';
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') throw new Error('forbidden');
  const enabled = formData.get('enabled') === 'on';
  const costAware = formData.get('costAware') === 'on';
  const intervalHours = Number(formData.get('intervalHours') || 24);
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/retrain/schedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled, costAware, intervalHours })
  });
}

async function fetchSchedule() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/retrain/schedule`, { cache: 'no-store' });
  if (!res.ok) return { enabled: false, costAware: false, intervalHours: 24 };
  return res.json();
}

export default async function RetrainSchedulerPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') return null;
  const sched: any = await fetchSchedule();

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Retrain Scheduler</h1>
      <form action={updateSchedule} className="space-y-4 border rounded p-4 bg-white">
        <div className="flex items-center gap-2">
          <input type="checkbox" name="enabled" defaultChecked={!!sched.enabled} />
          <label className="text-sm">Enable scheduled retraining</label>
        </div>
        <div>
          <label className="text-sm block mb-1">Interval (hours)</label>
          <input type="number" name="intervalHours" defaultValue={sched.intervalHours ?? 24} min={1} className="border px-2 py-1 rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="costAware" defaultChecked={!!sched.costAware} />
          <label className="text-sm">Cost-aware mode (only run when compute costs are low)</label>
        </div>
        <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
      </form>
    </div>
  );
}