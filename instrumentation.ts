// Next.js instrumentation hook to initialize background scheduled jobs on the server
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
  const { setupScheduler } = await import("./lib/schedulerRuntime");
  setupScheduler();
}

