import type { AnswerKeyEntry } from '../../types/content';

/**
 * Answer key for the source questions — kept in its own module, separate from the
 * question presentation. Every answer was derived independently from the question
 * text/figures (never from markings in the source PDF) and cross-checked against
 * the model functions in src/economics (see models.test.ts).
 *
 * `answer` is the index into the ORIGINAL option order (0 = first option).
 */
export const ANSWER_KEY: Record<string, AnswerKeyEntry> = {
  pq01: {
    answer: 2, status: 'verified',
    explanation: 'The tax is levied on **sellers**, so it is the **supply** curve that is shifted up by the tax. Cutting the tax by $15 shifts supply **down by $15**. Because demand is downward sloping (and supply upward sloping), the $15 is split: buyers pay somewhat less and sellers keep somewhat more — so the effective price received by sellers rises by **less than $15**. It would rise by the full $15 only if demand were perfectly elastic.',
  },
  pq02: {
    answer: 2, status: 'verified',
    explanation: 'Producer surplus = (price − cost) × quantity. $60 = (P − $1) × 30 ⇒ P − 1 = 2 ⇒ **P = $3**.',
  },
  pq03: {
    answer: 3, status: 'verified',
    explanation: 'Original tax: A (Q = 1, P = 9) to B (P = 4), so revenue = $5 × 1 = **$5**. New tax: revenue = $2.50 × 1.5 = **$3.75** — revenue falls. The deadweight loss is the triangle between demand and supply from the taxed quantity to the equilibrium quantity (≈ 1.83); a smaller tax moves the quantity closer to equilibrium, so the DWL **shrinks** (DWL grows roughly with the square of the tax). Answer: decrease revenue and decrease DWL.',
    reviewNote: 'The figure and the text are slightly inconsistent (on the drawn curves a quantity of 1.5 corresponds to prices 7 and 5, not 7.50 and 5). The conclusion is the same either way.',
  },
  pq04: {
    answer: 1, status: 'verified',
    explanation: 'Marginal cost = ΔTC/ΔQ = ($4.2m − $4.0m)/1 = **$200,000**. Check the others: average cost of the first 20 = $4m/20 = $200,000 (not $150,000). Selling for $170,000 is below the marginal cost of $200,000, so building it would *lose* $30,000. "Never build because total cost rises" ignores marginal benefit — any extra unit raises total cost.',
  },
  pq05: {
    answer: 3, status: 'verified',
    explanation: 'Moving from P1 to P2, revenue gains rectangle **A** (higher price on the Q2 units still sold) and loses rectangle **D** (P1 × the units no longer sold). If A < D, raising the price **lowers** total revenue — so demand is **elastic** in this range ($|\\%\\Delta Q| > |\\%\\Delta P|$), and cutting the price from P2 to P1 raises revenue. The incorrect statement is therefore "An increase in price from P1 to P2 will lead to an increase in total revenue."',
  },
  pq06: {
    answer: 2, status: 'verified',
    explanation: 'Tony needs 6 minutes for a pound of walnut; in those 6 minutes he could make 6/10 of a pound of bread. Opportunity cost of 1 walnut = 6/10 = **3/5 pound of bread**.',
  },
  pq07: {
    answer: 0, status: 'verified',
    explanation: "Bobby's willingness to pay is at least as high as Sasra's and Avaa's for the 1st, 2nd and 3rd pie, so at any price he buys at least as many pies and earns at least as much surplus on each — no one's CS can exceed his. The others are false: Avaa buys a first pie at any price up to $0.75 (not only below $0.25); at $0.60 the surplus from pies with WTP ≥ $0.60 is (1.40 + 0.90 + 0.15) + (0.90 + 0.40 + 0) + 0.15 = **$3.90**, not $4.90 (and only three pies exist, which would make it even smaller); and Avaa has the *lowest* WTP.",
    reviewNote: 'The "only three pies" condition makes some options ill-posed, but option A holds under any allocation rule based on individual WTP, and every other option is false.',
  },
  pq08: {
    answer: 2, status: 'verified',
    explanation: 'From the table: demand $P = 12 - \\tfrac{2}{3}Q$ (choke price $12), supply $P = \\tfrac{1}{3}Q$ (starts at $0). Equilibrium at P = $4, Q = 12. CS = ½ × 12 × (12 − 4) = **$48**; PS = ½ × 12 × (4 − 0) = **$24**; total surplus = **$72**.',
  },
  pq09: {
    answer: 1, status: 'verified',
    explanation: 'Quantities: $12,000/$600 = 20 and $13,500/$750 = 18. Midpoint method: %ΔQ = (18 − 20)/19 = −10.5%; %ΔP = (750 − 600)/675 = +22.2%. Elasticity = 10.5/22.2 ≈ **0.47** (inelastic — consistent with revenue rising when the price rose).',
  },
  pq10: {
    answer: 1, status: 'verified',
    explanation: 'The tax drives a wedge from A (buyers pay $32) to B (sellers get $16) at Q = 15, versus the equilibrium Q = 25. DWL = ½ × (32 − 16) × (25 − 15) = **$80**. Deadweight loss is the surplus lost because trades that would have benefited both buyers and sellers no longer happen — it is the amount by which the loss of CS + PS **exceeds** tax revenue, not the other way round.',
  },
  pq11: {
    answer: 1, status: 'verified',
    explanation: "Alvina: 400 lemonade or 200 pizzas ⇒ a pizza costs her **2** lemonades. Jane: 450 lemonade or 300 pizzas ⇒ a pizza costs her **1.5** lemonades. Jane has the comparative advantage in pizzas and Alvina in lemonade, so gains come from Alvina producing more lemonade and Jane more pizzas. (Option 3's \"Betty\" is a typo in the source.)",
  },
  pq12: {
    answer: 0, status: 'verified',
    explanation: 'Seeing the new release costs you the $7 ticket **plus** the net value of the best alternative you give up: the first movie, which you value at V but would have cost only $7 − $3 = $4, so its net value is V − 4. Opportunity cost = 7 + (V − 4) = **V + $3**. (Same logic as the course example: opportunity cost = explicit cost + net value of best forgone option.)',
  },
  pq13: {
    answer: 3, status: 'verified',
    explanation: "Peru's PPF: Cashews = 240 − 30 × Peanuts. At 3 peanuts the frontier allows 240 − 90 = **150** cashews, so (3, 150) is on the PPF — possible. The others are outside: at 7 peanuts max is 30; at 5 max is 90; at 2 max is 180.",
  },
  pq14: {
    answer: 0, status: 'verified',
    explanation: 'Supply is $P = Q/3$, starting at $0. Equilibrium P = $4, Q = 12. PS = ½ × 12 × 4 = **$24**.',
  },
  pq15: {
    answer: 2, status: 'verified',
    explanation: 'If a car costs x trucks, then a truck costs 1/x cars — the two opportunity costs are reciprocals (the course: "opportunity cost of one good is the inverse of the opportunity cost of the other"). Product = x × 1/x = **1**.',
  },
  pq16: {
    answer: 2, status: 'verified',
    explanation: 'The $400,000 is **sunk** — it is spent whatever he does. Compare only what changes: (1) repair: receive $390,000 − $50,000 = $340,000 net; (2) sell as is: $350,000. Option (2) is better by $10,000.',
  },
  pq17: {
    answer: 3, status: 'verified',
    explanation: 'The tax is the vertical distance between S₂ and S₁ (or between the price buyers pay and the price sellers receive at the taxed quantity): at Q = 105, $12 − $8 = **$4**.',
  },
  pq18: {
    answer: 3, status: 'verified',
    explanation: 'A tax creates a wedge: buyers pay more, sellers receive less (after paying the tax), and the quantity traded falls. Both sides share the burden regardless of who legally pays.',
  },
  pq19: {
    answer: 1, status: 'verified',
    explanation: 'With straight lines the DWL is a triangle: ½ × tax × ΔQ. 60,000 = ½ × T × 1,000 ⇒ **T = $120**.',
  },
  pq20: {
    answer: 1, status: 'verified',
    explanation: 'Without the tax, CS = A + B + C (above $12 up to Q = 24). With a $10 tax, buyers pay $18 and Q = 12, so CS shrinks to **A**. The loss is **B + C** (B goes to the government as revenue, C is part of the deadweight loss).',
  },
  pq21: {
    answer: 3, status: 'verified',
    explanation: 'Tanek: 300 burritos or 400 tacos ⇒ 1 burrito costs 400/300 = **4/3 tacos**. Barb: 200 burritos or 400 tacos ⇒ 1 burrito costs 400/200 = **2 tacos**.',
  },
  pq22: {
    answer: 1, status: 'verified',
    explanation: 'The number of buyers is a determinant of **demand**. Fewer buyers ⇒ less is demanded at every price ⇒ demand decreases (shifts left).',
  },
  pq23: {
    answer: 1, status: 'verified',
    explanation: 'With two units and one per buyer, the two highest-value buyers (Bill $21, Eva $18) should win. Bidding stops once the third-highest buyer (Sara, $15) drops out, so the price ends just above $15 — and it cannot exceed $18 or Eva would drop out. Of the options only **$16** lies in that range.',
    reviewNote: 'The table is titled "baseball game ticket" while the question speaks of surgical masks — a wording slip in the source. The willingness-to-pay values are used as given.',
  },
  pq24: {
    answer: 0, status: 'verified',
    explanation: 'Higher cost shifts supply left, raising the price. Existing buyers pay more and some buyers leave the market, so consumer surplus **decreases**.',
  },
  pq25: {
    answer: 3, status: 'verified',
    explanation: 'Comparative advantage means a **lower** opportunity cost. By specialising in that good and trading, a country can consume beyond its own PPF (the Frank & Ruby result). It should export, not import, that good.',
  },
  pq26: {
    answer: 0, status: 'verified',
    explanation: 'Supply $P = 2 + 2Q$, demand $P = 12 - 3Q$, equilibrium (2, 6). Without tax: PS = ½ × 2 × (6 − 2) = **$4**. With the tax E–F at Q = 1, sellers receive $4: PS = ½ × 1 × (4 − 2) = **$1**.',
  },
  pq27: {
    answer: 3, status: 'verified',
    explanation: 'The total gain from the trade is Kara\'s value minus Raymand\'s cost: $2.8 − $2.0 = $0.8. A tax smaller than the gain from trade ($0.3 < $0.8) does not destroy the trade — e.g. at a price of $2.5 Raymand nets $2.2 > $2.0 and Kara still gains $0.3. Only taxes larger than $0.8 would eliminate this trade (creating deadweight loss).',
  },
  pq28: {
    answer: 3, status: 'verified',
    explanation: 'The course treats the demand for illegal drugs as **inelastic** — that is why interdiction (supply falls) raises total spending and can increase drug-related crime. So "very responsive to price" is the incorrect statement. Demand is plausibly more elastic in the long run, which interdiction advocates argue.',
  },
  pq29: {
    answer: 2, status: 'verified',
    explanation: 'A binding ceiling ($150 < $200) does not shift either curve; it causes movements **along** them: quantity demanded rises, quantity supplied falls ⇒ shortage. Fewer sessions are actually completed (the short side, quantity supplied, determines trade).',
  },
  pq30: {
    answer: 2, status: 'verified',
    explanation: 'The fall in quantity from a tax is larger the more **elastic** both demand and supply are (the flatter both curves, the more the wedge squeezes quantity). Strong responses from both buyers and sellers ⇒ largest fall in quantity.',
  },
  pq31: {
    answer: 1, status: 'verified',
    explanation: 'Deadweight loss grows with the elasticities of supply and demand. Supply₂ and Demand₂ are the **flatter** (more elastic) curves at the common point, so a given tax shrinks quantity most and creates the largest DWL.',
  },
  pq32: {
    answer: 1, status: 'verified',
    explanation: 'In a (perfectly) competitive market the goods offered are (nearly) identical and there are many buyers and sellers, so no one has influence over the price.',
  },
  pq33: {
    answer: 0, status: 'verified',
    explanation: "A price taker faces a perfectly elastic (horizontal) demand curve: if it charges more than the market price, buyers simply buy the identical product from other sellers.",
  },
  pq34: {
    answer: 2, status: 'verified',
    explanation: 'The price stays at $5 whatever quantity is sold — a horizontal (perfectly elastic) demand curve. That is the demand curve faced by a single firm in a **competitive** market.',
  },
  pq35: {
    answer: 2, status: 'verified',
    explanation: 'TC = ATC × Q: 10, 16, 21, 32, 50. Profit at P = $10: Q=1: 10 − 10 = 0; Q=2: 20 − 16 = 4; Q=3: 30 − 21 = **9**; Q=4: 40 − 32 = 8; Q=5: 50 − 50 = 0. Best: **3 units** (marginal cost of the 4th unit is $11 > $10). The fixed cost is already inside ATC and does not change the choice.',
  },
  pq36: {
    answer: 1, status: 'verified',
    explanation: 'A monopolist is the only seller, so it faces the downward-sloping **market** demand curve: to sell more it must lower the price — it can choose only price–quantity pairs on the demand curve.',
  },
  pq37: {
    answer: 3, status: 'verified',
    explanation: 'Average revenue = price, which must fall to sell more along a downward-sloping demand curve. Marginal revenue lies below the price and also falls (for linear demand MR = a − 2bQ, twice as steep as demand).',
  },
  pq38: {
    answer: 1, status: 'verified',
    explanation: 'TR(300) = 300 × $45 = $13,500; TR(301) = 301 × $44.60 = $13,424.60. MR = 13,424.60 − 13,500 = **−$75.40** (the price cut on the 300 earlier units outweighs the $44.60 earned on the extra unit).',
  },
  pq39: {
    answer: 2, status: 'verified',
    explanation: 'The monopolist produces where **MR = MC**: quantity W (height C). It charges the price on the demand curve at W: **K**. Average total cost at W is **B**. Profit = (P − ATC) × Q = **(K − B) × W**. (K − C) × W uses marginal rather than average cost; L and T do not correspond to the optimum.',
  },
};
