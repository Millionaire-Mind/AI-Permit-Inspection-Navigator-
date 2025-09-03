export async function setupScheduler() {
  const g: any = globalThis as any;
  if (g.__schedulerInitialized) return;
  g.__schedulerInitialized = true;

  try {
    const cron = (eval('require') as any)("node-cron");
    const { forecastRunnerJob } = await import("@/lib/jobs/forecastRunner");
    const { scheduleRetrainIfNeeded } = await import("@/lib/ml/retrainScheduler");
    const { runAlertSweep } = await import("@/lib/alerts");

    // Run forecast every 6 hours
    cron.schedule("0 */6 * * *", async () => {
      try {
        console.log("[scheduler] Running forecastRunnerJob");
        await forecastRunnerJob();
      } catch (e) {
        console.error("Forecast runner error", e);
      }
    });

    // Daily retrain check at 03:00
    cron.schedule("0 3 * * *", async () => {
      try {
        console.log("[scheduler] Running retrain schedule check");
        await scheduleRetrainIfNeeded({ minSamples: 200 });
      } catch (e) {
        console.error("Retrain schedule error", e);
      }
    });

    // Alert sweep every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
      try {
        console.log("[scheduler] Running alert sweep");
        await runAlertSweep();
      } catch (e) {
        console.error("Alert sweep error", e);
      }
    });
  } catch (e: any) {
    console.warn("[scheduler] Skipping scheduler init:", e?.message ?? e);
    return;
  }
}

