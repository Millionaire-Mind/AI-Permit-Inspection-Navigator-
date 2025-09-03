import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([]);
});
