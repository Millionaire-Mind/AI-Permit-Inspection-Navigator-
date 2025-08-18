import { z } from "zod";

export const AppealCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string(),
});

export type AppealCreateInput = z.infer<typeof AppealCreateSchema>;
