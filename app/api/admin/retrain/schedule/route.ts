import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const sched = await (prisma as any).retrainSchedule.findUnique({ where: { id: 'default' } });
  return NextResponse.json(sched ?? { id: 'default', enabled: false, intervalHours: 24, costAware: false });
}

export async function PUT(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const json = await req.json().catch(() => ({}));
  const { enabled, intervalHours, cronExpr, costAware } = json;
  const data: any = {};
  if (typeof enabled === 'boolean') data.enabled = enabled;
  if (typeof intervalHours === 'number') data.intervalHours = intervalHours;
  if (typeof cronExpr === 'string') data.cronExpr = cronExpr;
  if (typeof costAware === 'boolean') data.costAware = costAware;
  const sched = await (prisma as any).retrainSchedule.upsert({ where: { id: 'default' }, update: data, create: { id: 'default', enabled: true, intervalHours: 24, costAware: false, ...data } });
  return NextResponse.json(sched);
}