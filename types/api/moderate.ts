import { z } from "zod";

export const ModerateSchema = z.object({
  reportId: z.string().min(1),
  action: z.enum(["approve","flag","reject"]),
  note: z.string().optional(),
  adminUserId: z.string().optional()
});
export type ModerateInput = z.infer<typeof ModerateSchema>;
