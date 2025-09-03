import { z } from "zod";

export const AppealCreateSchema = z.object({
  userId: z.string().min(1),
  reportId: z.string().min(1),
  reason: z.string().min(1),
});
export type AppealCreateInput = z.infer<typeof AppealCreateSchema>;

export const AppealActionSchema = z.object({
  action: z.enum(["approve", "reject", "assign", "note", "reviewed"]),
  assignTo: z.string().optional(),
  note: z.string().optional(),
});
export type AppealActionInput = z.infer<typeof AppealActionSchema>;