import { prisma } from "@/lib/prisma";
import { sendSlackAlert as sendSlack } from "./alerts/sendSlackAlert";
// Defer nodemailer usage to runtime to avoid bundling Node deps in build
let sendErrorEmail: ((args: { subject: string; message: string }) => Promise<void>) | null = null;
async function loadEmailSender() {
  if (sendErrorEmail) return sendErrorEmail;
  try {
    const mod = await import("./alerts/sendErrorAlert");
    sendErrorEmail = mod.sendErrorAlert;
  } catch {
    sendErrorEmail = null;
  }
  return sendErrorEmail;
}

export async function runAlertSweep() {
  const rules = await prisma.alertRule.findMany({ where: { active: true } });
  let created = 0;
  for (const r of rules) {
    // demo: generate a fake spike event 1/4 times
    if (Math.random() < 0.25) {
      const anyDb = prisma as any;
      if (anyDb.alertEvent?.create) {
        await anyDb.alertEvent.create({ data: {
          ruleId: r.id, message: `[${r.kind}] threshold ${r.threshold} exceeded for ${r.scope}`, level: "warn"
        }});
      }
      created++;
      await sendSlack(`ALERT: ${r.kind} on ${r.scope} exceeded threshold`);
      try { const send = await loadEmailSender(); if (send) await send({ subject: `Alert: ${r.kind}`, message: `Scope: ${r.scope} threshold ${r.threshold} exceeded.` }); } catch {}
      try {
        await prisma.audit.create({ data: { action: "alert_generated", actor: "system", detail: { ruleId: r.id, kind: r.kind, scope: r.scope, threshold: r.threshold } } });
      } catch {}
    }
  }
  return { created };
}
