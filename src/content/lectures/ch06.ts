import type { Lecture } from '../../types/content';

const ch06: Lecture = {
  id: 'ch06',
  number: 6,
  title: 'Supply, Demand, and Government Policies',
  subtitle: 'Price ceilings, price floors and taxes: what they do to prices, quantities and who really bears the burden.',
  estMinutes: 65,
  color: '#0d9488',
  objectives: [
    'Determine whether a **price ceiling** or **price floor** is binding, and compute the resulting **shortage** or **surplus**.',
    'Explain rationing, and why rent control causes small shortages in the short run but large ones in the long run.',
    'Analyse the **minimum wage** as a price floor in the labour market.',
    'Show that a tax on buyers and a tax on sellers are **equivalent**: a wedge between the two prices.',
    'Explain why **tax incidence** depends on elasticities, not on who legally pays.',
  ],
  keywords: ['price ceiling', 'price floor', 'rent control', 'minimum wage', 'tax incidence', 'tax wedge', 'payroll tax'],
  models: ['price-controls', 'tax'],
  problemSets: ['ps-ch06-08', 'ps-sp-ch06'],
  prerequisites: ['ch04', 'ch05'],
  sections: [
    {
      id: 'intro', title: 'Why governments intervene', kind: 'intro',
      blocks: [
        { type: 'p', text: 'Policymakers sometimes believe the market price is **unfair** to buyers or sellers and impose **price controls**; these can themselves generate inequities. Governments also levy **taxes** — to raise revenue for public purposes and to influence market outcomes. Supply and demand tell us what these policies really do.' },
        { type: 'definition', term: 'Price ceiling', conceptId: 'price-ceiling', text: 'A legal **maximum** on the price at which a good can be sold (e.g. rent control).' },
        { type: 'definition', term: 'Price floor', conceptId: 'price-floor', text: 'A legal **minimum** on the price at which a good can be sold (e.g. the minimum wage).' },
      ],
    },
    {
      id: 'ceilings', title: 'Price ceilings', kind: 'definitions',
      blocks: [
        { type: 'list', items: [
          '**Not binding** if set **above** the equilibrium price: no effect on price or quantity. In Figure 1(a) a $4 ceiling with equilibrium $3 changes nothing (100 cones).',
          '**Binding** if set **below** equilibrium: the price is stuck at the ceiling and a **shortage** appears. Figure 1(b): at a $2 ceiling, 125 cones are demanded but only 75 supplied — a shortage of 50.',
          'With a shortage, sellers must **ration**: long lines, or discrimination according to the sellers’ biases.',
        ] },
        { type: 'callout', tone: 'example', title: 'Lines at the gas pump (1973)', text: 'Before OPEC raised crude prices, the equilibrium price of gasoline was below the legal ceiling — the ceiling was not binding. When crude oil (an input) became expensive, supply shifted left, the equilibrium rose **above** the ceiling, and the ceiling became binding: a severe shortage and long lines. The laws were later repealed. The culprit was the regulation as much as OPEC.' },
        { type: 'h', text: 'Rent control in the short run and the long run' },
        { type: 'p', text: 'The goal is to help the poor by making housing affordable; economists see it as a highly inefficient way to do so (93% agree a ceiling on rents reduces the quantity and quality of housing).' },
        { type: 'compare', left: { title: 'Short run', items: ['Supply and demand for housing are **inelastic** (the number of flats is fixed; people take time to move)', 'Result: a **small** shortage and lower rents'] }, right: { title: 'Long run', items: ['Supply and demand are **more elastic**: landlords stop building and maintaining; more people move to the city and seek their own flats', 'Result: a **large** shortage'] } },
        { type: 'p', text: 'Rationing mechanisms under rent control: long waiting lists, preference for tenants without children, racial discrimination, bribes to building superintendents. In a free market landlords keep buildings clean and safe to get higher rents; under rent control they lose that incentive, tenants get lower rents and **lower-quality** housing, and policymakers respond with more regulations that are costly to enforce.' },
        { type: 'callout', tone: 'note', title: 'Hong Kong: subdivided flats', text: 'From January 2022 landlords of subdivided flats may not raise rents in the first two years or overcharge for water and electricity; official data showed tenants still paid more. In 2023 a concern group proposed capping starting rents; from 1 March 2026 the Basic Housing Units Ordinance (Cap. 658) sets minimum living standards. (Lecture slides.)' },
        { type: 'model', model: 'price-controls' },
      ],
    },
    {
      id: 'floors', title: 'Price floors and the minimum wage', kind: 'definitions',
      blocks: [
        { type: 'list', items: [
          '**Not binding** if set **below** equilibrium (Figure 4a: a $2 floor with equilibrium $3).',
          '**Binding** if set **above** equilibrium: a **surplus**. Figure 4(b): at $4, 120 cones are supplied and 80 demanded — a surplus of 40. Some sellers cannot sell all they want; rationing among sellers is undesirable.',
        ] },
        { type: 'p', text: 'The **minimum wage** is a price floor in the labour market: workers supply labour, firms demand it. Hong Kong’s minimum wage (2023–) is HK$41.2 per hour (≈ US$5.2); the US federal minimum is US$7.25; the UK rate for workers aged 23+ is £8.91 (≈ US$11.9). In France average income is 30% lower than in the US but the minimum wage is more than 30% higher.' },
        { type: 'list', items: [
          'If the minimum wage is above equilibrium ⇒ labour supplied > labour demanded ⇒ **unemployment**. Those who keep jobs earn more; those who cannot find jobs earn less.',
          'For **skilled, experienced** workers it is not binding — their equilibrium wages are well above it.',
          'For **teenagers** (least skilled, willing to accept low wages for on-the-job training) it binds. A 10% rise in the minimum wage reduces teen employment by 1–3%; some students drop out to take jobs and displace other teenagers.',
        ] },
        { type: 'compare', left: { title: 'Advocates', items: ['Raises the income of the working poor', 'Minimum-wage workers can only afford a meagre standard of living'] }, right: { title: 'Opponents', items: ['Not the best way to fight poverty', 'Causes unemployment, encourages dropping out, prevents on-the-job training', 'Poorly targeted'] } },
        { type: 'example', title: 'PS Ch. 6, P8: raising the minimum wage', problem: 'The minimum wage is above the equilibrium wage for unskilled labour and is raised further. (b) Effect on employment — which elasticity matters? (c) Effect on unemployment? (d) Do total wage payments rise?', steps: [
          '(b) Employment = quantity of labour **demanded** at the wage. A higher wage moves firms up their demand curve: employment falls, by an amount that depends only on the **elasticity of demand**.',
          '(c) Unemployment = Qs − Qd. Qs rises (more people want work) and Qd falls, so unemployment rises by an amount that depends on **both** elasticities.',
          '(d) Wage payments = wage × employment = the firms’ "revenue rectangle" on the labour-demand curve. If labour demand is **inelastic**, a higher wage **raises** total payments; if elastic, it lowers them.',
        ], answer: 'Employment ↓ (demand elasticity); unemployment ↑ (both); total wages ↑ if demand is inelastic, ↓ if elastic.' },
      ],
    },
    {
      id: 'evaluating', title: 'Evaluating price controls', kind: 'interpretation',
      blocks: [
        { type: 'p', text: '**Surplus under price controls.** A shortage means sellers ration among buyers, and a surplus means buyers ration among sellers. Then the goods traded are not necessarily consumed by the buyers who value them most (or produced by the sellers with the lowest cost) — an extra welfare loss on top of the lost trades. (The Lab’s surplus numbers assume ideal rationing, so the true loss is at least as large.)' },
        { type: 'list', items: [
          'Markets are usually a good way to organise activity; prices balance supply and demand and coordinate economic activity. Economists therefore usually **oppose** price ceilings and floors.',
          'Price controls are often aimed at helping the poor but **often hurt those they are meant to help**.',
          'Better alternatives: **rent subsidies** (government pays part of the rent) and **wage subsidies** such as the earned income tax credit.',
        ] },
      ],
    },
    {
      id: 'taxes', title: 'Taxes: the wedge and its incidence', kind: 'math',
      blocks: [
        { type: 'definition', term: 'Tax incidence', conceptId: 'tax-incidence', text: 'The manner in which the **burden** of a tax is shared among participants in a market.' },
        { type: 'compare', left: { title: 'Tax on sellers ($0.50 per cone)', items: ['Supply curve shifts **up** by $0.50', 'Q falls from 100 to 90', 'Buyers pay $3.30 (was $3.00)', 'Sellers keep $3.30 − $0.50 = $2.80'] }, right: { title: 'Tax on buyers ($0.50 per cone)', items: ['Demand curve shifts **down** by $0.50', 'Q falls from 100 to 90', 'Sellers receive $2.80', 'Buyers pay $2.80 + $0.50 = $3.30'] } },
        { type: 'callout', tone: 'key', text: 'Taxes on sellers and on buyers are **equivalent**: either way the tax drives a **wedge** between the price buyers pay and the price sellers receive, the market shrinks, and both sides share the burden.' },
        { type: 'p', text: 'With linear curves $P = a - bQ$ and $P = c + dQ$ and a per-unit tax $t$, the taxed quantity solves $P_B - P_S = t$:' },
        { type: 'math', tex: 'Q_T = \\frac{a - c - t}{b + d}, \\qquad P_B = a - bQ_T, \\qquad P_S = P_B - t' },
        { type: 'math', tex: '\\frac{\\Delta P_B}{t} = \\frac{b}{b+d} \\;(\\text{buyers’ share}), \\qquad \\frac{\\Delta P_S}{t} = \\frac{d}{b+d} \\;(\\text{sellers’ share})', caption: 'The **steeper** (less elastic) side bears the larger share.' },
        { type: 'example', title: 'PS Ch. 6, P10: price controls and a tax in one market', problem: 'Qs = 2P, Qd = 300 − P. (b) Price ceiling $90? (c) Price floor $90? (d) A $30 tax on producers, new supply Qs = 2(P − 30)?', steps: [
          'Equilibrium: 2P = 300 − P ⇒ P = 100, Q = 200.',
          '(b) $90 < $100 ⇒ binding ceiling: Qs = 180, Qd = 210 ⇒ **shortage of 30**, price $90.',
          '(c) $90 < $100 ⇒ the floor is **not binding**: P = 100, Q = 200, no surplus.',
          '(d) 2(P − 30) = 300 − P ⇒ 3P = 360 ⇒ buyers pay **P = $120**, Q = 180, sellers keep 120 − 30 = **$90**. No shortage or surplus — the market clears at the new prices.',
          'Incidence: buyers pay $20 more, sellers receive $10 less ⇒ buyers bear 2/3 because supply (slope ½ in inverse form) is flatter than demand (slope 1).',
        ], answer: '(b) shortage 30; (c) no effect; (d) P_B = 120, P_S = 90, Q = 180.' },
      ],
    },
    {
      id: 'tax-interactive', title: 'Interactive: who really pays?', kind: 'interactive',
      blocks: [
        { type: 'p', text: 'Toggle "levied on sellers / buyers": the dashed curve changes, the outcome does not. Then compare the **Luxury tax** and **Cigarettes** scenarios and watch the incidence bar.' },
        { type: 'model', model: 'tax', props: { preset: 1 } },
      ],
    },
    {
      id: 'incidence', title: 'Elasticity and tax incidence', kind: 'interpretation',
      blocks: [
        { type: 'list', items: [
          '**Elastic supply, inelastic demand** (Figure 9a): sellers’ price falls only slightly, buyers’ price rises a lot ⇒ **buyers** bear most of the tax.',
          '**Inelastic supply, elastic demand** (Figure 9b): **sellers** bear most of the tax.',
          'General rule: the burden falls more heavily on the **less elastic** side. A small elasticity of demand means buyers have no good alternatives to consuming the good; a small elasticity of supply means sellers have no good alternatives to producing it.',
        ] },
        { type: 'callout', tone: 'example', title: 'Who pays the luxury tax? (1990)', text: 'Congress taxed yachts, private planes, furs, jewellery and expensive cars to raise revenue from those who could most easily pay. But demand for luxuries is quite **elastic** (the rich can spend on other things) while supply is relatively **inelastic** (yacht builders cannot easily switch). The burden fell largely on the **suppliers** and their workers. Most of the tax was repealed in 1993.' },
        { type: 'callout', tone: 'example', title: 'Can Congress distribute the burden of a payroll tax?', text: 'By law, half the US payroll tax is paid by firms and half by workers. Treat it as a tax on the good "labour" whose price is the wage: the tax lowers the wage workers receive and raises the wage firms pay. **Lawmakers can decide whose pocket the tax comes from, but not its true burden** — that is determined by the elasticities of labour supply and demand, not necessarily 50–50.' },
        { type: 'example', title: 'Self-practice Ch. 6, P5', problem: 'A senator wants to raise revenue *and* make workers better off. A staffer proposes raising the payroll tax paid by firms and using part of the extra revenue to cut the payroll tax paid by workers. Does it work?', steps: [
          'Incidence does not depend on which side legally pays — only the **total** wedge matters.',
          'If total payroll tax rises (to raise revenue), the wedge grows, so workers’ take-home wage falls by their share of the increase, whatever the legal split.',
        ], answer: 'No: the plan raises the total tax, so workers are still made worse off; relabelling who pays changes nothing.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Saying any price ceiling causes a shortage.', right: 'Only a **binding** ceiling (below equilibrium) does; a floor binds only **above** equilibrium.' },
          { wrong: 'Saying a ceiling "shifts the supply curve left" (Q29 distractor).', right: 'Controls do not shift curves; they move the market **along** both curves: Qd ↑, Qs ↓.' },
          { wrong: 'Thinking the side that legally pays bears the tax.', right: 'Incidence depends on **elasticities**; the less elastic side bears more.' },
          { wrong: 'Shifting supply up by the tax **and** charging buyers the full tax.', right: 'Read the new equilibrium: buyers’ price rises by **less** than the tax unless demand is perfectly inelastic (Q1).' },
          { wrong: 'Treating "quantity traded" under a ceiling as quantity demanded.', right: 'Trade is limited by the **short side**: min(Qd, Qs).' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'Frisbees: equilibrium price $8 (6 million). Congress sets a price floor $2 above equilibrium ($10), where Qd = 2 million and Qs = 12 million. How many frisbees are sold?', options: ['6 million', '2 million', '12 million', '10 million'], answer: 1, explanation: 'At a binding floor the **short side** — buyers — limits sales: 2 million (with a surplus of 10 million). Self-practice Ch. 6, P3.' } },
        { type: 'check', question: { prompt: 'Congress then repeals the floor and imposes a ceiling $1 below the former floor, i.e. $9. Market outcome?', options: ['Shortage at $9', 'Price $9, 4 million sold', 'Price $8, 6 million sold', 'Surplus at $9'], answer: 2, explanation: '$9 is **above** the equilibrium $8, so the ceiling does not bind: the market returns to $8 and 6 million.' } },
        { type: 'check', question: { prompt: 'Demand for gasoline is very inelastic and supply is elastic. A $0.50 per gallon tax is imposed on producers. Who bears most of it?', options: ['Producers, because they pay it', 'Consumers', 'Split exactly 50–50', 'The government'], answer: 1, explanation: 'The less elastic side (buyers) bears most of the tax — regardless of who sends the cheque (PS Ch. 6, P7).' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq01', 'pq17', 'pq18', 'pq29', 'pq30'] },
        { type: 'p', text: 'Then try the [ceiling challenge](#/practice/challenges/pc-shortage-60), [Problem set Ch. 6 & 8](#/practice/problems/ps-ch06-08) (Ch. 6 problems) and [Self-practice Ch. 6](#/practice/problems/ps-sp-ch06).' },
      ],
    },
  ],
  recap: [
    'A **ceiling** binds only below equilibrium ⇒ shortage and rationing; a **floor** binds only above ⇒ surplus.',
    'Rent control: small shortage in the short run, **large** shortage and lower quality in the long run (elasticities rise).',
    'The **minimum wage** is a binding floor for low-skilled workers ⇒ unemployment; employment depends on labour-demand elasticity.',
    'A tax on buyers ≡ a tax on sellers: a **wedge** $P_B - P_S = t$ that shrinks the market.',
    '**Incidence** falls on the less elastic side: buyers’ share $= b/(b+d)$. Lawmakers cannot legislate the true burden.',
    'Economists usually prefer **subsidies** (rent, wage) to price controls for helping the poor.',
  ],
};

export default ch06;
