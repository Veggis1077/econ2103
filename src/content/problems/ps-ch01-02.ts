import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-ch01-02',
  title: 'Problem set: Chapters 1 & 2',
  lectures: ['ch01', 'ch02'],
  problems: [
    { id: 'c1p2', title: 'Ch. 1, P2 — Comparing a vacation’s costs and benefits', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'You are trying to decide whether to take a vacation. Most of the costs of the vacation (airfare, hotel, and forgone wages) are measured in dollars, but the benefits of the vacation are psychological.',
      parts: [{ label: 'a', prompt: 'How can you compare the benefits to the costs?', solution: 'Convert the psychological benefit into dollars with **willingness to pay**: ask "what is the most I would pay for this vacation?" If that amount exceeds the full opportunity cost (airfare + hotel + **forgone wages**), take it. Money is just a common yardstick for comparing alternatives.' }] },
    { id: 'c1p5', title: 'Ch. 1, P5 — The half-developed product', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Your company has invested $5 million in developing a new product, but development is not quite finished. Competing products have reduced expected sales of your product to $3 million. It would cost $1 million to finish development and make the product.',
      parts: [
        { label: 'a', prompt: 'Should you go ahead?', solution: 'Yes. The $5 million is **sunk**. Going forward, finishing costs $1 million and brings $3 million: a marginal gain of $2 million.' },
        { label: 'b', prompt: 'What is the most you should pay to complete development (in $ million)?', solution: 'Up to the marginal benefit: **$3 million**. (Ignore the sunk $5 million.)', check: { answer: 3, unit: '$ million' } },
      ] },
    { id: 'c1p7', title: 'Ch. 1, P7 — Equality or efficiency?', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Explain whether each government activity is motivated by a concern about equality or efficiency. For efficiency, name the market failure.',
      parts: [
        { label: 'a', prompt: 'Regulating cable TV prices.', solution: '**Efficiency** — cable firms often have **market power** (local monopoly).' },
        { label: 'b', prompt: 'Providing some low-income people with vouchers to buy food.', solution: '**Equality** — redistribution to the poor.' },
        { label: 'c', prompt: 'Prohibiting smoking in public places.', solution: '**Efficiency** — second-hand smoke is an **externality**.' },
        { label: 'd', prompt: 'Breaking up Standard Oil (90% of US refineries) into smaller companies.', solution: '**Efficiency** — reducing **market power**.' },
        { label: 'e', prompt: 'Higher personal income-tax rates on higher incomes.', solution: '**Equality**.' },
        { label: 'f', prompt: 'Laws against driving while intoxicated.', solution: '**Efficiency** — drunk drivers impose an **externality** (risk) on others.' },
      ] },
    { id: 'c1p8', title: 'Ch. 1, P8 — Equality and efficiency trade-offs', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Discuss each statement from the standpoints of equality and efficiency.',
      parts: [
        { label: 'a', prompt: '"Everyone in society should be guaranteed the best healthcare possible."', solution: '**Equality:** appealing — everyone gets the same high standard. **Efficiency:** "the best possible" for everyone uses enormous resources that could produce other things people value more, and free access encourages overuse (procedures worth less than their cost — compare PS Ch. 7, P11). Society faces a trade-off.' },
        { label: 'b', prompt: '"When workers are laid off, they should be able to collect unemployment benefits until they find a new job."', solution: '**Equality:** protects workers from income loss. **Efficiency:** unlimited benefits weaken the **incentive** to search for and accept a new job (Principle 4), so unemployment lasts longer and output falls.' },
      ] },
    { id: 'c1p10', title: 'Ch. 1, P10 — Saving and productivity', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Suppose Americans decide to save more of their incomes, and banks lend the extra saving to businesses that build new factories.',
      parts: [
        { label: 'a', prompt: 'How might this lead to faster growth in productivity? Who benefits? Is society getting a free lunch?', solution: 'More factories = more **capital per worker**, so each worker produces more: productivity rises (Principle 8). Workers (higher wages) and owners of capital (returns) benefit, and future generations enjoy higher living standards. It is **not a free lunch**: people must consume less **today** in order to save — a trade-off between present and future consumption.' },
      ] },
    { id: 'c2p2', title: 'Ch. 2, P2 — Guns and butter', source: 'ProblemSets/Chapter 1&2.pdf', models: ['ppf'], intro: 'A society produces military goods ("guns") and consumer goods ("butter").',
      parts: [
        { label: 'a', prompt: 'Draw a PPF and explain, using opportunity cost, why it is most likely bowed out.', solution: 'Resources are **specialised**: some are better at guns, others at butter. As the economy makes more guns it must use resources ever less suited to guns, so each extra gun costs more butter — rising opportunity cost ⇒ bowed-out PPF.' },
        { label: 'b', prompt: 'Show an impossible point and a feasible but inefficient point.', solution: 'Any point **outside** the frontier is impossible; any point **inside** is feasible but inefficient (idle or misused resources).' },
        { label: 'c', prompt: 'Where might the Hawks and the Doves choose?', solution: 'Both choose points **on** the frontier: Hawks near the guns axis (many guns, little butter), Doves near the butter axis.' },
        { label: 'd', prompt: 'Both parties cut guns by the same amount. Who gets the bigger "peace dividend" in butter?', solution: 'The **Hawks**. Their point lies where the PPF is steep in guns — the opportunity cost of guns in butter is high — so giving up guns frees many resources that are productive in butter.' },
      ] },
    { id: 'c2p3', title: 'Ch. 2, P3 — Environment vs industrial output', source: 'ProblemSets/Chapter 1&2.pdf', models: ['ppf'], intro: 'Use a PPF to illustrate society’s trade-off between a clean environment and industrial output.',
      parts: [
        { label: 'a', prompt: 'What determines the shape and position of the frontier?', solution: 'Its **position** depends on available resources and technology (including pollution-control technology); its **shape** (bowed out) on how specialised resources are in the two "goods".' },
        { label: 'b', prompt: 'What happens if engineers develop a new way of producing electricity that emits fewer pollutants?', solution: 'For any level of industrial output society can now have a cleaner environment: the frontier **shifts outward** (rotates out along the environment axis), allowing more of both.' },
      ] },
    { id: 'c2p4', title: 'Ch. 2, P4 — Larry, Moe and Curly', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Each works 10 hours a day. Per hour: Larry mows 1 lawn or washes 1 car; Moe mows 1 lawn or washes 2 cars; Curly mows 2 lawns or washes 1 car.',
      parts: [
        { label: 'a1', prompt: '(A) All three mow all the time. How many lawns?', solution: '10 + 10 + 20 = **40 lawns**, 0 cars.', check: { answer: 40, unit: 'lawns' } },
        { label: 'a2', prompt: '(B) All three wash cars all the time. How many cars?', solution: '10 + 20 + 10 = **40 cars**.', check: { answer: 40, unit: 'cars' } },
        { label: 'a3', prompt: '(C) All spend half their time on each. How many lawns (= cars)?', solution: 'Lawns 5 + 5 + 10 = **20**; cars 5 + 10 + 5 = 20.', check: { answer: 20 } },
        { label: 'a4', prompt: '(D) Larry half and half, Moe only washes, Curly only mows. How many lawns (= cars)?', solution: 'Lawns 5 + 0 + 20 = **25**; cars 5 + 20 + 0 = 25.', check: { answer: 25 } },
        { label: 'b', prompt: 'Graph the PPF and place A–D.', solution: 'Vertices: (lawns, cars) = (0, 40) → Curly mows (20, 30) → Larry mows (30, 20) → Moe mows (40, 0). A = (40, 0) and B = (0, 40) are endpoints; D = (25, 25) lies on the middle segment; C = (20, 20) lies inside.' },
        { label: 'c', prompt: 'Why does the PPF have this shape?', solution: 'The three workers have **different opportunity costs** of mowing (Curly ½ car, Larry 1 car, Moe 2 cars per lawn). Efficient production assigns mowing to the lowest-cost worker first, so the slope (OC) rises as more lawns are mowed: a kinked, bowed-out PPF.' },
        { label: 'd', prompt: 'Are any allocations inefficient?', solution: '**C** is inefficient: everyone splits time, so Curly washes cars and Moe mows lawns — tasks they are relatively bad at. Reallocating (as in D) yields more of both.' },
      ] },
    { id: 'c2p6', title: 'Ch. 2, P6 — Positive or normative?', source: 'ProblemSets/Chapter 1&2.pdf', intro: 'Classify each statement.',
      parts: [
        { label: 'a', prompt: 'Society faces a short-run trade-off between inflation and unemployment.', solution: '**Positive** — a testable description.' },
        { label: 'b', prompt: 'A reduction in the growth rate of money will reduce inflation.', solution: '**Positive** — a cause-and-effect claim.' },
        { label: 'c', prompt: 'The Federal Reserve should reduce the growth rate of money.', solution: '**Normative** — "should".' },
        { label: 'd', prompt: 'Society ought to require welfare recipients to look for jobs.', solution: '**Normative** — "ought to".' },
        { label: 'e', prompt: 'Lower tax rates encourage more work and more saving.', solution: '**Positive** — testable with evidence.' },
      ] },
  ],
};
export default ps;
