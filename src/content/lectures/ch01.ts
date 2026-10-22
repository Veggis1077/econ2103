import type { Lecture } from '../../types/content';

const ch01: Lecture = {
  id: 'ch01',
  number: 1,
  title: 'Ten Principles of Economics',
  subtitle: 'Scarcity, trade-offs, opportunity cost and marginal thinking — the toolkit behind every later chapter.',
  estMinutes: 45,
  color: '#2552eb',
  objectives: [
    'Explain **scarcity** and why economics studies *choice under constraints*.',
    'Compute the **opportunity cost** of a choice, including the best forgone alternative.',
    'Separate **sunk costs** from marginal costs and make decisions **at the margin**.',
    'Predict how people respond to **incentives**, including unintended consequences of policy.',
    'Explain why **trade** and **markets** usually work well, and when governments can improve outcomes (market failure, equity).',
  ],
  keywords: ['scarcity', 'trade-offs', 'opportunity cost', 'marginal thinking', 'incentives', 'markets', 'market failure'],
  models: ['opportunity-cost'],
  problemSets: ['ps-ch01-02'],
  sections: [
    {
      id: 'intro', title: 'The economic way of thinking', kind: 'intro',
      blocks: [
        { type: 'p', text: `Many disciplines try to understand people's behaviour — sociology, history, psychology. Economics has a distinctive **approach**: we analyse people's **choices under constraints**. The lecture opened with generative AI (ChatGPT, launched November 2022): people ask very different questions about it — homework productivity, which skills to learn, regulation, growth, inequality — and even with the same question they *interpret* the same news differently (sceptics such as Daron Acemoglu vs optimists such as Larry Summers). A good methodology helps you interpret and predict better.` },
        { type: 'p', text: `The economic approach rests on two pillars:` },
        { type: 'list', ordered: true, items: [
          `**People are maximisers.** When an individual makes a choice, the objective is to maximise the happiness (benefit) received.`,
          `**Choices face constraints.** Choice without limitation is meaningless — if you had unlimited money, "spending wisely" would be a meaningless idea.`,
        ] },
        { type: 'definition', term: 'Scarcity', conceptId: 'scarcity', text: `Society's resources are insufficient to satisfy everyone's wants. Scarcity is about **availability and wants together**: diamonds are scarce, sand in the Sahara is not.` },
        { type: 'definition', term: 'Economics', conceptId: 'economics', text: `The study of how society manages its scarce resources: how people decide what to buy and how much to work, save and spend; how firms decide how much to produce and how many workers to hire; how society divides resources between defence, consumer goods, the environment and other needs.` },
        { type: 'callout', tone: 'note', title: 'What is examinable', text: `The slides group the ten principles into three sets. Principles 1–7 (how people make decisions, how people interact) are core. Principles 8–10 (how the economy as a whole works) are marked **"Not required"** in the slides — they are summarised at the end of this module for context only.` },
      ],
    },
    {
      id: 'decisions', title: 'How people make decisions (Principles 1–4)', kind: 'definitions',
      blocks: [
        { type: 'h', text: 'Principle 1 — People face trade-offs' },
        { type: 'p', text: `All decisions involve trade-offs: a party the night before your midterm leaves less time to study; more money for things requires longer working hours and less leisure; protecting the environment uses resources that could produce consumer goods.` },
        { type: 'p', text: `Society faces a central trade-off between **efficiency** and **equality**. Redistributing income from the wealthy to the poor can make prosperity more equal, but it reduces the incentive to work and produce — it shrinks the economic pie.` },
        { type: 'compare', left: { title: 'Efficiency', items: ['Society gets the **most** it can from its scarce resources', 'The **size** of the economic pie'] }, right: { title: 'Equality', items: ['Prosperity is distributed **uniformly** among members of society', 'How the pie is **sliced**'] } },
        { type: 'h', text: 'Principle 2 — The cost of something is what you give up to get it' },
        { type: 'definition', term: 'Opportunity cost', conceptId: 'opportunity-cost', text: `Whatever must be given up to obtain an item: the value of the **best (highest-valued) alternative** you give up. It is the relevant cost for decision making.` },
        { type: 'p', text: `The opportunity cost of a year of college is not just tuition, books and fees, but also the **forgone wages** and the human capital you would have accumulated by working. The opportunity cost of a movie is the ticket price *and* the value of the time spent in the theatre.` },
        { type: 'list', items: [
          `**Only the best alternative counts.** If tonight you can (A) study, (B) game or (C) date, choosing A means you cannot do B *or* C — but you could only have done one of them anyway. The OC of A is the higher-valued of B and C, and it can differ between people.`,
          `**No choice = no cost.** If there is no alternative, it is not part of the cost: sleep and food are not costs of attending college (you would need them anyway).`,
          `**Cost is forward-looking.** Things that have already happened and cannot be reversed — **sunk costs** — are not part of the cost. Lost your movie ticket? The lost ticket is irrelevant to whether you should buy a new one.`,
          `**Opportunity costs change when alternatives change:** the OC of college rises when the wage of a high-school graduate rises.`,
        ] },
        { type: 'h', text: 'Principle 3 — Rational people think at the margin' },
        { type: 'definition', term: 'Rational people', conceptId: 'rational', text: `Systematically and purposefully do the best they can to achieve their objectives. They make decisions by evaluating the costs and benefits of **marginal changes** — incremental adjustments to an existing plan.` },
        { type: 'p', text: `The **marginal** unit is the *additional* unit; marginal benefit/cost is the benefit/cost of that additional unit. A manager considering more output compares the cost of the extra labour and materials with the **extra revenue**. Deciding how many buffalo wings to eat, you compare the pleasure of *one more* wing with its price. Distinguish **marginal** from **average**: the average cost of the apartments you have built says nothing about whether the next one is worth building.` },
        { type: 'callout', tone: 'note', title: 'Is rationality realistic?', text: `Economists value a consistent framework built on rationality, though people sometimes seem not quite rational. **Behavioural economics** relaxes that assumption — it is not covered in this course.` },
        { type: 'h', text: 'Principle 4 — People respond to incentives' },
        { type: 'definition', term: 'Incentive', conceptId: 'incentive', text: `Something that induces a person to act — the prospect of a reward or a punishment.` },
        { type: 'p', text: `When gas prices rise, consumers buy more hybrid cars and fewer gas-guzzling SUVs. When cigarette taxes increase, teen smoking falls. Policies change incentives, and therefore behaviour — often in ways policymakers did not intend (see the policy tables below).` },
      ],
    },
    {
      id: 'math', title: 'Opportunity cost and the marginal rule, formally', kind: 'math',
      blocks: [
        { type: 'p', text: `Suppose you choose among options $i = 1, \\dots, n$. Option $i$ costs a money price $c_i$ and gives a benefit (your willingness to pay) $b_i$. Its **net value** is $b_i - c_i$. The **opportunity cost** of choosing option $A$ is what you pay for it plus the net value of the best alternative you give up:` },
        { type: 'math', tex: '\\text{OC}(A) = c_A + \\max_{j \\neq A}\\,(b_j - c_j)', caption: '(doing nothing, with net value 0, is always an alternative)' },
        { type: 'p', text: `You should choose $A$ exactly when its benefit is at least its opportunity cost, $b_A \\ge \\text{OC}(A)$. That is equivalent to choosing the option with the **highest net value**.` },
        { type: 'p', text: `**The marginal rule.** For a decision about "one more step" (one more unit, one more repair), compare the **marginal benefit** $MB$ (how much better off the step makes you) with the **marginal cost** $MC$ (how much it costs from now on):` },
        { type: 'math', tex: '\\text{take the step} \\iff MB \\ge MC', caption: 'Sunk costs appear on neither side.' },
        { type: 'p', text: `Mathematically, choosing a quantity to maximise *net* gain means increasing it while $MB > MC$ and stopping where $MB = MC$ — this is the logic behind firms' $P = MC$ (Ch. 15) and monopoly's $MR = MC$ later.` },
      ],
    },
    {
      id: 'interactive', title: 'Interactive: compute opportunity costs', kind: 'interactive',
      blocks: [
        { type: 'p', text: `Load "Anne's Saturday" (the lecture example) and check each number. Then change a ticket price and watch the best choice switch. The second tab handles marginal decisions with sunk costs.` },
        { type: 'model', model: 'opportunity-cost' },
      ],
    },
    {
      id: 'examples', title: 'Worked examples', kind: 'example',
      blocks: [
        { type: 'example', title: "Anne's Saturday evening (lecture)", problem: `Anne has three options: (A) a movie — ticket 50 HKD, she values it at 120 HKD; (B) a concert — ticket 150 HKD, value 250 HKD; (C) a party — food and drink 80 HKD, value 170 HKD. What is the opportunity cost of each option, and which should she choose?`, steps: [
          'Net values: movie 120 − 50 = **70**; concert 250 − 150 = **100**; party 170 − 80 = **90**.',
          'OC(movie) = 50 + max{100, 90} = **150 HKD**. She pays 50 and gives up the concert, worth 100 net.',
          'OC(concert) = 150 + max{70, 90} = **240 HKD**.',
          'OC(party) = 80 + max{70, 100} = **180 HKD**.',
          'Compare benefit with OC: movie 120 < 150 ✗; concert 250 > 240 ✓; party 170 < 180 ✗.',
        ], answer: 'Anne should go to the **concert** — the only option whose benefit exceeds its opportunity cost (equivalently, the highest net value).' },
        { type: 'example', title: 'Active learning 1: the dying transmission', problem: `You are selling your 2012 Toyota. You have already spent $10,000 on repairs. At the last minute the transmission dies. You can pay $6,000 to repair it or sell the car "as is". Scenario A: the car sells for $65,000 if the transmission works, $57,000 if not. Scenario B: $60,000 vs $55,000.`, steps: [
          'The $10,000 already spent is **sunk**: you cannot get it back whatever you do, so ignore it.',
          'Marginal cost of the repair = $6,000.',
          'Scenario A: marginal benefit = $65,000 − $57,000 = $8,000 > $6,000 ⇒ repair.',
          'Scenario B: marginal benefit = $60,000 − $55,000 = $5,000 < $6,000 ⇒ sell as is.',
        ], answer: 'Repair in A, not in B. The change in incentives (the price gap) changes the decision; the sunk $10,000 never matters.' },
        { type: 'example', title: 'Problem set Ch. 1, P5: the half-finished product', problem: `Your company has invested $5 million developing a product. Competitors have cut expected sales to $3 million. Finishing development and making the product costs another $1 million. Go ahead? What is the most you should pay to complete it?`, steps: [
          'The $5 million is sunk.',
          'Marginal benefit of finishing = $3 million of sales; marginal cost = $1 million.',
          '$3m > $1m, so finishing adds $2 million.',
          'You would be willing to pay up to the marginal benefit: $3 million.',
        ], answer: 'Yes, finish it; pay at most **$3 million** to complete development.' },
      ],
    },
    {
      id: 'interaction', title: 'How people interact (Principles 5–7)', kind: 'interpretation',
      blocks: [
        { type: 'h', text: 'Principle 5 — Trade can make everyone better off' },
        { type: 'p', text: `Rather than being self-sufficient, people can **specialise** in producing one good or service and exchange it for others. Countries also gain: they get a better price abroad for what they produce and buy other goods more cheaply than they could make them. (Chapter 3 shows exactly why, using comparative advantage.)` },
        { type: 'h', text: 'Principle 6 — Markets are usually a good way to organise economic activity' },
        { type: 'definition', term: 'Market', conceptId: 'market', text: `A group of buyers and sellers (need not be in a single location). "Organising economic activity" means determining what goods to produce, how to produce them, how much of each, and who gets them.` },
        { type: 'p', text: `A **market economy** allocates resources through the decentralised decisions of many households and firms. Adam Smith (*The Wealth of Nations*, 1776): each acts as if "led by an **invisible hand**" to promote general well-being. The invisible hand works through **prices**: they reflect the good's value to buyers and its cost of production, and guide self-interested decisions toward outcomes that in many cases maximise society's well-being.` },
        { type: 'callout', tone: 'example', title: "Case: China's Household Responsibility System", text: [`Under the People's Commune (1958–1978) work was done by collective brigades, land was 100% collectively commanded, pay came as uniform work points, crops were mandated centrally and the state was a monopsony buyer at fixed prices. Under the Household Responsibility System (1978–) households farmed land with use rights, were **residual claimants** ("keep all surplus above quota"), chose their crops, and could sell on a free market beyond the state quota (dual-track pricing).`, `Gross agricultural output grew **7.7% a year in 1978–1984**, versus 2.9% in the preceding two decades, and surplus rural workers fed China's early light-manufacturing boom. Incentives (Principle 4) and markets (Principle 6) at work.`] },
        { type: 'h', text: 'Principle 7 — Governments can sometimes improve market outcomes' },
        { type: 'p', text: `Markets need governments to enforce **property rights** (police, courts): people are less willing to work, produce, invest or buy if their property may be stolen. Governments may also intervene for two reasons:` },
        { type: 'list', items: [
          `**Efficiency** — to correct a **market failure**, when the market on its own fails to allocate resources efficiently. Causes: **externalities** (production or consumption affects bystanders, e.g. pollution) and **market power** (a single buyer or seller substantially influences the price, e.g. monopoly).`,
          `**Equity** — if the market's distribution of well-being is undesirable, taxes or welfare policies can change how the pie is divided.`,
        ] },
        { type: 'p', text: `"Sometimes" matters: policies can also fail. The lecture's policy tables show how incentives create side effects:` },
        { type: 'table', table: { headers: ['Problem', 'Solution', 'Possible consequences'], rows: [
          ['Steel producers threatened by imports', 'Tariff on imported steel', 'Steel price rises; steel-using industries face higher costs and raise prices; domestic producers sell more'],
          ['Rents put housing out of reach of the poor', 'Rent control', 'Landlords skimp on upkeep; fewer rental units built in the long run'],
          ['Medical costs are very high', 'Government pays a share of bills', 'Doctor and hospital charges rise even more; taxes must rise'],
          ['Tuna fishing kills dolphins', 'Dolphin-safe nets for domestic fisheries', 'Tuna gets dearer; foreign fisheries take over more of the trade'],
          ['Drug addiction', 'Legalise drugs', 'More availability, lower prices, more use; if demand is inelastic, less total spending ⇒ less drug-related crime'],
          ['Drug addiction', 'Tougher enforcement', 'Higher prices, less quantity; if demand is inelastic, higher total spending ⇒ addicts steal more to feed the habit'],
        ] } },
        { type: 'callout', tone: 'exam', text: `The two drug rows use **elasticity** (Chapter 5): with inelastic demand, a supply cut raises total revenue. Questions linking Ch. 1 policies to Ch. 5 reasoning are common (see Q28).` },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Adding up **all** forgone alternatives to get the opportunity cost.', right: 'Only the **single best** forgone alternative counts — you could only have done one of them.' },
          { wrong: 'Counting money already spent ("we have invested so much, we must finish").', right: 'Sunk costs are irrelevant; compare only future marginal benefit and marginal cost.' },
          { wrong: 'Using the explicit price only ("the movie costs $7").', right: 'Add the net value of the best alternative you give up (Q12: the answer is "value of the first movie + $3").' },
          { wrong: 'Using average cost to decide on one more unit (Q4: "average cost is $200,000, so…").', right: 'Use marginal cost: the change in total cost from that unit.' },
          { wrong: 'Treating things you would have needed anyway (food, sleep) as a cost of college.', right: 'No choice ⇒ no cost. Only what you give up *because of* the choice counts.' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'You could spend tonight studying (worth 60 to you), gaming (worth 40) or on a date (worth 100, costs $30 for dinner). What is the opportunity cost of studying?', options: ['$40', '$70', '$100', '$140'], answer: 1, explanation: 'Studying costs nothing out of pocket. Net values of the alternatives: gaming 40, date 100 − 30 = 70. The best forgone alternative is the date, worth **70** net.' } },
        { type: 'check', question: { prompt: 'Which government activity is motivated mainly by **efficiency** (correcting a market failure)?', options: ['Food vouchers for low-income people', 'Higher income-tax rates on high earners', 'Prohibiting smoking in public places', 'Unemployment benefits'], answer: 2, explanation: 'Second-hand smoke is an **externality** — a market failure. The other three are mainly about **equality** (problem set Ch. 1, P7).' } },
        { type: 'check', question: { prompt: 'After paying $12 for a concert ticket you lose it. A new ticket costs $12 and you value the concert at $20. Should you buy a new one?', options: ['No — the concert would then cost $24, more than it is worth', 'Yes — the marginal benefit $20 exceeds the marginal cost $12', 'Only if the first ticket can be refunded', 'It depends on how much you have already spent this month'], answer: 1, explanation: 'The lost $12 is **sunk**. Going forward, buying gives $20 of value for $12.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq04', 'pq12', 'pq16'] },
        { type: 'p', text: `Then work through [Problem set Ch. 1 & 2](#/practice/problems/ps-ch01-02) — problems 2, 5, 7, 8 and 10 belong to this chapter.` },
      ],
    },
    {
      id: 'macro', title: 'For context: how the economy as a whole works (not required)', kind: 'application',
      blocks: [
        { type: 'callout', tone: 'note', title: 'Principles 8–10 (marked "not required" in the slides)', text: [
          `**8. A country's standard of living depends on its ability to produce goods and services.** The key determinant is **productivity** — output per unit of labour — which depends on equipment, skills and technology. Average income in rich countries is more than ten times that in poor ones; the US standard of living is about eight times higher than 100 years ago.`,
          `**9. Prices rise when the government prints too much money.** In the long run inflation is almost always caused by excessive money growth.`,
          `**10. Society faces a short-run trade-off between inflation and unemployment** (over 1–2 years).`,
        ] },
      ],
    },
  ],
  recap: [
    'Economics studies **choices under constraints** made by maximising people facing **scarcity**.',
    '**Opportunity cost** = what you pay + the net value of the **best** alternative given up; it is forward-looking.',
    '**Sunk costs** never affect rational decisions; compare **marginal** benefit with **marginal** cost.',
    'People respond to **incentives** — so policies have side effects (rent control, tariffs, drug enforcement).',
    '**Trade** lets everyone specialise and gain; **markets** coordinate via prices (the invisible hand).',
    'Governments can sometimes improve outcomes: correcting **market failures** (externalities, market power) or promoting **equity** — the efficiency–equality trade-off.',
  ],
};

export default ch01;
