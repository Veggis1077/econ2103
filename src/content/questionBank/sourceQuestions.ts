import type { BankQuestion, FigureSpec } from '../../types/content';

/**
 * The 39 questions from ECON2103_questions_no_answers.pdf.
 * Wording, numbers and answer choices are preserved from the source (including
 * the source's own typos such as "Betty" in Q11). Graphs are reconstructed as
 * live SVG figures from the coordinates readable in the original images.
 *
 * Answers are NOT stored here — see answerKey.ts (kept separate by design).
 */

const SRC = 'ECON2103 practice questions';
const r = (start: number, end: number, step: number) => {
  const out: number[] = [];
  for (let v = start; v <= end + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
};

const q3fig: FigureSpec = {
  xDomain: [0, 6.2], yDomain: [0, 12.6], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: r(0.5, 6, 0.5), yTicks: r(1, 12, 1),
  curves: [
    { kind: 'line', from: [0.15, 12.4], to: [3.25, 0], label: 'Demand', labelAt: [3.3, 0.6], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 2], to: [5.2, 12.4], label: 'Supply', labelAt: [4.2, 9.2], color: 'var(--c-supply)' },
  ],
  points: [
    { x: 0.5, y: 11, label: 'F' }, { x: 1, y: 9, label: 'A' }, { x: 1.5, y: 7, label: 'C' },
    { x: 0.5, y: 3, label: 'G', dx: 6, dy: 14 }, { x: 1, y: 4, label: 'B', dx: 6, dy: 14 }, { x: 1.5, y: 5, label: 'D', dx: 6, dy: 14 },
  ],
  guides: [{ x: 0.5, y: 11 }, { x: 1, y: 9 }, { x: 1.5, y: 7 }, { x: 0.5, y: 3 }, { x: 1, y: 4 }, { x: 1.5, y: 5 }, { x: 11 / 6, y: 17 / 3 }],
};

const q5fig: FigureSpec = {
  xDomain: [0, 11], yDomain: [0, 11], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: [{ v: 3, label: 'Q2' }, { v: 5, label: 'Q1' }], yTicks: [{ v: 5, label: 'P1' }, { v: 7, label: 'P2' }],
  curves: [{ kind: 'line', from: [0, 10], to: [10, 0], label: 'Demand', labelAt: [8.6, 2.2], color: 'var(--c-demand)' }],
  guides: [{ x: 3, y: 7 }, { x: 5, y: 5 }, { x: 3, y: 5, toY: false }],
  labels: [{ x: 1.5, y: 5.9, text: 'A' }, { x: 1.5, y: 2.5, text: 'B' }, { x: 3.65, y: 5.5, text: 'C' }, { x: 4, y: 2.5, text: 'D' }],
};

const q10fig: FigureSpec = {
  xDomain: [0, 62], yDomain: [0, 50], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: r(5, 60, 5), yTicks: r(4, 48, 4),
  curves: [
    { kind: 'line', from: [0, 44], to: [55, 0], label: 'Demand', labelAt: [50, 5], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 4], to: [52, 45.6], label: 'Supply', labelAt: [46, 43], color: 'var(--c-supply)' },
  ],
  points: [{ x: 15, y: 32, label: 'A' }, { x: 15, y: 16, label: 'B', dx: 8, dy: 16 }, { x: 25, y: 24 }],
  guides: [{ x: 15, y: 32 }, { x: 15, y: 16 }, { x: 25, y: 24 }],
};

const ppfFig = (name: string, maxY: number, maxX: number, pt: [number, number] | null, ptLabel: string | null, xLabel: string, yLabel: string, ticks = r(50, 500, 50)): FigureSpec => ({
  xDomain: [0, 520], yDomain: [0, 520], xLabel, yLabel, xTicks: ticks, yTicks: ticks, height: 380,
  curves: [{ kind: 'line', from: [0, maxY], to: [maxX, 0], label: `${name}'s PPF`, labelAt: [18, maxY + 12], color: 'var(--accent)' }],
  points: [{ x: 0, y: maxY }, { x: maxX, y: 0 }, ...(pt ? [{ x: pt[0], y: pt[1], label: ptLabel ?? undefined }] : [])],
  guides: pt ? [{ x: pt[0], y: pt[1] }] : [],
});

