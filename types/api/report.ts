// types/api/report.ts
import { z } from "zod";

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const ReportCreateSchema = z.object({
  userId: z.string().min(1),
  address: z.string().min(1),
});
export type ReportCreateInput = z.infer<typeof ReportCreateSchema>;

export const ReportUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  address: z.string().min(1).optional(),
});
export type ReportUpdateInput = z.infer<typeof ReportUpdateSchema>;
