import { z } from "zod";

export const ReportCreateSchema = z.object({
  userId: z.string().uuid(),
  address: z.string().optional(),
});

export type ReportCreateInput = z.infer<typeof ReportCreateSchema>;
