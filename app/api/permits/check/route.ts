import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkProjectPermits } from '@/lib/permitEngine';
import { CheckPermitsSchema, CheckPermitsResponseSchema } from '@/types/api/permits';

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = CheckPermitsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { projectId } = parsed.data;

  try {
    const result = await checkProjectPermits(projectId);
    const validated = CheckPermitsResponseSchema.safeParse(result);
    if (!validated.success) {
      return NextResponse.json({ error: 'Internal response validation failed' }, { status: 500 });
    }
    return NextResponse.json(validated.data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
