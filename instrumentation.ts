// Next.js instrumentation hook to initialize background scheduled jobs on the server
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
  if (process.env.NODE_ENV === 'production') {
    try { await import("./sentry.server.config"); } catch {}
  }
  const { setupScheduler } = await import("./lib/schedulerRuntime");
  setupScheduler();
}

