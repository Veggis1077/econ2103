import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch06-08',
  title: 'Problem set: Chapters 6 & 8',
  lectures: ['ch06', 'ch08'],
  problems: [
    { id: 'c6p7', title: 'Ch. 6, P7 — A $0.50 gasoline tax', source: 'ProblemSets/Chapter 6&8.pdf', models: ['tax'], intro: 'Congress and the president want to reduce air pollution by reducing gasoline use. They impose a $0.50 tax on each gallon sold.',
      parts: [
        { label: 'a', prompt: 'Should they impose the tax on producers or consumers?', solution: '**It does not matter.** A tax on producers shifts supply up by $0.50; a tax on consumers shifts demand down by $0.50. Either way the wedge between the buyer price and seller price is $0.50 and the equilibrium quantity is the same.' },
        { label: 'b', prompt: 'If demand were more elastic, would the tax be more or less effective at reducing quantity?', solution: '**More effective.** With flatter demand the same wedge reduces the quantity by more (buyers cut back strongly).' },
        { label: 'c', prompt: 'Are consumers helped or hurt?', solution: '**Hurt** — they pay a higher price (ignoring any benefit from cleaner air).' },
        { label: 'd', prompt: 'Are oil-industry workers helped or hurt?', solution: '**Hurt** — producers receive a lower price and sell less, so demand for their labour falls.' },
      ] },
    { id: 'c6p8', title: 'Ch. 6, P8 — The minimum wage', source: 'ProblemSets/Chapter 6&8.pdf', models: ['price-controls'], intro: 'Suppose the minimum wage is above the equilibrium wage in the market for unskilled labour.',
      parts: [
        { label: 'a', prompt: 'Show the market wage, employment, unemployment and total wage payments.', solution: 'Wage = the minimum wage. Employment = **quantity demanded** at that wage. Unemployment = quantity supplied − quantity demanded. Total wage payments = minimum wage × employment (a rectangle under the demand curve).' },
        { label: 'b', prompt: 'The minimum wage is raised. Effect on employment — which elasticity matters?', solution: 'Employment **falls**; the size depends only on the **elasticity of labour demand**.' },
        { label: 'c', prompt: 'Effect on unemployment — which elasticity?', solution: 'Unemployment **rises** (Qs ↑, Qd ↓); it depends on **both** elasticities.' },
        { label: 'd', prompt: 'If labour demand is inelastic, do total wage payments rise or fall? If elastic?', solution: 'Inelastic: wage ↑ by a larger % than employment ↓ ⇒ payments **rise**. Elastic: payments **fall**.' },
      ] },
    { id: 'c6p10', title: 'Ch. 6, P10 — Controls and a tax in one market', source: 'ProblemSets/Chapter 6&8.pdf', models: ['price-controls', 'tax'], intro: 'A market is described by $Q^S = 2P$ and $Q^D = 300 - P$.',
      parts: [
        { label: 'a1', prompt: 'Equilibrium price?', solution: '2P = 300 − P ⇒ **P = 100**.', check: { answer: 100 } },
        { label: 'a2', prompt: 'Equilibrium quantity?', solution: 'Q = 2 × 100 = **200**.', check: { answer: 200 } },
        { label: 'b', prompt: 'Price ceiling of $90: size of the shortage?', solution: 'Binding (90 < 100). Qs = 180, Qd = 210 ⇒ **shortage of 30**; price $90.', check: { answer: 30, unit: 'units' } },
        { label: 'c', prompt: 'Price floor of $90?', solution: 'Not binding (90 < 100): price 100, quantity 200, **no surplus**.', check: { answer: 0, unit: 'surplus' } },
        { label: 'd', prompt: 'A $30 tax on producers: $Q^S = 2(P - 30)$. Price paid by buyers?', solution: '2(P − 30) = 300 − P ⇒ 3P = 360 ⇒ **P = $120** paid by buyers; Q = 180; sellers keep $90. No shortage or surplus.', check: { answer: 120, unit: '$' } },
      ] },
    { id: 'c8p7', title: 'Ch. 8, P7 — A tax on socks', source: 'ProblemSets/Chapter 6&8.pdf', models: ['tax'], intro: 'The government places a tax on the purchase of socks.',
      parts: [
        { label: 'a', prompt: 'Show the effect on price and quantity, and the areas of consumer spending, producer revenue and tax revenue before and after.', solution: 'Before: spending = producer revenue = P* × Q*. After: buyers pay P_B × Q_T (total spending), producers receive P_S × Q_T, and the government gets (P_B − P_S) × Q_T = t × Q_T, the rectangle between the two prices.' },
        { label: 'b', prompt: 'Does the price received by producers rise or fall? Total receipts?', solution: 'P_S **falls** and Q **falls** ⇒ producers’ total receipts **fall**.' },
        { label: 'c', prompt: 'Does the price paid by consumers rise or fall? Can you tell whether total spending rises? If spending falls, does CS rise?', solution: 'P_B **rises**, Q falls: spending rises if demand is **inelastic**, falls if **elastic**. Even if spending falls, **CS falls** — consumers pay more per unit and buy less.' },
      ] },
    { id: 'c8p8', title: 'Ch. 8, P8 — A $2 subsidy', source: 'ProblemSets/Chapter 6&8.pdf', models: ['tax'], intro: 'For each unit of a good sold, the government pays $2 to the buyer.',
      parts: [{ label: 'a', prompt: 'Effects on CS, PS, tax revenue and total surplus. Is there a DWL?', solution: 'Demand shifts up by $2: quantity rises above Q*, buyers’ net price falls, sellers’ price rises ⇒ **CS ↑, PS ↑**. The government **spends** $2 × Q. Spending exceeds the gains in CS + PS: units beyond Q* cost more than buyers value them ⇒ total surplus **falls**: a **deadweight loss**. (Try a negative tax in the Tax model.)' }] },
    { id: 'c8p10', title: 'Ch. 8, P10 — Revenue and DWL as functions of T', source: 'ProblemSets/Chapter 6&8.pdf', models: ['tax'], intro: '$Q^S = 2P$, $Q^D = 300 - P$. A tax T is placed on buyers: $Q^D = 300 - (P + T)$.',
      parts: [
        { label: 'b', prompt: 'New equilibrium: prices and quantity?', solution: '2P = 300 − P − T ⇒ sellers receive $P = 100 - T/3$; buyers pay $100 + 2T/3$; $Q = 200 - 2T/3$.' },
        { label: 'c', prompt: 'Tax revenue at T = 150?', solution: '$R = T(200 - 2T/3) = 200T - \\tfrac{2}{3}T^2$. At T = 150: 150 × 100 = **15,000** (the peak).', check: { answer: 15000 } },
        { label: 'd', prompt: 'Deadweight loss at T = 150?', solution: '$DWL = \\tfrac12 \\cdot T \\cdot \\tfrac{2T}{3} = T^2/3$. At T = 150: **7,500**.', check: { answer: 7500 } },
        { label: 'e', prompt: 'A tax of $200 per unit: good policy? Better policy?', solution: 'At T = 200: revenue 200 × 66.7 = 13,333 and DWL = 13,333. It lies past the Laffer peak: a $150 tax raises **more** revenue (15,000) with a much smaller DWL (7,500). Lowering the tax is better.' },
      ] },
  ],
};
export default ps;
