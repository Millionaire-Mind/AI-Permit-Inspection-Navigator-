import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('returns ok status and uptime', async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe('ok');
    expect(typeof json.time).toBe('string');
    expect(typeof json.uptimeMs).toBe('number');
  });
});