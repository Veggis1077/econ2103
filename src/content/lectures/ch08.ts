import type { Lecture } from '../../types/content';

const ch08: Lecture = {
  id: 'ch08',
  number: 8,
  title: 'Application: The Costs of Taxation',
  subtitle: 'Why taxes cost society more than the revenue they raise — deadweight loss, its determinants, the Laffer curve and subsidies.',
  estMinutes: 60,
  color: '#9333ea',
  objectives: [
    'Identify the welfare areas (CS, PS, revenue, **deadweight loss**) of a tax on a supply–demand diagram.',
    'Explain DWL as **lost gains from trade**.',
    'Explain why DWL is larger when supply and/or demand are more **elastic**.',
    'Describe how DWL and **revenue** change with the size of the tax (the **Laffer curve**).',
    'Analyse **subsidies**, and compare rent control with a rent subsidy.',
  ],
  keywords: ['deadweight loss', 'tax revenue', 'gains from trade', 'elasticity', 'Laffer curve', 'subsidy', 'supply-side economics'],
  models: ['tax', 'surplus'],
  problemSets: ['ps-ch06-08', 'ps-sp-ch08'],
  prerequisites: ['ch06', 'ch07'],
  sections: [
    {
      id: 'intro', title: 'Recap: the tax wedge', kind: 'intro',
      blocks: [
        { type: 'p', text: 'From Chapter 6: a tax on buyers shifts demand **down** by the tax; a tax on sellers shifts supply **up** by the tax. Either way we get the same outcome — a **price wedge**: the price paid by buyers rises, the price received by sellers falls, and the quantity sold falls. The burden is shared according to the elasticities of supply and demand, and the market for the good becomes **smaller**.' },
        { type: 'p', text: 'Chapter 7 gave us the tools to measure welfare. This chapter combines them: who gains and who loses from a tax, and by how much?' },
      ],
    },
    {
      id: 'welfare', title: 'How a tax affects welfare', kind: 'definitions',
      blocks: [
        { type: 'p', text: 'Economic welfare now has three parts: **buyers** (consumer surplus), **sellers** (producer surplus) and the **government** (tax revenue $= T \\times Q$, the rectangle between supply and demand at the taxed quantity — its public benefit is what the money is spent on).' },
        { type: 'figure', figure: {
          xDomain: [0, 100], yDomain: [0, 12], xLabel: 'Quantity', yLabel: 'Price', xTicks: [{ v: 37.5, label: 'Q₂' }, { v: 50, label: 'Q₁' }], yTicks: [{ v: 6.25, label: 'P_B' }, { v: 5, label: 'P₁' }, { v: 4.25, label: 'P_S' }],
          curves: [
            { kind: 'line', from: [0, 10], to: [100, 0], color: 'var(--c-demand)', label: 'Demand', labelAt: [88, 2.2] },
            { kind: 'line', from: [0, 2], to: [100, 8], color: 'var(--c-supply)', label: 'Supply', labelAt: [88, 8] },
          ],
          regions: [
            { points: [[0, 10], [37.5, 6.25], [0, 6.25]], fill: 'var(--c-cs)', label: 'A' },
            { points: [[0, 6.25], [37.5, 6.25], [37.5, 5], [0, 5]], fill: 'var(--c-rev)', label: 'B' },
            { points: [[37.5, 6.25], [50, 5], [37.5, 5]], fill: 'var(--c-dwl)', label: 'C', labelAt: [41, 5.45] },
            { points: [[0, 5], [37.5, 5], [37.5, 4.25], [0, 4.25]], fill: 'var(--c-rev)', label: 'D' },
            { points: [[37.5, 5], [50, 5], [37.5, 4.25]], fill: 'var(--c-dwl)', label: 'E', labelAt: [41, 4.7] },
            { points: [[0, 4.25], [37.5, 4.25], [0, 2]], fill: 'var(--c-ps)', label: 'F' },
          ],
          guides: [{ x: 37.5, y: 6.25 }, { x: 37.5, y: 4.25 }, { x: 50, y: 5 }],
        }, caption: 'Course Figure 3 reconstructed (P = 10 − 0.1Q, P = 2 + 0.06Q, tax $2).' },
        { type: 'table', table: { caption: 'Course Figure 3: welfare without and with a tax', headers: ['', 'Without tax', 'With tax', 'Change'], rows: [
          ['Consumer surplus', 'A + B + C', 'A', '−(B + C)'],
          ['Producer surplus', 'D + E + F', 'F', '−(D + E)'],
          ['Tax revenue', 'none', 'B + D', '+(B + D)'],
          ['Total surplus', 'A + B + C + D + E + F', 'A + B + D + F', '−(C + E)'],
        ] } },
        { type: 'definition', term: 'Deadweight loss', conceptId: 'deadweight-loss', text: 'The **fall in total surplus** that results from a market distortion, such as a tax. The losses to buyers and sellers (B + C + D + E) **exceed** the revenue raised (B + D) by the triangle **C + E**.' },
        { type: 'h', text: 'Deadweight losses and the gains from trade' },
        { type: 'p', text: 'Why does DWL exist? Taxes distort incentives. For every unit between Q₂ and Q₁, the buyer’s value exceeds the seller’s cost — a mutually beneficial trade — but the gap is **smaller than the tax**, so after the tax the trade no longer pays. Those trades are not made: the lost gains from trade are the deadweight loss (Figure 4).' },
      ],
    },
    {
      id: 'math', title: 'Deadweight loss in numbers', kind: 'math',
      blocks: [
        { type: 'p', text: 'With straight-line curves the DWL is a triangle with "base" equal to the tax (the vertical wedge) and "height" equal to the fall in quantity:' },
        { type: 'math', tex: 'DWL = \\tfrac{1}{2} \\cdot t \\cdot (Q^* - Q_T), \\qquad Q^* - Q_T = \\frac{t}{b + d} \\;\\Longrightarrow\\; DWL = \\frac{t^2}{2(b + d)}' },
        { type: 'p', text: 'Two lessons hide in this formula: (1) DWL grows with the **square** of the tax — double the tax, roughly quadruple the DWL; (2) flatter curves (smaller $b$, $d$ = more elastic) give a **larger** DWL.' },
        { type: 'math', tex: 'R(t) = t \\cdot Q_T = t \\cdot \\frac{a - c - t}{b + d}, \\qquad R\'(t) = 0 \\;\\Rightarrow\\; t_{\\max R} = \\frac{a - c}{2}', caption: 'Revenue first rises, then falls, with the size of the tax.' },
        { type: 'example', title: 'PS Ch. 6 & 8, P10 (Chapter 8 part)', problem: 'Qs = 2P, Qd = 300 − P. (b) A tax T is placed on buyers: Qd = 300 − (P + T). Find the new equilibrium. (c) Revenue as a function of T. (d) DWL as a function of T. (e) Is T = $200 a good policy?', steps: [
          'Without tax: P = 100, Q = 200.',
          '(b) 2P = 300 − P − T ⇒ sellers receive $P_S = 100 - T/3$; buyers pay $P_B = P_S + T = 100 + 2T/3$; quantity $Q = 200 - 2T/3$.',
          '(c) $R = T \\cdot Q = 200T - \\tfrac{2}{3}T^2$ — an inverted U from T = 0 to T = 300; maximum at T = 150 (R = 15,000).',
          '(d) DWL = ½ × T × (200 − Q) = ½ × T × (2T/3) = $T^2/3$ — rising ever faster (30,000 at T = 300).',
          '(e) At T = 200: Q = 66.7, R = 13,333 and DWL = 13,333. A lower tax of 150 raises *more* revenue (15,000) with a far smaller DWL (7,500).',
        ], answer: 'A $200 tax is on the downward-sloping side of the Laffer curve: cutting it to $150 (or lower) raises at least as much revenue with much less deadweight loss.' },
        { type: 'questions', ids: ['pq10', 'pq19', 'pq20', 'pq26', 'pq03'], title: 'Graph questions on tax welfare' },
      ],
    },
    {
      id: 'interactive', title: 'Interactive: tax size, elasticity and the Laffer curve', kind: 'interactive',
      blocks: [
        { type: 'p', text: 'Drag the purple handle (or the tax slider). Watch revenue and DWL on the Laffer chart below the main graph. Then flatten one of the curves (lower its slope) and see the DWL of the **same** tax grow.' },
        { type: 'model', model: 'tax', props: { preset: 0 } },
      ],
    },
    {
      id: 'determinants', title: 'The determinants of deadweight loss', kind: 'interpretation',
      blocks: [
        { type: 'list', items: [
          'Holding demand and the tax fixed, a **more elastic supply** gives a **larger** DWL (Figure 5a,b).',
          'Holding supply and the tax fixed, a **more elastic demand** gives a **larger** DWL (Figure 5c,d).',
          'Reason: a tax distorts behaviour by shrinking the quantity traded; the more responsive buyers and sellers are, the more the quantity shrinks.',
          'If demand or supply is **perfectly inelastic**, there is **no** DWL: quantity does not change, and the perfectly inelastic side bears the whole tax.',
        ] },
        { type: 'h', text: 'The deadweight-loss debate: how big should the government be?' },
        { type: 'p', text: 'The larger the DWL of taxation, the larger the true cost of any government programme. The most important tax is on **labour** (Social Security, Medicare, most of federal income tax) — a wedge between the wage firms pay and the wage workers receive. In the US the marginal tax rate on labour income is about 40%.' },
        { type: 'compare', left: { title: 'Small DWL view', items: ['Labour supply is fairly **inelastic** (almost vertical)', 'Most people work full time regardless of the wage'] }, right: { title: 'Large DWL view', items: ['Labour supply is **more elastic**', 'Workers adjust hours (overtime); second earners choose market vs home work; the elderly choose when to retire; some move to the underground economy'] } },
        { type: 'p', text: 'Top marginal income-tax rates differ widely (lecture slide): Belgium 79.5%, Finland 66.75%, Japan 56%, mainland China 45%, India (effective) 42.74%, South Korea 42% + 11.4%, Taiwan 40%, Indonesia 35%, Monaco 0%.' },
      ],
    },
    {
      id: 'laffer', title: 'Deadweight loss, revenue and the Laffer curve', kind: 'application',
      blocks: [
        { type: 'list', items: [
          'As the tax rises, the **DWL increases — even more rapidly** than the size of the tax.',
          '**Tax revenue first increases, then decreases**: a very high tax shrinks the market so much that it raises little (Figure 6). Revenue as a function of the tax is the **Laffer curve**.',
          'A tax on the **downward-sloping** part of the Laffer curve is undesirable: cutting it would raise revenue **and** reduce the DWL.',
          'Each Laffer curve belongs to given supply and demand schedules; when elasticities change (e.g. in the long run) the curve shifts.',
        ] },
        { type: 'p', text: '**Supply-side economics.** In 1974 Arthur Laffer argued US tax rates were so high that cutting them would raise revenue. Ronald Reagan (whose film income was taxed at high rates, so he worked less) campaigned in 1980 on tax cuts that would restore work incentives and perhaps raise revenue. Economists still debate it: there is no consensus on the relevant elasticities. The general lesson: the change in revenue from a tax change depends on **how it affects behaviour**.' },
        { type: 'example', title: 'Heating oil (Self-practice Ch. 8, P4)', problem: 'A tax on heating oil is imposed. Is the DWL greater in year 1 or year 5? Is revenue greater in year 1 or year 5?', steps: [
          'Over time people insulate homes and switch heating systems: demand becomes **more elastic** in the long run.',
          'More elastic demand ⇒ quantity falls more ⇒ **DWL larger in year 5**.',
          'Revenue = t × Q; Q is smaller in year 5 ⇒ **revenue larger in year 1**.',
        ], answer: 'DWL: fifth year. Revenue: first year.' },
      ],
    },
    {
      id: 'subsidy', title: 'Subsidies, and subsidies vs price controls', kind: 'application',
      blocks: [
        { type: 'p', text: 'A **subsidy** works in the opposite direction: it is also a price wedge, but the price received by sellers is **higher** than the price paid by buyers.' },
        { type: 'list', items: [
          'Subsidies paid to sellers and to buyers are **equivalent**.',
          'Incidence depends on elasticities: the more elastic demand (supply), the **smaller** the share of the subsidy consumers (producers) get.',
          'For a given subsidy, the more elastic demand and/or supply, the **larger** the DWL: the quantity rises above the efficient level, and the extra units cost more than they are worth.',
          'If demand or supply is perfectly inelastic: no DWL, and the perfectly inelastic side enjoys the whole subsidy.',
        ] },
        { type: 'example', title: 'PS Ch. 6 & 8, P8: a $2 subsidy to buyers', problem: 'For each unit sold the government pays $2 to the buyer. Effects on CS, PS, government revenue and total surplus? Is there a DWL?', steps: [
          'Demand shifts **up** by $2: quantity rises, buyers pay less net of subsidy, sellers receive more ⇒ **CS ↑ and PS ↑**.',
          'The government **spends** $2 × Q (negative revenue).',
          'Government spending exceeds the gains in CS + PS: the units beyond the efficient quantity have cost > value.',
        ], answer: 'CS and PS rise, revenue falls by more, total surplus falls ⇒ **yes, a deadweight loss**.' },
        { type: 'h', text: 'Affordable housing: rent control or a rent subsidy?' },
        { type: 'table', table: { headers: ['', 'Rent control (ceiling)', 'Rent subsidy'], rows: [
          ['Price paid by tenants', 'lower', 'lower — the same goal is met'],
          ['Number of flats rented', '**falls**', '**rises**'],
          ['Deadweight loss', 'quantity ≠ efficient level **plus** inefficient rationing', 'quantity ≠ efficient level only'],
        ] } },
        { type: 'p', text: 'Both create DWL because marginal value ≠ marginal cost at the traded quantity, but **only rent control adds rationing**, so the subsidy is the more desirable policy.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Counting tax revenue as a loss to society.', right: 'Revenue is a **transfer** to the government; only C + E (the DWL) is lost.' },
          { wrong: '"DWL is the amount by which revenue exceeds the loss of CS and PS" (Q10 distractor).', right: 'It is the reverse: the loss of CS + PS **exceeds** revenue by the DWL.' },
          { wrong: 'Thinking a bigger tax always raises more revenue.', right: 'Beyond the Laffer peak revenue **falls**.' },
          { wrong: 'Thinking inelastic markets have the biggest DWL.', right: 'The **more elastic** the curves, the bigger the DWL; perfectly inelastic ⇒ none.' },
          { wrong: '"A tax with no DWL raises no revenue."', right: 'With perfectly inelastic demand or supply a tax raises revenue with **no** DWL; and a prohibitive tax raises **no** revenue but has a large DWL (Self-practice Ch. 8, P2).' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'A tax doubles from $2 to $4 per unit in a market with straight-line curves (and the market does not disappear). The deadweight loss…', options: ['doubles', 'quadruples', 'halves', 'is unchanged'], answer: 1, explanation: '$DWL = t^2/[2(b+d)]$ — proportional to the **square** of the tax.' } },
        { type: 'check', question: { prompt: 'Your friend proposes taxing food because demand is very inelastic. In what sense is that a "good" way to raise revenue, and in what sense not?', options: ['Good: small DWL; Bad: regressive — the burden falls heavily on the poor', 'Good: large DWL; Bad: little revenue', 'Good: buyers pay none of it; Bad: sellers pay all', 'It is good in every sense'], answer: 0, explanation: 'Inelastic demand ⇒ quantity barely changes ⇒ small DWL and reliable revenue. But food is a large share of poor households’ budgets, so the tax is **regressive** — an equity concern (Self-practice Ch. 8, P5).' } },
        { type: 'check', question: { prompt: 'Raymand mows Kara’s lawn: his cost $2.0, her WTP $2.8. A tax of $0.3 per mow is introduced. What happens?', options: ['The trade disappears', 'The trade still happens — the $0.8 gain exceeds the tax', 'Kara pays the full tax', 'A deadweight loss of $0.3 appears'], answer: 1, explanation: 'A tax destroys a trade only if it exceeds the gain from trade (value − cost). Here 0.3 < 0.8, so no trade is lost (Q27).' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq03', 'pq10', 'pq19', 'pq20', 'pq26', 'pq27', 'pq31'] },
        { type: 'p', text: 'Then do the Chapter 8 parts of [Problem set Ch. 6 & 8](#/practice/problems/ps-ch06-08) and [Self-practice Ch. 8](#/practice/problems/ps-sp-ch08).' },
      ],
    },
  ],
  recap: [
    'A tax reduces CS by B + C and PS by D + E, raises revenue B + D, and destroys **C + E**: the deadweight loss.',
    'DWL = **lost gains from trade**: trades whose value − cost is positive but smaller than the tax.',
    'DWL is larger when supply and/or demand are **more elastic**; zero if either is perfectly inelastic.',
    'With linear curves $DWL = t^2/[2(b+d)]$: it rises with the **square** of the tax.',
    'Revenue first rises then falls with the tax (**Laffer curve**); taxes beyond the peak are undesirable.',
    'Subsidies also create DWL; a rent **subsidy** beats rent **control** because it avoids rationing.',
  ],
};

export default ch08;
