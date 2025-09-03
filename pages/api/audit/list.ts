import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const items = await db.audit.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.status(200).json(items);
});

