export async function sendForecastApprovalRequest(forecastData: {
  forecastedAppeals: number;
  recommendedMods: number;
  recommendedHours: number;
  date: string;
}) {
  const webhookUrl = process.env.SLACK_APPROVAL_WEBHOOK;
  if (!webhookUrl) return;
  const { forecastedAppeals, recommendedMods, recommendedHours, date } = forecastData;
  const payload = {
    text: `📊 Forecast Approval Needed for ${date}\nForecasted appeals: ${forecastedAppeals}\nRecommended mods: ${recommendedMods} for ${recommendedHours} hours`,
    attachments: [
      {
        text: "Approve or Reject",
        actions: [
          {
            type: "button",
            text: "Approve",
            url: `${process.env.APP_URL}/admin/model-canary?approve=true&date=${date}`
          },
          {
            type: "button",
            text: "Reject",
            url: `${process.env.APP_URL}/admin/model-canary?approve=false&date=${date}`
          }
        ]
      }
    ]
  };
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
