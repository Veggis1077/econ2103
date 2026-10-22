import { calculateEquilibrium, demandPrice, type LinearDemand, type LinearSupply } from './linear';
import { calculateDeadweightLoss } from './surplus';

export interface TaxOutcome {
  tax: number;
  /** Equilibrium without the tax. */
  before: { quantity: number; price: number };
  quantity: number;
  /** Price paid by buyers (including the tax). */
  buyerPrice: number;
  /** Price received by sellers (after paying the tax). */
  sellerPrice: number;
  revenue: number;
  consumerSurplus: number;
  producerSurplus: number;
  deadweightLoss: number;
  /** Fraction of the tax borne by buyers (0–1): (P_B − P*) / t. */
  buyerShare: number;
  sellerShare: number;
  /** Change in CS and PS relative to no tax (both ≤ 0). */
  consumerSurplusLoss: number;
  producerSurplusLoss: number;
}

/**
 * Per-unit tax of size t. Whether the tax is levied on buyers (demand shifts down
 * by t) or on sellers (supply shifts up by t) the outcome is identical: a wedge of t
 * between the price buyers pay and the price sellers receive.
 *
 *   Q_T = (a − c − t) / (b + d),   P_B = a − b·Q_T,   P_S = P_B − t
 */
export function calculateTaxIncidence(D: LinearDemand, S: LinearSupply, tax: number): TaxOutcome {
  if (tax < 0) throw new Error('Tax must be non-negative (use calculateSubsidy for subsidies).');
  const before = calculateEquilibrium(D, S);
  const quantity = Math.max(0, (D.a - S.c - tax) / (D.b + S.d));
  // If the tax eliminates the market, report the limiting prices at Q = 0.
  const buyerPrice = quantity > 0 ? demandPrice(D, quantity) : D.a;
  const sellerPrice = quantity > 0 ? buyerPrice - tax : S.c;
  const consumerSurplus = (D.b * quantity * quantity) / 2;
  const producerSurplus = (S.d * quantity * quantity) / 2;
  const csBefore = (D.b * before.quantity ** 2) / 2;
  const psBefore = (S.d * before.quantity ** 2) / 2;
  // Incidence follows from slopes: buyers bear b/(b+d) of the tax (steeper demand ⇒ larger share).
  const buyerShare = tax > 0 && quantity > 0 ? (buyerPrice - before.price) / tax : D.b / (D.b + S.d);
  return {
    tax,
    before,
    quantity,
    buyerPrice,
    sellerPrice,
    revenue: tax * quantity,
    consumerSurplus,
    producerSurplus,
    deadweightLoss: calculateDeadweightLoss(D, S, quantity),
    buyerShare,
    sellerShare: 1 - buyerShare,
    consumerSurplusLoss: csBefore - consumerSurplus,
    producerSurplusLoss: psBefore - producerSurplus,
  };
}

/** Deadweight loss of a tax computed directly (triangle formula): ½ · t · (Q* − Q_T). */
export const taxDeadweightLoss = (D: LinearDemand, S: LinearSupply, tax: number): number =>
  calculateTaxIncidence(D, S, tax).deadweightLoss;

/** The tax that maximises revenue on a linear market (peak of the Laffer curve): t = (a − c)/2. */
export const revenueMaximizingTax = (D: LinearDemand, S: LinearSupply): number => Math.max(0, (D.a - S.c) / 2);

/** Sample the Laffer curve (revenue) and deadweight loss for taxes from 0 to the prohibitive tax. */
export function lafferCurve(D: LinearDemand, S: LinearSupply, steps = 60) {
  const maxTax = Math.max(0, D.a - S.c);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = (maxTax * i) / steps;
    const o = calculateTaxIncidence(D, S, t);
    return { tax: t, revenue: o.revenue, deadweightLoss: o.deadweightLoss };
  });
}

export interface SubsidyOutcome {
  subsidy: number;
  quantity: number;
  buyerPrice: number;
  sellerPrice: number;
  governmentCost: number;
  consumerSurplus: number;
  producerSurplus: number;
  deadweightLoss: number;
  buyerShare: number;
}

/** Per-unit subsidy s: sellers receive s more than buyers pay. Quantity rises above the efficient level. */
export function calculateSubsidy(D: LinearDemand, S: LinearSupply, subsidy: number): SubsidyOutcome {
  const before = calculateEquilibrium(D, S);
  const quantity = Math.max(0, (D.a - S.c + subsidy) / (D.b + S.d));
  const buyerPrice = demandPrice(D, quantity);
  const sellerPrice = buyerPrice + subsidy;
  return {
    subsidy,
    quantity,
    buyerPrice,
    sellerPrice,
    governmentCost: subsidy * quantity,
    consumerSurplus: (D.b * quantity * quantity) / 2,
    producerSurplus: (S.d * quantity * quantity) / 2,
    deadweightLoss: calculateDeadweightLoss(D, S, quantity),
    buyerShare: subsidy > 0 ? (before.price - buyerPrice) / subsidy : D.b / (D.b + S.d),
  };
}
