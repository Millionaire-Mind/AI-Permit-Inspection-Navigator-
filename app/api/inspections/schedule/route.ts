import { NextResponse } from 'next/server';
import { BuildInspectionPlanSchema, BuildInspectionPlanResponseSchema } from '@/types/api/inspections';
import { buildInspectionPlan } from '@/lib/permitEngine';

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = BuildInspectionPlanSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { projectId } = parsed.data;

  try {
    const result = await buildInspectionPlan(projectId);
    const validated = BuildInspectionPlanResponseSchema.safeParse(result);
    if (!validated.success) {
      return NextResponse.json({ error: 'Internal response validation failed' }, { status: 500 });
    }
    return NextResponse.json(validated.data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
