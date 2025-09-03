import { logger } from "../logger";
import { sendSlackAlert } from "../alerts/sendSlackAlert";

export async function forecastRunnerJob() {
  try {
    const forecast = [
      { date: new Date().toISOString(), predicted: 120, low: 100, high: 140, notes: "sample" }
    ];

    // Phase 1: no DB write; future phases can persist forecast logs
    // Phase 1: notify via Slack stub only
    await sendSlackAlert(`Forecast generated: ${forecast[0].predicted}`);

    return forecast;
  } catch (err) {
    logger.error("forecastRunnerJob error", err as any);
    throw err;
  }
}
