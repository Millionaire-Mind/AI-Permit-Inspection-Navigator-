export async function sendSlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) { console.log("[SLACK]", message); return { ok: true }; }
  await fetch(url, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ text: message })});
  return { ok: true };
}
