if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  (async () => {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
        enabled: !!(process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN),
      });
    } catch {}
  })();
}

