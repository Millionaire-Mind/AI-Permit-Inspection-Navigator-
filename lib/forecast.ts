// Simple moving average forecast with naive band
export function forecastSeries(history: { date: string; value: number }[], horizon = 14) {
  const values = history.map(h => h.value);
  const mean = values.length ? values.reduce((a,b)=>a+b,0) / values.length : 0;
  const forecast = Array.from({length: horizon}).map((_,i)=>({
    date: datePlus(history.at(-1)?.date ?? todayISO(), i+1),
    value: Math.max(0, Math.round(mean))
  }));
  const lower = forecast.map(f => ({ date: f.date, value: Math.max(0, Math.round(f.value * 0.8)) }));
  const upper = forecast.map(f => ({ date: f.date, value: Math.round(f.value * 1.2) }));
  return { forecast, lower, upper };
}

function todayISO() { return new Date().toISOString().slice(0,10); }
function datePlus(iso: string, days: number) {
  const d = new Date(iso); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10);
}
