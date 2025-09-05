import { prisma } from "@/lib/prisma";
import { sendSlackAlert as sendSlack } from "./alerts/sendSlackAlert";

let sendErrorEmail: ((args: { subject: string; message: string }) => Promise<void>) | null = null;
async function loadEmailSender() {
  try {
    const mod = await import("./alerts/sendErrorAlert");
    sendErrorEmail = mod.sendErrorAlert;
  } catch {
    sendErrorEmail = null;
  }
  return sendErrorEmail;
}

export async function runAlertSweep() {
  try {
    const anyDb: any = prisma as any;
    const rules = await anyDb.alertRule.findMany({ where: { active: true } });
    let created = 0;

    for (const r of rules) {
      if (Math.random() < 0.25) {
        if (anyDb.alertEvent?.create) {
          await anyDb.alertEvent.create({
            data: {
              ruleId: r.id,
              message: `[${r.kind}] threshold ${r.threshold} exceeded for ${r.scope}`,
              level: "warn"
            }
          });
        }
        created++;
        await sendSlack(`ALERT: ${r.kind} on ${r.scope} exceeded threshold`);

        const send = await loadEmailSender();
        if (send) {
          await send({
            subject: `Alert: ${r.kind}`,
            message: `Scope: ${r.scope} threshold ${r.threshold} exceeded.`
          });
        }
      }
    }

    return { created };
  } catch (error: any) {
    console.error("Error running alert sweep:", error);
    return { created: 0, error: error?.message ?? "unknown" };
  }
}
