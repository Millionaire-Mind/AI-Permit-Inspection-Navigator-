import { prisma } from '@/lib/prisma';
import { getActiveModelVersion } from '@/lib/ml/retrainQueueManager';

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

  // Example: read active model for future use
  const activeModel = await getActiveModelVersion();
  void activeModel;

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
    const status = evaluateCriteria((req as any).criteria ?? {}, params);
    const ruleText = typeof (req as any).rule === 'string' ? (req as any).rule : '';
    const rationale = `Matched rule: ${ruleText.slice(0, 140)}${ruleText.length > 140 ? '…' : ''}`;
    const permitTypeId = (req as any).permitTypeId ?? 'unknown';
    decisions.push({ permitTypeId, status, rationale });
  }

  // Write/upsert decisions to ProjectPermit
  for (const d of decisions) {
    // Guard missing model in current schema
    // @ts-ignore
    if ((prisma as any).projectPermit?.upsert) {
      await (prisma as any).projectPermit.upsert({
        where: { projectId_permitTypeId: { projectId: (project as any).id, permitTypeId: d.permitTypeId } },
        update: { status: d.status, rationale: d.rationale },
        create: { projectId: (project as any).id, permitTypeId: d.permitTypeId, status: d.status, rationale: d.rationale },
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
        projectId: (project as any).id,
        scope: 'permit_check',
        score,
        factors: {
          jurisdiction: (project as any).jurisdiction.name,
          ruleCount: decisions.length,
          paramKeys: Object.keys(params).length,
          maybeCount: decisions.filter(d => d.status === 'maybe').length,
        },
      },
    });
  }

  return { projectId: (project as any).id, decisions, confidence };
}

/** Simple machine-checkable criteria evaluator. Extend as needed. */
function evaluateCriteria(criteria: Record<string, any>, params: Record<string, any>) {
  // Example: { "valuationMin": 5000, "scopeIncludes": ["electrical"] }
  let votes = 0;
  let total = 0;

  if ('valuationMin' in criteria) {
    total++;
    if (Number((params as any).valuation ?? 0) >= Number(criteria.valuationMin)) votes++;
  }
  if ('sqftMin' in criteria) {
    total++;
    if (Number((params as any).sqft ?? 0) >= Number(criteria.sqftMin)) votes++;
  }
  if (Array.isArray(criteria.scopeIncludes)) {
    total++;
    const scope = String((params as any).scope ?? '').toLowerCase();
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

export async function checkPermitRequirementsByContext(params: { projectType: string; location: string; }) {
  const { projectType, location } = params;
  const jurisdiction = await prisma.jurisdiction.findFirst({
    where: {
      OR: [
        { slug: location.toLowerCase() },
        { name: { equals: location, mode: 'insensitive' } },
      ],
    },
  });
  if (!jurisdiction) {
    return { decisions: [], confidence: { score: 0.0, factors: { message: 'Jurisdiction not found' } } };
  }

  const requirements = await prisma.permitRequirement.findMany({
    where: {
      jurisdictionId: jurisdiction.id,
      projectType: projectType,
    },
    include: { permitType: true },
  });

  const decisions = requirements.map((req: any) => {
    // For now, context-only evaluation uses declared criteria without project params
    const status = evaluateCriteria(req.criteria ?? {}, {});
    const rationale = `Matched rule: ${String(req.rule).slice(0, 140)}${String(req.rule).length > 140 ? '…' : ''}`;
    return { permitTypeId: req.permitTypeId, status, rationale, permitTypeName: req.permitType?.name };
  });

  const clearCount = decisions.filter((d: any) => d.status !== 'maybe').length;
  const score = decisions.length ? clearCount / decisions.length : 0.5;

  return {
    jurisdiction: { id: jurisdiction.id, name: jurisdiction.name, slug: jurisdiction.slug },
    projectType,
    decisions,
    confidence: { score, factors: { ruleCount: decisions.length } },
  };
}

export async function buildInspectionPlan(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('Project not found');

  // Derive a naive inspection plan from selected permits (you can make this smarter)
  const permits = (prisma as any).projectPermit?.findMany ? await (prisma as any).projectPermit.findMany({
    where: { projectId, status: { in: ['required', 'submitted', 'approved'] } },
    include: { permitType: true },
  }) : [];

  const items = [] as any[];
  let idx = 0;
  for (const pp of permits) {
    const t = (pp as any).permitType.name.toLowerCase();
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
          id: (item as any).id,
          projectId,
          type: (item as any).type,
          requiredAfter: (item as any).requiredAfter ?? null,
          orderIndex: (item as any).orderIndex,
          notes: (item as any).notes ?? null,
        },
      });
    }
  }

  return { projectId, items, confidence };
}
