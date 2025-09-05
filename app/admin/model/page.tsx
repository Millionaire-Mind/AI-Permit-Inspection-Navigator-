import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function setActive(stage: 'primary' | 'canary') {
  'use server';
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') {
    throw new Error('Forbidden');
  }
  const client: any = prisma as any;
  if (stage === 'primary') {
    await client.productionModel.updateMany({ where: { stage: 'production' }, data: { metadata: { active: true } } });
    await client.productionModel.updateMany({ where: { stage: 'canary' }, data: { metadata: { active: false } } });
  } else {
    await client.productionModel.updateMany({ where: { stage: 'canary' }, data: { metadata: { active: true, canary: true } } });
    await client.productionModel.updateMany({ where: { stage: 'production' }, data: { metadata: { active: false } } });
  }
}

export default async function ModelAdminPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') return null;
  const client: any = prisma as any;
  const prod = await client.productionModel.findFirst({ where: { stage: 'production' } });
  const canary = await client.productionModel.findFirst({ where: { stage: 'canary' } });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Model Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="font-semibold mb-1">Production</div>
          <div className="text-sm text-gray-600">{prod?.modelVersion ?? '—'}</div>
          <form action={async () => { 'use server'; await setActive('primary'); }} className="mt-2">
            <button type="submit" className="px-3 py-2 border rounded">Set Active</button>
          </form>
        </div>
        <div className="border rounded p-4">
          <div className="font-semibold mb-1">Canary</div>
          <div className="text-sm text-gray-600">{canary?.modelVersion ?? '—'}</div>
          <form action={async () => { 'use server'; await setActive('canary'); }} className="mt-2">
            <button type="submit" className="px-3 py-2 border rounded">Set Active</button>
          </form>
        </div>
      </div>
    </div>
  );
}