const q13fig: FigureSpec = {
  xDomain: [0, 10.4], yDomain: [0, 410], xLabel: 'PEANUTS (Pounds)', yLabel: 'CASHEWS (Pounds)',
  xTicks: r(1, 10, 1), yTicks: r(40, 400, 40),
  curves: [{ kind: 'line', from: [0, 240], to: [8, 0], label: "Peru's PPF", labelAt: [0.4, 250], color: 'var(--accent)' }],
  points: [{ x: 0, y: 240 }, { x: 8, y: 0 }],
};

const q17fig: FigureSpec = {
  xDomain: [0, 165], yDomain: [0, 17], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: [40, 80, 105, 120, 160], yTicks: [4, 8, 9, 12, 16],
  curves: [
    { kind: 'line', from: [85, 16], to: [140, 5], label: 'Demand', labelAt: [128, 3.4], color: 'var(--c-demand)' },
    { kind: 'line', from: [15, 6], to: [150, 15], label: 'S₂', labelAt: [151, 15.4], color: 'var(--c-supply)' },
    { kind: 'line', from: [15, 2], to: [150, 11], label: 'S₁', labelAt: [151, 11.4], color: 'var(--c-supply)' },
  ],
  points: [{ x: 105, y: 12 }, { x: 105, y: 8 }, { x: 120, y: 9 }],
  guides: [{ x: 105, y: 12 }, { x: 105, y: 8 }, { x: 120, y: 9 }],
};

const q20fig: FigureSpec = {
  xDomain: [0, 37], yDomain: [0, 25], xLabel: 'QUANTITY', yLabel: 'PRICE', height: 440,
  xTicks: r(3, 36, 3), yTicks: r(2, 24, 2),
  curves: [
    { kind: 'line', from: [0, 24], to: [36, 6], label: 'Demand', labelAt: [33.5, 5.2], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 4], to: [36, 16], label: 'Supply', labelAt: [32, 17.3], color: 'var(--c-supply)' },
  ],
  points: [{ x: 12, y: 18 }, { x: 12, y: 8 }, { x: 24, y: 12 }, { x: 32, y: 8 }],
  guides: [{ x: 12, y: 18 }, { x: 24, y: 12 }, { x: 32, y: 8 }, { x: 12, y: 8, toY: false }],
  labels: [
    { x: 3, y: 20.5, text: 'A' }, { x: 6, y: 14.5, text: 'B' }, { x: 15, y: 15, text: 'C' }, { x: 6, y: 10, text: 'D' },
    { x: 16, y: 11, text: 'F' }, { x: 21, y: 9.4, text: 'G' }, { x: 25.5, y: 9.4, text: 'H' }, { x: 4, y: 6.6, text: 'J' },
    { x: 5, y: 3, text: 'K' }, { x: 18, y: 3, text: 'L' }, { x: 28, y: 3, text: 'M' },
  ],
};

const q26fig: FigureSpec = {
  xDomain: [0, 6.2], yDomain: [0, 12.6], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: r(0.5, 6, 0.5), yTicks: r(1, 12, 1),
  curves: [
    { kind: 'line', from: [0, 12], to: [4, 0], label: 'Demand', labelAt: [3.9, 0.7], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 2], to: [5, 12], label: 'Supply', labelAt: [4, 9.6], color: 'var(--c-supply)' },
  ],
  points: [{ x: 1, y: 9, label: 'E' }, { x: 1, y: 4, label: 'F', dx: 8, dy: 16 }, { x: 2, y: 6 }],
  guides: [{ x: 1, y: 9 }, { x: 1, y: 4 }, { x: 2, y: 6 }],
};

const q31fig: FigureSpec = {
  xDomain: [0, 11.5], yDomain: [0, 12], xLabel: 'QUANTITY', yLabel: 'PRICE', xTicks: [], yTicks: [],
  curves: [
    { kind: 'line', from: [0, 10], to: [5, 0], label: 'Demand₁', labelAt: [0.4, 10.4], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 5.5], to: [11, 0], label: 'Demand₂', labelAt: [9.2, 1.4], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 0], to: [8.4, 11.2], label: 'Supply₁', labelAt: [8.6, 11.2], color: 'var(--c-supply)' },
    { kind: 'line', from: [0, 2.5], to: [11, 8], label: 'Supply₂', labelAt: [8.6, 7.5], color: 'var(--c-supply)' },
  ],
  points: [{ x: 3, y: 4 }],
};

