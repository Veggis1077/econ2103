import type { Lecture } from '../../types/content';

const ch04: Lecture = {
  id: 'ch04',
  number: 4,
  title: 'The Market Forces of Supply and Demand',
  subtitle: 'How buyers and sellers in competitive markets determine prices and quantities — and how events shift the equilibrium.',
  estMinutes: 60,
  color: '#ea580c',
  objectives: [
    'Define a **competitive market** and a price taker.',
    'Derive individual and **market** demand and supply (horizontal summation).',
    'Distinguish **shifts** of a curve from **movements along** it, and list the shifters of demand and supply.',
    'Find **equilibrium**, and explain how **surpluses** and **shortages** push the price toward it.',
    'Use the **three-step method** to analyse events — including simultaneous shifts of both curves.',
    'Solve for equilibrium algebraically with linear curves.',
  ],
  keywords: ['competitive market', 'law of demand', 'law of supply', 'shifts vs movements', 'equilibrium', 'shortage', 'surplus'],
  models: ['supply-demand', 'shift-analyzer', 'market-demand'],
  problemSets: ['ps-ch04'],
  prerequisites: ['ch02'],
  sections: [
    {
      id: 'markets', title: 'Markets and competition', kind: 'intro',
      blocks: [
        { type: 'p', text: '**Supply and demand** are the words economists use most often: they are the forces that make market economies work. A **market** is a group of buyers and sellers of a particular good or service. Buyers as a group determine the **demand**; sellers as a group the **supply**. Markets can be highly organised (agricultural commodities) or less organised (ice cream in a town).' },
        { type: 'definition', term: 'Competitive market', conceptId: 'competitive-market', text: 'A market with many buyers and many sellers, each with a **negligible impact** on the market price.' },
        { type: 'definition', term: 'Perfectly competitive market', conceptId: 'perfect-competition', text: 'The goods offered are all **exactly the same** and buyers and sellers are so numerous that no one has any influence over the price — they are **price takers**: at the market price buyers can buy all they want and sellers can sell all they want.' },
        { type: 'p', text: 'At the other extreme a **monopoly** is the only seller and sets the price. Many markets lie in between.' },
        { type: 'callout', tone: 'example', title: 'Competitive markets in the slides', text: ['**Seasonal fruit picking:** many farms hire similar workers at the prevailing daily wage; a worker shortage pushes the wage up until enough workers accept.', '**Foreign exchange:** millions of participants, full price transparency, no individual market power; rates adjust second by second.', '**Wholesale fish auctions:** identical grades of perishable fish; big catches lower the clearing price, small catches drive it up.'] },
      ],
    },
    {
      id: 'demand', title: 'Demand', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Quantity demanded', conceptId: 'quantity-demanded', text: 'The amount of a good that buyers are **willing and able** to purchase.' },
        { type: 'definition', term: 'Law of demand', conceptId: 'law-of-demand', text: '**Other things equal**, when the price of a good rises, the quantity demanded falls; when the price falls, the quantity demanded rises.' },
        { type: 'p', text: 'A **demand schedule** is a table of price and quantity demanded; the **demand curve** graphs it (price on the vertical axis). It slopes down because a lower price raises the quantity demanded.' },
        { type: 'definition', term: 'Market demand', conceptId: 'market-demand', text: 'The sum of all individual demands: add the **quantities** demanded by all buyers **at each price** — i.e. sum the individual curves **horizontally**.' },
        { type: 'table', table: { caption: 'Course Figure 2: Catherine + Nicholas = market (ice-cream cones)', headers: ['Price', '$0.00', '$0.50', '$1.00', '$1.50', '$2.00', '$2.50', '$3.00'], rows: [['Catherine', 12, 10, 8, 6, 4, 2, 0], ['Nicholas', 7, 6, 5, 4, 3, 2, 1], ['Market', 19, 16, 13, 10, 7, 4, 1]] } },
        { type: 'h', text: 'What shifts the demand curve?' },
        { type: 'p', text: 'An **increase in demand** is any change that raises the quantity demanded **at every price** (curve shifts right); a **decrease** shifts it left. The shifters:' },
        { type: 'list', items: [
          '**Income.** **Normal good**: income ↑ ⇒ demand ↑. **Inferior good**: income ↑ ⇒ demand ↓.',
          '**Prices of related goods.** **Substitutes**: the price of one ↑ ⇒ demand for the other ↑. **Complements**: the price of one ↑ ⇒ demand for the other ↓.',
          '**Tastes.**',
          '**Expectations** about the future: expected higher income ⇒ current demand ↑ for a normal good (↓ for an inferior good); expected higher prices ⇒ current demand ↑.',
          '**Number of buyers**: more buyers ⇒ market demand ↑.',
        ] },
        { type: 'callout', tone: 'key', title: 'The special role of the good’s own price', text: 'A change in the **price of the good itself** is a **movement along** the demand curve (a change in *quantity demanded*). A change in **any other** variable **shifts** the curve (a change in *demand*).' },
        { type: 'callout', tone: 'example', title: 'Two ways to reduce smoking', text: ['**Shift demand left:** public service announcements, mandatory health warnings, bans on TV advertising. In course Figure 4(a), at $4.00 per pack quantity falls from 20 to 10 cigarettes per day (A → B).', '**Raise the price (tax):** a **movement along** the curve. From $4.00 to $8.00, quantity falls from 20 to 12 (A → C). Evidence: a 10% price rise cuts smoking 4%; among teenagers 12%. Cigarettes and marijuana appear to be complements.'] },
      ],
    },
    {
      id: 'supply', title: 'Supply', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Law of supply', conceptId: 'law-of-supply', text: 'Other things equal, when the price of a good rises, the **quantity supplied** (amount sellers are willing and able to sell) also rises; when it falls, quantity supplied falls.' },
        { type: 'p', text: 'Market supply is the **horizontal** sum of individual supplies. At $2.00 Ben supplies 3 cones and Jerry 4 — market quantity supplied is 7.' },
        { type: 'h', text: 'What shifts the supply curve?' },
        { type: 'list', items: [
          '**Input prices**: higher input prices ⇒ supply ↓ (supply is negatively related to input prices).',
          '**Technology**: an advance reduces marginal costs ⇒ supply ↑.',
          '**Expectations**: expected higher future prices ⇒ *current* supply ↓ (sellers hold back).',
          '**Number of sellers**: more sellers ⇒ market supply ↑.',
        ] },
        { type: 'p', text: 'Again, a change in the good’s **own price** moves us **along** the supply curve.' },
      ],
    },
    {
      id: 'equilibrium', title: 'Supply and demand together', kind: 'math',
      blocks: [
        { type: 'definition', term: 'Equilibrium', conceptId: 'equilibrium', text: 'A situation in which the market price has reached the level where **quantity supplied = quantity demanded**: where the supply and demand curves intersect. The **equilibrium price** (market-clearing price) balances them; the **equilibrium quantity** is the amount bought and sold at that price.' },
        { type: 'list', items: [
          '**Surplus (excess supply):** at a price above equilibrium, Qs > Qd ⇒ downward pressure on price. In Figure 9(a), at $2.50, 10 cones are supplied but only 4 demanded.',
          '**Shortage (excess demand):** at a price below equilibrium, Qd > Qs ⇒ upward pressure on price. At $1.50, 10 are demanded and 4 supplied.',
          '**Law of supply and demand:** the price adjusts to bring Qs and Qd into balance. In most markets surpluses and shortages are temporary.',
        ] },
        { type: 'h', text: 'Equilibrium with linear curves' },
        { type: 'p', text: 'Write demand and supply in inverse form (price on the left, as in the graphs):' },
        { type: 'math', tex: '\\text{Demand: } P = a - bQ, \\qquad \\text{Supply: } P = c + dQ' },
        { type: 'p', text: 'Setting the demand price equal to the supply price gives' },
        { type: 'math', tex: 'a - bQ^* = c + dQ^* \\;\\Longrightarrow\\; Q^* = \\frac{a - c}{b + d}, \\qquad P^* = a - bQ^*' },
        { type: 'example', title: 'Course ice-cream market', problem: 'Market demand from the table: Q = 19 − 6P. Market supply (for P ≥ 1): Q = 6P − 5. Find the equilibrium.', steps: [
          'Set Qd = Qs: 19 − 6P = 6P − 5.',
          '24 = 12P ⇒ **P* = $2.00**.',
          'Q* = 19 − 6·2 = **7 cones** (check: 6·2 − 5 = 7).',
        ], answer: 'P* = $2, Q* = 7 — exactly course Figure 8.' },
        { type: 'example', title: 'Problem set Ch. 6 & 8, P10a', problem: 'Qs = 2P and Qd = 300 − P. Solve for the equilibrium.', steps: ['2P = 300 − P ⇒ 3P = 300 ⇒ **P = 100**.', 'Q = 2·100 = **200**.'], answer: 'P* = 100, Q* = 200.' },
      ],
    },
    {
      id: 'interactive', title: 'Interactive: supply and demand', kind: 'interactive',
      blocks: [
        { type: 'p', text: 'Drag a curve sideways to shift it, drag the coloured handles to change intercepts and slopes, and hover to read off values. Try the "Ice cream (Ch. 4)" and "Heat wave" scenarios.' },
        { type: 'model', model: 'supply-demand', props: { preset: 1 } },
      ],
    },
    {
      id: 'changes', title: 'Analysing changes in equilibrium', kind: 'interpretation',
      blocks: [
        { type: 'callout', tone: 'key', title: 'Three steps', text: ['1. Decide whether the event shifts the **supply** curve, the **demand** curve, or both.', '2. Decide whether the curve shifts **right** or **left**.', '3. Use the supply-and-demand diagram to **compare** the initial and the new equilibrium price and quantity.'] },
        { type: 'list', items: [
          '**Hot summer** (tastes) ⇒ demand for ice cream shifts right ⇒ P rises from $2.00 to $2.50 and Q from 7 to 10.',
          '**Hurricane destroys sugarcane** (input price) ⇒ supply shifts left ⇒ P rises to $2.50, Q falls to 4.',
          '**Both at once** ⇒ P rises for sure; Q rises if the demand shift is bigger and falls if the supply shift is bigger.',
        ] },
        { type: 'table', table: { caption: 'Course Table 4: what happens to P and Q?', headers: ['', 'No change in supply', 'Increase in supply', 'Decrease in supply'], rows: [
          ['No change in demand', 'P same; Q same', 'P down; Q up', 'P up; Q down'],
          ['Increase in demand', 'P up; Q up', 'P ambiguous; Q up', 'P up; Q ambiguous'],
          ['Decrease in demand', 'P down; Q down', 'P down; Q ambiguous', 'P ambiguous; Q down'],
        ] } },
        { type: 'model', model: 'shift-analyzer' },
        { type: 'p', text: '**How prices allocate resources.** Supply and demand together determine the prices of the economy’s many goods; prices are **signals** that guide the allocation of resources, ration scarce goods, and determine who produces each good and how much.' },
        { type: 'callout', tone: 'note', title: 'Ask the experts: price gouging', text: 'Economists are sceptical of laws banning "unconscionably excessive" prices during emergencies: high prices ration scarce goods and attract supply to where it is most needed.' },
      ],
    },
    {
      id: 'examples', title: 'Worked examples from the problem set', kind: 'example',
      blocks: [
        { type: 'example', title: 'Bagels and cream cheese (PS Ch. 4, P10)', problem: 'Bagels and cream cheese are complements. (a) The equilibrium price of cream cheese and the equilibrium quantity of bagels have both risen. Was it a fall in the price of flour or a fall in the price of milk? (b) The price of cream cheese rose but the quantity of bagels fell: a rise in the price of flour or of milk?', steps: [
          '(a) A fall in the price of **flour** (bagel input) shifts bagel supply right ⇒ more bagels, cheaper bagels ⇒ demand for the complement cream cheese shifts right ⇒ its price rises. ✓ both facts.',
          '(a, check) A fall in the price of milk would *lower* the price of cream cheese — inconsistent.',
          '(b) A rise in the price of **milk** shifts cream-cheese supply left ⇒ its price rises and quantity falls ⇒ demand for bagels (complement) shifts left ⇒ fewer bagels. ✓',
        ], answer: '(a) fall in the price of flour; (b) rise in the price of milk.' },
        { type: 'example', title: 'Ketchup and hot dogs (PS Ch. 4, P7)', problem: 'Ketchup is a complement of hot dogs. If the price of hot dogs rises, what happens in the markets for ketchup, tomatoes, tomato juice and orange juice?', steps: [
          'Hot dogs dearer ⇒ fewer hot dogs ⇒ demand for **ketchup** ↓: price and quantity fall.',
          'Less ketchup ⇒ demand for **tomatoes** (an input) ↓: price and quantity fall.',
          'Cheaper tomatoes ⇒ supply of **tomato juice** ↑: price falls, quantity rises.',
          'Cheaper tomato juice (a substitute) ⇒ demand for **orange juice** ↓: price and quantity fall.',
        ], answer: 'A chain of shifts through related markets — always ask "which curve, which direction" in each market.' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: '"The price rose, so demand fell."', right: 'A price change causes a fall in **quantity demanded** (movement along). "Demand" changes only when a non-price determinant changes.' },
          { wrong: 'Shifting the demand curve when an **input price** changes.', right: 'Input prices and technology shift **supply**.' },
          { wrong: 'Adding individual curves **vertically** (adding prices).', right: 'Market curves add **quantities at each price** — horizontally.' },
          { wrong: 'Concluding both P and Q are determined when both curves shift.', right: 'With two shifts, one of P or Q is **ambiguous** unless you know the sizes.' },
          { wrong: 'Thinking expected higher future prices raise current supply.', right: 'Sellers hold back: current supply **falls** (while current demand rises).' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'A technological advance lowers the cost of producing TV screens. In the market for **movie tickets** (a substitute for watching at home)…', options: ['demand for movie tickets increases', 'demand for movie tickets decreases', 'supply of movie tickets increases', 'nothing happens'], answer: 1, explanation: 'Cheaper TV screens ⇒ more screens bought ⇒ more home viewing, a substitute for cinema ⇒ demand for movie tickets shifts **left**: price and quantity fall (PS Ch. 4, P4).' } },
        { type: 'check', question: { prompt: 'Scientists show oranges reduce diabetes risk, and a new fertilizer raises orange yields. The equilibrium quantity of oranges…', options: ['rises; price ambiguous', 'falls; price rises', 'is ambiguous; price rises', 'is unchanged'], answer: 0, explanation: 'Demand ↑ and supply ↑: both raise Q; their price effects work in opposite directions ⇒ **Q rises, P ambiguous** (PS Ch. 4, P9).' } },
        { type: 'check', question: { prompt: 'People’s income rises and the demand for bus rides falls. Bus rides are…', options: ['a normal good', 'an inferior good', 'a complement to income', 'a luxury'], answer: 1, explanation: 'Income ↑ ⇒ demand ↓ is the definition of an **inferior good**.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq22', 'pq32', 'pq33'] },
        { type: 'p', text: 'Then try the [graph challenge](#/practice/challenges/sd-price-8) and [Problem set Ch. 4](#/practice/problems/ps-ch04).' },
      ],
    },
  ],
  recap: [
    'In a **competitive market** buyers and sellers are price takers.',
    'Market demand and supply are **horizontal sums** of individual curves.',
    'Own-price changes **move along** a curve; income, related prices, tastes, expectations and number of buyers **shift demand**; input prices, technology, expectations and number of sellers **shift supply**.',
    '**Equilibrium**: Qs = Qd. Above it a surplus, below it a shortage — the price adjusts.',
    'Linear curves: $Q^* = (a-c)/(b+d)$, $P^* = a - bQ^*$.',
    'Three steps: which curve, which direction, compare equilibria. With two shifts, one of P or Q is ambiguous.',
  ],
};

export default ch04;
