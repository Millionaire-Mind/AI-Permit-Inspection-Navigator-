import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const jobs = await (prisma as any).retrainJob.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ jobs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || (session.user.role ?? '').toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json().catch(() => ({}));
    const modelName = String(body.modelName || 'primary');
    const metadata = body.metadata || {};

    const job = await (prisma as any).retrainJob.create({ data: { requestedBy: session.user.id, status: 'QUEUED', modelName, metadata } });

    // Fire-and-forget external trigger
    const endpoint = process.env.RETRAIN_ENDPOINT_URL;
    const apiKey = process.env.RETRAIN_ENDPOINT_API_KEY;

    if (!endpoint) {
      return NextResponse.json({ job, warning: 'RETRAIN_ENDPOINT_URL not set' }, { status: 202 });
    }

    // Immediately mark TRAINING, then update based on response
    await (prisma as any).retrainJob.update({ where: { id: job.id }, data: { status: 'TRAINING' } });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({ jobId: job.id, modelName, metadata }),
        // You can add timeout signal here if needed
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({} as any));
      await (prisma as any).retrainJob.update({ where: { id: job.id }, data: { status: 'COMPLETED', metadata: { ...metadata, response: data } } });
      return NextResponse.json({ jobId: job.id, status: 'COMPLETED' }, { status: 200 });
    } catch (err: any) {
      await (prisma as any).retrainJob.update({ where: { id: job.id }, data: { status: 'FAILED', metadata: { ...metadata, error: String(err?.message || err) } } });
      return NextResponse.json({ jobId: job.id, status: 'FAILED', error: String(err?.message || err) }, { status: 502 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}