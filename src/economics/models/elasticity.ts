export type ElasticityClass = 'perfectly inelastic' | 'inelastic' | 'unit elastic' | 'elastic' | 'perfectly elastic';

export interface MidpointElasticity {
  /** Percentage change in quantity, midpoint method (signed, as a fraction: 0.1 = 10%). */
  pctChangeQuantity: number;
  /** Percentage change in price, midpoint method (signed fraction). */
  pctChangePrice: number;
  /** Absolute value of the elasticity, as reported in the course (minus sign dropped). */
  elasticity: number;
  classification: ElasticityClass;
}

/** Percentage change using the midpoint (arc) method: (x₂ − x₁) / ((x₁ + x₂)/2). */
export function midpointPercentChange(x1: number, x2: number): number {
  const mid = (x1 + x2) / 2;
  if (mid === 0) return 0;
  return (x2 - x1) / mid;
}

/**
 * Price elasticity between (Q₁, P₁) and (Q₂, P₂) using the midpoint method.
 * Works for demand and supply alike (the value is reported as an absolute value).
 */
export function calculateElasticity(q1: number, q2: number, p1: number, p2: number): MidpointElasticity {
  const pctChangeQuantity = midpointPercentChange(q1, q2);
  const pctChangePrice = midpointPercentChange(p1, p2);
  let elasticity: number;
  if (pctChangePrice === 0) elasticity = pctChangeQuantity === 0 ? 0 : Infinity;
  else elasticity = Math.abs(pctChangeQuantity / pctChangePrice);
  return { pctChangeQuantity, pctChangePrice, elasticity, classification: classifyElasticity(elasticity) };
}

/** General elasticity of Y with respect to X (income, cross-price…), signed, midpoint method. */
export function calculateGeneralElasticity(x1: number, x2: number, y1: number, y2: number): number {
  const px = midpointPercentChange(x1, x2);
  if (px === 0) throw new Error('X must change to compute an elasticity');
  return midpointPercentChange(y1, y2) / px;
}

export function classifyElasticity(e: number, tolerance = 1e-9): ElasticityClass {
  if (!Number.isFinite(e)) return 'perfectly elastic';
  if (Math.abs(e) <= tolerance) return 'perfectly inelastic';
  if (Math.abs(e - 1) <= 1e-6) return 'unit elastic';
  return e > 1 ? 'elastic' : 'inelastic';
}

/** Point elasticity on a linear inverse demand P = a − bQ at (Q, P): |ε| = (1/b)·(P/Q). */
export function pointElasticityLinear(b: number, price: number, quantity: number): number {
  if (quantity <= 0) return Infinity;
  return price / (b * quantity);
}

export interface RevenueChange {
  before: number;
  after: number;
  change: number;
  /** Revenue gained on the units still sold at the higher price (rectangle "A" in the course figure). */
  priceEffect: number;
  /** Revenue lost/gained from the change in units sold (rectangle "D"). */
  quantityEffect: number;
}

/**
 * Total revenue P×Q before and after a move along the demand curve, split into
 * the two rectangles used in the lecture: price effect (ΔP × the smaller quantity)
 * and quantity effect (ΔQ × the lower price).
 */
export function totalRevenueChange(q1: number, p1: number, q2: number, p2: number): RevenueChange {
  const before = p1 * q1;
  const after = p2 * q2;
  const priceEffect = (p2 - p1) * Math.min(q1, q2);
  const quantityEffect = (q2 - q1) * Math.min(p1, p2);
  return { before, after, change: after - before, priceEffect, quantityEffect };
}

/** Classify a good by income elasticity (course definitions). */
export function classifyIncomeElasticity(e: number): 'inferior' | 'necessity' | 'luxury' {
  if (e < 0) return 'inferior';
  return e < 1 ? 'necessity' : 'luxury';
}

/** Cross-price elasticity sign → relationship between goods. */
export function classifyCrossPrice(e: number): 'substitutes' | 'complements' | 'unrelated' {
  if (Math.abs(e) < 1e-9) return 'unrelated';
  return e > 0 ? 'substitutes' : 'complements';
}
