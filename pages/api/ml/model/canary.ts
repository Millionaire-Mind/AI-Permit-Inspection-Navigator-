import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";
import db from "@/lib/db";

const INFERENCE_URL = process.env.INFERENCE_SERVICE_URL;
const INFERENCE_API_KEY = process.env.INFERENCE_API_KEY;

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { modelVersion } = req.body;
  if (!modelVersion) return res.status(400).json({ error: "modelVersion required" });
  try {
    const resp = await fetch(`${INFERENCE_URL}/canary`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${INFERENCE_API_KEY}` },
      body: JSON.stringify({ modelVersion })
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: "Inference API error", detail: text });
    }
    await db.productionModel.upsert({
      where: { modelVersion },
      update: { stage: "canary", deployedBy: "admin", deployedAt: new Date(), metadata: { canary: true } },
      create: { modelVersion, stage: "canary", deployedBy: "admin", metadata: { canary: true } }
    });
    await db.audit.create({ data: { action: "model_canary_deploy", actor: "admin", detail: { modelVersion }, createdAt: new Date() } });
    return res.status(200).json({ status: "ok", modelVersion });
  } catch (err: any) {
    console.error("canary deploy error", err);
    return res.status(500).json({ error: err.message });
  }
});
