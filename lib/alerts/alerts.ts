// lib/alerts.ts
import { prisma } from "@/lib/prisma";

export async function getActiveAlertRules() {
  return await prisma.alertRule.findMany({ where: { active: true } });
}

export async function createAlert(data: {
  scope: string;
  scopeRef?: string | null;
  kind: string;
  threshold: number;
  windowHours: number;
}) {
  return await prisma.alertRule.create({ data });
}

// Example function to trigger an alert (expand as needed)
export async function triggerAlert(alertData: {
  ruleId: string;
  message: string;
  severity?: "info" | "warning" | "critical";
}) {
  // Implement alert sending logic here, e.g., send email, Slack, etc.
  console.log(`Alert triggered for rule ${alertData.ruleId}: ${alertData.message}`);
  // You can also save alerts to DB if you have an Alert model
}