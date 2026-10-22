import type { LinearDemand } from './linear';

/**
 * Monopoly with linear demand P = a − b·Q and cost TC = F + c·Q + (e/2)·Q²
 * (MC = c + e·Q; e = 0 gives constant marginal cost).
 */
export interface MonopolyCost {
  fixed: number;
  /** Intercept of marginal cost. */
  c: number;
  /** Slope of marginal cost. */
  e: number;
}

export const monopolyMC = (k: MonopolyCost, q: number) => k.c + k.e * q;
export const monopolyTC = (k: MonopolyCost, q: number) => k.fixed + k.c * q + (k.e / 2) * q * q;
export const monopolyATC = (k: MonopolyCost, q: number) => (q > 0 ? monopolyTC(k, q) / q : Infinity);
/** Marginal revenue for linear demand: twice as steep as demand. */
export const marginalRevenue = (D: LinearDemand, q: number) => D.a - 2 * D.b * q;

export interface MonopolyOutcome {
  quantity: number;
  price: number;
  marginalRevenue: number;
  marginalCost: number;
  averageTotalCost: number;
  revenue: number;
  totalCost: number;
  profit: number;
  consumerSurplus: number;
  /** Producer surplus = revenue − variable cost. */
  producerSurplus: number;
  deadweightLoss: number;
  /** Benchmark where P = MC (efficient / competitive quantity). */
  competitive: { quantity: number; price: number; consumerSurplus: number; producerSurplus: number };
  /** Markup of price over marginal cost at the optimum. */
  markup: number;
  /** Would the monopolist rather not produce (price below AVC)? */
  shutsDown: boolean;
}

/** Profit maximum: MR = MC ⇒ Q_M = (a − c)/(2b + e); price read off the demand curve. */
export function calculateMonopolyOptimum(D: LinearDemand, k: MonopolyCost): MonopolyOutcome {
  const qInterior = Math.max(0, (D.a - k.c) / (2 * D.b + k.e));
  const avcAt = (q: number) => k.c + (k.e / 2) * q;
  const pAt = (q: number) => D.a - D.b * q;
  const shutsDown = qInterior <= 0 || pAt(qInterior) < avcAt(qInterior);
  const quantity = shutsDown ? 0 : qInterior;
  const price = quantity > 0 ? pAt(quantity) : D.a;
  const revenue = price * quantity;
  const totalCost = monopolyTC(k, quantity);
  const qc = Math.max(0, (D.a - k.c) / (D.b + k.e));
  const pc = pAt(qc);
  const ts = (q: number) => (D.a - k.c) * q - ((D.b + k.e) * q * q) / 2;
  return {
    quantity,
    price,
    marginalRevenue: marginalRevenue(D, quantity),
    marginalCost: monopolyMC(k, quantity),
    averageTotalCost: monopolyATC(k, quantity),
    revenue,
    totalCost,
    profit: revenue - totalCost,
    consumerSurplus: (D.b * quantity * quantity) / 2,
    producerSurplus: revenue - (k.c * quantity + (k.e / 2) * quantity * quantity),
    deadweightLoss: ts(qc) - ts(quantity),
    competitive: { quantity: qc, price: pc, consumerSurplus: (D.b * qc * qc) / 2, producerSurplus: (k.e * qc * qc) / 2 },
    markup: price - monopolyMC(k, quantity),
    shutsDown,
  };
}

/** Marginal revenue of one extra unit from a two-point demand schedule (e.g. 300 @ $45 vs 301 @ $44.60). */
export const discreteMarginalRevenue = (q1: number, p1: number, q2: number, p2: number) => (p2 * q2 - p1 * q1) / (q2 - q1);
