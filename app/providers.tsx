"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  try { require("../sentry.client.config"); } catch {}
  return <SessionProvider>{children}</SessionProvider>;
}

