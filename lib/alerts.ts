import { sendSlack } from "./slack";

// TODO: Implement proper alerts system with database models
// For now, return mock data to prevent build errors

export async function runAlertSweep() {
  // Mock alert rules data
  const rules = [
    {
      id: "rule-1",
      scope: "global",
      kind: "forecast_spike",
      threshold: 0.2,
      active: true
    },
    {
      id: "rule-2", 
      scope: "project",
      kind: "sla_breach",
      threshold: 0.1,
      active: true
    }
  ];
  
  let created = 0;
  for (const r of rules) {
    // demo: generate a fake spike event 1/4 times
    if (Math.random() < 0.25) {
      // Mock alert event creation
      const alertEvent = {
        id: `alert-${Date.now()}-${created}`,
        ruleId: r.id, 
        message: `[${r.kind}] threshold ${r.threshold} exceeded for ${r.scope}`, 
        level: "warn",
        createdAt: new Date().toISOString()
      };
      created++;
      await sendSlack(`ALERT: ${r.kind} on ${r.scope} exceeded threshold`);
    }
  }
  return { created };
}
