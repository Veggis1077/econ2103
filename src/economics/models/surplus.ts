import { calculateEquilibrium, demandPrice, demandQuantity, supplyPrice, supplyQuantity, type LinearDemand, type LinearSupply } from './linear';

/**
 * Consumer surplus when `quantity` units are bought at `price`, assuming the
 * units go to the buyers with the highest willingness to pay:
 *   CS = ∫₀^Q (D(q) − P) dq = (a − P)·Q − b·Q²/2
 */
export function calculateConsumerSurplus(D: LinearDemand, price: number, quantity = demandQuantity(D, price)): number {
  const q = Math.max(0, quantity);
  return Math.max(0, (D.a - price) * q - (D.b * q * q) / 2);
}

/**
 * Producer surplus when `quantity` units are sold at `price` by the lowest-cost sellers:
 *   PS = ∫₀^Q (P − S(q)) dq = (P − c)·Q − d·Q²/2
 */
export function calculateProducerSurplus(S: LinearSupply, price: number, quantity = supplyQuantity(S, price)): number {
  const q = Math.max(0, quantity);
  return Math.max(0, (price - S.c) * q - (S.d * q * q) / 2);
}

/** Total surplus = value to buyers − cost to sellers for the first Q units: ∫₀^Q (D(q) − S(q)) dq. */
export function calculateTotalSurplus(D: LinearDemand, S: LinearSupply, quantity: number): number {
  const q = Math.max(0, quantity);
  return (D.a - S.c) * q - ((D.b + S.d) * q * q) / 2;
}

/**
 * Deadweight loss from trading `quantity` instead of the efficient (equilibrium)
 * quantity. Works for under-production (taxes, price controls, monopoly) and
 * over-production (subsidies): DWL = TS(Q*) − TS(Q) ≥ 0.
 */
export function calculateDeadweightLoss(D: LinearDemand, S: LinearSupply, quantity: number): number {
  const eq = calculateEquilibrium(D, S);
  return Math.max(0, calculateTotalSurplus(D, S, eq.quantity) - calculateTotalSurplus(D, S, quantity));
}

export interface MarketWelfare {
  equilibrium: { quantity: number; price: number };
  consumerSurplus: number;
  producerSurplus: number;
  totalSurplus: number;
}

/** Welfare at the free-market equilibrium. */
export function marketWelfare(D: LinearDemand, S: LinearSupply): MarketWelfare {
  const equilibrium = calculateEquilibrium(D, S);
  const consumerSurplus = calculateConsumerSurplus(D, equilibrium.price, equilibrium.quantity);
  const producerSurplus = calculateProducerSurplus(S, equilibrium.price, equilibrium.quantity);
  return { equilibrium, consumerSurplus, producerSurplus, totalSurplus: consumerSurplus + producerSurplus };
}

/** Welfare at an arbitrary (possibly non-equilibrium) market price where trade is min(Qd, Qs). */
export function welfareAtPrice(D: LinearDemand, S: LinearSupply, price: number) {
  const qd = demandQuantity(D, price);
  const qs = supplyQuantity(S, price);
  const traded = Math.min(qd, qs);
  const consumerSurplus = calculateConsumerSurplus(D, price, traded);
  const producerSurplus = calculateProducerSurplus(S, price, traded);
  return {
    price,
    quantityDemanded: qd,
    quantitySupplied: qs,
    quantityTraded: traded,
    consumerSurplus,
    producerSurplus,
    totalSurplus: consumerSurplus + producerSurplus,
    deadweightLoss: calculateDeadweightLoss(D, S, traded),
    marginalBuyerValue: demandPrice(D, traded),
    marginalSellerCost: supplyPrice(S, traded),
  };
}

// ---------------------------------------------------------------------------
// Discrete (step) markets: individual buyers' willingness to pay and sellers' costs
// ---------------------------------------------------------------------------

export interface DiscreteOutcome {
  units: number;
  surplus: number;
  /** Surplus of each unit that trades, in order. */
  perUnit: number[];
}

/** Buyers with WTP ≥ price buy one unit each; CS = Σ (WTP − P). */
export function discreteConsumerSurplus(willingnessToPay: number[], price: number): DiscreteOutcome {
  const perUnit = [...willingnessToPay].sort((x, y) => y - x).filter((w) => w >= price).map((w) => w - price);
  return { units: perUnit.length, surplus: sum(perUnit), perUnit };
}

/** Sellers with cost ≤ price sell one unit each; PS = Σ (P − cost). */
export function discreteProducerSurplus(costs: number[], price: number): DiscreteOutcome {
  const perUnit = [...costs].sort((x, y) => x - y).filter((c) => c <= price).map((c) => price - c);
  return { units: perUnit.length, surplus: sum(perUnit), perUnit };
}

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
