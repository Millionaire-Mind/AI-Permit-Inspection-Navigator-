import { z } from "zod";

export const ReportCreateSchema = z.object({
  userId: z.string().min(1),
  address: z.string().min(3)
});
export type ReportCreate = z.infer<typeof ReportCreateSchema>;
