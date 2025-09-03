import { prisma } from "@/lib/prisma";
import { sendSlackAlert as sendSlack } from "./alerts/sendSlackAlert";

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
    }
  }
  return { created };
}
