import { prisma } from '@/lib/prisma';

export type AuditEvent = {
  userId?: string | null;
  action: string;
  detail?: Record<string, any> | null;
};

export async function logAudit(event: AuditEvent) {
  const { userId, action, detail } = event;
  const anyDb: any = prisma as any;
  if (anyDb.audit?.create) {
    await anyDb.audit.create({ data: { actor: userId ?? null, action, detail: detail ?? null } });
  }
}

export async function logPermitApplicationCreated(userId: string, applicationId: string) {
  return logAudit({ userId, action: 'permit_application.created', detail: { applicationId } });
}

export async function logSettingChanged(userId: string | null, key: string, value: any) {
  return logAudit({ userId, action: 'settings.changed', detail: { key, value } });
}