import { z } from "zod";

export const SLASettingSchema = z.object({
  category: z.string(),
  threshold: z.number().int().min(1),
  teamId: z.string().nullable().optional(),
  graceMin: z.number().int().min(0).optional()
});
export type SLASetting = z.infer<typeof SLASettingSchema>;
