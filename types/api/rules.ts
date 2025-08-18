import { z } from 'zod';

export const IngestRuleSourceSchema = z.object({
  jurisdictionId: z.string().uuid(),
  sourceType: z.enum(['pdf', 'html', 'api']),
  url: z.string().url().optional(),
  title: z.string().optional(),
  meta: z.record(z.any()).optional(),
});
export type IngestRuleSourceInput = z.infer<typeof IngestRuleSourceSchema>;
