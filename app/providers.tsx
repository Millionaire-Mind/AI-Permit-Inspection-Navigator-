"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try { await import("../sentry.client.config"); } catch {}
    })();
  }, []);
  return <SessionProvider>{children}</SessionProvider>;
}
