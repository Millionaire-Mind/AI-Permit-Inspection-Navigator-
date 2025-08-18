import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tasks = await db.sLATask.findMany({ orderBy: { dueAt: "asc" } });
  res.status(200).json(tasks);
});
