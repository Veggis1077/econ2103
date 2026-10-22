import type { Lecture } from '../../types/content';

const ch05: Lecture = {
  id: 'ch05',
  number: 5,
  title: 'Elasticity and Its Application',
  subtitle: 'How strongly quantities respond to prices and income — and why that decides what happens to revenue, tax burdens and policy.',
  estMinutes: 65,
  color: '#db2777',
  objectives: [
    'Compute the **price elasticity of demand** with the **midpoint method**.',
    'Name the **determinants** of demand elasticity and classify demand as elastic, inelastic or unit elastic.',
    'Predict what a price change does to **total revenue** from the elasticity.',
    'Explain why elasticity **varies along a linear demand curve**.',
    'Use **income** and **cross-price** elasticities to classify goods, and explain **supply** elasticity.',
    'Apply elasticity to farm technology, OPEC, and drug policy.',
  ],
  keywords: ['price elasticity of demand', 'midpoint method', 'total revenue', 'income elasticity', 'cross-price elasticity', 'elasticity of supply'],
  models: ['elasticity'],
  problemSets: ['ps-ch05'],
  prerequisites: ['ch04'],
  sections: [
    {
      id: 'intro', title: 'Why "how much" matters', kind: 'intro',
      blocks: [
        { type: 'p', text: 'Chapter 4 told us the **direction** of changes: a supply cut raises the price. Elasticity tells us **how much**. If the price of wheat falls by a third, does the quantity sold rise a lot or a little? The answer decides whether farmers earn more or less, who pays a tax, and whether a drug crackdown raises or lowers crime.' },
        { type: 'definition', term: 'Elasticity', conceptId: 'elasticity', text: 'A measure of the **responsiveness** of quantity demanded or quantity supplied to a change in one of its determinants.' },
        { type: 'definition', term: 'Price elasticity of demand', conceptId: 'ped', text: 'How much the quantity demanded responds to a change in the good’s own price: **percentage change in quantity demanded ÷ percentage change in price**. Demand is **elastic** if quantity responds substantially, **inelastic** if only slightly.' },
      ],
    },
    {
      id: 'determinants', title: 'Determinants of demand elasticity', kind: 'definitions',
      blocks: [
        { type: 'list', items: [
          '**Availability of close substitutes**: goods with close substitutes have more elastic demand (butter vs margarine; eggs have no close substitute).',
          '**Necessities vs luxuries**: necessities are inelastic (a doctor’s visit), luxuries elastic (sailboats).',
          '**Definition of the market**: narrowly defined markets are more elastic ("vanilla ice cream" vs "food").',
          '**Time horizon**: demand is more elastic over **longer** horizons (people switch cars and habits when gasoline stays expensive).',
        ] },
        { type: 'table', table: { headers: ['Elasticity', 'Name', 'Demand curve'], rows: [['= 0', 'Perfectly inelastic', 'vertical'], ['< 1', 'Inelastic', 'steep'], ['= 1', 'Unit elastic', '—'], ['> 1', 'Elastic', 'flat'], ['= ∞', 'Perfectly elastic', 'horizontal']] } },
        { type: 'callout', tone: 'intuition', text: 'Rule of thumb from the slides: the **flatter** the demand curve through a point, the **greater** the price elasticity. (Strictly, elasticity also depends on where you are on the curve — see below.)' },
      ],
    },
    {
      id: 'math', title: 'Computing elasticity: the midpoint method', kind: 'math',
      blocks: [
        { type: 'p', text: 'Percentage changes depend on the base: going from 4 to 5 is +25%, going back from 5 to 4 is −20%. The **midpoint method** uses the average of the two values as the base, so the answer is the same in both directions:' },
        { type: 'math', tex: '\\varepsilon_D = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\left| \\frac{(Q_2 - Q_1) / [(Q_1 + Q_2)/2]}{(P_2 - P_1) / [(P_1 + P_2)/2]} \\right|', caption: 'We drop the minus sign: demand elasticities are reported as positive numbers.' },
        { type: 'p', text: '**General elasticity.** For any variables, the elasticity of $Y$ with respect to $X$ is the percentage change in $Y$ divided by the percentage change in $X$, holding other factors constant. With a function $Y = Y(X)$ the point version is' },
        { type: 'math', tex: 'E_{Y,X} = \\frac{\\%\\Delta Y}{\\%\\Delta X} = \\frac{dY}{dX} \\cdot \\frac{X}{Y}' },
        { type: 'p', text: 'For linear inverse demand $P = a - bQ$ we have $dQ/dP = -1/b$, so the point elasticity is $|\\varepsilon| = \\frac{1}{b} \\cdot \\frac{P}{Q}$. It equals 1 at the **midpoint** of the line ($Q = a/2b$), is **above 1** at higher prices and **below 1** at lower prices.' },
        { type: 'example', title: "Sara's Scanning Service (Q9)", problem: 'Revenue rises from $12,000 to $13,500 when the price rises from $600 to $750. Find the price elasticity of demand.', steps: [
          'Recover quantities from TR = P × Q: Q₁ = 12,000/600 = **20**, Q₂ = 13,500/750 = **18**.',
          '%ΔQ = (18 − 20)/[(20 + 18)/2] = −2/19 = **−10.5%**.',
          '%ΔP = (750 − 600)/[(600 + 750)/2] = 150/675 = **22.2%**.',
          'ε = 10.5/22.2 ≈ **0.47**.',
        ], answer: 'ε ≈ 0.47: inelastic — consistent with revenue rising after a price increase.' },
      ],
    },
    {
      id: 'revenue', title: 'Elasticity and total revenue', kind: 'interpretation',
      blocks: [
        { type: 'definition', term: 'Total revenue', conceptId: 'total-revenue', text: 'The amount paid by buyers and received by sellers: **TR = P × Q** — the area of the rectangle under the demand curve at the chosen point. At $4 and 100 units, TR = $400.' },
        { type: 'p', text: 'A price increase has two opposite effects on revenue: a **price effect** (more revenue on each unit still sold — rectangle **A**) and a **quantity effect** (fewer units sold — rectangle **D**). Which wins depends on elasticity:' },
        { type: 'list', items: [
          '**Inelastic** (ε < 1): price and TR move in the **same** direction. Figure 3(a): $4 → $5 cuts Q from 100 to 90; TR rises from $400 to $450.',
          '**Elastic** (ε > 1): price and TR move in **opposite** directions. Figure 3(b): $4 → $5 cuts Q from 100 to 70; TR falls from $400 to $350.',
          '**Unit elastic** (ε = 1): TR stays constant.',
        ] },
        { type: 'model', model: 'elasticity' },
        { type: 'table', table: { caption: 'Course Figure 4: elasticity along the linear demand P = 7 − 0.5Q', headers: ['Price', 'Quantity', 'Total revenue', 'Elasticity (midpoint)', 'Description'], rows: [
          ['$7', 0, '$0', '', ''], ['$6', 2, '$12', '13.0', 'Elastic'], ['$5', 4, '$20', '3.7', 'Elastic'], ['$4', 6, '$24', '1.8', 'Elastic'], ['$3', 8, '$24', '1.0', 'Unit elastic'], ['$2', 10, '$20', '0.6', 'Inelastic'], ['$1', 12, '$12', '0.3', 'Inelastic'], ['$0', 14, '$0', '0.1', 'Inelastic'],
        ] } },
        { type: 'callout', tone: 'intuition', text: 'Same slope everywhere, different elasticity: at high prices a $1 change is a *small* percentage of the price but the quantity change is a *large* percentage of a small quantity. Revenue is maximised where demand is unit elastic.' },
      ],
    },
    {
      id: 'other-elasticities', title: 'Income, cross-price and supply elasticities', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Income elasticity of demand', conceptId: 'income-elasticity', text: '%ΔQd ÷ %Δincome. **Normal goods**: positive — **necessities** between 0 and 1, **luxuries** above 1. **Inferior goods**: negative.' },
        { type: 'definition', term: 'Cross-price elasticity of demand', conceptId: 'cross-elasticity', text: '%ΔQd of good 1 ÷ %ΔP of good 2. **Substitutes** (used in place of one another): positive. **Complements** (used together): negative.' },
        { type: 'definition', term: 'Price elasticity of supply', conceptId: 'pes', text: '%ΔQs ÷ %ΔP — always positive. Depends on the **flexibility** of sellers to change output; supply is more elastic in the **long run**. Perfectly inelastic = vertical; perfectly elastic = horizontal.' },
        { type: 'p', text: '**Supply elasticity can vary along the curve.** With limited capacity, supply is very elastic at low quantities and inelastic near capacity. Course Figure 6: from $3 to $4, Qs rises from 100 to 200 — a 67% rise against a 29% price rise (elastic). From $12 to $15, Qs rises only from 500 to 525 — 5% vs 22% (inelastic).' },
        { type: 'example', title: 'Thelma and Louise (PS Ch. 5, P9)', problem: 'Before seeing the price, Thelma orders "5 gallons of gas"; Louise orders "$20 worth of gas". What is each driver’s price elasticity of demand?', steps: [
          'Thelma buys 5 gallons whatever the price: %ΔQ = 0 ⇒ elasticity **0** (perfectly inelastic).',
          'Louise always spends $20: P × Q is constant ⇒ revenue does not change with price ⇒ elasticity **1** (unit elastic).',
        ], answer: 'Thelma: 0. Louise: 1.' },
        { type: 'example', title: 'Revenue rises 15% while quantity falls 30% (PS Ch. 5, P4)', problem: 'A price change lowers quantity demanded by 30% while total revenue rises by 15%. Elastic or inelastic?', steps: [
          'Revenue rose while quantity fell ⇒ the price must have **risen**.',
          'TR rising after a price rise is the signature of **inelastic** demand (P and TR move together).',
          'Check: 1.15 = (1 + %ΔP)(0.70) ⇒ price rose ≈ 64%, larger than the 30% drop in quantity.',
        ], answer: '**Inelastic.**' },
      ],
    },
    {
      id: 'applications', title: 'Three applications', kind: 'application',
      blocks: [
        { type: 'h', text: '1. Can good news for farming be bad news for farmers?' },
        { type: 'p', text: 'A new hybrid raises wheat output per acre by 20%: supply shifts right, the price falls, quantity rises. Because **demand for wheat is inelastic**, the quantity rises proportionally less than the price falls: in Figure 7 Q goes from 100 to 110 while the price falls from $3 to $2, and revenue drops from $300 to $220. The paradox of public policy: programmes that pay farmers *not* to plant can raise farm incomes.' },
        { type: 'callout', tone: 'exam', title: 'PS Ch. 5, P12', text: 'A drought **around the world** shrinks the market supply of grain; with inelastic demand the price rises a lot and **total** farm revenue rises. A drought **only in Kansas** barely moves the world price — Kansas farmers face an almost perfectly elastic demand — so they sell less at the same price and their revenue **falls**.' },
        { type: 'h', text: '2. Why did OPEC fail to keep the price of oil high?' },
        { type: 'p', text: 'In 1973–74 and 1979–81 OPEC cut supply and the price soared — in the **short run** both supply and demand are inelastic. In the **long run** both become more elastic: non-OPEC producers expanded (North Sea, Mexico, Canada, Alaska), consumers shifted to fuel-efficient cars and alternative energy, strategic reserves and the IEA were created. The same supply cut then raises the price much less, and in 1985 Saudi Arabia abandoned production limits.' },
        { type: 'callout', tone: 'note', title: '"Pivoting" curves', text: 'When we say demand becomes more elastic in the long run we mean elasticity **around the original equilibrium point**: the curves pivot around that point (at the original price, other producers and consumers have not yet changed their quantities).' },
        { type: 'h', text: '3. Does drug interdiction increase or decrease drug-related crime?' },
        { type: 'p', text: '**Interdiction** shifts the supply of illegal drugs left: price up, quantity down. Because demand for drugs is **inelastic**, total spending by users **rises** — addicts who finance their habit through crime commit more of it. **Drug education** shifts demand left: price and quantity both fall, total spending falls, and drug-related crime falls. Interdiction may look better in the long run if demand becomes more elastic over time.' },
        { type: 'p', text: 'Modern examples in the slides: fentanyl tariffs (interdiction) vs prescription monitoring, non-opioid alternatives, medication-assisted treatment and social safety nets (demand-side policies). Another application: South Korean doctors (2.6 per 1,000 people vs the OECD 3.7) struck against plans to train more physicians — **unions are more likely to succeed when labour demand is inelastic**.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Using the simple percentage change (base = starting value).', right: 'Use the **midpoint** of the two values as the base.' },
          { wrong: 'Saying a straight-line demand curve has one elasticity.', right: 'The slope is constant; the elasticity **falls** as you move down the curve.' },
          { wrong: 'Equating "steep" with "inelastic" when comparing points on the same curve.', right: 'Slope comparisons work across curves through the **same point**; along one line elasticity changes.' },
          { wrong: 'Concluding a price rise always raises revenue.', right: 'Only if demand is **inelastic**; with elastic demand revenue falls.' },
          { wrong: 'Forgetting the sign conventions for income and cross-price elasticities.', right: 'Unlike PED these keep their sign: negative = inferior / complements.' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'Coffee and donuts are complements and both have inelastic demand. A hurricane destroys half the coffee bean crop. What happens to total expenditure on cups of coffee and on donuts?', options: ['coffee ↑, donuts ↓', 'coffee ↓, donuts ↑', 'both ↑', 'both ↓'], answer: 0, explanation: 'Coffee supply ↓ ⇒ price ↑; inelastic ⇒ spending on coffee **rises**. Fewer cups ⇒ demand for donuts ↓ ⇒ donut price and quantity fall ⇒ spending on donuts **falls** (PS Ch. 5, P5).' } },
        { type: 'check', question: { prompt: 'The price of ibuprofen rose sharply but the quantity sold stayed the same. Which explanation could be right?', options: ['Demand increased, and demand was perfectly inelastic', 'Supply decreased, and demand was unit elastic', 'Supply decreased, and demand was perfectly inelastic', 'Supply increased, and demand was perfectly elastic'], answer: 2, explanation: 'With vertical demand a supply cut raises only the price. (Also possible: demand ↑ with vertical supply, or demand ↑ and supply ↓ together.) A demand increase along a vertical *demand* curve would change Q, and unit-elastic demand means Q must fall (PS Ch. 5, P6).' } },
        { type: 'check', question: { prompt: 'When income rises 10%, quantity demanded of a good rises 4%. The good is…', options: ['inferior', 'a necessity', 'a luxury', 'a complement'], answer: 1, explanation: 'Income elasticity = 0.4, between 0 and 1 ⇒ normal good and a **necessity**.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq05', 'pq09', 'pq28'] },
        { type: 'p', text: 'Then do [Problem set Ch. 5](#/practice/problems/ps-ch05).' },
      ],
    },
  ],
  recap: [
    'Price elasticity of demand = |%ΔQ / %ΔP|, computed with the **midpoint method**.',
    'Demand is more elastic with close substitutes, for luxuries, for narrow markets and over longer horizons.',
    'Inelastic ⇒ P and TR move **together**; elastic ⇒ **opposite**; unit elastic ⇒ TR constant.',
    'Along a straight-line demand curve elasticity falls as the price falls; TR peaks where ε = 1.',
    'Income elasticity (normal/inferior, necessity/luxury) and cross-price elasticity (substitutes/complements) keep their sign; supply is more elastic in the long run.',
    'Applications: inelastic demand explains falling farm revenue after good harvests, OPEC’s short-run power, and why interdiction can raise drug-related crime.',
  ],
};

export default ch05;
