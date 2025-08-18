import { z } from 'zod';

export const CreateProjectSchema = z.object({
  userId: z.string().uuid(),
  jurisdictionId: z.string().uuid(),
  type: z.string().min(2),
  subType: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  params: z.record(z.any()).optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const ProjectListQuerySchema = z.object({
  userId: z.string().uuid(),
  jurisdictionId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;
