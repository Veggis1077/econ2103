import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-sp-ch06',
  title: 'Self-practice: Chapter 6',
  lectures: ['ch06'],
  problems: [
    { id: 'p3', title: 'P3 — Frisbees', source: 'ProblemSets/Self-Practice_Chapter 6.pdf', models: ['price-controls'], intro: 'A recent study found these demand and supply schedules for Frisbees.',
      table: { headers: ['Price per Frisbee', 'Quantity demanded', 'Quantity supplied'], rows: [['$11', '1 million', '15 million'], ['10', 2, 12], ['9', 4, 9], ['8', 6, 6], ['7', 8, 3], ['6', 10, 1]] },
      parts: [
        { label: 'a', prompt: 'Equilibrium price and quantity?', solution: '**$8**, **6 million** Frisbees.', check: { answer: 8, unit: '$' } },
        { label: 'b', prompt: 'Congress imposes a price floor $2 above equilibrium. New price? How many sold (million)?', solution: 'Floor $10 (binding): price **$10**; buyers take only **2 million** (surplus of 10 million).', check: { answer: 2, unit: 'million' } },
        { label: 'c', prompt: 'The floor is repealed and a ceiling $1 below the former floor is imposed. New price? Quantity (million)?', solution: 'Ceiling $9 is **above** equilibrium ⇒ not binding: price **$8**, **6 million**.', check: { answer: 6, unit: 'million' } },
      ] },
    { id: 'p4', title: 'P4 — A $2 beer tax on drinkers', source: 'ProblemSets/Self-Practice_Chapter 6.pdf', models: ['tax'], intro: 'The federal government requires beer drinkers to pay a $2 tax on each case of beer purchased.',
      parts: [
        { label: 'a', prompt: 'Without the tax: difference between the price paid by consumers and received by producers?', solution: 'They are the same equilibrium price: difference **$0**.', check: { answer: 0, unit: '$' } },
        { label: 'b', prompt: 'With the tax: difference? Has quantity sold increased or decreased?', solution: 'Demand shifts down by $2: the wedge is **$2** (buyers pay P_S + 2), and the quantity sold **decreases**.', check: { answer: 2, unit: '$' } },
      ] },
    { id: 'p5', title: 'P5 — The senator’s payroll-tax plan', source: 'ProblemSets/Self-Practice_Chapter 6.pdf', intro: 'A senator wants to raise tax revenue and make workers better off. A staff member proposes raising the payroll tax paid by firms and using part of the extra revenue to reduce the payroll tax paid by workers.',
      parts: [{ label: 'a', prompt: 'Would this accomplish the senator’s goal?', solution: '**No.** Tax incidence depends on the elasticities of labour supply and demand, not on who legally pays. Only the **total** wedge matters: if total payroll tax rises (to raise revenue), the wedge grows and workers’ after-tax wage falls by their share, regardless of how the tax is split on paper.' }] },
  ],
};
export default ps;
