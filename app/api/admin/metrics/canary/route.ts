import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const client: any = prisma as any;
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

  // Cost estimation from forecast logs (predicted * tokens_per_req * price)
  const tokensPerReq = Number(process.env.INFERENCE_TOKENS_PER_REQ || 1000);
  const pricePer1k = Number(process.env.INFERENCE_PRICE_PER_1K || 0.002);

  const logs = client.forecastLog?.findMany ? await client.forecastLog.findMany({
    where: { triggeredAt: { gte: since } },
    orderBy: { triggeredAt: 'asc' },
  }) : [];

  const byDate = new Map<string, number>();
  for (const log of logs) {
    const items = Array.isArray(log.results) ? (log.results as any[]) : [];
    const totalPred = items.reduce((acc, cur) => acc + (cur.predicted || 0), 0);
    const dateStr = new Date(log.triggeredAt).toISOString().slice(0,10);
    byDate.set(dateStr, (byDate.get(dateStr) || 0) + totalPred);
  }
  const cost = Array.from(byDate.entries()).map(([date, pred]) => ({ date, cost: (pred * tokensPerReq / 1000) * pricePer1k }));

  // SLA signal: open tasks per day (approx.)
  const tasks = client.sLATask?.findMany ? await client.sLATask.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'asc' } }) : [];
  const slaMap = new Map<string, number>();
  for (const t of tasks) {
    const d = new Date(t.createdAt).toISOString().slice(0,10);
    slaMap.set(d, (slaMap.get(d) || 0) + 1);
  }
  const sla = Array.from(slaMap.entries()).map(([date, openTasks]) => ({ date, openTasks }));

  // Retrain jobs: last 20
  const retrain = client.retrainJob?.findMany ? await client.retrainJob.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }) : [];
  const retrainSeries = retrain.map((r: any) => ({ id: r.id, status: r.status ?? r.stage ?? 'UNKNOWN', createdAt: r.createdAt }));

  return NextResponse.json({ cost, sla, retrain: retrainSeries });
}