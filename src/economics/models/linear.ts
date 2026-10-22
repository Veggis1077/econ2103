/**
 * Linear market model.
 *
 * Curves are written in inverse ("price as a function of quantity") form, which
 * is how they are drawn in the course (price on the vertical axis):
 *   Demand:  P = a − b·Q   (a > 0, b > 0)
 *   Supply:  P = c + d·Q   (c ≥ 0, d > 0)
 */
export interface LinearDemand {
  /** Price intercept (choke price): willingness to pay of the first unit. */
  a: number;
  /** Absolute slope: how much the price must fall to sell one more unit. */
  b: number;
}

export interface LinearSupply {
  /** Price intercept: cost of the first (cheapest) unit. */
  c: number;
  /** Slope: how much the marginal cost rises per extra unit. */
  d: number;
}

export interface Equilibrium {
  quantity: number;
  price: number;
}

export const demandPrice = (D: LinearDemand, q: number): number => D.a - D.b * q;
export const supplyPrice = (S: LinearSupply, q: number): number => S.c + S.d * q;

/** Quantity demanded at price p (never negative). */
export const demandQuantity = (D: LinearDemand, p: number): number => Math.max(0, (D.a - p) / D.b);

/** Quantity supplied at price p (never negative). */
export const supplyQuantity = (S: LinearSupply, p: number): number => Math.max(0, (p - S.c) / S.d);

/** Demand intercept on the quantity axis. */
export const demandQuantityIntercept = (D: LinearDemand): number => D.a / D.b;

/**
 * Market equilibrium where quantity supplied equals quantity demanded.
 * Returns quantity 0 (and price = demand intercept) when even the first unit
 * costs more than any buyer is willing to pay (c ≥ a): no trade happens.
 */
export function calculateEquilibrium(D: LinearDemand, S: LinearSupply): Equilibrium {
  assertCurves(D, S);
  if (S.c >= D.a) return { quantity: 0, price: D.a };
  const quantity = (D.a - S.c) / (D.b + S.d);
  return { quantity, price: demandPrice(D, quantity) };
}

/** Shift a demand curve horizontally by `dq` units (positive = rightward = increase in demand). */
export const shiftDemand = (D: LinearDemand, dq: number): LinearDemand => ({ a: D.a + D.b * dq, b: D.b });

/** Shift a supply curve horizontally by `dq` units (positive = rightward = increase in supply). */
export const shiftSupply = (S: LinearSupply, dq: number): LinearSupply => ({ c: S.c - S.d * dq, d: S.d });

/** Build an inverse linear curve through two (Q, P) points. */
export function lineThrough(q1: number, p1: number, q2: number, p2: number): { intercept: number; slope: number } {
  if (q1 === q2) throw new Error('lineThrough: points must have different quantities');
  const slope = (p2 - p1) / (q2 - q1);
  return { intercept: p1 - slope * q1, slope };
}

export function assertCurves(D: LinearDemand, S: LinearSupply): void {
  if (!(D.b > 0)) throw new Error('Demand slope b must be positive (downward-sloping demand).');
  if (!(S.d > 0)) throw new Error('Supply slope d must be positive (upward-sloping supply).');
}
