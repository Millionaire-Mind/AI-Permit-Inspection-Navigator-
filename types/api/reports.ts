import { z } from "zod";

export const ReportCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string(),
});

export type ReportCreateInput = z.infer<typeof ReportCreateSchema>;

