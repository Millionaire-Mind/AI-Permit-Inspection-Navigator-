import { z } from 'zod';

export const BuildInspectionPlanSchema = z.object({
  projectId: z.string().uuid(),
});

export type BuildInspectionPlanInput = z.infer<typeof BuildInspectionPlanSchema>;

export const InspectionItemSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  requiredAfter: z.string().optional(),
  orderIndex: z.number().int(),
  notes: z.string().optional(),
});

export const BuildInspectionPlanResponseSchema = z.object({
  projectId: z.string().uuid(),
  items: z.array(InspectionItemSchema),
  confidence: z.object({
    score: z.number().min(0).max(1),
    factors: z.record(z.string(), z.any()).optional(),
  }),
});
export type BuildInspectionPlanResponse = z.infer<typeof BuildInspectionPlanResponseSchema>;