import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  address: z.string(),
  jurisdictionId: z.string(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']).optional(),
  valuation: z.number().optional(),
  sqft: z.number().optional(),
  scope: z.string().optional(),
  params: z.any().optional(),
});

export const ProjectListQuerySchema = z.object({
  userId: z.string(),
  jurisdictionId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']).optional(),
  valuation: z.number().optional(),
  sqft: z.number().optional(),
  scope: z.string().optional(),
  params: z.any().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;