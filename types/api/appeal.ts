import { z } from "zod";

export const AppealCreateSchema = z.object({
  userId: z.string().uuid(),
  reportId: z.string().uuid(),
  reason: z.string().min(1),
});

export type AppealCreateInput = z.infer<typeof AppealCreateSchema>;

export const AppealActionSchema = z.object({
  action: z.enum(["approve", "reject", "assign", "note", "reviewed"]),
  assignTo: z.string().uuid().optional(),
  note: z.string().optional(),
});

export type AppealActionInput = z.infer<typeof AppealActionSchema>;
