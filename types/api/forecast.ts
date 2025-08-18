import { z } from "zod";

export const ForecastQuerySchema = z.object({
  horizon: z.coerce.number().int().min(1).max(60).default(14)
});
export type ForecastQuery = z.infer<typeof ForecastQuerySchema>;
