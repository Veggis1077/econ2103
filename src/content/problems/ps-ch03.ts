import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch03',
  title: 'Problem set: Chapter 3',
  lectures: ['ch03'],
  problems: [
    { id: 'p3', title: 'P3 — Diego and Darnell', source: 'ProblemSets/Chapter 3.pdf', models: ['trade'], intro: 'Diego takes 4 hours to brew a gallon of root beer and 2 hours to make a pizza. Darnell takes 6 hours to brew a gallon and 4 hours to make a pizza.',
      parts: [
        { label: 'a1', prompt: "What is Diego's opportunity cost of a pizza (gallons of root beer)?", solution: '2 hours per pizza could brew 2/4 = **0.5 gallon**.', check: { answer: 0.5, unit: 'gallons' } },
        { label: 'a2', prompt: "What is Darnell's opportunity cost of a pizza?", solution: '4/6 = **⅔ ≈ 0.667 gallon**.', check: { answer: 0.6667, tolerance: 0.01, unit: 'gallons' } },
        { label: 'a3', prompt: 'Who has the absolute advantage in pizza? The comparative advantage?', solution: 'Diego needs fewer hours for a pizza ⇒ **absolute advantage** (in both goods, actually). His OC of pizza is lower ⇒ **comparative advantage in pizza**.' },
        { label: 'b', prompt: 'If they trade, who trades pizza for root beer?', solution: '**Diego** (pizza specialist) trades pizza for root beer; Darnell specialises in root beer.' },
        { label: 'c', prompt: 'Highest and lowest price of pizza (in gallons) that makes both better off?', solution: 'Between the two opportunity costs: higher than **½ gallon** (else Diego loses) and lower than **⅔ gallon** (else Darnell loses).' },
      ] },
    { id: 'p4', title: 'P4 — Canada, cars and wheat', source: 'ProblemSets/Chapter 3.pdf', models: ['trade'], intro: 'There are 10 million workers in Canada; each can produce 2 cars or 30 bushels of wheat a year.',
      parts: [
        { label: 'a1', prompt: 'Opportunity cost of a car (bushels)?', solution: '30/2 = **15 bushels**.', check: { answer: 15, unit: 'bushels' } },
        { label: 'a2', prompt: 'Opportunity cost of a bushel (cars)? Relationship?', solution: '2/30 = **1/15 car** — the reciprocal of the OC of a car.', check: { answer: 0.0667, tolerance: 0.02, unit: 'cars' } },
        { label: 'b', prompt: "Canada's PPF; wheat consumed with 10 million cars and no trade (million bushels)?", solution: 'PPF from 20 million cars to 300 million bushels. Ten million cars use 5 million workers; the other 5 million grow 5 × 30 = **150 million bushels**.', check: { answer: 150, unit: 'million bushels' } },
        { label: 'c', prompt: 'The US buys 10 million cars at 20 bushels each. If Canada still consumes 10 million cars, how much wheat can it consume (million bushels)? Accept?', solution: 'Produce 20 million cars (all workers), sell 10 million for 200 million bushels, consume **200 million bushels** + 10 million cars — beyond the PPF. **Accept**: 20 bushels > Canada’s OC of 15.', check: { answer: 200, unit: 'million bushels' } },
      ] },
    { id: 'p6', title: 'P6 — Baseballia’s socks', source: 'ProblemSets/Chapter 3.pdf', models: ['trade'], intro: 'Per worker per hour: Boston makes 3 pairs of red or 3 pairs of white socks; Chicago 2 red or 1 white.',
      parts: [
        { label: 'a1', prompt: 'Without trade, the price of white socks in red socks in Boston?', solution: 'OC of a white = 3/3 = **1 red**.', check: { answer: 1, unit: 'red' } },
        { label: 'a2', prompt: '…and in Chicago?', solution: 'OC of a white = 2/1 = **2 red**.', check: { answer: 2, unit: 'red' } },
        { label: 'b', prompt: 'Absolute and comparative advantage?', solution: 'Boston has the **absolute** advantage in both colours. Comparative: Boston in **white** (1 < 2), Chicago in **red** (OC of red: Chicago ½ white < Boston 1 white).' },
        { label: 'c', prompt: 'Which sock does each city export?', solution: 'Boston exports **white**, Chicago exports **red**.' },
        { label: 'd', prompt: 'Range of mutually beneficial prices?', solution: 'A pair of white socks must trade for **between 1 and 2 pairs of red**.' },
      ] },
    { id: 'p7', title: 'P7 — German and French workers', source: 'ProblemSets/Chapter 3.pdf', intro: 'A German worker takes 400 hours to produce a car and 2 hours per case of wine. A French worker takes 600 hours per car and X hours per case.',
      parts: [
        { label: 'a', prompt: 'For what X are gains from trade possible?', solution: 'OC of a car: Germany 400/2 = 200 cases; France 600/X. Gains exist whenever they differ: **X ≠ 3**.' },
        { label: 'b', prompt: 'For what X will Germany export cars and import wine?', solution: 'Germany needs the lower OC of cars: 200 < 600/X ⇔ **X < 3**.' },
      ] },
    { id: 'p8', title: 'P8 — America and China', source: 'ProblemSets/Chapter 3.pdf', intro: 'In a year an American worker can make 100 shirts or 20 computers; a Chinese worker 100 shirts or 10 computers.',
      parts: [
        { label: 'a', prompt: 'Graph each PPF; with no trade each worker spends half the time on each good. Identify the points.', solution: 'US PPF: (shirts, computers) from (100, 0) to (0, 20); no-trade point **(50, 10)**. China: (100, 0) to (0, 10); no-trade point **(50, 5)**.' },
        { label: 'b', prompt: 'Who exports shirts? Give a numerical example. Who benefits?', solution: 'OC of a shirt: US 0.2 computer, China 0.1 ⇒ **China exports shirts**, the US exports computers. Example: China makes only shirts (100), the US only computers (20). China sends 50 shirts for 7 computers (≈ 7.1 shirts per computer). China consumes (50 shirts, 7 computers) vs (50, 5) without trade; the US consumes (50, 13) vs (50, 10). **Both benefit**' },
        { label: 'c', prompt: 'At what price of computers (in shirts) might they trade?', solution: 'OC of a computer: US 5 shirts, China 10 shirts ⇒ price **between 5 and 10 shirts**.' },
        { label: 'd', prompt: 'China catches up: a Chinese worker can make 100 shirts or 20 computers. Pattern of trade? Welfare?', solution: 'Opportunity costs become **identical** ⇒ no comparative advantage and no gains from trade, so trade stops. Chinese citizens are better off (higher productivity ⇒ more of everything). Americans lose the gains from trade they had, but are no worse off than in autarky.' },
      ] },
  ],
};
export default ps;
