import { z } from 'zod';

export const CheckPermitsSchema = z.object({
  projectId: z.string().uuid(),
});

export type CheckPermitsInput = z.infer<typeof CheckPermitsSchema>;

export const PermitDecisionSchema = z.object({
  permitTypeId: z.string().uuid(),
  status: z.enum(['required', 'maybe', 'not_required']),
  rationale: z.string().optional(),
});

export type PermitDecision = z.infer<typeof PermitDecisionSchema>;

export const CheckPermitsResponseSchema = z.object({
  projectId: z.string().uuid(),
  decisions: z.array(PermitDecisionSchema),
  confidence: z.object({
    score: z.number().min(0).max(1),
    factors: z.record(z.string(), z.any()).optional(),
  }),
});
export type CheckPermitsResponse = z.infer<typeof CheckPermitsResponseSchema>;
