export async function sendSlackAlert(message: string) {
  const webhookUrl = process.env.SLACK_ALERT_WEBHOOK;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message })
    });
  } catch (err) {
    console.error("Slack send error", err);
  }
}
