import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-sp-ch14',
  title: 'Self-practice: Chapter 14',
  lectures: ['ch14'],
  problems: [
    { id: 'p3', title: 'P3 — The commercial fisherman', source: 'ProblemSets/Self-Practice_Chapter 14.pdf', models: ['production'], intro: 'Hours fishing 0–5 yield 0, 10, 18, 24, 28, 30 pounds of fish. The fisherman’s fixed cost is $10 (his pole); the opportunity cost of his time is $5 per hour.',
      parts: [
        { label: 'a', prompt: 'Marginal product of the 3rd hour?', solution: 'MP: 10, 8, **6**, 4, 2 (pounds per hour).', check: { answer: 6, unit: 'lb' } },
        { label: 'b', prompt: 'Graph the production function and explain its shape.', solution: 'Output rises but by less each hour — **diminishing marginal product** — so the curve gets flatter (concave).' },
        { label: 'c', prompt: 'Total cost of catching 28 lb? Shape of the total-cost curve?', solution: 'TC = 10 + 5 × hours: for 0, 10, 18, 24, 28, 30 lb it is 10, 15, 20, 25, **30**, 35. Plotted against fish caught it gets **steeper** (MC per pound: 0.50, 0.63, 0.83, 1.25, 2.50) — the mirror image of diminishing MP.', check: { answer: 30, unit: '$' } },
      ] },
    { id: 'p5', title: 'P5 — One more gaming console?', source: 'ProblemSets/Self-Practice_Chapter 14.pdf', models: ['cost-curves'], intro: 'ATC is $300 at 600 consoles and $301 at 601. All 600 have been sold. Someone offers $550 for one more.',
      parts: [{ label: 'a', prompt: 'Marginal cost of the 601st console? Accept the offer?', solution: 'TC(601) − TC(600) = 601 × 301 − 600 × 300 = 180,901 − 180,000 = **$901**. Since $550 < $901, **reject**: selling it would cut profit by $351.', check: { answer: 901, unit: '$' } }] },
    { id: 'p6', title: 'P6 — The pizzeria', source: 'ProblemSets/Self-Practice_Chapter 14.pdf', models: ['cost-curves'], intro: 'Quantity (dozen pizzas) 0–6. Total cost: $300, 350, 390, 420, 450, 490, 540. Variable cost: $0, 50, 90, 120, 150, 190, 240.',
      parts: [
        { label: 'a', prompt: 'Fixed cost?', solution: 'TC at Q = 0: **$300** (also TC − VC at every quantity).', check: { answer: 300, unit: '$' } },
        { label: 'b', prompt: 'MC per dozen from TC and from VC. What is MC of the 3rd dozen? Relationship?', solution: 'From TC: 50, 40, **30**, 30, 40, 50. From VC: identical. Fixed cost does not change with output, so it drops out of every change in cost.', check: { answer: 30, unit: '$' } },
      ] },
  ],
};
export default ps;
