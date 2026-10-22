import { calculateEquilibrium, demandQuantity, supplyQuantity, type LinearDemand, type LinearSupply } from './linear';
import { calculateConsumerSurplus, calculateDeadweightLoss, calculateProducerSurplus } from './surplus';

export type PriceControlKind = 'ceiling' | 'floor';

export interface PriceControlOutcome {
  kind: PriceControlKind;
  level: number;
  /** A ceiling binds only below the equilibrium price; a floor only above it. */
  binding: boolean;
  marketPrice: number;
  quantityDemanded: number;
  quantitySupplied: number;
  quantityTraded: number;
  shortage: number;
  surplus: number;
  consumerSurplus: number;
  producerSurplus: number;
  deadweightLoss: number;
}

/**
 * Effect of a legal maximum (ceiling) or minimum (floor) price.
 * Surplus figures assume efficient rationing (the goods go to the buyers who value
 * them most and are made by the lowest-cost sellers). Real rationing — queues,
 * discrimination — makes the true welfare loss larger, as the lecture notes stress.
 */
export function calculatePriceControl(D: LinearDemand, S: LinearSupply, kind: PriceControlKind, level: number): PriceControlOutcome {
  const eq = calculateEquilibrium(D, S);
  const binding = kind === 'ceiling' ? level < eq.price : level > eq.price;
  const marketPrice = binding ? level : eq.price;
  const quantityDemanded = binding ? demandQuantity(D, marketPrice) : eq.quantity;
  const quantitySupplied = binding ? supplyQuantity(S, marketPrice) : eq.quantity;
  const quantityTraded = Math.min(quantityDemanded, quantitySupplied);
  return {
    kind,
    level,
    binding,
    marketPrice,
    quantityDemanded,
    quantitySupplied,
    quantityTraded,
    shortage: Math.max(0, quantityDemanded - quantitySupplied),
    surplus: Math.max(0, quantitySupplied - quantityDemanded),
    consumerSurplus: calculateConsumerSurplus(D, marketPrice, quantityTraded),
    producerSurplus: calculateProducerSurplus(S, marketPrice, quantityTraded),
    deadweightLoss: calculateDeadweightLoss(D, S, quantityTraded),
  };
}
