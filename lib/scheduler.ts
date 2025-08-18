import cron from "node-cron";
import { forecastRunnerJob } from "./jobs/forecastRunner";
import { scheduleRetrainIfNeeded } from "./ml/retrainScheduler";

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
