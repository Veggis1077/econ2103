import type { Lecture } from '../../types/content';

const ch07: Lecture = {
  id: 'ch07',
  number: 7,
  title: 'Consumers, Producers, and the Efficiency of Markets',
  subtitle: 'Welfare economics: measuring the gains from trade with consumer and producer surplus, and why competitive equilibrium is efficient.',
  estMinutes: 60,
  color: '#16a34a',
  objectives: [
    'Define **willingness to pay** and **consumer surplus**, and measure CS from a demand curve.',
    'Define **cost** and **producer surplus**, and measure PS from a supply curve.',
    'Show how price changes affect CS and PS (existing vs new buyers/sellers).',
    'Explain why **total surplus** is maximised at the competitive equilibrium (**efficiency**).',
    'Distinguish **efficiency** from **equality**, and identify when markets fail.',
  ],
  keywords: ['welfare economics', 'willingness to pay', 'consumer surplus', 'producer surplus', 'total surplus', 'efficiency', 'market failure'],
  models: ['surplus', 'supply-demand'],
  problemSets: ['ps-ch07'],
  prerequisites: ['ch04'],
  sections: [
    {
      id: 'intro', title: 'Welfare economics', kind: 'intro',
      blocks: [
        { type: 'definition', term: 'Welfare economics', conceptId: 'welfare-economics', text: 'The study of how the allocation of resources affects economic well-being: the benefits buyers and sellers receive from trading, and how society can make these benefits as large as possible.' },
        { type: 'callout', tone: 'key', text: 'The big result of this chapter: in any market, the equilibrium of supply and demand **maximises the total benefits** received by all buyers and sellers combined.' },
      ],
    },
    {
      id: 'cs', title: 'Consumer surplus', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Willingness to pay', conceptId: 'wtp', text: 'The maximum amount a buyer will pay for a good — how much the buyer **values** it.' },
        { type: 'definition', term: 'Consumer surplus', conceptId: 'consumer-surplus', text: 'The amount a buyer is willing to pay for a good **minus** the amount the buyer actually pays.' },
        { type: 'table', table: { caption: 'Course Table 1: four possible buyers of a mint-condition copy of Elvis Presley’s first album', headers: ['Buyer', 'Willingness to pay'], rows: [['Taylor', '$100'], ['Carrie', '$80'], ['Rihanna', '$70'], ['Gaga', '$50']] } },
        { type: 'p', text: 'The demand schedule is built from these values: above $100 nobody buys; between $80 and $100 only Taylor; $70–$80 Taylor and Carrie; $50–$70 three buyers; $50 or less all four. The **height of the demand curve** at any quantity is the willingness to pay of the **marginal buyer** — the buyer who would leave the market first if the price were any higher.' },
        { type: 'list', items: [
          'At a price of $80: only Taylor buys ⇒ CS = 100 − 80 = **$20**.',
          'At a price of $70: Taylor and Carrie buy ⇒ CS = (100 − 70) + (80 − 70) = **$40**.',
        ] },
        { type: 'callout', tone: 'key', text: '**Consumer surplus in a market = the area below the demand curve and above the price.**' },
        { type: 'p', text: '**A lower price raises consumer surplus** in two ways (Figure 3): **existing buyers** pay less (area BCED) and **new buyers** enter the market at the lower price (area CEF).' },
        { type: 'callout', tone: 'note', title: 'What does CS measure?', text: 'CS measures benefit **as buyers themselves perceive it** — a good measure of well-being if we respect buyers’ preferences. The exception: illegal drugs. Addicts are willing to pay a lot for heroin, but society does not regard that as a large benefit.' },
      ],
    },
    {
      id: 'ps', title: 'Producer surplus', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Cost', conceptId: 'cost-seller', text: 'The value of everything a seller must give up to produce a good — a measure of the seller’s **willingness to sell**.' },
        { type: 'definition', term: 'Producer surplus', conceptId: 'producer-surplus', text: 'The amount a seller is paid for a good **minus** the seller’s cost of providing it.' },
        { type: 'table', table: { caption: 'Course Table 2: four possible sellers of house-painting services', headers: ['Seller', 'Cost'], rows: [['Vincent', '$900'], ['Claude', '$800'], ['Pablo', '$600'], ['Andy', '$500']] } },
        { type: 'p', text: 'The height of the supply curve is the cost of the **marginal seller** — the one who would leave first if the price were any lower.' },
        { type: 'list', items: ['At $600: only Andy paints ⇒ PS = **$100**.', 'At $800: Andy, Pablo (and Claude, indifferent) ⇒ PS = (800 − 500) + (800 − 600) = **$500**.'] },
        { type: 'callout', tone: 'key', text: '**Producer surplus = the area below the price and above the supply curve.** A higher price raises PS: existing sellers receive more, and new sellers enter.' },
        { type: 'model', model: 'surplus', props: { preset: 2 } },
      ],
    },
    {
      id: 'efficiency', title: 'Market efficiency', kind: 'math',
      blocks: [
        { type: 'p', text: 'Imagine a **benevolent social planner** — all-knowing, all-powerful and well-intentioned — who wants to maximise the economic well-being of everyone. Her measure of well-being is **total surplus**:' },
        { type: 'math', tex: '\\begin{aligned} \\text{Total surplus} &= \\text{CS} + \\text{PS} \\\\ &= (\\text{value to buyers} - \\text{amount paid}) + (\\text{amount received} - \\text{cost to sellers}) \\\\ &= \\text{value to buyers} - \\text{cost to sellers} \\end{aligned}', caption: 'The amount paid by buyers equals the amount received by sellers, so it cancels.' },
        { type: 'definition', term: 'Efficiency', conceptId: 'efficiency', text: 'A resource allocation is efficient if it **maximises total surplus** received by all members of society. (**Equality**: distributing prosperity uniformly — how the pie is sliced, rather than how big it is.)' },
        { type: 'p', text: 'At the market equilibrium:' },
        { type: 'list', ordered: true, items: [
          'Free markets allocate the supply of goods to the buyers who **value them most** (everyone with WTP ≥ price buys).',
          'Free markets allocate the demand for goods to the sellers who can produce them at **least cost** (everyone with cost ≤ price sells).',
          'Free markets produce the quantity that **maximises total surplus**: below Q* the value to buyers exceeds the cost to sellers (producing more raises surplus); above Q* cost exceeds value (Figure 8).',
        ] },
        { type: 'p', text: 'With linear curves total surplus up to quantity $Q$ is the area between demand and supply:' },
        { type: 'math', tex: 'TS(Q) = \\int_0^{Q} \\big[(a - bq) - (c + dq)\\big]\\,dq = (a - c)Q - \\tfrac{1}{2}(b + d)Q^2' },
        { type: 'p', text: 'Setting $TS\'(Q) = a - c - (b+d)Q = 0$ gives exactly the equilibrium $Q^* = (a-c)/(b+d)$: the surplus-maximising quantity **is** the market quantity, where the marginal buyer’s value equals the marginal seller’s cost.' },
        { type: 'model', model: 'surplus', props: { preset: 1 } },
        { type: 'callout', tone: 'intuition', title: 'Planned vs market economy', text: 'A central planner would find it extremely hard (1) to allocate a given quantity to the consumers who value it most and to the producers with the lowest costs, and (2) to find the surplus-maximising quantity. The invisible hand does both, using information no planner has. Laissez-faire: "let people do as they will".' },
      ],
    },
    {
      id: 'examples', title: 'Worked examples', kind: 'example',
      blocks: [
        { type: 'example', title: 'Total surplus from a table (Q8 and Q14)', problem: 'Price $12 → Qd 0, Qs 36; $10 → 3, 30; $8 → 6, 24; $6 → 9, 18; $4 → 12, 12; $2 → 15, 6; $0 → 18, 0. Demand and supply are straight lines. Find CS, PS and total surplus at equilibrium.', steps: [
          'Equilibrium where Qd = Qs: **P = $4, Q = 12**.',
          'Demand hits the price axis where Qd = 0: **$12**. Supply hits it where Qs = 0: **$0**.',
          'CS = ½ × 12 × (12 − 4) = **$48**.',
          'PS = ½ × 12 × (4 − 0) = **$24**.',
          'Total surplus = 48 + 24 = **$72**.',
        ], answer: 'CS $48, PS $24, TS $72.' },
        { type: 'example', title: 'Bert and Ernie (PS Ch. 7, P4–6 — course solutions)', problem: 'Bert values bottles of water at $7, $5, $3, $1. Ernie can produce them at $1, $3, $5, $7. Find the equilibrium and the surpluses; what happens if one bottle more or less is traded?', steps: [
          'At $4: Bert buys 2 (values 7 and 5 ≥ 4), Ernie sells 2 (costs 1 and 3 ≤ 4) ⇒ equilibrium **P = $4, Q = 2**.',
          'CS = (7 − 4) + (5 − 4) = $4; PS = (4 − 1) + (4 − 3) = $4; **total = $8**.',
          'One bottle fewer: lose the second bottle’s value − cost = 5 − 3 = $2 ⇒ total $6.',
          'One bottle more: the third bottle costs $5 but is worth $3 ⇒ total falls by $2 to $6.',
        ], answer: 'Equilibrium maximises total surplus ($8); any other quantity gives less.' },
        { type: 'example', title: 'Choosing a streaming provider (PS Ch. 7, P10)', problem: 'Your friend’s demand for movies is Q = 150 − 50P (choke price $3). Provider A charges $120 a year for unlimited movies; Provider B charges $1 per movie. Which gives more consumer surplus?', steps: [
          'Provider A: the marginal price of a movie is $0 ⇒ she watches 150. Value = ½ × 3 × 150 = $225; she pays $120 ⇒ **CS = $105**.',
          'Provider B: price $1 ⇒ she watches 150 − 50 = 100. CS = ½ × (3 − 1) × 100 = **$100** (she pays $100).',
        ], answer: 'Recommend **A**: CS $105 > $100.' },
      ],
    },
    {
      id: 'organs', title: 'Application: should there be a market for organs?', kind: 'application',
      blocks: [
        { type: 'p', text: 'Ms Stevens’ son needed a kidney; her own was not compatible, so she donated one to a stranger and her son moved to the top of the waiting list. Should she be able to trade a kidney for a kidney? For an experimental cancer treatment? For free tuition? For cash?' },
        { type: 'list', items: [
          'Current policy makes it illegal to sell organs — in effect a **price ceiling of zero**, which causes a **shortage**. The typical patient waits several years, and thousands die each year waiting.',
          'A market would balance supply and demand: sellers get cash, buyers get to live; most people have two kidneys and need only one.',
          'Critics worry about **fairness** — the rich benefiting at the expense of the poor. Defenders ask whether the current system is fair: some have an extra kidney they do not need while others are dying for one.',
        ] },
        { type: 'callout', tone: 'note', text: 'This is a classic efficiency vs equality question: a market raises total surplus, but whether its distribution is acceptable is a normative judgement.' },
      ],
    },
    {
      id: 'failure', title: 'Market efficiency and market failure', kind: 'interpretation',
      blocks: [
        { type: 'p', text: 'The efficiency result relies on assumptions: markets are **perfectly competitive**, and the outcome matters only to the buyers and sellers in that market. When these fail, "market equilibrium is efficient" may no longer be true:' },
        { type: 'list', items: [
          '**Market power**: a single buyer or seller (or small group) can control prices, so the market is inefficient (later chapters — see the Monopoly model).',
          '**Externalities**: decisions affect people outside the market (pollution), so welfare depends on more than buyers’ value and sellers’ cost.',
        ] },
        { type: 'definition', term: 'Market failure', conceptId: 'market-failure', text: 'The inability of some unregulated markets to allocate resources efficiently. Public policy can potentially remedy the problem and increase efficiency.' },
        { type: 'callout', tone: 'example', title: 'Medical care and insurance (PS Ch. 7, P11 — course solution)', text: 'Each procedure costs society $100 (horizontal supply). Without insurance patients buy Q₁, where their value equals $100. If insurance makes them pay only $20, they buy Q₂ > Q₁: procedures worth less than their cost are performed, reducing total surplus. Fixing this requires patients to bear the marginal cost (which undoes insurance) or the insurer to decide — but the insurer does not get the benefits.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Measuring CS as the whole area under the demand curve.', right: 'CS is the area under demand **above the price**, up to the quantity bought.' },
          { wrong: 'Using the supply intercept as zero when it is not.', right: 'PS is the triangle between the price and the supply curve — start from the supply curve’s actual intercept.' },
          { wrong: 'Saying "efficient" means "fair".', right: 'Efficiency is about the **size** of total surplus; fairness/equality is about its **distribution**.' },
          { wrong: 'Thinking producing more always raises welfare.', right: 'Beyond Q* each extra unit costs more than it is worth: total surplus falls.' },
          { wrong: 'Treating a higher price as "neutral" for CS because some buyers still buy.', right: 'Existing buyers pay more **and** some buyers leave: CS falls (Q24).' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'At a price of $70 for the Elvis album, what is total consumer surplus?', options: ['$20', '$30', '$40', '$70'], answer: 2, explanation: 'Taylor (100 − 70 = 30) + Carrie (80 − 70 = 10) = **$40**; Rihanna is indifferent, Gaga does not buy.' } },
        { type: 'check', question: { prompt: 'At a quantity below the equilibrium quantity…', options: ['the value to the marginal buyer is below the cost to the marginal seller', 'the value to the marginal buyer exceeds the cost to the marginal seller', 'total surplus is maximised', 'producer surplus is zero'], answer: 1, explanation: 'Below Q*, the demand curve lies above the supply curve: producing more would add surplus.' } },
        { type: 'check', question: { prompt: 'Which assumption is NOT needed for the claim that market equilibrium is efficient?', options: ['Markets are perfectly competitive', 'No externalities', 'Income is distributed equally', 'Outcomes matter only to buyers and sellers in the market'], answer: 2, explanation: 'Efficiency concerns the size of the pie, not its distribution; equality is a separate (normative) question.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq02', 'pq07', 'pq08', 'pq14', 'pq23', 'pq24'] },
        { type: 'p', text: 'Then review [Problem set Ch. 7 (with course solutions)](#/practice/problems/ps-ch07).' },
      ],
    },
  ],
  recap: [
    '**Willingness to pay** = value; the height of demand is the marginal buyer’s WTP. **Cost** = willingness to sell; the height of supply is the marginal seller’s cost.',
    '**CS** = area under demand above the price; **PS** = area above supply below the price.',
    'A lower price raises CS (existing buyers pay less, new buyers enter); a higher price raises PS.',
    'Total surplus = value to buyers − cost to sellers; it is **maximised at the competitive equilibrium**.',
    'Efficiency (size of the pie) ≠ equality (its distribution).',
    'Market failures — **market power** and **externalities** — can make the market outcome inefficient.',
  ],
};

export default ch07;
