import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

/**
 * Simple wrapper - expect req.headers['x-user-role'] to be provided in examples.
 * Replace this with Supabase/Auth0/NextAuth in production.
 */
export function requireAdmin(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const role = req.headers["x-user-role"] as string | undefined;
    if (role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    return handler(req, res);
  };
}
