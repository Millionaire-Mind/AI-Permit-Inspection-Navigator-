import { z } from "zod";

export const AlertRuleSchema = z.object({
  scope: z.enum(["global","team","role"]),
  scopeRef: z.string().nullish(),
  kind: z.enum(["reversal_rate","sla_breach","forecast_spike"]),
  threshold: z.number().min(0),
  windowHours: z.number().int().min(1)
});
export type AlertRuleInput = z.infer<typeof AlertRuleSchema>;
