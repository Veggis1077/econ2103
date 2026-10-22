import { averageTotalCost, averageVariableCost, marginalCost, minAverageTotalCost, minAverageVariableCost, totalCost, type CubicCost } from './costs';

export type FirmDecision = 'produce at a profit' | 'produce at a loss (short run)' | 'break even' | 'shut down';

export interface CompetitiveFirmOutcome {
  price: number;
  /** Profit-maximising output (0 if the firm shuts down). */
  quantity: number;
  revenue: number;
  totalCost: number;
  profit: number;
  averageTotalCost: number;
  averageVariableCost: number;
  marginalCost: number;
  /** Shutdown price = min AVC; break-even price = min ATC. */
  shutdownPrice: number;
  breakEvenPrice: number;
  decision: FirmDecision;
  /** Long run: firms enter if P > min ATC, exit if P < min ATC. */
  longRun: 'entry' | 'exit' | 'zero economic profit';
}

/**
 * Price-taking firm with cubic costs. Short run: choose q where P = MC on the
 * rising part of MC; produce only if P ≥ AVC (otherwise shut down and lose F).
 */
export function calculateCompetitiveFirm(c: CubicCost, price: number): CompetitiveFirmOutcome {
  const shutdown = minAverageVariableCost(c);
  const breakEven = minAverageTotalCost(c);
  const q = quantityWherePriceEqualsRisingMC(c, price);
  const produce = q > 0 && price >= averageVariableCost(c, q) - 1e-9 && price >= shutdown.value - 1e-9;
  const quantity = produce ? q : 0;
  const revenue = price * quantity;
  const tc = totalCost(c, quantity);
  const profit = revenue - tc;
  const tol = 1e-6 * Math.max(1, Math.abs(tc));
  const decision: FirmDecision = !produce ? 'shut down' : Math.abs(profit) <= tol ? 'break even' : profit > 0 ? 'produce at a profit' : 'produce at a loss (short run)';
  const longRun = Math.abs(price - breakEven.value) < 1e-6 ? 'zero economic profit' : price > breakEven.value ? 'entry' : 'exit';
  return {
    price,
    quantity,
    revenue,
    totalCost: tc,
    profit,
    averageTotalCost: quantity > 0 ? averageTotalCost(c, quantity) : NaN,
    averageVariableCost: quantity > 0 ? averageVariableCost(c, quantity) : NaN,
    marginalCost: marginalCost(c, quantity),
    shutdownPrice: shutdown.value,
    breakEvenPrice: breakEven.value,
    decision,
    longRun,
  };
}

/** Largest root of MC(q) = P (the root on the upward-sloping part of MC); 0 if none. */
export function quantityWherePriceEqualsRisingMC(c: CubicCost, price: number): number {
  const A = 3 * c.gamma;
  const B = -2 * c.beta;
  const C = c.alpha - price;
  if (A === 0) {
    if (B === 0) return 0;
    const q = -C / B;
    return q > 0 ? q : 0;
  }
  const disc = B * B - 4 * A * C;
  if (disc < 0) return 0;
  const q = (-B + Math.sqrt(disc)) / (2 * A);
  return q > 0 ? q : 0;
}

/**
 * Quadratic-cost firm TC = F + a·q + (k/2)·q² (MC = a + k·q), e.g. Ch.15 problem 11
 * (TC = 50 + ½q², MC = q). Short-run supply q = (P − a)/k for P ≥ a.
 */
export interface QuadraticCost { fixed: number; a: number; k: number }

export function quadraticFirm(c: QuadraticCost, price: number) {
  const q = Math.max(0, (price - c.a) / c.k);
  const tc = c.fixed + c.a * q + (c.k / 2) * q * q;
  const efficientScale = Math.sqrt((2 * c.fixed) / c.k);
  const minATC = c.a + c.k * efficientScale;
  return { quantity: q, profit: price * q - tc, totalCost: tc, efficientScale, minATC };
}

/** Long-run competitive equilibrium with identical quadratic-cost firms and linear demand Q = A − B·P. */
export function longRunEquilibrium(c: QuadraticCost, demandIntercept: number, demandSlope: number) {
  const { efficientScale, minATC } = quadraticFirm(c, 0);
  const quantity = demandIntercept - demandSlope * minATC;
  return { price: minATC, quantity, perFirm: efficientScale, firms: quantity / efficientScale };
}

/** Short-run equilibrium with n identical quadratic-cost firms and demand Q = A − B·P. */
export function shortRunEquilibrium(c: QuadraticCost, n: number, demandIntercept: number, demandSlope: number) {
  // Market supply Q = n(P − a)/k ; set equal to A − B·P.
  const price = (demandIntercept + (n * c.a) / c.k) / (demandSlope + n / c.k);
  const firm = quadraticFirm(c, price);
  return { price, quantity: n * firm.quantity, perFirm: firm.quantity, profitPerFirm: firm.profit };
}
