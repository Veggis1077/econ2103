import type { ProblemSet } from '../../types/content';

/** Chapter 15 problem set — the lecture slides for Ch. 15 are not yet available. */
const ps: ProblemSet = {
  id: 'ps-ch15',
  title: 'Problem set: Chapter 15 (firms in competitive markets)',
  lectures: ['ch15'],
  problems: [
    { id: 'p1', title: 'P1 — Boats and the price of oil', source: 'ProblemSets/Chapter 15.pdf', models: ['competitive-firm'], intro: 'Many small boats are made of fiberglass and a resin derived from crude oil. Suppose the price of oil rises.',
      parts: [
        { label: 'a', prompt: 'Show what happens to the cost curves of an individual boat-making firm and to the market supply curve.', solution: 'The resin is a variable input: **MC, AVC and ATC shift up**. Each firm’s supply curve (MC above min AVC) shifts up, so the **market supply curve shifts left**.' },
        { label: 'b', prompt: 'Profits in the short run? Number of boat makers in the long run?', solution: 'Short run: the market price rises by less than costs ⇒ firms make **losses**. Long run: some firms **exit** until the price rises to the new, higher minimum ATC and profits return to zero.' },
      ] },
    { id: 'p4', title: 'P4 — Ball Bearings, Inc.', source: 'ProblemSets/Chapter 15.pdf', models: ['competitive-firm'], intro: 'Total fixed cost is $100; total variable cost for 0–6 cases is $0, 50, 70, 90, 140, 200, 360.',
      parts: [
        { label: 'a', prompt: 'Compute AFC, AVC, ATC and MC. What is MC of the 4th case?', solution: 'AFC: 100, 50, 33.3, 25, 20, 16.7. AVC: 50, 35, 30, 35, 40, 60. ATC: 150, 85, 63.3, 60, 60, 76.7. MC: 50, 20, 20, **50**, 60, 160.', check: { answer: 50, unit: '$' } },
        { label: 'b', prompt: 'Price is $50. The CEO shuts down. Profit/loss? Wise?', solution: 'Shutting down loses the fixed cost: **−$100**. Not wise: at Q = 4, TR = 200 and TC = 240, a loss of only **$40**. Since P ($50) exceeds AVC at that output ($35), the firm should keep producing in the short run.', check: { answer: -100, unit: '$' } },
        { label: 'c', prompt: 'The CFO says produce 1 case because MR = MC there. Profit at Q = 1? Best decision?', solution: 'At Q = 1: TR 50 − TC 150 = **−$100**. Not best: MC = 50 at Q = 1 is on the **falling** part of MC. The optimum is where P = MC on the **rising** part: Q = 4, loss $40.', check: { answer: -100, unit: '$' } },
      ] },
    { id: 'p5', title: 'P5 — Book printing and a patent', source: 'ProblemSets/Chapter 15.pdf', models: ['competitive-firm'], intro: 'The book-printing industry is competitive and starts in long-run equilibrium.',
      parts: [
        { label: 'a', prompt: 'Draw ATC, MC, MR and supply for the typical firm.', solution: 'MR is horizontal at the price; in long-run equilibrium P = MR touches the bottom of ATC, where MC crosses it. The firm’s supply curve is MC above min AVC.' },
        { label: 'b', prompt: 'Hi-Tech patents a process that sharply cuts printing costs. Short-run effect on Hi-Tech’s profit and the price of books?', solution: 'Hi-Tech’s costs fall ⇒ it earns **positive profit**. It is one small firm, so the **market price barely changes**.' },
        { label: 'c', prompt: 'Long run, after the patent expires?', solution: 'Other firms adopt the technology and new firms enter: market supply shifts right, the **price falls** to the new lower min ATC, and **profits return to zero**.' },
      ] },
    { id: 'p10', title: 'P10 — 100 identical firms', source: 'ProblemSets/Chapter 15.pdf', models: ['competitive-firm'], intro: '100 firms, each with fixed costs $16 and AVC for 1–6 units of $1, 2, 3, 4, 5, 6 (so VC = Q²).',
      parts: [
        { label: 'a', prompt: 'Compute MC and ATC for 1–6 units. ATC at 4 units?', solution: 'TC = 16 + Q²: 17, 20, 25, 32, 41, 52. MC: 1, 3, 5, 7, 9, 11. ATC: 17, 10, 8.33, **8**, 8.2, 8.67.', check: { answer: 8, unit: '$' } },
        { label: 'b', prompt: 'Price $10: output per firm? Market quantity supplied?', solution: 'Produce while MC ≤ P: the 5th unit costs 9 ≤ 10, the 6th 11 > 10 ⇒ **5 units** per firm; market Qs = 100 × 5 = **500**.', check: { answer: 500, unit: 'units' } },
        { label: 'c', prompt: 'Long run with free entry: does price rise or fall? Quantity demanded? Output per firm?', solution: 'At $10, ATC(5) = 8.2 ⇒ profits ⇒ **entry** ⇒ price **falls** to min ATC = $8; quantity demanded **rises**; each firm’s output falls to **4** units (efficient scale).' },
        { label: 'd', prompt: 'Long-run supply curve?', solution: '**Horizontal at P = $8** (min ATC): any quantity is supplied at $8 by adjusting the number of firms (4 units each).', check: { answer: 8, unit: '$' } },
      ] },
    { id: 'p11', title: 'P11 — TC = 50 + ½q²', source: 'ProblemSets/Chapter 15.pdf', models: ['competitive-firm'], intro: 'Each firm: $TC = 50 + \\tfrac12 q^2$, $MC = q$. Market demand $Q^D = 120 - P$. Currently 9 firms.',
      parts: [
        { label: 'a', prompt: 'Fixed cost, variable cost, ATC?', solution: 'FC = **50**; VC = ½q²; $ATC = 50/q + q/2$.' },
        { label: 'b', prompt: 'Quantity that minimises ATC? MC and ATC there?', solution: 'ATC min where MC = ATC: q = 50/q + q/2 ⇒ q² = 100 ⇒ **q = 10**, MC = ATC = 10.', check: { answer: 10 } },
        { label: 'c', prompt: 'Firm supply curve?', solution: 'P = MC ⇒ **q = P** (AVC = q/2 is always below MC, so the firm produces at any positive price).' },
        { label: 'd', prompt: 'Short-run market supply with 9 firms?', solution: '**Q = 9P**.' },
        { label: 'e', prompt: 'Short-run equilibrium price?', solution: '9P = 120 − P ⇒ **P = 12**, Q = 108.', check: { answer: 12, unit: '$' } },
        { label: 'f', prompt: 'Profit per firm? Entry or exit?', solution: 'q = 12; TR = 144; TC = 50 + 72 = 122 ⇒ **profit 22** > 0 ⇒ firms **enter**.', check: { answer: 22, unit: '$' } },
        { label: 'g', prompt: 'Long-run price and quantity?', solution: 'P = min ATC = **10**; Q = 120 − 10 = **110**.', check: { answer: 110, unit: 'units' } },
        { label: 'h', prompt: 'Long run: output per firm and number of firms?', solution: 'q = 10 each; 110/10 = **11 firms**.', check: { answer: 11, unit: 'firms' } },
      ] },
  ],
};
export default ps;
