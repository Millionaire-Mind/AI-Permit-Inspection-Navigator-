import { z } from "zod";

export const RuleSchema = z.object({
  id: z.string(),
  jurisdictionId: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateRuleSchema = z.object({
  code: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  jurisdictionId: z.string(),
  isActive: z.boolean().optional(),
});

export const UpdateRuleSchema = z.object({
  code: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type Rule = z.infer<typeof RuleSchema>;
export type CreateRuleInput = z.infer<typeof CreateRuleSchema>;
export type UpdateRuleInput = z.infer<typeof UpdateRuleSchema>;
