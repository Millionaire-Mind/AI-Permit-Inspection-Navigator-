import { prisma } from '@/lib/prisma';

export async function logJobFailure(jobName: string, error: any, metadata?: Record<string, any>) {
  const message = typeof error === 'string' ? error : (error?.message ?? String(error));
  const anyDb: any = prisma as any;
  try {
    if (anyDb.jobFailureLog?.create) {
      await anyDb.jobFailureLog.create({ data: { jobName, error: message, metadata: metadata ?? null } });
    }
  } catch (e) {
    console.error('[jobFailureLog] failed to persist', e);
  }
}

export async function withRetry<T>(jobName: string, fn: () => Promise<T>, opts: { retries?: number; delayMs?: number; backoffFactor?: number } = {}): Promise<T> {
  const retries = opts.retries ?? 3;
  const delayMs = opts.delayMs ?? 500;
  const backoff = opts.backoffFactor ?? 2;
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      await logJobFailure(jobName, e, { attempt });
      if (attempt === retries) break;
      const wait = delayMs * Math.pow(backoff, attempt);
      await new Promise(r => setTimeout(r, wait));
      attempt++;
    }
  }
  throw lastErr;
}