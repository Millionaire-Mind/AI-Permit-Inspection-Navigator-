import { prisma } from '@/lib/prisma';

/**
 * Very conservative, deterministic checker:
 * - Pulls PermitRequirement for the project's jurisdiction.
 * - Applies simple criteria (if provided) against project.params.
 * - Produces `required` / `maybe` / `not_required` decisions + confidence model.
 * - Optionally can call an LLM later for nuance (kept off by default for trust).
 */
export async function checkProjectPermits(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { jurisdiction: true },
  });
  if (!project) throw new Error('Project not found');

  const requirements = await prisma.permitRequirement.findMany({
    where: { jurisdictionId: project.jurisdictionId },
  });

  const params = ({} as Record<string, any>);
  const decisions: Array<{
    permitTypeId: string;
    status: 'required' | 'maybe' | 'not_required';
    rationale?: string;
  }> = [];

  for (const req of requirements as any[]) {
    const status = evaluateCriteria(req.criteria ?? {}, params);
    const ruleText = typeof req.rule === 'string' ? req.rule : '';
    const rationale = `Matched rule: ${ruleText.slice(0, 140)}${ruleText.length > 140 ? '…' : ''}`;
    const permitTypeId = req.permitTypeId ?? "unknown";
    decisions.push({ permitTypeId, status, rationale });
  }

  // Write/upsert decisions to ProjectPermit
  for (const d of decisions) {
    // Guard missing model in current schema
    // @ts-ignore
    if ((prisma as any).projectPermit?.upsert) {
      await (prisma as any).projectPermit.upsert({
        where: { projectId_permitTypeId: { projectId: project.id, permitTypeId: d.permitTypeId } },
        update: { status: d.status, rationale: d.rationale },
        create: { projectId: project.id, permitTypeId: d.permitTypeId, status: d.status, rationale: d.rationale },
      });
    }
  }

  // Confidence: ratio of rules with clear boolean matches (vs "maybe")
  const clearCount = decisions.filter(d => d.status !== 'maybe').length;
  const score = decisions.length ? clearCount / decisions.length : 0.6;

  let confidence: any = null;
  if ((prisma as any).confidence?.create) {
    confidence = await (prisma as any).confidence.create({
      data: {
        projectId: project.id,
        scope: 'permit_check',
        score,
        factors: {
          jurisdiction: project.jurisdiction.name,
          ruleCount: decisions.length,
          paramKeys: Object.keys(params).length,
          maybeCount: decisions.filter(d => d.status === 'maybe').length,
        },
      },
    });
  }

  return { projectId: project.id, decisions, confidence };
}

/** Simple machine-checkable criteria evaluator. Extend as needed. */
function evaluateCriteria(criteria: Record<string, any>, params: Record<string, any>) {
  // Example: { "valuationMin": 5000, "scopeIncludes": ["electrical"] }
  let votes = 0;
  let total = 0;

  if ('valuationMin' in criteria) {
    total++;
    if (Number(params.valuation ?? 0) >= Number(criteria.valuationMin)) votes++;
  }
  if ('sqftMin' in criteria) {
    total++;
    if (Number(params.sqft ?? 0) >= Number(criteria.sqftMin)) votes++;
  }
  if (Array.isArray(criteria.scopeIncludes)) {
    total++;
    const scope = String(params.scope ?? '').toLowerCase();
    const ok = (criteria.scopeIncludes as string[]).some(s => scope.includes(s.toLowerCase()));
    if (ok) votes++;
  }
  // If no criteria provided, default to "maybe" to remain conservative.
  if (total === 0) return 'maybe' as const;

  const ratio = votes / total;
  if (ratio >= 0.75) return 'required' as const;
  if (ratio <= 0.25) return 'not_required' as const;
  return 'maybe' as const;
}

export async function buildInspectionPlan(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('Project not found');

  // Derive a naive inspection plan from selected permits (you can make this smarter)
  const permits = (prisma as any).projectPermit?.findMany ? await (prisma as any).projectPermit.findMany({
    where: { projectId, status: { in: ['required', 'submitted', 'approved'] } },
    include: { permitType: true },
  }) : [];

  const items = [];
  let idx = 0;
  for (const pp of permits) {
    const t = pp.permitType.name.toLowerCase();
    if (t.includes('electrical')) {
      items.push({
        id: crypto.randomUUID(),
        type: 'Electrical Rough',
        requiredAfter: 'After rough-in wiring and prior to insulation',
        orderIndex: idx++,
        notes: 'All junction boxes must remain accessible.',
      });
      items.push({
        id: crypto.randomUUID(),
        type: 'Electrical Final',
        requiredAfter: 'After fixtures installed and before final sign-off',
        orderIndex: idx++,
        notes: 'GFCI/AFCI compliance required where applicable.',
      });
    } else if (t.includes('building') || t.includes('struct')) {
      items.push({
        id: crypto.randomUUID(),
        type: 'Framing',
        requiredAfter: 'After framing complete but before insulation/drywall',
        orderIndex: idx++,
      });
      items.push({
        id: crypto.randomUUID(),
        type: 'Final Building',
        requiredAfter: 'At project completion',
        orderIndex: idx++,
      });
    }
  }

  if (items.length === 0) {
    items.push({
      id: crypto.randomUUID(),
      type: 'Final Inspection',
      requiredAfter: 'At project completion',
      orderIndex: 0,
      notes: 'Generic final inspection when permit set is minimal.',
    });
  }

  const confidence = (prisma as any).confidence?.create ? await (prisma as any).confidence.create({
    data: {
      projectId,
      scope: 'inspection_plan',
      score: Math.min(0.9, 0.6 + items.length * 0.05),
      factors: { itemCount: items.length },
    },
  }) : null;

  // Persist generated inspections (idempotent-ish: wipe & replace for demo)
  if ((prisma as any).inspection?.deleteMany) {
    await (prisma as any).inspection.deleteMany({ where: { projectId } });
  }
  for (const item of items) {
    if ((prisma as any).inspection?.create) {
      await (prisma as any).inspection.create({
        data: {
          id: item.id,
          projectId,
          type: item.type,
          requiredAfter: item.requiredAfter ?? null,
          orderIndex: item.orderIndex,
          notes: item.notes ?? null,
        },
      });
    }
  }

  return { projectId, items, confidence };
}
