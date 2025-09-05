import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as engine from '@/lib/permitEngine';

vi.mock('@/lib/prisma', () => {
  return {
    prisma: {
      project: { findUnique: vi.fn(async (args: any) => ({ id: args.where.id, jurisdictionId: 'j1', jurisdiction: { name: 'Seattle' } })) },
      permitRequirement: { findMany: vi.fn(async () => ([
        { permitTypeId: 'p1', rule: 'Electrical over $5000', criteria: { valuationMin: 5000 } },
        { permitTypeId: 'p2', rule: 'Building over 1000 sqft', criteria: { sqftMin: 1000 } },
      ])) },
    }
  };
});

// Minimal polyfill for crypto.randomUUID used in engine
// @ts-ignore
global.crypto = { randomUUID: () => 'uuid' } as any;

describe('permitEngine.checkProjectPermits', () => {
  it('returns decisions with confidence', async () => {
    const result: any = await engine.checkProjectPermits('project-123');
    expect(result.projectId).toBe('project-123');
    expect(Array.isArray(result.decisions)).toBe(true);
    expect(typeof result.confidence.score).toBe('number');
  });
});