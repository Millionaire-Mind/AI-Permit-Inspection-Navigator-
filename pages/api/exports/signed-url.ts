import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedFileUrl } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const key = (req.query.key as string) || "";
  if (!key) return res.status(400).json({ error: "key required" });
  try {
    // Optional: ensure the key belongs to the requesting user by checking PdfExport
    const anyDb: any = prisma as any;
    const rec = await anyDb.pdfExport?.findFirst({ where: { fileUrl: key } });
    if (!rec) return res.status(404).json({ error: "not_found" });
    const url = await getSignedFileUrl({ key, expiresIn: 60 * 5 });
    return res.status(200).json({ url });
  } catch (e: any) {
    console.error("signed-url error", e);
    return res.status(500).json({ error: e?.message || "failed" });
  }
}

