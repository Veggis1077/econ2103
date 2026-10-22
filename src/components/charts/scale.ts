export type Tick = number | { v: number; label: string; dy?: number };

export const tickDy = (t: Tick) => (typeof t === 'number' ? 0 : t.dy ?? 0);

/** "Nice" tick values (1, 2, 2.5, 5 × 10^k) covering [min, max]. */
export function niceTicks(min: number, max: number, count = 6): number[] {
  if (!(max > min)) return [min];
  const span = max - min;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 2.25 ? 2 : norm < 3.5 ? 2.5 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(min / step - 1e-9) * step;
  const out: number[] = [];
  for (let v = start; v <= max + step * 1e-6; v += step) out.push(Math.round(v / step) * step);
  return out;
}

export const tickValue = (t: Tick) => (typeof t === 'number' ? t : t.v);
export const tickLabel = (t: Tick) => (typeof t === 'number' ? formatTick(t) : t.label);

export function formatTick(v: number): string {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-US');
  return String(Math.round(v * 1000) / 1000);
}

/** Sample y = f(x) on [x0, x1]. */
export function sample(f: (x: number) => number, x0: number, x1: number, n = 80): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = f(x);
    if (Number.isFinite(y)) pts.push([x, y]);
  }
  return pts;
}

/** Polygon for the region between upper(x) and lower(x) on [x0, x1]. */
export function between(upper: (x: number) => number, lower: (x: number) => number, x0: number, x1: number, n = 60): [number, number][] {
  if (!(x1 > x0)) return [];
  return [...sample(upper, x0, x1, n), ...sample(lower, x0, x1, n).reverse()];
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
