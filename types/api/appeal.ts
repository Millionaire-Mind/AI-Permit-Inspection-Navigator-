import { z } from "zod";

export const AppealCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string(),
});

export const AppealActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export type AppealCreateInput = z.infer<typeof AppealCreateSchema>;
export type AppealActionInput = z.infer<typeof AppealActionSchema>;