const q39fig: FigureSpec = {
  xDomain: [0, 126], yDomain: [0, 126], xLabel: 'QUANTITY', yLabel: 'PRICE', height: 460,
  xTicks: [{ v: 30, label: 'T' }, { v: 40, label: 'W' }, { v: 60, label: 'Z' }],
  yTicks: [{ v: 30, label: 'A', dy: 5 }, { v: 31.25, label: 'B', dy: -5 }, { v: 40, label: 'C' }, { v: 60, label: 'J' }, { v: 80, label: 'K' }, { v: 90, label: 'L' }, { v: 120, label: 'P' }],
  curves: [
    { kind: 'line', from: [0, 120], to: [120, 0], label: 'D', labelAt: [118, 6], color: 'var(--c-demand)' },
    { kind: 'line', from: [0, 120], to: [60, 0], label: 'MR', labelAt: [63, 8], color: 'var(--c-mr)' },
    { kind: 'line', from: [12, 12], to: [100, 100], label: 'MC', labelAt: [101, 103], color: 'var(--c-mc)' },
    { kind: 'fn', fn: { type: 'atc', fixed: 450, c: 0, e: 1 }, xFrom: 14, xTo: 122, label: 'ATC', labelAt: [112, 72], color: 'var(--c-atc)' },
  ],
  guides: [{ x: 30, y: 90 }, { x: 40, y: 80 }, { x: 60, y: 60 }, { x: 40, y: 40 }, { x: 40, y: 31.25 }, { x: 30, y: 30 }],
};

