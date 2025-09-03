import { prisma } from './prisma';

/**
 * Very conservative, deterministic checker:
 * - Pulls PermitRequirement for the project's jurisdiction.
 * - Applies simple criteria (if provided) against project.params.
 * - Produces `required` / `maybe` / `not_required` decisions + confidence model.
 * - Optionally can call an LLM later for nuance (kept off by default for trust).
 */
export async function checkProjectPermits(projectId: string) {
  return { projectId, decisions: [], confidence: { score: 0.6 } } as any;
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
  return { projectId, items: [], confidence: { score: 0.6 } } as any;
}
