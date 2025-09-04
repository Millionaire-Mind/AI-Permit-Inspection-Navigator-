import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

function verifySlack(req: NextApiRequest) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;
  const ts = req.headers["x-slack-request-timestamp"] as string | undefined;
  const sig = req.headers["x-slack-signature"] as string | undefined;
  if (!ts || !sig) return false;
  const base = `v0:${ts}:${(req as any).rawBody ?? ""}`;
  const mac = crypto.createHmac("sha256", signingSecret).update(base).digest("hex");
  const expected = `v0=${mac}`;
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig)); } catch { return false; }
}

export const config = { api: { bodyParser: false } };

function parseForm(body: string) {
  const params = new URLSearchParams(body);
  const obj: any = {};
  for (const [k, v] of params) obj[k] = v;
  return obj;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!verifySlack(req)) return res.status(401).json({ error: "invalid-signature" });
  const raw = await new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    (req as any).on('data', (c: any) => chunks.push(c));
    (req as any).on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    (req as any).on('error', reject);
  });
  const payload = parseForm(raw);
  const text = (payload.text || '').trim();

  // Example: /alerts add forecast_spike 0.2 24
  const [cmd, kind, thresholdStr, windowStr] = text.split(/\s+/);
  if (cmd === 'add') {
    const { prisma } = await import("@/lib/prisma");
    const rule = await prisma.alertRule.create({ data: { kind: kind || 'forecast_spike', threshold: Number(thresholdStr || 0.2), windowHours: Number(windowStr || 24), scope: 'global' } });
    return res.status(200).json({ text: `Rule added: ${rule.kind} (th=${rule.threshold}, win=${rule.windowHours}h)` });
  }
  if (cmd === 'list') {
    const { prisma } = await import("@/lib/prisma");
    const rules = await prisma.alertRule.findMany({ where: { active: true } });
    return res.status(200).json({ text: rules.map(r => `${r.kind} th=${r.threshold} win=${r.windowHours}`).join('\n') || 'No rules' });
  }

  return res.status(200).json({ text: 'Usage: /alerts add <kind> <threshold> <windowHours> | /alerts list' });
}

