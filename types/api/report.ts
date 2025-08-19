import { z } from "zod";

export const ReportCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  projectId: z.string().optional(),
});

export const ReportUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['DRAFT', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
});

export type ReportCreateInput = z.infer<typeof ReportCreateSchema>;
export type ReportUpdateInput = z.infer<typeof ReportUpdateSchema>;