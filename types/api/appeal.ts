export const AppealActionSchema = z.object({
  actionType: z.string(),
  performedBy: z.string(),
  performedAt: z.string().optional(),
  // add other fields as needed
});

export type AppealActionInput = z.infer<typeof AppealActionSchema>;