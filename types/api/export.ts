import { z } from "zod";

export const ExportPDFSchema = z.object({
  reportId: z.string().min(1),
  timezone: z.string().optional(),
  noteTagFilter: z.string().nullable().optional()
});
export type ExportPDFInput = z.infer<typeof ExportPDFSchema>;
