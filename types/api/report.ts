import { z } from "zod";

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const ReportCreateSchema = z.object({
  userId: z.string().min(1),
  address: z.string().min(1)
});