export const SOURCE_QUESTIONS: BankQuestion[] = [
  {
    id: 'pq01', source: `${SRC} · Q1`, kind: 'mcq', lectures: ['ch06', 'ch08'], topics: ['tax-incidence'], difficulty: 2,
    stem: 'Suppose a tax of $60 per ticket is imposed on NBA tickets and the sellers of NBA tickets have to pay the tax to the government. If the tax is reduced from $60 per ticket to $45 per ticket, then the',
    options: [
      'demand curve will shift upward by $15, and the price paid by buyers will decrease by less than $15.',
      'demand curve will shift upward by $15, and the price paid by buyers will decrease by $15.',
      'supply curve will shift downward by $15, and the effective price received by sellers will increase by less than $15.',
      'supply curve will shift downward by $15, and the effective price received by sellers will increase by $15.',
    ],
  },
  {
    id: 'pq02', source: `${SRC} · Q2`, kind: 'mcq', lectures: ['ch07'], topics: ['producer-surplus'], difficulty: 1,
    stem: "It costs $1.00 to make a biscuit at Peter's cake shop. If Peter sells 30 biscuits and gains producer surplus of $60.00, he must be selling his biscuits for",
    options: ['$1.00 each.', '$2.00 each.', '$3.00 each.', '$20.00 each.'],
  },
  {
    id: 'pq03', source: `${SRC} · Q3`, kind: 'mcq', lectures: ['ch08'], topics: ['tax-revenue', 'deadweight-loss'], difficulty: 2,
    stem: 'The vertical distance between points A and B represents the original tax.',
    figures: [{ spec: q3fig }],
    question: 'If the per-unit tax has been cut from $5.00 to $2.50, the price paid by the purchasers amounts to $7.50, the price received by the sellers amounts to $5, and the quantity sold amounts to 1.5 units. This lower tax rate, compared to the original tax rate, would',
    options: [
      'increase government revenue and increase the deadweight loss from the tax.',
      'increase government revenue and decrease the deadweight loss from the tax.',
      'decrease government revenue and increase the deadweight loss from the tax.',
      'decrease government revenue and decrease the deadweight loss from the tax.',
    ],
  },
  {
    id: 'pq04', source: `${SRC} · Q4`, kind: 'mcq', lectures: ['ch01', 'ch14'], topics: ['marginal-thinking', 'costs'], difficulty: 1,
    stem: 'Castle Construction, Inc., has built 20 apartments and cost $4 million. The company is considering building a 21th apartment and the total cost will increase to $4.2 million. Which of the following statements is correct?',
    options: [
      'For the first 20 apartments, the average cost per apartment was $150,000.',
      'If the 21th apartment is built, the marginal cost will equal $200,000.',
      'If the company can sell the 21th apartment for at least $170,000, then it should build it.',
      'The company should never build the 21th apartment because this increases its total cost.',
    ],
  },
  {
    id: 'pq05', source: `${SRC} · Q5`, kind: 'mcq', lectures: ['ch05'], topics: ['elasticity', 'total-revenue'], difficulty: 2,
    stem: '',
    figures: [{ spec: q5fig }],
    question: 'If size of the rectangle A is smaller than that of rectangle D, then which of the following is incorrect?',
    options: [
      'Demand is elastic between the two prices, P1 and P2.',
      'A decrease in price from P2 to P1 will lead to an increase in total revenue.',
      'The magnitude of the percentage change in price between P1 and P2 is smaller than the magnitude of the corresponding percent change in quantity demanded.',
      'An increase in price from P1 to P2 will lead to an increase in total revenue.',
    ],
  },
  {
    id: 'pq06', source: `${SRC} · Q6`, kind: 'mcq', lectures: ['ch03'], topics: ['opportunity-cost', 'comparative-advantage'], difficulty: 1,
    stem: 'Assume that Billy and Tony can produce walnut and producing bread at a constant rate.',
    table: { caption: 'Minutes Needed to Make 1', headers: ['', 'Pound of Walnut', 'Pound of Bread'], rows: [['Billy', 10, 12], ['Tony', 6, 10]] },
    question: "What is Tony's opportunity cost of producing one pound of walnut?",
    options: ['1/2 pound of bread', '5/3 pounds of bread', '3/5 pounds of bread', '1 pound of bread'],
  },
  {
    id: 'pq07', source: `${SRC} · Q7`, kind: 'mcq', lectures: ['ch07'], topics: ['consumer-surplus'], difficulty: 3,
    stem: 'Bobby, Sasra, and Avaa are the only three buyers of pies and only three pies can be produced every day.',
    table: { caption: 'Willingness to Pay (Dollars)', headers: ['', 'First Pie', 'Second Pie', 'Third Pie'], rows: [['Bobby', '2.00', '1.50', '0.75'], ['Sasra', '1.50', '1.00', '0.60'], ['Avaa', '0.75', '0.25', '0.00']] },
    question: 'Which of the following statements is correct?',
    options: [
      "Neither Sasra's consumer surplus nor Avaa's consumer surplus can exceed Bobby's consumer surplus, for any price of a pie.",
      'All three individuals will buy at least one pie only if the price of a pie is less than $0.25.',
      'If the price of a pie is $0.60, then consumer surplus is $4.90.',
      'Avaa will always have the highest consumer surplus.',
    ],
  },
  {
    id: 'pq08', source: `${SRC} · Q8`, kind: 'mcq', lectures: ['ch07'], topics: ['consumer-surplus', 'producer-surplus', 'efficiency'], difficulty: 2,
    stem: '',
    table: { headers: ['Price (Dollars per unit)', 'Quantity Demanded (Units)', 'Quantity Supplied (Units)'], rows: [['12.00', 0, 36], ['10.00', 3, 30], ['8.00', 6, 24], ['6.00', 9, 18], ['4.00', 12, 12], ['2.00', 15, 6], ['0.00', 18, 0]] },
    question: 'The market demand curve and the market supply curve are straight lines. Total surplus, at equilibrium, amounts to',
    options: ['$44.', '$56.', '$72.', '$96.'],
  },
  {
    id: 'pq09', source: `${SRC} · Q9`, kind: 'mcq', lectures: ['ch05'], topics: ['elasticity', 'total-revenue'], difficulty: 2,
    stem: "Sara's Scanning Service's total monthly revenue has increased from $12,000 to $13,500 when the price of scanning has been raised from $600 to $750. The price elasticity of demand for Sara's Scanning Service is",
    options: ['0.11.', '0.47.', '1.12.', '2.11.'],
  },
  {
    id: 'pq10', source: `${SRC} · Q10`, kind: 'mcq', lectures: ['ch08'], topics: ['deadweight-loss'], difficulty: 2,
    stem: 'A tax: point A to point B',
    figures: [{ spec: q10fig }],
    question: 'The deadweight loss is',
    options: [
      "$80, represents the amount by which the government's tax revenue exceeds the loss of producer and consumer surpluses combined.",
      '$80, represents the loss of surplus because the tax discourages mutually advantageous trades between buyers and sellers.',
      "$160, represents the amount by which the government's tax revenue exceeds the loss of producer and consumer surpluses combined.",
      '$160, represents the loss of surplus because the tax discourages mutually advantageous trades between buyers and sellers.',
    ],
  },
  {
    id: 'pq11', source: `${SRC} · Q11`, kind: 'mcq', lectures: ['ch03'], topics: ['ppf', 'comparative-advantage'], difficulty: 2,
    stem: '',
    figures: [
      { spec: ppfFig('Alvina', 400, 200, [100, 200], 'A', 'PIZZAS', 'LEMONADE') },
      { spec: ppfFig('Jane', 450, 300, [180, 180], 'B (180, 180)', 'PIZZAS', 'LEMONADE') },
    ],
    question: 'Point A and Point B represent current production. Could these two individuals gain from trade?',
    options: [
      'Alvina produces more pizzas and Jane produces more lemonade.',
      'Alvina produces more lemonade and Jane produces more pizzas.',
      'Both Alvina and Betty produce only pizzas.',
      'There are no circumstances under which both Alvina and Jane can benefit from specialization and trade.',
    ],
    fixedOrder: true,
  },
  {
    id: 'pq12', source: `${SRC} · Q12`, kind: 'mcq', lectures: ['ch01'], topics: ['opportunity-cost'], difficulty: 3,
    stem: 'A movie ticket typically costs $7.00 at Broadway cinema. You plan to see a movie for which you have a $3-off coupon good for only that movie at that time. You ran into a friend who asked if you would rather see a new release. Both movies start and end at the same time. What is your opportunity cost if you decide to see the new release with your friend?',
    options: ['The amount you value the first movie + $3', 'The amount you value the first movie + $7.00', '$3', '$7.00'],
  },
  {
    id: 'pq13', source: `${SRC} · Q13`, kind: 'mcq', lectures: ['ch02'], topics: ['ppf'], difficulty: 1,
    stem: '',
    figures: [{ spec: q13fig }],
    question: 'Given the production possibilities frontier, which of the following could be possible?',
    options: ['7 pounds of peanuts and 135 pounds of cashews', '5 pounds of peanuts and 160 pounds of cashews', '2 pounds of peanuts and 240 pounds of cashews', '3 pounds of peanuts and 150 pounds of cashews'],
  },
  {
    id: 'pq14', source: `${SRC} · Q14`, kind: 'mcq', lectures: ['ch07'], topics: ['producer-surplus'], difficulty: 2,
    stem: '',
    table: { headers: ['Price (Dollars per unit)', 'Quantity Demanded (Units)', 'Quantity Supplied (Units)'], rows: [['12.00', 0, 36], ['10.00', 3, 30], ['8.00', 6, 24], ['6.00', 9, 18], ['4.00', 12, 12], ['2.00', 15, 6], ['0.00', 18, 0]] },
    question: 'The demand curve and the supply curve are straight lines. Producer surplus at equilibrium amounts to',
    options: ['$24.', '$32.', '$48.', '$64.'],
  },
  {
    id: 'pq15', source: `${SRC} · Q15`, kind: 'mcq', lectures: ['ch02', 'ch03'], topics: ['opportunity-cost', 'ppf'], difficulty: 2,
    stem: "A mechanic could build either cars or trucks or some combination of the two. The mechanic's opportunity cost of a car multiplied by his opportunity cost of a truck",
    options: ['is equal to 0.', 'is between 0 and 1.', 'is equal to 1.', 'is greater than 1.'],
    fixedOrder: true,
  },
  {
    id: 'pq16', source: `${SRC} · Q16`, kind: 'mcq', lectures: ['ch01'], topics: ['marginal-thinking', 'sunk-cost'], difficulty: 2,
    stem: 'Bobby has just paid $400,000 for a house on Clear Water Bay Street and is planning to spend $50,000 on repairs. He is planning to sell the house for $500,000 after the renovation. Last week, the government announced that a new landfill will be built on Clear Water Bay Street near the house Bobby purchased. Bobby is thinking if (1) he should go ahead with the $50,000 in repairs and then sell the house for $390,000, or (2) he should give up on the repairs and sell the house as it is for $350,000. He should',
    options: [
      'keep the house and live in it.',
      'go ahead with the $50,000 in repairs and sell the house for $390,000.',
      'forgo the repairs and sell the house as it is for $350,000.',
      'move the house from Clear Water Bay Street to a more desirable location, regardless of the cost of doing so.',
    ],
  },
  {
    id: 'pq17', source: `${SRC} · Q17`, kind: 'mcq', lectures: ['ch06', 'ch08'], topics: ['tax-incidence'], difficulty: 1,
    stem: '',
    figures: [{ spec: q17fig }],
    question: 'How much is the per-unit tax?',
    options: ['$1', '$2', '$3', '$4'],
    fixedOrder: true,
  },
  {
    id: 'pq18', source: `${SRC} · Q18`, kind: 'mcq', lectures: ['ch06'], topics: ['tax-incidence'], difficulty: 1,
    stem: 'In a cupcake market, a tax imposed on the sellers will raise the price paid by buyers,',
    options: [
      'increase the effective price of cupcakes received by sellers, and increase the equilibrium quantity of cupcakes.',
      'increase the effective price of cupcakes received by sellers, and decrease the equilibrium quantity of cupcakes.',
      'decrease the effective price of cupcakes received by sellers, and increase the equilibrium quantity of cupcakes.',
      'decrease the effective price of cupcakes received by sellers, and decrease the equilibrium quantity of cupcakes.',
    ],
  },
  {
    id: 'pq19', source: `${SRC} · Q19`, kind: 'mcq', lectures: ['ch08'], topics: ['deadweight-loss'], difficulty: 2,
    stem: 'There is new policy that each smart phone sold is taxed. Suppose that both the supply curve and the demand curve are straight lines. The equilibrium quantity of smart phones sold drops from 8,000 to 7,000, and the deadweight loss of the tax is $60,000. What is the tax on each smart phone?',
    options: ['$60.', '$120.', '$160.', '$200.'],
  },
  {
    id: 'pq20', source: `${SRC} · Q20`, kind: 'mcq', lectures: ['ch08'], topics: ['consumer-surplus', 'tax-incidence'], difficulty: 2,
    stem: '',
    figures: [{ spec: q20fig }],
    question: 'If a per-unit tax of $10 is imposed on by the government, the consumer surplus will be decreased by',
    options: ['A.', 'B + C.', 'A + B + C.', 'A + B + C + D + F.'],
  },
  {
    id: 'pq21', source: `${SRC} · Q21`, kind: 'mcq', lectures: ['ch03'], topics: ['opportunity-cost', 'ppf'], difficulty: 1,
    stem: '',
    figures: [
      { spec: ppfFig('Tanek', 300, 400, null, null, 'TACOS', 'BURRITOS') },
      { spec: ppfFig('Barb', 200, 400, null, null, 'TACOS', 'BURRITOS') },
    ],
    question: 'The opportunity cost of one burrito for Tanek is',
    options: [
      "3/4 taco and Barb's opportunity cost of one burrito is 1/2 taco.",
      "3/4 taco and Barb's opportunity cost of one burrito is 2 tacos.",
      "4/3 tacos and Barb's opportunity cost of one burrito is 1/2 taco.",
      "4/3 tacos and Barb's opportunity cost of one burrito is 2 tacos.",
    ],
  },
  {
    id: 'pq22', source: `${SRC} · Q22`, kind: 'mcq', lectures: ['ch04'], topics: ['shifts'], difficulty: 1,
    stem: 'Given the number of buyers in a market drops, then',
    options: ['demand will increase.', 'demand will decrease.', 'supply will increase.', 'supply will decrease.'],
  },
  {
    id: 'pq23', source: `${SRC} · Q23`, kind: 'mcq', lectures: ['ch07'], topics: ['consumer-surplus', 'willingness-to-pay'], difficulty: 2,
    stem: '',
    table: { headers: ['Buyer', 'Willingness to Pay for a Baseball Game Ticket (Dollars)'], rows: [['Nathan', 6], ['Ted', 9], ['Kelly', 12], ['Sara', 15], ['Eva', 18], ['Bill', 21]] },
    question: 'If you sell 2 boxes of surgical masks in an auction and each one can only buy one box, which of the following is closest to the selling price for each box?',
    options: ['$8', '$16', '$11', '$20'],
  },
  {
    id: 'pq24', source: `${SRC} · Q24`, kind: 'mcq', lectures: ['ch07'], topics: ['consumer-surplus'], difficulty: 1,
    stem: 'If the cost of producing surgical masks increases causing the price of surgical masks to increase, consumer surplus in the surgical mask market will',
    options: ['decrease.', 'increase.', 'remain constant.', 'increase for some buyers and decrease for other buyers.'],
  },
  {
    id: 'pq25', source: `${SRC} · Q25`, kind: 'mcq', lectures: ['ch03'], topics: ['comparative-advantage'], difficulty: 1,
    stem: 'Suppose a country has a comparative advantage in producing a certain good,',
    options: [
      'the country should import that good.',
      'the country should produce just enough of that good for its own consumption.',
      "the country's opportunity cost of that good is high relative to other countries' opportunity costs of that same good.",
      'then specializing in the production of that good and trading for other goods could allow that country to consume at a point beyond its production possibilities frontier.',
    ],
  },
  {
    id: 'pq26', source: `${SRC} · Q26`, kind: 'mcq', lectures: ['ch08'], topics: ['producer-surplus', 'tax-incidence'], difficulty: 2,
    stem: '',
    figures: [{ spec: q26fig }],
    question: 'The length between points E and F denotes a tax. The producer surplus without the tax is',
    options: [
      '$4, and producer surplus with the tax is $1.',
      '$1, and producer surplus with the tax is $4.',
      '$4, and producer surplus with the tax is $1.5.',
      '$1.5, and producer surplus with the tax is $6.',
    ],
  },
  {
    id: 'pq27', source: `${SRC} · Q27`, kind: 'mcq', lectures: ['ch08'], topics: ['deadweight-loss', 'gains-from-trade'], difficulty: 2,
    stem: 'Raymand charges Kara $2.5 for mowing her lawn. The opportunity cost for Raymand to mow Kara\'s lawn is $2.0, and Kara is willing to pay $2.8 Raymand to mow her lawn. Suppose Raymand is required by law to pay a tax of $0.3 each time he mows a lawn. Which of the following results is most likely?',
    options: [
      'Kara now will decide to mow her own lawn, and Raymand will decide it is no longer in his interest to mow Kara\'s lawn.',
      'Kara is willing to pay Raymand to mow her lawn, but Raymand will decline her offer.',
      'Raymand is willing to mow Kara\'s lawn, but Kara will decide to mow her own lawn.',
      'Raymand and Kara still can engage in a mutually-agreeable trade.',
    ],
  },
  {
    id: 'pq28', source: `${SRC} · Q28`, kind: 'mcq', lectures: ['ch05'], topics: ['elasticity'], difficulty: 2,
    stem: 'Which of the following statements is incorrect?',
    options: [
      'Advocates for drug-interdiction policies that reduce the supply of illegal drugs argue that the demand for illegal drugs may be more responsive in the long run than in the short run.',
      'The demand for illegal drugs is price inelastic.',
      'Drug interdiction efforts that reduce the supply of illegal drugs may increase drug-related crimes.',
      'The quantity of illegal drugs demanded is very responsive to changes in price.',
    ],
  },
  {
    id: 'pq29', source: `${SRC} · Q29`, kind: 'mcq', lectures: ['ch06'], topics: ['price-controls'], difficulty: 1,
    stem: 'Suppose the equilibrium price of a training session by a fitness coach is $200, and the government imposes a price ceiling of $150 per session. As a result of the price ceiling, the',
    options: [
      'demand curve for training sessions shifts to the right.',
      'supply curve for training sessions shifts to the left.',
      'quantity demanded of training sessions increases, and the quantity supplied of training sessions decreases.',
      'number of training sessions completed stays the same.',
    ],
  },
  {
    id: 'pq30', source: `${SRC} · Q30`, kind: 'mcq', lectures: ['ch06', 'ch08'], topics: ['elasticity', 'tax-incidence'], difficulty: 2,
    stem: 'Suppose shoes are taxed. In which of the following scenarios will the tax shrink the equilibrium quantity of shoes by the largest amount?',
    options: [
      'The response of buyers to a change in the price of shoes is strong, and the response of sellers to a change in the price of shoes is weak.',
      'The response of sellers to a change in the price of shoes is strong, and the response of buyers to a change in the price of shoes is weak.',
      'The response of buyers and sellers to a change in the price of shoes is strong.',
      'The response of buyers and sellers to a change in the price of shoes is weak.',
    ],
  },
  {
    id: 'pq31', source: `${SRC} · Q31`, kind: 'mcq', lectures: ['ch08'], topics: ['deadweight-loss', 'elasticity'], difficulty: 2,
    stem: '',
    figures: [{ spec: q31fig }],
    question: 'Suppose the government is considering levying a tax in markets with the following supply and demand combinations. Which combination will have the largest deadweight loss from a tax?',
    options: ['Supply₁ and Demand₁', 'Supply₂ and Demand₂', 'Supply₁ and Demand₂', 'Supply₂ and Demand₁'],
  },
  {
    id: 'pq32', source: `${SRC} · Q32`, kind: 'mcq', lectures: ['ch04', 'ch15'], topics: ['competitive-market'], difficulty: 1,
    stem: 'A key characteristic of a competitive market is that',
    options: ['government antitrust laws regulate competition.', 'producers sell nearly identical products.', 'firms minimize total costs.', 'firms have price setting power.'],
  },
  {
    id: 'pq33', source: `${SRC} · Q33`, kind: 'mcq', lectures: ['ch04', 'ch15'], topics: ['competitive-market'], difficulty: 1,
    stem: 'When firms are said to be price takers, it implies that if a firm raises its price,',
    options: ['buyers will go elsewhere.', 'buyers will pay the higher price in the short run.', 'competitors will also raise their prices.', 'firms in the industry will exercise market power.'],
  },
  {
    id: 'pq34', source: `${SRC} · Q34`, kind: 'mcq', lectures: ['ch15'], topics: ['competitive-firm'], difficulty: 1,
    stem: 'Table 14-1',
    table: { headers: ['Price (Dollars per unit)', 'Quantity Demanded (Units)'], rows: Array.from({ length: 10 }, (_, i) => [5, i]) },
    question: 'Refer to Table 14-1. The price and quantity relationship in the table is most likely a demand curve faced by a firm in a',
    options: ['monopoly.', 'concentrated market.', 'competitive market.', 'strategic market.'],
  },
  {
    id: 'pq35', source: `${SRC} · Q35`, kind: 'mcq', lectures: ['ch14', 'ch15'], topics: ['costs', 'competitive-firm'], difficulty: 2,
    stem: 'Table 14-8. A firm in a competitive market has the following cost structure.',
    table: { headers: ['Quantity (Units)', 'Average Total Cost (Dollars)'], rows: [[0, '--'], [1, 10], [2, 8], [3, 7], [4, 8], [5, 10]] },
    question: "Refer to Table 14-8. If the firm's fixed cost of production is $3, and the market price is $10, how many units should the firm produce to maximize profit?",
    options: ['1 unit', '2 units', '3 units', '4 units'],
    fixedOrder: true,
  },
  {
    id: 'pq36', source: `${SRC} · Q36`, kind: 'mcq', lectures: ['beyond'], topics: ['monopoly'], difficulty: 1,
    stem: 'Monopoly firms face',
    options: [
      'downward-sloping demand curves, so they can sell as much output as they desire at the market price.',
      'downward-sloping demand curves, so they can sell only the specific price-quantity combinations that lie on the demand curve.',
      'horizontal demand curves, so they can sell as much output as they desire at the market price.',
      'horizontal demand curves, so they can sell only a limited quantity of output at each price.',
    ],
  },
  {
    id: 'pq37', source: `${SRC} · Q37`, kind: 'mcq', lectures: ['beyond'], topics: ['monopoly'], difficulty: 1,
    stem: 'When a monopolist increases the amount of output that it produces and sells, average revenue',
    options: ['increases, and marginal revenue increases.', 'increases, and marginal revenue decreases.', 'decreases, and marginal revenue increases.', 'decreases, and marginal revenue decreases.'],
  },
  {
    id: 'pq38', source: `${SRC} · Q38`, kind: 'mcq', lectures: ['beyond'], topics: ['monopoly'], difficulty: 2,
    stem: 'A monopolist can sell 300 units of output for $45 per unit. Alternatively, it can sell 301 units of output for $44.60 per unit. The marginal revenue of the 301st unit of output is',
    options: ['-$120.00.', '-$75.40.', '-$0.40.', '$75.40.'],
  },
  {
    id: 'pq39', source: `${SRC} · Q39`, kind: 'mcq', lectures: ['beyond'], topics: ['monopoly'], difficulty: 2,
    stem: 'Figure 15-4',
    figures: [{ spec: q39fig, caption: 'Reconstructed with D: P = 120 − Q, MC = Q, ATC = 450/Q + Q/2, so every labelled point is consistent with the original figure (MR = MC at W; ATC is minimised at T).' }],
    question: "Refer to Figure 15-4. What area measures the monopolist's profit?",
    options: ['(K − C) × W', '(L − A) × T', '(K − B) × W', '0.5[(K − C) × (Z − T)]'],
  },
];
