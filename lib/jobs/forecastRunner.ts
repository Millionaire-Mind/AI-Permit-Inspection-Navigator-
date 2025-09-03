import db from "@/lib/db";
import { sendSlackAlert } from "../alerts/sendSlackAlert";
import { recommendModeratorCoverage } from "../ml/shiftRecommender";
import { forecastSeries } from "../forecast";

export async function forecastRunnerJob() {
  try {
    // Build a simple daily history from prior forecast logs (sum of predicted values)
    const recentLogs = await db.forecastLog.findMany({
      orderBy: { triggeredAt: "asc" },
      take: 30
    });

    const historyMap = new Map<string, number>();
    for (const log of recentLogs) {
      const items = Array.isArray(log.results) ? (log.results as any[]) : [];
      const date = new Date(log.triggeredAt).toISOString().slice(0, 10);
      const total = items.reduce((acc, cur) => acc + (cur.predicted || 0), 0);
      historyMap.set(date, (historyMap.get(date) || 0) + total);
    }
    const history = Array.from(historyMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const { forecast, lower, upper } = forecastSeries(history, 14);

    const results = forecast.map((f, i) => ({
      date: f.date,
      predicted: f.value,
      low: lower[i]?.value ?? Math.max(0, Math.round(f.value * 0.8)),
      high: upper[i]?.value ?? Math.round(f.value * 1.2)
    }));

    await db.forecastLog.create({
      data: { triggeredAt: new Date(), results: results as any }
    });

    // Evaluate SLA threshold using a category-specific setting if available
    const slaSetting = await db.sLASettings.findFirst({ where: { category: "appeals" } });
    const threshold = slaSetting?.threshold ?? 50;

    const firstDay = results[0];
    if (firstDay && firstDay.predicted > threshold) {
      await db.sLATask.create({
        data: {
          title: `Add moderators for forecast ${firstDay.date}`,
          description: `Predicted ${firstDay.predicted} appeals (range ${firstDay.low}-${firstDay.high}).`,
          priority: "HIGH",
          dueAt: new Date(),
          assignedTeam: slaSetting?.teamId ?? null,
          status: "OPEN",
          type: "SLA_PROACTIVE_SCHEDULING"
        }
      });

      const { recommendedHours, recommendedMods } = recommendModeratorCoverage(firstDay.predicted);
      await sendSlackAlert(
        `📈 Predicted ${firstDay.predicted} appeals on ${firstDay.date}. Recommend ${recommendedMods} moderators for ${recommendedHours} hours.`
      );
    }

    return results;
  } catch (err) {
    console.error("forecastRunnerJob error", err);
    throw err;
  }
}
