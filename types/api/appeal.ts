import { z } from "zod";

export const AppealCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  reason: z.string(),
  reportId: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

export const AppealActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export type AppealCreateInput = z.infer<typeof AppealCreateSchema>;
export type AppealActionInput = z.infer<typeof AppealActionSchema>;
