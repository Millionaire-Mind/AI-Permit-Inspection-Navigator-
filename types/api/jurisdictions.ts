import { z } from 'zod';

export const JurisdictionSearchSchema = z.object({
  q: z.string().min(2),
  state: z.string().length(2).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
export type JurisdictionSearchInput = z.infer<typeof JurisdictionSearchSchema>;
