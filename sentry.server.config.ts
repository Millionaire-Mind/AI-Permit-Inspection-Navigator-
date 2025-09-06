if (process.env.NODE_ENV === "production") {
  try {
    const Sentry = require("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
      enabled: !!process.env.SENTRY_DSN,
    });
  } catch {}
}

