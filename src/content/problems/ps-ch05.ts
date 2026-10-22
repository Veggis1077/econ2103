import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch05',
  title: 'Problem set: Chapter 5',
  lectures: ['ch05'],
  problems: [
    { id: 'p4', title: 'P4 — Quantity −30%, revenue +15%', source: 'ProblemSets/Chapter 5.pdf', models: ['elasticity'], intro: 'A price change causes the quantity demanded of a good to decrease by 30 percent, while total revenue increases by 15 percent.',
      parts: [{ label: 'a', prompt: 'Is demand elastic or inelastic? Explain.', solution: 'Revenue rose although quantity fell, so the price rose — by more than quantity fell (1.15 = (1 + %ΔP) × 0.70 ⇒ the price rose ≈ 64%). |%ΔQ| < |%ΔP| ⇒ **inelastic**: price and revenue moved in the same direction.' }] },
    { id: 'p5', title: 'P5 — Coffee, donuts and a hurricane', source: 'ProblemSets/Chapter 5.pdf', intro: 'Cups of coffee and donuts are complements; both have inelastic demand. A hurricane destroys half the coffee bean crop.',
      parts: [
        { label: 'a', prompt: 'What happens to the price of coffee beans?', solution: 'Supply of beans ↓ ⇒ the price of beans **rises** (a lot, since demand is inelastic).' },
        { label: 'b', prompt: 'Price of a cup of coffee and total expenditure on coffee?', solution: 'Input cost ↑ ⇒ supply of cups ↓ ⇒ price ↑; inelastic demand ⇒ **expenditure rises**.' },
        { label: 'c', prompt: 'Price of donuts and total expenditure on donuts?', solution: 'Fewer cups of coffee ⇒ demand for donuts ↓ ⇒ price ↓ and quantity ↓ ⇒ **expenditure falls**.' },
      ] },
    { id: 'p6', title: 'P6 — Ibuprofen diagnoses', source: 'ProblemSets/Chapter 5.pdf', intro: 'The price of ibuprofen rose sharply last month while the quantity sold stayed the same. Meredith: demand increased, but supply was perfectly inelastic. Alex: demand increased, but it was perfectly inelastic. Miranda: demand increased, but supply decreased at the same time. Richard: supply decreased, but demand was unit elastic. Owen: supply decreased, but demand was perfectly inelastic.',
      parts: [{ label: 'a', prompt: 'Who could possibly be right?', solution: '**Meredith** (vertical supply: a demand increase raises only P), **Miranda** (demand ↑ and supply ↓ of the right sizes leave Q unchanged with P ↑) and **Owen** (vertical demand: a supply cut raises only P). **Alex** is wrong — a vertical demand curve shifting right raises Q. **Richard** is wrong — with unit-elastic demand a supply cut must lower Q (revenue stays constant, so a higher P means a lower Q).' }] },
    { id: 'p9', title: 'P9 — Thelma and Louise', source: 'ProblemSets/Chapter 5.pdf', intro: 'Before checking the price, Thelma says "I’d like 5 gallons of gas." Louise says "I’d like $20 worth of gas."',
      parts: [
        { label: 'a', prompt: "Thelma's price elasticity of demand?", solution: 'She buys 5 gallons at any price ⇒ **0** (perfectly inelastic).', check: { answer: 0 } },
        { label: 'b', prompt: "Louise's price elasticity of demand?", solution: 'She spends $20 at any price ⇒ revenue constant ⇒ **1** (unit elastic).', check: { answer: 1 } },
      ] },
    { id: 'p12', title: 'P12 — Droughts and farm revenue', source: 'ProblemSets/Chapter 5.pdf', intro: 'Explain why the following might be true: a drought around the world raises the total revenue that farmers receive from grain, but a drought only in Kansas reduces the revenue Kansas farmers receive.',
      parts: [{ label: 'a', prompt: 'Explain.', solution: 'World drought: world supply ↓; demand for grain is **inelastic**, so the price rises proportionally more than quantity falls ⇒ total revenue **rises**. Kansas-only drought: Kansas is a small part of the market, so the world price barely moves — Kansas farmers face an (almost) **perfectly elastic** demand. They sell less at the same price ⇒ their revenue **falls**.' }] },
  ],
};
export default ps;
