export type LogLevel = "debug" | "info" | "warn" | "error";

function format(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  return JSON.stringify({ ts, level, message, ...(meta || {}) });
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => console.debug(format("debug", message, meta)),
  info: (message: string, meta?: Record<string, unknown>) => console.info(format("info", message, meta)),
  warn: (message: string, meta?: Record<string, unknown>) => console.warn(format("warn", message, meta)),
  error: (message: string, meta?: Record<string, unknown>) => console.error(format("error", message, meta)),
};

export async function logRequest(request: Request, extra?: Record<string, unknown>) {
  try {
    const { method } = request as any;
    const url = (request as any).url as string;
    const ua = (request.headers.get("user-agent") || "").slice(0, 200);
    logger.info("http_request", { method, url, ua, ...extra });
  } catch (e: any) {
    logger.warn("logRequest_failed", { error: e?.message });
  }
}

export const logger = {
  info: (...args: any[]) => console.log("[INFO]", ...args),
  warn: (...args: any[]) => console.warn("[WARN]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args)
};
