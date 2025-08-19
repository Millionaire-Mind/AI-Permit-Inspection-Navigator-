import { prisma } from "@/lib/prisma";
import { sendSlack } from "./slack";

export async function runAlertSweep() {
  try {
    // Get all active rules from the database
    const rules = await prisma.rule.findMany({ 
      where: { isActive: true } 
    });

    let created = 0;
    
    for (const rule of rules) {
      // Demo: generate a fake spike event 1/4 times
      if (Math.random() < 0.25) {
        // Create audit log for the alert
        await prisma.audit.create({
          data: {
            action: 'ALERT_TRIGGERED',
            actor: 'SYSTEM',
            detail: {
              ruleId: rule.id,
              ruleCode: rule.code,
              ruleCategory: rule.category,
              message: `[${rule.category}] Rule ${rule.code} triggered alert`,
              level: 'warn',
              timestamp: new Date().toISOString(),
            },
          },
        });

        created++;
        
        // Send Slack notification
        await sendSlack(`ALERT: ${rule.category} rule ${rule.code} triggered`);
      }
    }

    return { created };
  } catch (error) {
    console.error('Error running alert sweep:', error);
    return { created: 0, error: error.message };
  }
}
