/**
 * Graph challenges: the student manipulates a Lab model until its state satisfies
 * a target. `check` receives the model's live state (shape defined by the model).
 */
export interface Challenge {
  id: string;
  title: string;
  model: string;
  preset?: number;
  initial?: Record<string, unknown>;
  prompt: string;
  hint: string;
  /** Explanation shown on success. */
  success: string;
  /** Returns [solved, live status text]. */
  check: (s: any) => [boolean, string]; // eslint-disable-line @typescript-eslint/no-explicit-any
  lectures: string[];
}

import { bowedPPF, calculateCompetitiveFirm, calculateMonopolyOptimum, calculateOpportunityCost, calculateTaxIncidence, produce, producerFromTimes, simulateTrade } from '../economics';

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const f2 = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '—');

export const CHALLENGES: Challenge[] = [
  {
    id: 'sd-price-8', title: 'Shift demand to a price of $8', model: 'supply-demand', preset: 0, lectures: ['ch04'],
    prompt: 'Starting from P = 10 − 0.1Q and P = 2 + 0.06Q, **shift the demand curve** (drag it, or use the demand shift slider) so that the new equilibrium price is **$8.00** (±0.05). Do not change supply.',
    hint: 'Demand must increase. With supply P = 2 + 0.06Q, a price of $8 needs Q = 100 on the supply curve — so the new demand curve must pass through (100, 8).',
    success: 'An increase in demand moves the market **along** the supply curve: both P and Q rise. Here Q* = (8 − 2)/0.06 = 100.',
    check: (s) => {
      const D = { a: s.a + s.b * s.dShift, b: s.b };
      const S = { c: s.c - s.d * s.sShift, d: s.d };
      const q = (D.a - S.c) / (D.b + S.d);
      const p = D.a - D.b * q;
      const supplyUnchanged = near(s.sShift, 0, 1e-9) && near(s.c, 2, 1e-9) && near(s.d, 0.06, 1e-9);
      return [near(p, 8, 0.05) && supplyUnchanged, `Equilibrium price now $${f2(p)}${supplyUnchanged ? '' : ' — supply was changed; reset it'}`];
    },
  },
  {
    id: 'pc-shortage-60', title: 'Create a shortage of exactly 60', model: 'price-controls', preset: 3, lectures: ['ch06'],
    prompt: 'In the market Qs = 2P, Qd = 300 − P, **drag the price ceiling** so that the shortage equals **60 units** (±1).',
    hint: 'Shortage = Qd − Qs = (300 − P) − 2P = 300 − 3P. Set this equal to 60.',
    success: 'Shortage = 300 − 3P = 60 ⇒ P = $80. The lower the binding ceiling, the bigger the gap between quantity demanded and supplied.',
    check: (s) => {
      if (s.control !== 'ceiling') return [false, 'Select a price ceiling first'];
      const P = s.controlPrice;
      const qd = Math.max(0, (s.a + s.b * s.dShift - P) / s.b);
      const qs = Math.max(0, (P - (s.c - s.d * s.sShift)) / s.d);
      const sh = Math.max(0, qd - qs);
      return [near(sh, 60, 1), `Current shortage: ${f2(sh)} units (ceiling $${f2(P)})`];
    },
  },
  {
    id: 'tax-revenue-12000', title: 'Raise exactly $12,000 with the smaller tax', model: 'tax', preset: 1, lectures: ['ch08'],
    prompt: 'In the market Qs = 2P, Qd = 300 − P, set the per-unit tax so that **government revenue is $12,000** (±150). There are two taxes that do this — find the **smaller** one.',
    hint: 'Revenue R = T(200 − 2T/3). Solve 200T − (2/3)T² = 12,000. Watch the Laffer chart: a horizontal line at 12,000 cuts the curve twice.',
    success: 'T ≈ $82.9 and T ≈ $217.1 both raise $12,000, but the smaller tax has far less deadweight loss (≈ 2,290 vs ≈ 15,700). Taxes on the downward-sloping side of the Laffer curve are never a good idea.',
    check: (s) => {
      if (s.t < 0) return [false, 'This is a subsidy — move the tax above zero'];
      const o = calculateTaxIncidence({ a: s.a, b: s.b }, { c: s.c, d: s.d }, s.t);
      return [near(o.revenue, 12000, 150) && s.t < (s.a - s.c) / 2, `Tax ${f2(s.t)} → revenue $${o.revenue.toFixed(0)}${s.t >= (s.a - s.c) / 2 ? ' (this is the larger tax)' : ''}`];
    },
  },
  {
    id: 'tax-buyers-75', title: 'Make buyers bear 75% of the tax', model: 'tax', preset: 0, lectures: ['ch06'],
    prompt: 'Without changing the tax, change the **slopes** of demand and/or supply so that **buyers bear at least 75%** of the tax burden.',
    hint: 'Buyers’ share = b/(b + d). Make demand steeper (less elastic) or supply flatter (more elastic).',
    success: 'The burden falls on the **less elastic** side of the market. With b ≥ 3d buyers pay at least three quarters — whoever legally pays the tax.',
    check: (s) => {
      const share = s.b / (s.b + s.d);
      return [share >= 0.75 && s.t > 0, `Buyers bear ${(share * 100).toFixed(0)}% of the tax`];
    },
  },
  {
    id: 'el-unit-arc', title: 'Find two prices with the same revenue', model: 'elasticity', preset: 0, lectures: ['ch05'],
    prompt: 'On the demand curve P = 7 − 0.5Q, place the two points **at least 2 units apart** so that total revenue is the **same** at both (±0.3).',
    hint: 'TR = Q(7 − 0.5Q) is symmetric around the midpoint Q = 7. Pick points equally far on either side of it.',
    success: 'When revenue is unchanged, the midpoint elasticity between the two points is exactly 1: the arc is **unit elastic**, straddling the midpoint of the linear demand curve.',
    check: (s) => {
      const tr = (q: number) => q * (s.a - s.b * q);
      const gap = Math.abs(s.q1 - s.q2);
      return [Math.abs(tr(s.q1) - tr(s.q2)) <= 0.3 && gap >= 2 && near(s.a, 7, 1e-9) && near(s.b, 0.5, 1e-9), `TR₁ = ${f2(tr(s.q1))}, TR₂ = ${f2(tr(s.q2))}, gap ${f2(gap)}`];
    },
  },
  {
    id: 'ppf-800-cars', title: 'Produce 800 cars efficiently', model: 'ppf', preset: 0, lectures: ['ch02'],
    prompt: 'On the cars & computers PPF, move the production point to **800 cars (±10)** at an **efficient** point.',
    hint: 'Efficient means on the frontier: the computers must equal the maximum the frontier allows at 800 cars. Use the "Move to the frontier" button.',
    success: 'At 800 cars the frontier allows 1,800 computers. Compare with 600 cars (2,400 computers): 200 more cars cost 600 computers — opportunity cost rises along a bowed-out PPF.',
    check: (s) => {
      const X = s.maxX * (1 + s.growthX / 100), Y = s.maxY * (1 + s.growthY / 100);
      const fy = bowedPPF(X, Y, s.k, Math.min(s.x, X));
      const eff = Math.abs(s.y - fy) <= 0.01 * Y;
      return [near(s.x, 800, 10) && eff, `${f2(s.x)} cars, ${f2(s.y)} computers — ${eff ? 'efficient' : s.y > fy ? 'unattainable' : 'inefficient'}`];
    },
  },
  {
    id: 'trade-new-deal', title: 'Design a different win–win trade', model: 'trade', preset: 0, lectures: ['ch03'],
    prompt: 'Frank and Ruby currently trade 5 oz of meat for 15 oz of potatoes. Find a **different** trade (other amounts) at which **both are better off** than without trade.',
    hint: 'Keep the price of meat between Frank’s and Ruby’s opportunity costs (2 and 4 potatoes per ounce), and make sure both consumption points beat the no-trade points.',
    success: 'Any trade at a price between the two opportunity costs can work, as long as quantities leave both consuming more. The price determines how the gains are split.',
    check: (s) => {
      const A = producerFromTimes(s.nameA, s.timeXA, s.timeYA, s.totalTime);
      const B = producerFromTimes(s.nameB, s.timeXB, s.timeYB, s.totalTime);
      const adv = calculateOpportunityCost(A, B);
      const nt = { [A.name]: produce(A, s.noTradeA), [B.name]: produce(B, s.noTradeB) };
      const r = simulateTrade(A, B, nt, { shareOnX: { [A.name]: s.tradeShareA, [B.name]: s.tradeShareB }, xExporter: adv.comparativeAdvantageX ?? B.name, unitsOfX: s.unitsOfX, unitsOfY: s.unitsOfY });
      const different = !(near(s.unitsOfX, 5, 0.05) && near(s.unitsOfY, 15, 0.05));
      return [r.bothBetterOff && different, `${f2(s.unitsOfX)} meat for ${f2(s.unitsOfY)} potatoes — ${r.bothBetterOff ? 'both gain' : 'someone loses'}${different ? '' : ' (same as the original deal)'}`];
    },
  },
  {
    id: 'planner-max-ts', title: 'Be the social planner', model: 'surplus', preset: 1, lectures: ['ch07'],
    prompt: 'Choose the quantity that **maximises total surplus** (±0.6 units) by dragging the planner’s quantity.',
    hint: 'Produce every unit whose value to buyers exceeds its cost to sellers — stop where the two curves meet.',
    success: 'The surplus-maximising quantity is exactly the market equilibrium quantity: the invisible hand gets the planner’s answer for free.',
    check: (s) => {
      if (s.mode !== 'planner') return [false, 'Switch to the Planner tab'];
      const q = (s.a - s.c) / (s.b + s.d);
      return [near(s.plannerQ, q, 0.6), `Q = ${f2(s.plannerQ)}`];
    },
  },
  {
    id: 'firm-break-even', title: 'Find the break-even price', model: 'competitive-firm', preset: 0, lectures: ['ch15'],
    prompt: 'Drag the market price to the level at which the firm earns **exactly zero economic profit** (±$0.10).',
    hint: 'Zero profit means P = ATC at the chosen output — this happens at the minimum of ATC, where MC crosses it.',
    success: 'The break-even price is min ATC. In long-run competitive equilibrium entry and exit drive the price exactly here.',
    check: (s) => {
      const o = calculateCompetitiveFirm({ fixed: s.fixed, alpha: s.alpha, beta: s.beta, gamma: s.gamma }, s.price);
      return [near(s.price, o.breakEvenPrice, 0.1), `P = $${f2(s.price)}, profit $${f2(o.profit)}`];
    },
  },
  {
    id: 'mono-mr-mc', title: 'Find the monopoly output', model: 'monopoly', preset: 1, lectures: ['beyond'],
    prompt: 'With demand P = 100 − Q and MC = $20, drag "try Q" to the **profit-maximising quantity** (±0.6).',
    hint: 'Watch the profit chart below the graph, or find where MR = 100 − 2Q equals MC.',
    success: 'MR = MC at Q = 40; the price is read off the demand curve: $60. A competitive market would produce 80 at P = $20.',
    check: (s) => {
      const m = calculateMonopolyOptimum({ a: s.a, b: s.b }, { fixed: s.fixed, c: s.c, e: s.e });
      return [near(s.qTry, m.quantity, 0.6), `Q = ${f2(s.qTry)}, MR = ${f2(s.a - 2 * s.b * s.qTry)}, MC = ${f2(s.c + s.e * s.qTry)}`];
    },
  },
];

export const getChallenge = (id: string | undefined) => CHALLENGES.find((c) => c.id === id);
