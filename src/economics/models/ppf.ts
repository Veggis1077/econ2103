/**
 * Production possibilities with constant opportunity cost (straight-line PPF),
 * as used for individuals in Chapter 3, plus a bowed-out PPF for Chapter 2.
 */
export interface Producer {
  name: string;
  /** Maximum output of good X if all resources go to X. */
  maxX: number;
  /** Maximum output of good Y if all resources go to Y. */
  maxY: number;
}

/** Build a producer from "time needed per unit" data (e.g. minutes per ounce) and total time available. */
export function producerFromTimes(name: string, timePerX: number, timePerY: number, totalTime: number): Producer {
  if (timePerX <= 0 || timePerY <= 0) throw new Error('Time per unit must be positive');
  return { name, maxX: totalTime / timePerX, maxY: totalTime / timePerY };
}

/** Opportunity cost of one unit of X, measured in units of Y given up (= |slope| of the PPF). */
export const opportunityCostOfX = (p: Producer): number => p.maxY / p.maxX;
/** Opportunity cost of one unit of Y, in units of X. Always the reciprocal of the cost of X. */
export const opportunityCostOfY = (p: Producer): number => p.maxX / p.maxY;

/** Maximum Y attainable when producing x units of X on a straight-line PPF. */
export const linearPPF = (p: Producer, x: number): number => Math.max(0, p.maxY * (1 - x / p.maxX));

export type PointStatus = 'efficient' | 'inefficient' | 'unattainable';

export function classifyPoint(frontierY: (x: number) => number, maxX: number, x: number, y: number, tolerance = 1e-6): PointStatus {
  if (x < -tolerance || y < -tolerance) return 'unattainable';
  if (x > maxX + tolerance) return 'unattainable';
  const yMax = frontierY(Math.min(x, maxX));
  if (y > yMax + tolerance * Math.max(1, yMax)) return 'unattainable';
  if (Math.abs(y - yMax) <= tolerance * Math.max(1, yMax) * 10) return 'efficient';
  return 'inefficient';
}

export interface AdvantageAnalysis {
  /** Who can produce more of X with the same resources (ties → null). */
  absoluteAdvantageX: string | null;
  absoluteAdvantageY: string | null;
  /** Who has the lower opportunity cost of X (ties → null: no gains from trade). */
  comparativeAdvantageX: string | null;
  comparativeAdvantageY: string | null;
  opportunityCosts: { name: string; costOfX: number; costOfY: number }[];
  /** Range of prices of X (in units of Y) at which both gain from trade; null if equal costs. */
  tradePriceRangeX: [number, number] | null;
  gainsFromTradePossible: boolean;
}

/** Compare two producers (absolute vs comparative advantage, terms of trade). */
export function calculateOpportunityCost(a: Producer, b: Producer): AdvantageAnalysis {
  const ocA = opportunityCostOfX(a);
  const ocB = opportunityCostOfX(b);
  const eq = (u: number, v: number) => Math.abs(u - v) < 1e-12 * Math.max(1, Math.abs(u), Math.abs(v));
  const pick = (u: number, v: number, higherWins: boolean) => (eq(u, v) ? null : (higherWins ? u > v : u < v) ? a.name : b.name);
  const gains = !eq(ocA, ocB);
  return {
    absoluteAdvantageX: pick(a.maxX, b.maxX, true),
    absoluteAdvantageY: pick(a.maxY, b.maxY, true),
    comparativeAdvantageX: pick(ocA, ocB, false),
    comparativeAdvantageY: gains ? (ocA < ocB ? b.name : a.name) : null,
    opportunityCosts: [
      { name: a.name, costOfX: ocA, costOfY: 1 / ocA },
      { name: b.name, costOfX: ocB, costOfY: 1 / ocB },
    ],
    tradePriceRangeX: gains ? [Math.min(ocA, ocB), Math.max(ocA, ocB)] : null,
    gainsFromTradePossible: gains,
  };
}

export interface Bundle { x: number; y: number }

