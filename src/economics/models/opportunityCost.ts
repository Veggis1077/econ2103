/**
 * Chapter 1: opportunity cost of a choice = explicit cost of the choice + the net
 * value of the best alternative given up. (Anne's Saturday-evening example.)
 */
export interface Option {
  name: string;
  /** Money paid for the option (ticket price, food…). */
  price: number;
  /** Benefit / willingness to pay for the option. */
  benefit: number;
}

export interface OptionAnalysis extends Option {
  netValue: number;
  bestAlternative: string | null;
  opportunityCost: number;
  /** Economic profit of choosing it: benefit − opportunity cost (≥ 0 only for the best choice). */
  economicSurplus: number;
}

export function analyseChoices(options: Option[]): { analysis: OptionAnalysis[]; best: string | null } {
  const net = options.map((o) => ({ ...o, netValue: o.benefit - o.price }));
  const analysis = net.map((o, i) => {
    const alternatives = net.filter((_, j) => j !== i);
    // Doing nothing (net value 0) is always an alternative.
    const bestAlt = alternatives.reduce<{ name: string | null; v: number }>((best, a) => (a.netValue > best.v ? { name: a.name, v: a.netValue } : best), { name: null, v: 0 });
    const opportunityCost = o.price + bestAlt.v;
    return { ...o, bestAlternative: bestAlt.name, opportunityCost, economicSurplus: o.benefit - opportunityCost };
  });
  const bestOpt = net.reduce<{ name: string | null; v: number }>((b, o) => (o.netValue > b.v ? { name: o.name, v: o.netValue } : b), { name: null, v: 0 });
  return { analysis, best: bestOpt.name };
}

/** Marginal decision rule: go ahead iff marginal benefit ≥ marginal cost. Sunk costs never enter. */
export function marginalDecision(marginalBenefit: number, marginalCost: number) {
  return { worthIt: marginalBenefit >= marginalCost, netGain: marginalBenefit - marginalCost };
}
