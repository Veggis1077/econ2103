import type { Lecture } from '../../types/content';

const ch03: Lecture = {
  id: 'ch03',
  number: 3,
  title: 'Interdependence and the Gains from Trade',
  subtitle: 'Why specialising according to comparative advantage and trading makes everyone better off — even someone who is better at everything.',
  estMinutes: 50,
  color: '#7c3aed',
  objectives: [
    'Derive a producer’s **PPF** and **opportunity costs** from time-per-unit data.',
    'Distinguish **absolute advantage** from **comparative advantage**.',
    'Show why specialisation and trade let both parties consume **beyond their PPFs**.',
    'Find the range of **prices of trade** that benefit both parties.',
    'Apply comparative advantage to people (Serena Williams) and countries (US and Japan).',
  ],
  keywords: ['absolute advantage', 'comparative advantage', 'opportunity cost', 'specialisation', 'gains from trade', 'terms of trade'],
  models: ['trade', 'ppf'],
  problemSets: ['ps-ch03'],
  prerequisites: ['ch01', 'ch02'],
  sections: [
    {
      id: 'parable', title: 'A parable: Frank the farmer and Ruby the rancher', kind: 'intro',
      blocks: [
        { type: 'p', text: `Two goods (meat and potatoes), two people. Both would like to eat both. Each works 8 hours (480 minutes) a day and can raise cattle, grow potatoes, or do some of each.` },
        { type: 'table', table: { caption: 'Course Figure 1(a): production opportunities', headers: ['', 'Minutes per oz of meat', 'Minutes per oz of potatoes', 'Meat in 8 hours', 'Potatoes in 8 hours'], rows: [['Frank the farmer', 60, 15, '8 oz', '32 oz'], ['Ruby the rancher', 20, 10, '24 oz', '48 oz']] } },
        { type: 'p', text: `Ruby is faster at **both** goods. It looks as if she has nothing to gain from trading with Frank. The surprise of this chapter is that **both** gain.` },
        { type: 'p', text: `Without trade, each person's PPF is also their **consumption possibilities frontier**. Suppose without trade Frank makes and eats 4 oz meat + 16 oz potatoes and Ruby 12 oz meat + 24 oz potatoes.` },
        { type: 'p', text: `Now suppose Frank **specialises** in potatoes (8 hours ⇒ 32 oz) and Ruby spends 6 hours on cattle and 2 on potatoes (18 oz meat, 12 oz potatoes). Ruby gives Frank 5 oz of meat for 15 oz of potatoes:` },
        { type: 'table', table: { caption: 'Course Figure 2(c): the gains from trade', headers: ['', "Frank's meat", "Frank's potatoes", "Ruby's meat", "Ruby's potatoes"], rows: [
          ['Production & consumption without trade', 4, 16, 12, 24],
          ['Production with trade', 0, 32, 18, 12],
          ['Trade', 'gets 5', 'gives 15', 'gives 5', 'gets 15'],
          ['Consumption with trade', 5, 17, 13, 27],
          ['Gain from trade', '+1', '+1', '+1', '+3'],
        ] } },
        { type: 'callout', tone: 'key', text: 'Both consume **more of both goods** than they could produce on their own — at points **outside** their own PPFs. Trade expands the set of consumption opportunities.' },
      ],
    },
    {
      id: 'definitions', title: 'Absolute vs comparative advantage', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Absolute advantage', conceptId: 'absolute-advantage', text: 'The ability to produce a good using **fewer inputs** than another producer. Ruby needs 20 minutes per oz of meat (Frank 60) and 10 minutes per oz of potatoes (Frank 15): she has the absolute advantage in both.' },
        { type: 'definition', term: 'Opportunity cost', conceptId: 'opportunity-cost', text: 'Whatever must be given up to obtain an item — here, how much of the *other* good a producer gives up to make one more unit.' },
        { type: 'table', table: { caption: 'Course Table 1: opportunity cost of meat and potatoes', headers: ['', 'OC of 1 oz meat', 'OC of 1 oz potatoes'], rows: [['Frank', '4 oz potatoes', '¼ oz meat'], ['Ruby', '2 oz potatoes', '½ oz meat']] } },
        { type: 'definition', term: 'Comparative advantage', conceptId: 'comparative-advantage', text: 'The ability to produce a good at a **lower opportunity cost** than another producer. Ruby has the comparative advantage in **meat** (2 < 4); Frank in **potatoes** (¼ < ½).' },
        { type: 'list', items: [
          'One person **can** have the absolute advantage in both goods.',
          'One person **cannot** have the comparative advantage in both goods (unless their opportunity costs are equal, in which case nobody has one). Because the OC of one good is the **inverse** of the OC of the other, a lower OC of meat implies a higher OC of potatoes.',
          '**Principle of comparative advantage:** each good should be produced by the individual with the smaller opportunity cost of producing it.',
        ] },
      ],
    },
    {
      id: 'math', title: 'The mathematics of comparative advantage', kind: 'math',
      blocks: [
        { type: 'p', text: `If producing one unit of $X$ takes $t_X$ minutes and one unit of $Y$ takes $t_Y$ minutes, then giving up one $X$ frees $t_X$ minutes, enough for $t_X/t_Y$ units of $Y$:` },
        { type: 'math', tex: '\\text{OC of } X = \\frac{t_X}{t_Y} \\text{ units of } Y, \\qquad \\text{OC of } Y = \\frac{t_Y}{t_X} = \\frac{1}{\\text{OC of } X}' },
        { type: 'p', text: `Equivalently, from the PPF intercepts: with $X_{\\max}$ and $Y_{\\max}$ (output if all time goes to one good), $\\text{OC of } X = Y_{\\max}/X_{\\max}$ — the absolute slope of the straight-line PPF.` },
        { type: 'p', text: `**The price of trade.** Let $P_X$ be the number of units of $Y$ exchanged for one $X$. The $X$-specialist (low OC of $X$) gains if she receives more than her OC; the buyer gains if he pays less than his own OC. So both gain only if` },
        { type: 'math', tex: '\\text{OC}^{\\text{low}}_X \\;<\\; P_X \\;<\\; \\text{OC}^{\\text{high}}_X' },
        { type: 'p', text: `Frank and Ruby: the price of meat must lie between 2 and 4 oz of potatoes. Their trade (5 meat for 15 potatoes) has $P_{\\text{meat}} = 3$ ✓.` },
        { type: 'callout', tone: 'intuition', text: 'Trade lets each person "produce" the other good indirectly at a price better than their own opportunity cost. Frank gets meat for 3 potatoes per ounce instead of 4; Ruby gets potatoes for ⅓ oz of meat each instead of ½.' },
      ],
    },
    {
      id: 'interactive', title: 'Interactive: specialise and trade', kind: 'interactive',
      blocks: [
        { type: 'p', text: 'The Frank & Ruby preset reproduces the course table. Change the times per unit to see comparative advantage switch, move the production points, and adjust the trade until both green consumption points lie outside the PPFs. The Billy & Tony preset is the setting of Q6.' },
        { type: 'model', model: 'trade' },
      ],
    },
    {
      id: 'examples', title: 'Worked examples', kind: 'example',
      blocks: [
        { type: 'example', title: 'Diego and Darnell (PS Ch. 3, P3)', problem: 'Diego takes 4 hours to brew a gallon of root beer and 2 hours to make a pizza. Darnell takes 6 hours and 4 hours. (a) Opportunity costs of a pizza; absolute and comparative advantage in pizza. (b) Who trades pizza for root beer? (c) Highest and lowest price of pizza (in gallons of root beer) that makes both better off.', steps: [
          'Diego: a pizza uses 2 h, which could brew 2/4 = **½ gallon** ⇒ OC(pizza) = ½ gallon. Darnell: 4/6 = **⅔ gallon**.',
          'Diego needs fewer hours for both goods ⇒ **absolute advantage** in both. His OC of pizza is lower ⇒ **comparative advantage in pizza**; Darnell has it in root beer.',
          'Diego trades **pizza** for root beer.',
          'The price of a pizza must lie between the OCs: more than ½ (or Diego loses) and less than ⅔ (or Darnell loses).',
        ], answer: 'Price of pizza between **½ and ⅔ gallon** of root beer.' },
        { type: 'example', title: 'Canada (PS Ch. 3, P4)', problem: '10 million workers can each produce 2 cars or 30 bushels of wheat per year. (a) OC of a car and of a bushel? (b) Wheat consumed if Canada consumes 10 million cars without trade? (c) The US offers 20 bushels per car for 10 million cars. Should Canada accept?', steps: [
          'OC(car) = 30/2 = **15 bushels**; OC(bushel) = **1/15 car** (reciprocals).',
          'PPF: 20 million cars or 300 million bushels. Consuming 10m cars uses half the workers ⇒ **150 million bushels**.',
          'With the deal: produce 20m cars, sell 10m at 20 bushels each = 200m bushels. Consumption: 10m cars + **200m bushels** > 150m.',
        ], answer: 'Accept — the price (20 bushels) exceeds Canada’s OC of a car (15), so Canada consumes beyond its PPF.' },
        { type: 'example', title: 'Germany and France (PS Ch. 3, P7)', problem: 'A German worker needs 400 h per car and 2 h per case of wine; a French worker 600 h per car and X h per case. (a) For what X are gains from trade possible? (b) When does Germany export cars?', steps: [
          'OC of a car: Germany 400/2 = 200 cases; France 600/X cases.',
          'Gains require different OCs: 600/X ≠ 200 ⇔ **X ≠ 3**.',
          'Germany exports cars if its OC of a car is lower: 200 < 600/X ⇔ **X < 3**.',
        ], answer: 'Gains for any X ≠ 3; Germany exports cars and imports wine when X < 3.' },
      ],
    },
    {
      id: 'applications', title: 'Applications', kind: 'application',
      blocks: [
        { type: 'h', text: 'Should Serena Williams mow her own lawn?' },
        { type: 'p', text: 'In 2 hours Serena can mow her lawn or film a commercial earning $30,000. Forrest Gump can mow her lawn in 4 hours or work at McDonald’s for $50. Serena probably has the absolute advantage in mowing, but her opportunity cost is $30,000 versus Forrest’s $50. She should hire Forrest — any price between $50 and $30,000 benefits both.' },
        { type: 'h', text: 'Should the US trade with other countries?' },
        { type: 'p', text: 'One American worker-month makes 1 car or 2 tons of food; a Japanese worker-month makes 1 car or 1 ton. OC of a car: 2 tons (US) vs 1 ton (Japan) ⇒ **Japan** has the comparative advantage in cars. OC of a ton of food: ½ car (US) vs 1 car (Japan) ⇒ the **US** in food. With specialisation and trade both countries have more food and more cars.' },
        { type: 'callout', tone: 'note', title: 'Ask the experts', text: 'Most economists agree that trade with China makes most Americans better off (cheaper goods) — *and* that some Americans producing competing goods (clothing, furniture) are made worse off. Trade raises total surplus, but not everyone gains.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Assigning production by **absolute** advantage ("Ruby is faster, so Ruby makes both").', right: 'Specialise by **comparative** advantage — lowest opportunity cost.' },
          { wrong: 'Computing OC as time per unit of the *same* good.', right: 'OC of X = (time per X)/(time per Y) — measured in units of the **other** good.' },
          { wrong: 'Thinking comparative advantage means a *high* opportunity cost (Q25 distractor).', right: 'Comparative advantage = **lower** opportunity cost.' },
          { wrong: 'Choosing any trade price.', right: 'The price must lie **between** the two opportunity costs, or one side loses.' },
          { wrong: 'Thinking a country should import the good it has a comparative advantage in.', right: 'It should **export** it and import the other good.' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'In Baseballia a Boston worker makes 3 red or 3 white socks per hour; a Chicago worker 2 red or 1 white. Which city has the comparative advantage in white socks?', options: ['Boston', 'Chicago', 'Neither', 'Both'], answer: 0, explanation: 'OC of a white sock: Boston 3/3 = 1 red; Chicago 2/1 = 2 red. Boston’s is lower ⇒ Boston has the comparative advantage in **white** socks (and Chicago in red). PS Ch. 3, P6.' } },
        { type: 'check', question: { prompt: 'Frank’s OC of meat is 4 oz potatoes and Ruby’s is 2 oz. At which price of meat would trade NOT benefit both?', options: ['2.5 oz potatoes', '3 oz potatoes', '3.5 oz potatoes', '5 oz potatoes'], answer: 3, explanation: 'Mutually beneficial prices lie between 2 and 4. At 5 Frank would pay more than his own opportunity cost.' } },
        { type: 'check', question: { prompt: 'A person has the absolute advantage in producing both goods. Then…', options: ['there are no gains from trade', 'she also has the comparative advantage in both goods', 'gains from trade still exist if opportunity costs differ', 'she should produce both goods herself'], answer: 2, explanation: 'Gains depend on **differences in opportunity costs**, not on absolute productivity.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq06', 'pq11', 'pq21', 'pq25', 'pq15'] },
        { type: 'p', text: 'Then do [Problem set Ch. 3](#/practice/problems/ps-ch03).' },
      ],
    },
  ],
  recap: [
    'Opportunity cost of X = time per X ÷ time per Y (= |slope| of a straight-line PPF); the two OCs are **reciprocals**.',
    '**Absolute advantage**: fewer inputs. **Comparative advantage**: lower opportunity cost.',
    'Nobody can have the comparative advantage in both goods; specialisation should follow **comparative** advantage.',
    'Specialisation + trade let both parties consume **outside** their own PPFs — the pie gets bigger.',
    'The price of trade must lie **between** the two opportunity costs.',
    'Trade benefits countries as a whole, though some groups (competing producers) can lose.',
  ],
};

export default ch03;