export interface TradeScenario {
  /** Share of each producer's resources devoted to good X (0–1), keyed by name. */
  shareOnX: Record<string, number>;
  /** Name of the producer who ships X to the other in exchange for Y. */
  xExporter: string;
  /** Units of X shipped. */
  unitsOfX: number;
  /** Units of Y received in return. */
  unitsOfY: number;
}

export interface TradeOutcome {
  production: Record<string, Bundle>;
  consumption: Record<string, Bundle>;
  gains: Record<string, Bundle>;
  /** Each consumes at least as much of both goods, and strictly more of something. */
  bothBetterOff: boolean;
  /** Implied price of one X in units of Y. */
  priceOfX: number;
}

/** Output of a linear producer who devotes `shareOnX` of resources to X. */
export const produce = (p: Producer, shareOnX: number): Bundle => ({ x: p.maxX * shareOnX, y: p.maxY * (1 - shareOnX) });

/**
 * Production + trade → consumption, compared with a no-trade consumption bundle.
 * Reproduces the Frank/Ruby parable: Frank 100% potatoes, Ruby 75% meat, trade 5 oz meat for 15 oz potatoes.
 */
export function simulateTrade(a: Producer, b: Producer, noTrade: Record<string, Bundle>, s: TradeScenario): TradeOutcome {
  const production: Record<string, Bundle> = { [a.name]: produce(a, s.shareOnX[a.name] ?? 0), [b.name]: produce(b, s.shareOnX[b.name] ?? 0) };
  const consumption: Record<string, Bundle> = {};
  const gains: Record<string, Bundle> = {};
  for (const p of [a, b]) {
    const exporter = p.name === s.xExporter;
    const prod = production[p.name];
    consumption[p.name] = exporter ? { x: prod.x - s.unitsOfX, y: prod.y + s.unitsOfY } : { x: prod.x + s.unitsOfX, y: prod.y - s.unitsOfY };
    gains[p.name] = { x: consumption[p.name].x - noTrade[p.name].x, y: consumption[p.name].y - noTrade[p.name].y };
  }
  const eps = 1e-9;
  const bothBetterOff = [a.name, b.name].every((n) => gains[n].x >= -eps && gains[n].y >= -eps && gains[n].x + gains[n].y > eps);
  return { production, consumption, gains, bothBetterOff, priceOfX: s.unitsOfX > 0 ? s.unitsOfY / s.unitsOfX : NaN };
}

/**
 * Joint (economy) PPF for two linear producers: start with all resources in Y and
 * move the producer with the lower opportunity cost of X into X first. Returns the
 * kinked frontier's vertices from x = 0 to x = maxX_total.
 */
export function jointPPF(a: Producer, b: Producer): Bundle[] {
  const [first, second] = opportunityCostOfX(a) <= opportunityCostOfX(b) ? [a, b] : [b, a];
  return [
    { x: 0, y: a.maxY + b.maxY },
    { x: first.maxX, y: second.maxY },
    { x: a.maxX + b.maxX, y: 0 },
  ];
}

/**
 * Bowed-out (concave) PPF: y = Ymax · (1 − (x/Xmax)^k)^(1/k) with curvature k ≥ 1
 * (k = 1 is a straight line, larger k bows out more). Increasing opportunity cost
 * reflects resource specialisation (Chapter 2).
 */
export function bowedPPF(maxX: number, maxY: number, k: number, x: number): number {
  if (x <= 0) return maxY;
  if (x >= maxX) return 0;
  return maxY * Math.pow(1 - Math.pow(x / maxX, k), 1 / k);
}

/** Marginal opportunity cost of X on the bowed PPF at x (|dy/dx|), numerically. */
export function bowedOpportunityCost(maxX: number, maxY: number, k: number, x: number): number {
  const h = maxX * 1e-5;
  const x0 = Math.max(0, Math.min(maxX - h, x));
  return Math.abs((bowedPPF(maxX, maxY, k, x0 + h) - bowedPPF(maxX, maxY, k, x0)) / h);
}
