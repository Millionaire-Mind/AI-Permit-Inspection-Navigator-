import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const anyDb: any = prisma as any;
  const row = await anyDb.onboardingChecklist.findUnique({ where: { userId: session.user.id } });
  const value = row ?? { userId: session.user.id, completeProfile: false, createFirstProject: false, exploreDashboard: false };
  const done = value.completeProfile && value.createFirstProject && value.exploreDashboard;
  return NextResponse.json({ ...value, done });
}

export async function PUT(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const json = await req.json().catch(() => ({}));
  const data: any = {};
  for (const key of ['completeProfile', 'createFirstProject', 'exploreDashboard'] as const) {
    if (typeof json[key] === 'boolean') data[key] = json[key];
  }
  const anyDb: any = prisma as any;
  const existing = await anyDb.onboardingChecklist.findUnique({ where: { userId: session.user.id } });
  const saved = existing
    ? await anyDb.onboardingChecklist.update({ where: { userId: session.user.id }, data })
    : await anyDb.onboardingChecklist.create({ data: { userId: session.user.id, ...data } });
  const done = saved.completeProfile && saved.createFirstProject && saved.exploreDashboard;
  return NextResponse.json({ ...saved, done });
}