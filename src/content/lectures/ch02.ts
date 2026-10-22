import type { Lecture } from '../../types/content';

const ch02: Lecture = {
  id: 'ch02',
  number: 2,
  title: 'Thinking Like an Economist',
  subtitle: 'Economics as a science: models, the circular flow, the production possibilities frontier, positive vs normative claims, and reading graphs.',
  estMinutes: 50,
  color: '#0891b2',
  objectives: [
    'Describe how economists use the **scientific method**, assumptions, models and **natural experiments**.',
    'Explain the **circular-flow diagram**: who buys and sells in goods markets and factor markets.',
    'Use a **PPF** to show efficiency, inefficiency, unattainable points, trade-offs, **opportunity cost** and growth.',
    'Explain why a PPF is usually **bowed outward** (increasing opportunity cost).',
    'Classify statements as **positive** or **normative**; explain why economists disagree.',
    'Read graphs: slope, movements vs shifts, **omitted variables** and **reverse causality**.',
  ],
  keywords: ['scientific method', 'circular flow', 'PPF', 'opportunity cost', 'positive vs normative', 'graphs'],
  models: ['ppf'],
  problemSets: ['ps-ch01-02'],
  prerequisites: ['ch01'],
  sections: [
    {
      id: 'scientist', title: 'The economist as a scientist', kind: 'intro',
      blocks: [
        { type: 'p', text: `Economists devise theories, collect data, analyse the data and try to verify or refute their theories — the **scientific method**: the dispassionate development and testing of theories about how the world works (observation → theory → more observation).` },
        { type: 'p', text: `Laboratory experiments are often impractical in economics (we cannot randomly assign countries their institutions). Economists therefore look for **natural experiments** offered by history. The lecture's examples: how schooling affects labour-market outcomes, the effect of institutions on growth, whether police reduce crime, whether democracy causes growth.` },
        { type: 'callout', tone: 'example', title: 'Acemoglu, Johnson & Robinson (2024 Nobel Prize)', text: `"The Colonial Origins of Comparative Development": where European settlers faced high mortality they did not settle and set up **extractive institutions**, which persisted. Using settler mortality as an *instrument* for today's institutions, the authors estimate large effects of institutions on income per capita.` },
        { type: 'h', text: 'Assumptions and models' },
        { type: 'p', text: `**Assumptions** simplify a complex world and make it easier to understand. The art of scientific thinking is choosing which assumptions to make — different questions, and short-run vs long-run analysis, call for different assumptions. **Economic models** (diagrams and equations) are built on assumptions, omit many details, and let us see what is truly important.` },
      ],
    },
    {
      id: 'circular-flow', title: 'Model 1: the circular-flow diagram', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Circular-flow diagram', conceptId: 'circular-flow', text: `A visual model of the economy showing how dollars flow through markets among **households** and **firms**.` },
        { type: 'figure', figure: {
          xDomain: [0, 10], yDomain: [0, 10], xLabel: '', yLabel: '', xTicks: [], yTicks: [], height: 380, hideAxes: true,
          curves: [
            { kind: 'line', from: [3.2, 8.6], to: [6.8, 8.6], color: 'var(--c-supply)', label: 'goods & services sold →', labelAt: [3.4, 9.1] },
            { kind: 'line', from: [6.8, 1.4], to: [3.2, 1.4], color: 'var(--c-supply)', label: '← labour, land, capital', labelAt: [3.4, 0.7] },
            { kind: 'line', from: [3.2, 7.4], to: [6.8, 7.4], color: 'var(--c-demand)', dashed: true, label: '← revenue (= spending)', labelAt: [3.4, 6.8] },
            { kind: 'line', from: [6.8, 2.6], to: [3.2, 2.6], color: 'var(--c-demand)', dashed: true, label: 'wages, rent, profit →', labelAt: [3.4, 3.1] },
          ],
          labels: [
            { x: 1.5, y: 5, text: 'FIRMS' }, { x: 8.5, y: 5, text: 'HOUSEHOLDS' },
            { x: 5, y: 8, text: 'Markets for goods & services', color: 'var(--accent)' },
            { x: 5, y: 2, text: 'Markets for factors of production', color: 'var(--accent)' },
          ],
        }, caption: 'Solid arrows: flows of goods/services and inputs. Dashed arrows: the opposite flows of dollars. (In goods markets firms sell and households buy; in factor markets households sell and firms buy.)' },
        { type: 'list', items: [
          '**Firms** produce goods and services using factors of production (labour, land, capital).',
          '**Households** own the factors of production and consume goods and services.',
          'In **markets for goods and services** firms are sellers and households are buyers.',
          'In **markets for factors of production** households are sellers and firms are buyers.',
        ] },
      ],
    },
    {
      id: 'ppf', title: 'Model 2: the production possibilities frontier', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Production possibilities frontier (PPF)', conceptId: 'ppf', text: `A graph showing the combinations of output that the economy can possibly produce, **given the available factors of production and technology**.` },
        { type: 'list', items: [
          '**On** the frontier: **efficient** — the economy gets all it can from its scarce resources. The only way to get more of one good is to produce less of the other (a trade-off): moving from A to B gives up 200 computers to make 100 more cars.',
          '**Inside** the frontier: **inefficient** — resources are idle or misallocated (e.g. unemployment); more of both goods is possible.',
          '**Outside** the frontier: **not feasible** with current resources and technology.',
        ] },
        { type: 'p', text: `The **slope** of the PPF measures the opportunity cost of one good in terms of the other. On a **bowed-outward** PPF this cost varies: a car is expensive (in computers) when the economy already makes many cars, and cheap when it makes few — because resources are **specialised**: the workers and machines best at cars are used for cars first.` },
        { type: 'p', text: `**Technological advance** (say, in computers) shifts the PPF outward: **economic growth**. The economy can then produce more of *both* goods — moving from point A to point G in course Figure 3, even though the improvement was only in computers.` },
      ],
    },
    {
      id: 'ppf-math', title: 'The PPF in numbers', kind: 'math',
      blocks: [
        { type: 'p', text: `Write the frontier as the maximum output of $Y$ for each output of $X$: $Y = f(X)$. The opportunity cost of one more unit of $X$ is how much $Y$ falls:` },
        { type: 'math', tex: '\\text{OC of } X \\;=\\; \\left| \\frac{\\Delta Y}{\\Delta X} \\right| \\;=\\; |\\text{slope of the PPF}|' },
        { type: 'p', text: `**Straight-line PPF** (constant opportunity cost): $Y = Y_{\\max}\\,(1 - X/X_{\\max})$, so the OC of $X$ is $Y_{\\max}/X_{\\max}$ everywhere. Peru (Q13) can make 8 lb of peanuts or 240 lb of cashews: $C = 240 - 30P$, one pound of peanuts always costs 30 lb of cashews.` },
        { type: 'p', text: `**Bowed-out PPF** (increasing opportunity cost): the slope gets steeper as $X$ rises. In the Lab we use $Y = Y_{\\max}\\,(1 - (X/X_{\\max})^k)^{1/k}$; $k = 1$ is a straight line and larger $k$ bows it out more.` },
        { type: 'p', text: `**Reciprocity.** If one car costs $x$ trucks, one truck costs $1/x$ cars, so the product of the two opportunity costs is always $1$ (Q15).` },
      ],
    },
    {
      id: 'ppf-interactive', title: 'Interactive: move along the PPF', kind: 'interactive',
      blocks: [
        { type: 'p', text: `Drag the point. Watch the classification change (efficient / inefficient / unattainable), and notice how the purple step — the computers given up for 100 more cars — grows as you move right. Then raise productivity in computers only: the frontier still lets you have more cars too.` },
        { type: 'model', model: 'ppf' },
      ],
    },
    {
      id: 'ppf-example', title: 'Worked example: Larry, Moe and Curly', kind: 'example',
      blocks: [
        { type: 'example', title: 'Problem set Ch. 2, P4', problem: `Three workers each work 10 hours a day. In an hour, Larry can mow 1 lawn or wash 1 car; Moe can mow 1 lawn or wash 2 cars; Curly can mow 2 lawns or wash 1 car. Compute output for: (A) all mow; (B) all wash; (C) all spend half their time on each; (D) Larry half and half, Moe only washes, Curly only mows. Which allocations are inefficient?`, steps: [
          'A: lawns = 10·1 + 10·1 + 10·2 = **40**, cars = 0. B: lawns 0, cars = 10 + 20 + 10 = **40**.',
          'C: each spends 5 hours on each task: lawns = 5 + 5 + 10 = **20**, cars = 5 + 10 + 5 = **20**.',
          'D: Larry 5 lawns + 5 cars, Moe 20 cars, Curly 20 lawns ⇒ **25 lawns, 25 cars**.',
          'Build the frontier: start from B (0, 40). Move the worker with the lowest OC of lawns into mowing first — Curly gives up 1 car per 2 lawns ⇒ (20, 30). Then Larry (1 car per lawn) ⇒ (30, 20). Last Moe (2 cars per lawn) ⇒ (40, 0). The PPF is **kinked and bowed out** because workers differ.',
          'D = (25, 25) lies on the Larry segment from (20, 30) to (30, 20) where lawns + cars = 50 ⇒ **efficient**. C = (20, 20) is inside the frontier ⇒ **inefficient** (everyone is doing tasks they are relatively bad at half the time).',
        ], answer: 'A (40, 0), B (0, 40), C (20, 20) inefficient, D (25, 25) efficient. The PPF bows out because opportunity costs differ across workers.' },
        { type: 'example', title: 'Guns and butter: the peace dividend (PS Ch. 2, P2d)', problem: `Hawks choose a point with many guns, Doves a point with few guns. Both cut guns by the same amount. Who gets the bigger increase in butter?`, steps: [
          'On a bowed-out PPF, the opportunity cost of guns (in butter) is **highest** where many guns are produced.',
          'Cutting guns at the Hawks’ point frees resources that are very productive in butter ⇒ a large butter gain.',
          'At the Doves’ point the same cut yields less butter.',
        ], answer: 'The **Hawks** get the bigger peace dividend. Try it in the Lab: Guns & butter preset.' },
      ],
    },
    {
      id: 'policy', title: 'The economist as policy adviser', kind: 'interpretation',
      blocks: [
        { type: 'compare', left: { title: 'Positive statements — descriptive', items: ['Describe the world **as it is**', 'Can be confirmed or refuted with evidence', '"Minimum-wage laws cause unemployment."'] }, right: { title: 'Normative statements — prescriptive', items: ['Prescribe how the world **should be**', 'Depend on values as well as facts', '"The government should raise the minimum wage."'] } },
        { type: 'callout', tone: 'exam', text: 'Signal words: "should", "ought to", "better/worse", "fair" ⇒ normative. Cause-and-effect claims ("lower taxes encourage more work") are **positive** even if they are wrong.' },
        { type: 'p', text: `Economists' advice is not always followed: communication, press, legislative and political advisers weigh in, and in an autocracy the ruler's personal interests and legitimacy matter too.` },
        { type: 'h', text: 'Why economists disagree' },
        { type: 'list', items: [
          '**Different scientific judgements:** different hunches about the validity of alternative theories or the size of key parameters (e.g. how elastic is labour supply?).',
          '**Different values:** Peter (income $100,000) and Paula ($20,000) take the same water from the town well; Peter pays $10,000 tax (10%) and Paula $4,000 (20%). Is that fair? Normative views differ.',
          '**Perception vs reality:** on many issues economists largely agree (93% agree rent ceilings reduce the quantity and quality of housing; 93% that tariffs and quotas usually reduce welfare; 79% that minimum wages raise unemployment among young and unskilled workers) yet policies persist.',
        ] },
      ],
    },
    {
      id: 'graphs', title: 'Appendix: graphing review', kind: 'math',
      blocks: [
        { type: 'p', text: 'Single-variable graphs: pie charts, bar graphs, time-series graphs. Two-variable graphs use the coordinate system (ordered pairs, scatterplots).' },
        { type: 'p', text: `**Slope** = rise over run: $\\text{slope} = \\Delta y / \\Delta x$. Emma's demand curve for novels moves from (21 novels, $6) to (13 novels, $8): slope $= (8-6)/(13-21) = -1/4$. A flat line has a slope near zero, a steep line a large slope; a downward-sloping line a negative slope; horizontal = zero; vertical = infinite.` },
        { type: 'p', text: `**Movement along vs shift.** Emma's demand curve plots price against quantity *holding income constant*. A change in price moves her **along** the curve. A change in income (from $40,000 to $50,000) **shifts** the whole curve right (D₁ → D₂); a fall to $30,000 shifts it left (D₃).` },
        { type: 'table', table: { caption: 'Novels purchased by Emma (excerpt): at $10 per novel', headers: ['Income', '$30,000', '$40,000', '$50,000'], rows: [['Novels at $10', 2, 5, 8], ['Demand curve', 'D₃', 'D₁', 'D₂']] } },
        { type: 'h', text: 'Cause and effect pitfalls' },
        { type: 'list', items: [
          '**Omitted variable:** households with more cigarette lighters have more cancer — but the number of cigarettes smoked drives both.',
          '**Reverse causality:** cities with more police have more crime — but crime-plagued cities may hire more police.',
        ] },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Calling any point under the PPF "unattainable".', right: 'Inside = attainable but **inefficient**; only points **outside** are unattainable.' },
          { wrong: 'Saying a technological advance in one good only increases that good.', right: 'The PPF shifts out; the economy can then have more of **both** goods.' },
          { wrong: 'Reading "opportunity cost" as the slope’s sign or the vertical intercept.', right: 'OC of X = |ΔY/ΔX| — the absolute slope at that point.' },
          { wrong: 'Classifying "Lower tax rates encourage more work" as normative.', right: 'It is a testable cause-and-effect claim ⇒ **positive**.' },
          { wrong: 'Inferring causation from a correlation in a graph.', right: 'Check for omitted variables and reverse causality.' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'An economy is at a point inside its PPF. Which statement is correct?', options: ['It must give up one good to get more of the other', 'It can produce more of both goods with existing resources', 'The point cannot be produced', 'Its opportunity cost of both goods is zero forever'], answer: 1, explanation: 'Inside the frontier resources are idle or misused, so more of **both** is possible without any trade-off.' } },
        { type: 'check', question: { prompt: '"The Federal Reserve should reduce the growth rate of the money supply." This statement is…', options: ['positive', 'normative', 'both', 'neither'], answer: 1, explanation: '"Should" prescribes a policy ⇒ **normative** (problem set Ch. 2, P6c).' } },
        { type: 'check', question: { prompt: 'Why is a PPF typically bowed outward?', options: ['Because resources are equally good at producing both goods', 'Because of technological progress', 'Because resources are specialised, so the opportunity cost of a good rises as more of it is produced', 'Because the economy is inefficient'], answer: 2, explanation: 'Increasing opportunity cost from **specialised** resources gives the concave shape.' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq13', 'pq15'] },
        { type: 'p', text: 'Then try [Problem set Ch. 1 & 2](#/practice/problems/ps-ch01-02), Chapter 2 problems 2, 3, 4 and 6.' },
      ],
    },
  ],
  recap: [
    'Economists use the **scientific method**; when experiments are impossible they exploit **natural experiments**.',
    'Models simplify with **assumptions**; the **circular flow** links households and firms through goods and factor markets.',
    'The **PPF** shows feasible output: on = efficient, inside = inefficient, outside = unattainable.',
    'The PPF slope is the **opportunity cost**; a bowed-out PPF means **increasing** opportunity cost; growth shifts it out.',
    '**Positive** = what is (testable); **normative** = what should be (values). Economists disagree about both.',
    'Graphs: slope = rise/run; price changes move **along** a curve, other variables **shift** it; beware omitted variables and reverse causality.',
  ],
};

export default ch02;
