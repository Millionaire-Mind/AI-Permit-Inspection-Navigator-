// types/api/report.ts
export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const ReportCreateSchema = {
  // Example Zod schema if using Zod
  title: { type: "string" },
  description: { type: "string" },
};
