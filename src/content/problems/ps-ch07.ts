import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch07',
  title: 'Problem set: Chapter 7 (with course solutions)',
  lectures: ['ch07'],
  problems: [
    { id: 'p4', title: 'P4 — Bert’s demand for bottled water', source: 'ProblemSets/Chapter 7_Solutions.pdf', officialSolution: true, models: ['surplus'], intro: 'Bert values his first bottle of water at $7, the second at $5, the third at $3 and the fourth at $1.',
      table: { caption: "Bert's demand schedule", headers: ['Price', 'Quantity demanded'], rows: [['More than $7', 0], ['$5 to $7', 1], ['$3 to $5', 2], ['$1 to $3', 3], ['$1 or less', 4]] },
      parts: [
        { label: 'b', prompt: 'If the price is $4, how many bottles does Bert buy and what is his consumer surplus?', solution: 'He buys **2**. CS = (7 − 4) + (5 − 4) = **$4** (area A).', check: { answer: 4, unit: '$' } },
        { label: 'c', prompt: 'If the price falls to $2, what is his consumer surplus? By how much does it change?', solution: 'He buys 3: CS = 5 + 3 + 1 = **$9** — an increase of **$5** (area B).', check: { answer: 9, unit: '$' } },
      ] },
    { id: 'p5', title: 'P5 — Ernie’s supply of bottled water', source: 'ProblemSets/Chapter 7_Solutions.pdf', officialSolution: true, models: ['surplus'], intro: 'Ernie can produce the first bottle at a cost of $1, the second at $3, the third at $5 and the fourth at $7.',
      table: { caption: "Ernie's supply schedule", headers: ['Price', 'Quantity supplied'], rows: [['More than $7', 4], ['$5 to $7', 3], ['$3 to $5', 2], ['$1 to $3', 1], ['Less than $1', 0]] },
      parts: [
        { label: 'b', prompt: 'At a price of $4, producer surplus?', solution: 'He sells 2: PS = (4 − 1) + (4 − 3) = **$4**.', check: { answer: 4, unit: '$' } },
        { label: 'c', prompt: 'At a price of $6, producer surplus?', solution: 'He sells 3: PS = 5 + 3 + 1 = **$9**, up by $5.', check: { answer: 9, unit: '$' } },
      ] },
    { id: 'p6', title: 'P6 — Bert and Ernie meet', source: 'ProblemSets/Chapter 7_Solutions.pdf', officialSolution: true, models: ['surplus'], intro: 'Combine Ernie’s supply schedule with Bert’s demand schedule.',
      table: { headers: ['Price', 'Quantity supplied', 'Quantity demanded'], rows: [['$2', 1, 3], ['$4', 2, 2], ['$6', 3, 1]] },
      parts: [
        { label: 'a', prompt: 'Equilibrium price?', solution: 'Only **$4** balances supply and demand (2 bottles).', check: { answer: 4, unit: '$' } },
        { label: 'b', prompt: 'Total surplus at equilibrium?', solution: 'CS $4 + PS $4 = **$8**.', check: { answer: 8, unit: '$' } },
        { label: 'c', prompt: 'If Ernie produced and Bert consumed one bottle fewer, what would total surplus be?', solution: 'PS falls to $3 and CS to $3 ⇒ **$6**.', check: { answer: 6, unit: '$' } },
        { label: 'd', prompt: 'If they traded one extra bottle, by how much would total surplus change?', solution: 'The extra bottle costs $5 and is worth $3 ⇒ total surplus **falls by $2** (to $6).', check: { answer: -2, unit: '$' } },
      ] },
    { id: 'p10', title: 'P10 — Two streaming providers', source: 'ProblemSets/Chapter 7_Solutions.pdf', officialSolution: true, intro: 'Your friend’s demand for movies is $Q = 150 - 50P$ (she stops at $3). Provider A charges $120 per year for unlimited movies; Provider B charges $1 per movie and no fixed fee.',
      parts: [
        { label: 'a', prompt: 'Cost of an extra movie with each provider?', solution: 'A: **$0**. B: **$1**.' },
        { label: 'b', prompt: 'How many movies with A? With B?', solution: 'A: 150 − 50(0) = **150**. B: 150 − 50(1) = **100**.' },
        { label: 'c', prompt: 'How much would she pay each year?', solution: 'A: **$120**. B: 100 × $1 = **$100**.' },
        { label: 'd', prompt: 'Consumer surplus with Provider A?', solution: '½ × 3 × 150 − 120 = 225 − 120 = **$105**. With B: ½ × 2 × 100 = $100.', check: { answer: 105, unit: '$' } },
        { label: 'e', prompt: 'Which provider would you recommend?', solution: '**Provider A** — it gives her more consumer surplus ($105 vs $100).' },
      ] },
    { id: 'p11', title: 'P11 — Medical care and insurance', source: 'ProblemSets/Chapter 7_Solutions.pdf', officialSolution: true, intro: 'Each medical procedure costs society $100 (horizontal supply curve). Demand for procedures is downward sloping.',
      parts: [
        { label: 'a', prompt: 'If each procedure has a price of $100, how many are demanded?', solution: 'Q₁ — where the demand curve meets the $100 supply line.' },
        { label: 'b', prompt: 'If consumers pay only $20 per procedure (insurance pays the rest), what happens? Is this efficient?', solution: 'Quantity rises to Q₂. Because the cost to society is $100, Q₂ is **too many**: the surplus-maximising quantity is Q₁.' },
        { label: 'c', prompt: 'In what sense is the use of medical care "excessive"?', solution: 'Consumers get procedures whose **value is less than their cost**; total surplus is reduced (a deadweight-loss triangle between Q₁ and Q₂).' },
        { label: 'd', prompt: 'What policies might prevent excessive use?', solution: 'Make the consumer bear the marginal cost — but that eliminates insurance. Or let the insurer (which pays the $80) decide which procedures are performed — but it does not get the benefits, so its decisions may not reflect the value to the patient.' },
      ] },
  ],
};
export default ps;
