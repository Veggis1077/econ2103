import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch04',
  title: 'Problem set: Chapter 4',
  lectures: ['ch04'],
  problems: [
    { id: 'p3', title: 'P3 — The market for pickup trucks', source: 'ProblemSets/Chapter 4.pdf', models: ['shift-analyzer'], intro: 'For each event identify the determinant of demand or supply affected, whether demand or supply increases or decreases, and the effect on the price and quantity of pickup trucks.',
      parts: [
        { label: 'a', prompt: 'Advances in fracking reduce the price of gasoline.', solution: 'Gasoline is a **complement** ⇒ demand ↑ ⇒ P ↑, Q ↑.' },
        { label: 'b', prompt: 'A strike by steelworkers raises steel prices.', solution: 'Steel is an **input** ⇒ supply ↓ ⇒ P ↑, Q ↓.' },
        { label: 'c', prompt: 'Engineers develop new automated machinery for producing pickup trucks.', solution: '**Technology** ⇒ supply ↑ ⇒ P ↓, Q ↑.' },
        { label: 'd', prompt: 'The price of sports utility vehicles rises.', solution: 'SUVs are **substitutes** ⇒ demand ↑ ⇒ P ↑, Q ↑.' },
        { label: 'e', prompt: 'A stock market crash lowers people’s wealth.', solution: '**Income/wealth** falls; trucks are a normal good ⇒ demand ↓ ⇒ P ↓, Q ↓.' },
      ] },
    { id: 'p4', title: 'P4 — Streaming, TV screens and movie tickets', source: 'ProblemSets/Chapter 4.pdf', intro: 'Consider the markets for video streaming services, TV screens, and tickets at movie theatres.',
      parts: [
        { label: 'a', prompt: 'For each pair: complements or substitutes? (streaming & TV screens; streaming & movie tickets; TV screens & movie tickets)', solution: 'Streaming & TV screens: **complements**. Streaming & movie tickets: **substitutes**. TV screens & movie tickets: **substitutes**.' },
        { label: 'b', prompt: 'A technological advance reduces the cost of making TV screens. What happens in the TV screen market?', solution: 'Supply of screens ↑ ⇒ price ↓, quantity ↑.' },
        { label: 'c', prompt: 'How does this affect the markets for streaming and movie tickets?', solution: 'More screens ⇒ demand for **streaming** ↑ (P ↑, Q ↑). Home viewing replaces cinema ⇒ demand for **movie tickets** ↓ (P ↓, Q ↓).' },
      ] },
    { id: 'p7', title: 'P7 — Ketchup and hot dogs', source: 'ProblemSets/Chapter 4.pdf', intro: 'Ketchup is a complement (as well as a condiment) for hot dogs. The price of hot dogs rises.',
      parts: [{ label: 'a', prompt: 'What happens in the markets for ketchup, tomatoes, tomato juice and orange juice?', solution: '**Ketchup:** demand ↓ ⇒ P ↓, Q ↓. **Tomatoes** (input to ketchup): demand ↓ ⇒ P ↓, Q ↓. **Tomato juice:** cheaper tomatoes ⇒ supply ↑ ⇒ P ↓, Q ↑. **Orange juice** (substitute for tomato juice): demand ↓ ⇒ P ↓, Q ↓.' }] },
    { id: 'p9', title: 'P9 — Healthier oranges and a new fertilizer', source: 'ProblemSets/Chapter 4.pdf', models: ['shift-analyzer'], intro: 'Scientists reveal that eating oranges decreases the risk of diabetes, and at the same time farmers use a new fertilizer that makes orange trees produce more oranges.',
      parts: [{ label: 'a', prompt: 'Effect on the equilibrium price and quantity of oranges?', solution: 'Demand ↑ (tastes) and supply ↑ (technology): **quantity rises**; the **price is ambiguous** — it rises if the demand shift is larger, falls if the supply shift is larger.' }] },
    { id: 'p10', title: 'P10 — Bagels and cream cheese', source: 'ProblemSets/Chapter 4.pdf', intro: 'Bagels and cream cheese are complements.',
      parts: [
        { label: 'a', prompt: 'The equilibrium price of cream cheese and the equilibrium quantity of bagels have both risen. A fall in the price of flour or a fall in the price of milk?', solution: '**A fall in the price of flour**: bagel supply ↑ ⇒ more bagels ⇒ demand for cream cheese ↑ ⇒ its price ↑. (Cheaper milk would lower the price of cream cheese.)' },
        { label: 'b', prompt: 'The price of cream cheese rose but the quantity of bagels fell. A rise in the price of flour or of milk?', solution: '**A rise in the price of milk**: cream-cheese supply ↓ ⇒ its price ↑ and quantity ↓ ⇒ demand for bagels ↓ ⇒ fewer bagels. (Dearer flour would lower the quantity of bagels but also *lower* the demand for, and price of, cream cheese.)' },
      ] },
  ],
};
export default ps;
