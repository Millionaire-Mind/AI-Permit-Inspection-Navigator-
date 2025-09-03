import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

function isValidSlackSignature(req: NextApiRequest): boolean {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;
  const ts = req.headers["x-slack-request-timestamp"] as string | undefined;
  const sig = req.headers["x-slack-signature"] as string | undefined;
  if (!ts || !sig) return false;
  const fiveMinutes = 60 * 5;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(ts)) > fiveMinutes) return false;
  const rawBody = (req as any).rawBody || (req as any).bodyRaw || ""; // ensure raw body middleware if needed
  const base = `v0:${ts}:${typeof rawBody === "string" ? rawBody : typeof rawBody === "object" ? JSON.stringify(rawBody) : ""}`;
  const hmac = crypto.createHmac("sha256", signingSecret).update(base).digest("hex");
  const expected = `v0=${hmac}`;
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig)); } catch { return false; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isValidSlackSignature(req)) return res.status(401).json({ error: "invalid-signature" });

  const payload = typeof req.body?.payload === "string" ? JSON.parse(req.body.payload) : req.body;
  // Handle interactive actions: approve/reject, etc.
  // For now, echo back
  return res.status(200).json({ ok: true, received: payload?.type ?? "unknown" });
}
