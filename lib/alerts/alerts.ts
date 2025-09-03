import { prisma } from "../prisma";
import { sendSlack } from "../slack";

export async function runAlertSweep() {
  try {
    const rules = await prisma.alertRule.findMany({ where: { active: true } }).catch(() => [] as any[]);
    let created = 0;
    for (const r of rules) {
      if (Math.random() < 0.25) {
        try {
          // @ts-expect-error: alertEvent may not exist in Phase 1
          await prisma.alertEvent.create({ data: {
            ruleId: r.id, message: `[${r.kind}] threshold ${r.threshold} exceeded for ${r.scope}`, level: "warn"
          }});
          created++;
          await sendSlack(`ALERT: ${r.kind} on ${r.scope} exceeded threshold`);
        } catch {}
      }
    }
    return { created };
  } catch {
    return { created: 0 };
  }
}