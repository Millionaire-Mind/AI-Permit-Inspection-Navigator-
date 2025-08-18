import db from "@/lib/db";
import { triggerProactiveScheduling } from "./../ml/retrainQueueManager";
import { scheduleRetrainIfNeeded } from "../ml/retrainScheduler";
import { logger } from "../logger";
import { sendSlackAlert } from "../alerts/sendSlackAlert";
import { recommendModeratorCoverage } from "../ml/shiftRecommender";

export async function forecastRunnerJob() {
  try {
    // placeholder: fetch historical data and generate a simple forecast
    // Replace with your forecasting logic or call to LLM/ML service
    const forecast = [
      { date: new Date().toISOString(), predicted: 120, low: 100, high: 140, notes: "sample" }
    ];

    await db.forecastLog.create({
      data: { triggeredAt: new Date(), results: forecast as any }
    });

    // pro-actively create tasks if threshold exceeded
    for (const f of forecast) {
      const totalPredicted = f.predicted;
      const slaThreshold = 50;
      if (totalPredicted > slaThreshold) {
        await db.slaTask.create({
          data: {
            title: `Add moderators for forecast ${f.date}`,
            description: `Predicted ${totalPredicted} appeals.`,
            priority: "HIGH",
            dueAt: new Date(),
            status: "OPEN",
            type: "SLA_PROACTIVE_SCHEDULING"
          }
        });

        const { recommendedHours, recommendedMods } = recommendModeratorCoverage(totalPredicted);
        await sendSlackAlert(`📈 Predicted ${totalPredicted} appeals. Recommend ${recommendedMods} mods for ${recommendedHours} hours.`);
      }
    }

    return forecast;
  } catch (err) {
    logger.error("forecastRunnerJob error", err);
    throw err;
  }
}
