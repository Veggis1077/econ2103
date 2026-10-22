import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch14',
  title: 'Problem set: Chapter 14',
  lectures: ['ch14'],
  problems: [
    { id: 'p4', title: 'P4 — Nimbus, Inc.', source: 'ProblemSets/Chapter 14.pdf', models: ['production'], intro: 'Nimbus makes brooms and sells them door-to-door. A worker costs $100 a day and fixed costs are $200.',
      table: { headers: ['Workers', 'Output', 'Marginal product', 'Total cost', 'ATC', 'MC'], rows: [[0, 0, '', '', '', ''], [1, 20, '', '', '', ''], [2, 50, '', '', '', ''], [3, 90, '', '', '', ''], [4, 120, '', '', '', ''], [5, 140, '', '', '', ''], [6, 150, '', '', '', ''], [7, 155, '', '', '', '']] },
      parts: [
        { label: 'a', prompt: 'Fill in marginal products. What pattern? Why?', solution: 'MP = 20, 30, 40, 30, 20, 10, 5. It **rises** at first (specialisation) and then **diminishes** as more workers share the fixed equipment.' },
        { label: 'b', prompt: 'Total cost with 7 workers?', solution: 'TC = 200 + 100 × L: 200, 300, …, **900**.', check: { answer: 900, unit: '$' } },
        { label: 'c', prompt: 'ATC at 120 brooms (4 workers)? Pattern?', solution: 'ATC = 600/120 = **$5.00**. Full column: —, 15, 8, 5.56, 5, 5, 5.33, 5.81 — first falls, then rises (U-shaped).', check: { answer: 5, unit: '$' } },
        { label: 'd', prompt: 'MC of brooms produced by the 3rd worker? Pattern?', solution: 'MC = $100/MP: 5, 3.33, **2.50**, 3.33, 5, 10, 20 — falls while MP rises, then rises.', check: { answer: 2.5, unit: '$' } },
        { label: 'e', prompt: 'Compare MP and MC.', solution: 'They move in **opposite** directions: MC = wage / MP. When MP rises, MC falls; when MP diminishes, MC rises.' },
        { label: 'f', prompt: 'Compare ATC and MC.', solution: 'When MC < ATC, ATC falls; when MC > ATC, ATC rises. MC crosses ATC at the **minimum** of ATC (around 120–140 brooms).' },
      ] },
    { id: 'p7', title: 'P7 — Vinnie’s painting company', source: 'ProblemSets/Chapter 14.pdf', models: ['cost-curves'], intro: 'Fixed costs $200; variable costs for 1–7 houses per month: $10, $20, $40, $80, $160, $320, $640.',
      parts: [
        { label: 'a', prompt: 'Compute AFC, AVC and ATC. What is the efficient scale (houses)?', solution: 'AFC: 200, 100, 66.67, 50, 40, 33.33, 28.57. AVC: 10, 10, 13.33, 20, 32, 53.33, 91.43. ATC: 210, 110, 80, **70**, 72, 86.67, 120. Efficient scale = **4 houses**.', check: { answer: 4, unit: 'houses' } },
      ] },
    { id: 'p8', title: 'P8 — Lump-sum vs per-burger tax', source: 'ProblemSets/Chapter 14.pdf', models: ['cost-curves'], intro: 'The city considers (i) a lump-sum tax of $300 on each hamburger producer, or (ii) a tax of $1 per burger, paid by producers.',
      parts: [
        { label: 'a', prompt: 'Which of AFC, AVC, ATC and MC shift with the lump-sum tax?', solution: '**AFC and ATC** shift up (AFC by $300/Q). AVC and MC do **not** change — the tax does not vary with output.' },
        { label: 'b', prompt: 'Which shift with the per-burger tax?', solution: '**AVC, ATC and MC** all shift up by exactly **$1**. AFC is unchanged.' },
      ] },
    { id: 'p9', title: 'P9 — Jane’s Juice Bar', source: 'ProblemSets/Chapter 14.pdf', models: ['cost-curves'], intro: 'Quantity (vats of juice) 0–6. Variable cost: $0, 10, 25, 45, 70, 100, 135. Total cost: $30, 40, 55, 75, 100, 130, 165.',
      parts: [
        { label: 'a1', prompt: 'AVC at 4 vats?', solution: 'AVC = VC/Q: 10, 12.5, 15, **17.5**, 20, 22.5.', check: { answer: 17.5, unit: '$' } },
        { label: 'a2', prompt: 'ATC at 3 vats?', solution: 'ATC = TC/Q: 40, 27.5, **25**, 25, 26, 27.5.', check: { answer: 25, unit: '$' } },
        { label: 'a3', prompt: 'MC of the 5th vat?', solution: 'MC = ΔTC: 10, 15, 20, 25, **30**, 35.', check: { answer: 30, unit: '$' } },
        { label: 'b', prompt: 'Graph the curves. Relationship between MC and ATC; MC and AVC?', solution: 'MC is below ATC while ATC falls (to Q = 3) and above it afterwards; it crosses ATC at its minimum (≈ $25, between 3 and 4 vats). MC lies above AVC throughout here because AVC rises from the first vat: MC crosses AVC at AVC’s minimum (at the very start).' },
      ] },
  ],
};
export default ps;
