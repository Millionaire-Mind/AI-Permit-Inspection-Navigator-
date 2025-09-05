import type { NextRequest } from "next/server";

let minuteStore: Map<string, { count: number; reset: number }>;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch seconds
}

const getDefaultLimit = () => Number(process.env.RATE_LIMIT_PER_MIN || 120);

export function getClientIdentifier(req: NextRequest, fallbackIp?: string): string {
  const ip = fallbackIp || req.ip || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  return String(ip);
}

export async function limitWithUpstash(key: string, limitPerMin: number): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limitPerMin, "1 m"),
    analytics: true,
    prefix: "api-rate",
  });
  const r = await limiter.limit(key);
  return {
    success: r.success,
    limit: limitPerMin,
    remaining: r.remaining,
    reset: Math.ceil(r.reset / 1000),
  };
}

export async function limitWithMemory(key: string, limitPerMin: number): Promise<RateLimitResult> {
  // Best-effort local fallback for dev only
  // @ts-ignore
  minuteStore = minuteStore ?? new Map<string, { count: number; reset: number }>();
  const now = Date.now();
  const windowMs = 60_000;
  const slot = Math.floor(now / windowMs) * windowMs;
  const mapKey = `${key}:${slot}`;
  const entry = minuteStore.get(mapKey) ?? { count: 0, reset: Math.ceil((slot + windowMs) / 1000) };
  entry.count += 1;
  minuteStore.set(mapKey, entry);
  const remaining = Math.max(0, limitPerMin - entry.count);
  return { success: entry.count <= limitPerMin, limit: limitPerMin, remaining, reset: entry.reset };
}

export async function rateLimitRequest(key: string, limitPerMin = getDefaultLimit()): Promise<RateLimitResult> {
  const upstash = await limitWithUpstash(key, limitPerMin);
  if (upstash) return upstash;
  return limitWithMemory(key, limitPerMin);
}