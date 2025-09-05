import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

async function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (c: any) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verifySlackSignature({ signingSecret, body, timestamp, signature }: { signingSecret: string; body: Buffer; timestamp: string; signature: string; }) {
  const fiveMinutes = 60 * 5;
  const now = Math.floor(Date.now() / 1000);
  const ts = Number(timestamp || '0');
  if (Math.abs(now - ts) > fiveMinutes) return false;
  const base = `v0:${timestamp}:${body.toString('utf8')}`;
  const hmac = crypto.createHmac('sha256', signingSecret).update(base).digest('hex');
  const expected = `v0=${hmac}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return res.status(500).json({ error: 'slack_not_configured' });

  const raw = await getRawBody(req);
  const timestamp = req.headers['x-slack-request-timestamp'] as string;
  const signature = req.headers['x-slack-signature'] as string;

  if (!verifySlackSignature({ signingSecret, body: raw, timestamp, signature })) {
    return res.status(401).json({ error: 'invalid_signature' });
  }

  const contentType = req.headers['content-type'] || '';
  let payload: any = {};

  if (contentType.includes('application/json')) {
    try { payload = JSON.parse(raw.toString('utf8')); } catch { payload = {}; }
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = raw.toString('utf8');
    const params = new URLSearchParams(text);
    const bodyPayload = params.get('payload');
    payload = bodyPayload ? JSON.parse(bodyPayload) : Object.fromEntries(params.entries());
  }

  // URL verification challenge (Events API)
  if (payload?.type === 'url_verification' && payload?.challenge) {
    return res.status(200).send(payload.challenge);
  }

  // Interactive actions
  if (payload?.type === 'block_actions' || payload?.type === 'interactive_message') {
    const actions = payload.actions || [];
    const actionId = actions[0]?.action_id || actions[0]?.name;
    const value = actions[0]?.value;
    // Example: approve/reject handling
    if (actionId === 'approve_request') {
      // TODO: perform approve operation
      return res.status(200).json({ text: 'Request approved ✅' });
    }
    if (actionId === 'reject_request') {
      // TODO: perform reject operation
      return res.status(200).json({ text: 'Request rejected ❌' });
    }
    return res.status(200).json({ text: 'Action received' });
  }

  // Events
  if (payload?.event) {
    return res.status(200).json({ ok: true });
  }

  // Fallback
  return res.status(200).json({ ok: true });
}