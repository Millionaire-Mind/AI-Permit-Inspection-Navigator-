import { subDays } from "date-fns";

export async function collectCandidates({ days = 90 } = {}) {
  const since = subDays(new Date(), days);
  // Phase 1 stub: return empty candidates
  return [] as any[];
}
