import { describe, expect, it } from 'vitest';
import {
  analyseChoices, buildCostTable, calculateCompetitiveFirm, calculateConsumerSurplus, calculateDeadweightLoss, calculateElasticity,
  calculateEquilibrium, calculateMonopolyOptimum, calculateOpportunityCost, calculatePriceControl, calculateProducerSurplus,
  calculateSubsidy, calculateTaxIncidence, classifyElasticity, classifyPoint, costTableFromVariable, discreteConsumerSurplus,
  discreteMarginalRevenue, discreteProducerSurplus, efficientScale, jointPPF, lafferCurve, lineThrough, linearPPF, longRunEquilibrium,
  marginalProducts, marketWelfare, minAverageTotalCost, minAverageVariableCost, producerFromTimes, profitComparison,
  quadraticFirm, revenueMaximizingTax, shiftDemand, shiftSupply, shortRunEquilibrium, simulateTrade, totalRevenueChange,
  bowedPPF, bowedOpportunityCost, calculateGeneralElasticity, classifyIncomeElasticity, classifyCrossPrice, welfareAtPrice,
} from '../index';

const close = (a: number, b: number, d = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(d);

// Course problem: Q^S = 2P, Q^D = 300 − P  ⇒  inverse D: P = 300 − Q, S: P = Q/2
const D300 = { a: 300, b: 1 };
const S2P = { c: 0, d: 0.5 };

describe('equilibrium', () => {
  it('solves the Ch6/Ch8 problem 10 market', () => {
    const eq = calculateEquilibrium(D300, S2P);
    close(eq.price, 100);
    close(eq.quantity, 200);
  });
  it('returns zero trade when the cheapest unit costs more than any buyer pays', () => {
    expect(calculateEquilibrium({ a: 5, b: 1 }, { c: 6, d: 1 }).quantity).toBe(0);
  });
  it('rejects non-positive slopes', () => {
    expect(() => calculateEquilibrium({ a: 5, b: 0 }, { c: 0, d: 1 })).toThrow();
    expect(() => calculateEquilibrium({ a: 5, b: 1 }, { c: 0, d: -1 })).toThrow();
  });
  it('shifts curves horizontally', () => {
    const D = shiftDemand({ a: 10, b: 1 }, 2);
    close(D.a, 12);
    const S = shiftSupply({ c: 2, d: 0.5 }, 2);
    close(S.c, 1);
  });
  it('builds lines through points', () => {
    const l = lineThrough(15, 32, 25, 24);
    close(l.slope, -0.8);
    close(l.intercept, 44);
  });
});

describe('surplus (question bank Q8/Q14 table)', () => {
  // Qd = 18 − 1.5P ⇒ P = 12 − (2/3)Q ; Qs = 3P ⇒ P = Q/3
  const D = { a: 12, b: 2 / 3 };
  const S = { c: 0, d: 1 / 3 };
  it('consumer, producer and total surplus', () => {
    const w = marketWelfare(D, S);
    close(w.equilibrium.price, 4);
    close(w.equilibrium.quantity, 12);
    close(w.consumerSurplus, 48);
    close(w.producerSurplus, 24);
    close(w.totalSurplus, 72);
  });
  it('surplus at a non-equilibrium price', () => {
    const w = welfareAtPrice(D, S, 6); // above eq: traded = Qd = 9
    close(w.quantityTraded, 9);
    close(w.consumerSurplus, 0.5 * 9 * 6);
    close(w.deadweightLoss, 0.5 * (12 - 9) * (6 - 3));
  });
  it('Q2: producer surplus of $60 on 30 biscuits costing $1 ⇒ price $3', () => {
    close(calculateProducerSurplus({ c: 1, d: 1e-12 }, 3, 30), 60, 1e-6);
  });
  it('CS is zero above the choke price', () => {
    expect(calculateConsumerSurplus(D, 20)).toBe(0);
  });
  it('discrete surplus: Bert & Ernie (Ch7 solutions)', () => {
    expect(discreteConsumerSurplus([7, 5, 3, 1], 4).surplus).toBe(4);
    expect(discreteConsumerSurplus([7, 5, 3, 1], 2).surplus).toBe(9);
    expect(discreteProducerSurplus([1, 3, 5, 7], 4).surplus).toBe(4);
    expect(discreteProducerSurplus([1, 3, 5, 7], 6).surplus).toBe(9);
  });
  it('Q7: price $0.60 consumer surplus is not $4.90', () => {
    const wtp = [2, 1.5, 0.75, 1.5, 1, 0.6, 0.75, 0.25, 0];
    close(discreteConsumerSurplus(wtp, 0.6).surplus, 3.9);
  });
});

describe('taxes', () => {
  it('Ch8 problem 10: tax T on buyers', () => {
    for (const T of [0, 30, 150, 200]) {
      const o = calculateTaxIncidence(D300, S2P, T);
      close(o.sellerPrice, 100 - T / 3);
      close(o.buyerPrice, 100 + (2 * T) / 3);
      close(o.quantity, 200 - (2 * T) / 3);
      close(o.revenue, 200 * T - (2 * T * T) / 3);
      close(o.deadweightLoss, (T * T) / 3);
    }
  });
  it('Ch6 problem 10d: $30 tax on producers ⇒ buyers pay 120, Q = 180', () => {
    const o = calculateTaxIncidence(D300, S2P, 30);
    close(o.buyerPrice, 120);
    close(o.sellerPrice, 90);
    close(o.quantity, 180);
  });
  it('incidence shares sum to one and follow relative slopes', () => {
    const o = calculateTaxIncidence(D300, S2P, 30);
    close(o.buyerShare + o.sellerShare, 1);
    close(o.buyerShare, 1 / 1.5); // buyers bear b/(b+d): here supply is flatter, so buyers pay 2/3
  });
  it('deadweight loss equals ½·t·ΔQ and CS+PS loss exceeds revenue by the DWL', () => {
    const D = { a: 44, b: 0.8 };
    const S = { c: 4, d: 0.8 };
    const o = calculateTaxIncidence(D, S, 16); // Q10: A(15,32) B(15,16)
    close(o.quantity, 15);
    close(o.deadweightLoss, 80);
    close(o.consumerSurplusLoss + o.producerSurplusLoss - o.revenue, o.deadweightLoss);
  });
  it('Q19: DWL 60,000 with quantity falling 8,000 → 7,000 ⇒ tax 120', () => {
    // Any straight-line market with Q* = 8000 where a tax of 120 cuts Q by 1000.
    const D = { a: 1000, b: 0.06 };
    const S = { c: 40, d: 0.06 };
    const eq = calculateEquilibrium(D, S);
    close(eq.quantity, 8000);
    const o = calculateTaxIncidence(D, S, 120);
    close(o.quantity, 7000);
    close(o.deadweightLoss, 60000, 1e-6);
  });
  it('prohibitive tax eliminates the market and revenue', () => {
    const o = calculateTaxIncidence(D300, S2P, 400);
    expect(o.quantity).toBe(0);
    expect(o.revenue).toBe(0);
    close(o.deadweightLoss, marketWelfare(D300, S2P).totalSurplus);
  });
  it('Laffer curve peaks at (a − c)/2', () => {
    close(revenueMaximizingTax(D300, S2P), 150);
    const pts = lafferCurve(D300, S2P, 300);
    const peak = pts.reduce((m, p) => (p.revenue > m.revenue ? p : m));
    close(peak.tax, 150, 1e-9);
    close(peak.revenue, 15000);
  });
  it('negative tax is rejected', () => {
    expect(() => calculateTaxIncidence(D300, S2P, -1)).toThrow();
  });
  it('subsidy raises quantity above efficient level and creates DWL', () => {
    const s = calculateSubsidy(D300, S2P, 30);
    close(s.quantity, 220);
    close(s.sellerPrice - s.buyerPrice, 30);
    expect(s.deadweightLoss).toBeGreaterThan(0);
    close(s.governmentCost - (s.consumerSurplus + s.producerSurplus - marketWelfare(D300, S2P).totalSurplus), s.deadweightLoss);
  });
});

describe('price controls', () => {
  it('Ch6 problem 10: binding ceiling at $90', () => {
    const o = calculatePriceControl(D300, S2P, 'ceiling', 90);
    expect(o.binding).toBe(true);
    close(o.quantitySupplied, 180);
    close(o.quantityDemanded, 210);
    close(o.shortage, 30);
  });
  it('Ch6 problem 10: floor at $90 is not binding', () => {
    const o = calculatePriceControl(D300, S2P, 'floor', 90);
    expect(o.binding).toBe(false);
    close(o.marketPrice, 100);
    expect(o.surplus).toBe(0);
    expect(o.deadweightLoss).toBe(0);
  });
  it('binding floor creates a surplus and DWL', () => {
    const o = calculatePriceControl(D300, S2P, 'floor', 120);
    close(o.quantityDemanded, 180);
    close(o.quantitySupplied, 240);
    close(o.surplus, 60);
    close(o.deadweightLoss, 0.5 * 20 * 30);
  });
});

describe('elasticity', () => {
  it('Q9: revenue 12,000 → 13,500 when price 600 → 750 ⇒ 0.47', () => {
    const e = calculateElasticity(20, 18, 600, 750);
    close(e.elasticity, 0.47368, 1e-4);
    expect(e.classification).toBe('inelastic');
  });
  it('course Figure 3: inelastic $4→$5, 100→90 raises revenue', () => {
    const r = totalRevenueChange(100, 4, 90, 5);
    close(r.before, 400);
    close(r.after, 450);
    close(r.priceEffect + r.quantityEffect, r.change);
  });
  it('revenue rectangles also decompose a price cut', () => {
    const r = totalRevenueChange(70, 5, 100, 4);
    close(r.priceEffect + r.quantityEffect, r.change);
  });
  it('classification edge cases', () => {
    expect(classifyElasticity(0)).toBe('perfectly inelastic');
    expect(classifyElasticity(Infinity)).toBe('perfectly elastic');
    expect(classifyElasticity(1)).toBe('unit elastic');
    expect(calculateElasticity(10, 20, 5, 5).classification).toBe('perfectly elastic');
    expect(calculateElasticity(10, 10, 5, 6).classification).toBe('perfectly inelastic');
  });
  it('supply elasticity example from the lecture ($3→$4, 100→200 is elastic)', () => {
    const e = calculateElasticity(100, 200, 3, 4);
    close(e.pctChangeQuantity, 2 / 3);
    close(e.pctChangePrice, 2 / 7);
    expect(e.classification).toBe('elastic');
  });
  it('income and cross-price classifications', () => {
    expect(classifyIncomeElasticity(-0.2)).toBe('inferior');
    expect(classifyIncomeElasticity(0.5)).toBe('necessity');
    expect(classifyIncomeElasticity(1.5)).toBe('luxury');
    expect(classifyCrossPrice(0.3)).toBe('substitutes');
    expect(classifyCrossPrice(-0.3)).toBe('complements');
    close(calculateGeneralElasticity(40000, 50000, 5, 8), (3 / 6.5) / (10000 / 45000));
  });
});

describe('PPF and comparative advantage', () => {
  const frank = producerFromTimes('Frank', 60, 15, 480); // meat, potatoes
  const ruby = producerFromTimes('Ruby', 20, 10, 480);
  it('reproduces the Frank/Ruby production possibilities', () => {
    expect(frank).toMatchObject({ maxX: 8, maxY: 32 });
    expect(ruby).toMatchObject({ maxX: 24, maxY: 48 });
  });
  it('opportunity costs, absolute and comparative advantage', () => {
    const a = calculateOpportunityCost(frank, ruby);
    expect(a.opportunityCosts[0].costOfX).toBe(4);
    expect(a.opportunityCosts[1].costOfX).toBe(2);
    expect(a.absoluteAdvantageX).toBe('Ruby');
    expect(a.absoluteAdvantageY).toBe('Ruby');
    expect(a.comparativeAdvantageX).toBe('Ruby');
    expect(a.comparativeAdvantageY).toBe('Frank');
    expect(a.tradePriceRangeX).toEqual([2, 4]);
  });
  it('reproduces the gains from trade table (5 oz meat for 15 oz potatoes)', () => {
    const t = simulateTrade(frank, ruby, { Frank: { x: 4, y: 16 }, Ruby: { x: 12, y: 24 } }, { shareOnX: { Frank: 0, Ruby: 0.75 }, xExporter: 'Ruby', unitsOfX: 5, unitsOfY: 15 });
    expect(t.consumption.Frank).toEqual({ x: 5, y: 17 });
    expect(t.consumption.Ruby).toEqual({ x: 13, y: 27 });
    expect(t.bothBetterOff).toBe(true);
    close(t.priceOfX, 3);
  });
  it('equal opportunity costs ⇒ no gains from trade', () => {
    const a = calculateOpportunityCost({ name: 'A', maxX: 10, maxY: 20 }, { name: 'B', maxX: 5, maxY: 10 });
    expect(a.gainsFromTradePossible).toBe(false);
    expect(a.tradePriceRangeX).toBeNull();
  });
  it('Q6: Tony needs 6 min per walnut, 10 per bread ⇒ OC of walnut = 3/5 bread', () => {
    const tony = producerFromTimes('Tony', 6, 10, 60);
    close(tony.maxY / tony.maxX, 3 / 5);
  });
  it('Q13: Peru PPF (8 peanuts, 240 cashews) – classify points', () => {
    const peru = { name: 'Peru', maxX: 8, maxY: 240 };
    const f = (x: number) => linearPPF(peru, x);
    expect(classifyPoint(f, 8, 3, 150)).toBe('efficient');
    expect(classifyPoint(f, 8, 7, 135)).toBe('unattainable');
    expect(classifyPoint(f, 8, 2, 100)).toBe('inefficient');
    expect(classifyPoint(f, 8, 9, 0)).toBe('unattainable');
  });
  it('joint PPF is kinked at the comparative-advantage point', () => {
    const j = jointPPF(frank, ruby);
    expect(j).toEqual([{ x: 0, y: 80 }, { x: 24, y: 32 }, { x: 32, y: 0 }]);
  });
  it('bowed PPF has increasing opportunity cost', () => {
    close(bowedPPF(100, 100, 2, 0), 100);
    close(bowedPPF(100, 100, 2, 100), 0);
    expect(bowedOpportunityCost(100, 100, 2, 80)).toBeGreaterThan(bowedOpportunityCost(100, 100, 2, 20));
  });
});

describe('opportunity cost of choices (Ch1 Anne example)', () => {
  it('matches the lecture numbers', () => {
    const r = analyseChoices([
      { name: 'Movie', price: 50, benefit: 120 },
      { name: 'Concert', price: 150, benefit: 250 },
      { name: 'Party', price: 80, benefit: 170 },
    ]);
    expect(r.analysis.map((o) => o.opportunityCost)).toEqual([150, 240, 180]);
    expect(r.best).toBe('Concert');
  });
});

describe('costs of production', () => {
  it('Nimbus: marginal products and costs', () => {
    expect(marginalProducts([0, 20, 50, 90, 120, 140, 150, 155])).toEqual([20, 30, 40, 30, 20, 10, 5]);
    const rows = buildCostTable([0, 20, 50, 90, 120, 140, 150, 155], [200, 300, 400, 500, 600, 700, 800, 900]);
    close(rows[1].marginalCost!, 5);
    close(rows[3].marginalCost!, 2.5);
    close(rows[7].marginalCost!, 20);
  });
  it('Vinnie: efficient scale is 4 houses (ATC $70)', () => {
    const rows = costTableFromVariable([1, 2, 3, 4, 5, 6, 7], [10, 20, 40, 80, 160, 320, 640], 200);
    const e = efficientScale(rows)!;
    expect(e.quantity).toBe(4);
    close(e.averageTotalCost!, 70);
  });
  it('Q35: ATC table ⇒ profit maximised at 3 units when P = 10', () => {
    const atc = [10, 8, 7, 8, 10];
    const profits = atc.map((a, i) => 10 * (i + 1) - a * (i + 1));
    expect(profits.indexOf(Math.max(...profits)) + 1).toBe(3);
  });
  it('Walter: economic vs accounting profit', () => {
    const p = profitComparison(60000, 25900, 40600);
    expect(p.accountingProfit).toBe(34100);
    expect(p.economicProfit).toBe(-6500);
  });
  it('cubic costs: MC crosses AVC and ATC at their minima', () => {
    const c = { fixed: 50, alpha: 20, beta: 3, gamma: 0.2 };
    const avc = minAverageVariableCost(c);
    const atc = minAverageTotalCost(c);
    const mc = (q: number) => c.alpha - 2 * c.beta * q + 3 * c.gamma * q * q;
    close(mc(avc.quantity), avc.value, 1e-6);
    close(mc(atc.quantity), atc.value, 1e-4);
    expect(atc.quantity).toBeGreaterThan(avc.quantity);
  });
});

describe('competitive firm', () => {
  const c = { fixed: 50, alpha: 20, beta: 3, gamma: 0.2 };
  it('produces where P = MC above min AVC', () => {
    const o = calculateCompetitiveFirm(c, 30);
    close(o.marginalCost, 30, 1e-6);
    expect(o.quantity).toBeGreaterThan(0);
  });
  it('shuts down below min AVC (loss = fixed cost)', () => {
    const o = calculateCompetitiveFirm(c, o0(c) - 1);
    expect(o.decision).toBe('shut down');
    close(o.profit, -50);
  });
  it('break-even at min ATC', () => {
    const be = minAverageTotalCost(c).value;
    const o = calculateCompetitiveFirm(c, be);
    close(o.profit, 0, 1e-3);
    expect(o.longRun).toBe('zero economic profit');
  });
  it('Ch15 problem 11: SR and LR equilibrium', () => {
    const k = { fixed: 50, a: 0, k: 1 };
    const sr = shortRunEquilibrium(k, 9, 120, 1);
    close(sr.price, 12);
    close(sr.quantity, 108);
    close(sr.profitPerFirm, 22);
    const lr = longRunEquilibrium(k, 120, 1);
    close(lr.price, 10);
    close(lr.quantity, 110);
    close(lr.perFirm, 10);
    close(lr.firms, 11);
    close(quadraticFirm(k, 10).profit, 0);
  });
});
const o0 = (c: { fixed: number; alpha: number; beta: number; gamma: number }) => minAverageVariableCost(c).value;

describe('monopoly', () => {
  it('Q39 reconstruction: D = 120 − Q, MC = Q, F = 450', () => {
    const m = calculateMonopolyOptimum({ a: 120, b: 1 }, { fixed: 450, c: 0, e: 1 });
    close(m.quantity, 40);
    close(m.price, 80);
    close(m.marginalRevenue, 40);
    close(m.marginalCost, 40);
    close(m.averageTotalCost, 31.25);
    close(m.profit, (80 - 31.25) * 40);
    close(m.competitive.quantity, 60);
    close(m.deadweightLoss, 0.5 * (80 - 40) * (60 - 40));
  });
  it('constant MC: Q_M is half the competitive quantity', () => {
    const m = calculateMonopolyOptimum({ a: 100, b: 1 }, { fixed: 0, c: 20, e: 0 });
    close(m.quantity, 40);
    close(m.competitive.quantity, 80);
    expect(m.price).toBeGreaterThan(m.marginalCost);
  });
  it('shuts down when MC exceeds the choke price', () => {
    expect(calculateMonopolyOptimum({ a: 10, b: 1 }, { fixed: 0, c: 12, e: 0 }).quantity).toBe(0);
  });
  it('Q38: MR of the 301st unit is −$75.40', () => {
    close(discreteMarginalRevenue(300, 45, 301, 44.6), -75.4, 1e-9);
  });
});

describe('deadweight loss helper', () => {
  it('is zero at equilibrium and positive elsewhere', () => {
    expect(calculateDeadweightLoss(D300, S2P, 200)).toBeCloseTo(0);
    expect(calculateDeadweightLoss(D300, S2P, 150)).toBeGreaterThan(0);
    expect(calculateDeadweightLoss(D300, S2P, 250)).toBeGreaterThan(0);
  });
});

describe('trade presets used in the Lab are mutually beneficial', () => {
  const cases = [
    { A: ['Billy', 10, 12], B: ['Tony', 6, 10], T: 60, nt: [0.5, 0.5], tr: [0, 0.85], x: 3.2, y: 2.3 },
    { A: ['Diego', 2, 4], B: ['Darnell', 4, 6], T: 12, nt: [0.5, 0.5], tr: [0.8, 0], x: 1.65, y: 0.95 },
    { A: ['US', 1, 0.5], B: ['Japan', 1, 1], T: 10, nt: [0.5, 0.5], tr: [0, 1], x: 5, y: 7 },
  ] as const;
  for (const c of cases) {
    it(`${c.A[0]} & ${c.B[0]}`, () => {
      const A = producerFromTimes(c.A[0], c.A[1], c.A[2], c.T);
      const B = producerFromTimes(c.B[0], c.B[1], c.B[2], c.T);
      const adv = calculateOpportunityCost(A, B);
      const nt = { [A.name]: { x: A.maxX * c.nt[0], y: A.maxY * (1 - c.nt[0]) }, [B.name]: { x: B.maxX * c.nt[1], y: B.maxY * (1 - c.nt[1]) } };
      const r = simulateTrade(A, B, nt, { shareOnX: { [A.name]: c.tr[0], [B.name]: c.tr[1] }, xExporter: adv.comparativeAdvantageX!, unitsOfX: c.x, unitsOfY: c.y });
      expect(r.bothBetterOff).toBe(true);
      expect(r.priceOfX).toBeGreaterThanOrEqual(adv.tradePriceRangeX![0]);
      expect(r.priceOfX).toBeLessThanOrEqual(adv.tradePriceRangeX![1]);
    });
  }
});

describe("Conrad's coffee shop (Ch14 Table 2) as TC = 3 + 0.2Q + 0.1Q²", () => {
  const c = { fixed: 3, alpha: 0.2, beta: -0.1, gamma: 0 };
  it('matches the lecture table', () => {
    const tc = [3, 3.3, 3.8, 4.5, 5.4, 6.5, 7.8, 9.3, 11, 12.9, 15];
    tc.forEach((v, q) => close(c.fixed + c.alpha * q - c.beta * q * q, v, 1e-9));
    const atc = minAverageTotalCost(c);
    close(atc.quantity, Math.sqrt(30), 1e-4); // efficient scale ≈ 5.48 cups
    close(minAverageVariableCost(c).quantity, 0);
  });
});
