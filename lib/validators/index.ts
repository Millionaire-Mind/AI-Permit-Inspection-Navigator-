import { z } from "zod";

export const Role = z.enum(["USER","MODERATOR","ADMIN"]);
export const ReportStatus = z.enum(["PENDING","IN_REVIEW","APPROVED","REJECTED","FLAGGED","COMPLETED"]);
export const SubscriptionStatus = z.enum(["TRIALING","ACTIVE","PAST_DUE","CANCELED","INCOMPLETE","INCOMPLETE_EXPIRED","UNPAID"]);
export const RetrainStatus = z.enum(["QUEUED","RUNNING","COMPLETED","FAILED","CANCELLED"]);
export const ProductionStage = z.enum(["CANARY","PRODUCTION","STAGING"]);
export const SLATaskStatus = z.enum(["OPEN","IN_PROGRESS","RESOLVED","ESCALATED","CLOSED"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  role: Role,
  createdAt: z.string(),
  lastLoginAt: z.string().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
});

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stripeCustomerId: z.string(),
  createdAt: z.string(),
});

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  stripeSubscriptionId: z.string(),
  plan: z.string(),
  status: SubscriptionStatus,
  currentPeriodEnd: z.string().optional().nullable(),
  cancelAtPeriodEnd: z.boolean().optional(),
  createdAt: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
});

export const PermitSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  jurisdiction: z.string(),
  permitType: z.string(),
  description: z.string().optional().nullable(),
  fees: z.number().optional().nullable(),
  estimatedTimeline: z.string().optional().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  reportId: z.string().uuid().optional().nullable(),
});

export const ReportSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
  userId: z.string().uuid(),
  title: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: ReportStatus,
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
});

export const PdfExportSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  userId: z.string().uuid(),
  fileUrl: z.string().url(),
  storageKey: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const ModerationActionSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  adminUserId: z.string().uuid(),
  action: z.string(),
  note: z.string().optional().nullable(),
  overrideContent: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const AIAssistLogSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  moderatorId: z.string().uuid().optional().nullable(),
  suggestedCategory: z.string().optional().nullable(),
  confidence: z.number().optional().nullable(),
  rationale: z.string().optional().nullable(),
  modelVersion: z.string().optional().nullable(),
  slaUrgency: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const AIFeedbackSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  suggestionId: z.string().optional().nullable(),
  accepted: z.boolean(),
  comments: z.string().optional().nullable(),
  moderatorId: z.string().uuid().optional().nullable(),
  category: z.string().optional().nullable(),
  confidence: z.number().optional().nullable(),
  createdAt: z.string(),
});

export const AITrainingExampleSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  suggestionId: z.string().optional().nullable(),
  moderatorId: z.string().uuid().optional().nullable(),
  accepted: z.boolean(),
  comments: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  confidence: z.number().optional().nullable(),
  createdAt: z.string(),
  reviewedAt: z.string().optional().nullable(),
  usedInJobId: z.string().optional().nullable(),
});

export const RetrainJobSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  triggeredBy: z.string().optional().nullable(),
  status: RetrainStatus,
  priority: z.number().int(),
  sampleCount: z.number().int(),
  metadata: z.any().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  finishedAt: z.string().optional().nullable(),
  error: z.string().optional().nullable(),
  validation: z.any().optional().nullable(),
  promoted: z.boolean().optional().nullable(),
});

export const ProductionModelSchema = z.object({
  id: z.string().uuid(),
  modelVersion: z.string(),
  stage: ProductionStage,
  deployedBy: z.string().optional().nullable(),
  deployedAt: z.string(),
  metadata: z.any().optional().nullable(),
});

export const ForecastLogSchema = z.object({
  id: z.string().uuid(),
  triggeredAt: z.string(),
  timeframe: z.string().optional().nullable(),
  results: z.any(),
  createdBy: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const SLATaskSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  priority: z.number().int().optional().nullable(),
  dueAt: z.string().optional().nullable(),
  assignedTeam: z.string().optional().nullable(),
  assignedUserId: z.string().uuid().optional().nullable(),
  status: SLATaskStatus,
  type: z.string().optional().nullable(),
  createdAt: z.string(),
  closedAt: z.string().optional().nullable(),
});

export const SLASettingsSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  threshold: z.number().int(),
  teamId: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const AuditSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  actor: z.string().optional().nullable(),
  detail: z.any().optional().nullable(),
  createdAt: z.string(),
});

export const KeyValueSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string().optional().nullable(),
});

