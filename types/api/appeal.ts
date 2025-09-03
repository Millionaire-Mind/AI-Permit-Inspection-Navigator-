import { z } from "zod";

export const AppealActionSchema = z.object({
  action: z.enum(["approve", "reject", "assign", "note", "reviewed"]),
  assignTo: z.string().optional(),
  note: z.string().optional()
});

export type AppealActionInput = z.infer<typeof AppealActionSchema>;

export const AppealCreateSchema = z.object({
  userId: z.string(),
  reportId: z.string(),
  reason: z.string().min(1)
});