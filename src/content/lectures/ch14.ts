import type { Lecture } from '../../types/content';

const ch14: Lecture = {
  id: 'ch14',
  number: 14,
  title: 'The Costs of Production',
  subtitle: 'Opportunity costs inside the firm, the production function, and the family of cost curves that drives every supply decision.',
  estMinutes: 65,
  color: '#b45309',
  objectives: [
    'Distinguish **explicit** and **implicit** costs, and **economic** vs **accounting** profit.',
    'Derive **marginal product** from a production function and explain **diminishing marginal product**.',
    'Link diminishing MP to a **steepening total-cost curve** and rising marginal cost.',
    'Compute FC, VC, TC, AFC, AVC, ATC and MC from a table.',
    'Explain why ATC is U-shaped and why **MC crosses ATC at its minimum** (efficient scale).',
    'Explain how taxes shift cost curves, and short-run vs long-run costs (economies of scale).',
  ],
  keywords: ['explicit vs implicit costs', 'economic profit', 'production function', 'marginal product', 'marginal cost', 'average total cost', 'efficient scale', 'economies of scale'],
  models: ['production', 'cost-curves'],
  problemSets: ['ps-ch14', 'ps-sp-ch14'],
  prerequisites: ['ch01', 'ch07'],
  sections: [
    {
      id: 'costs', title: 'What are costs?', kind: 'intro',
      blocks: [
        { type: 'p', text: '**Industrial organisation** studies how firms’ decisions about prices and quantities depend on the market conditions they face. Our assumption: the goal of a firm is to **maximise profit**.' },
        { type: 'math', tex: '\\text{Profit} = \\text{Total revenue} - \\text{Total cost}, \\qquad TR = P \\times Q' },
        { type: 'p', text: '**Total cost** is the market value of the inputs a firm uses — and, following Principle 2, it includes **all opportunity costs** of making the output.' },
        { type: 'compare', left: { title: 'Explicit costs', items: ['Input costs that require an **outlay of money** by the firm', 'Wages paid, supplies, interest on loans'] }, right: { title: 'Implicit costs', items: ['Input costs that **do not** require an outlay of money', 'The owner’s forgone salary; forgone interest on the owner’s own capital invested in the business', 'Ignored by accountants'] } },
        { type: 'definition', term: 'Economic vs accounting profit', conceptId: 'economic-profit', text: '**Economic profit** = TR − (explicit + implicit costs). **Accounting profit** = TR − explicit costs, usually larger.' },
        { type: 'example', title: "Walter's painting business (lecture)", problem: 'Walter quits a $40,000 teaching job to start a painting business. He withdraws $20,000 from savings that paid 3% interest and borrows $30,000 from his uncle at 3%. Supplies cost $25,000; revenue is $60,000. Compute his costs and profits.', steps: [
          'Explicit costs: interest paid to the uncle 3% × $30,000 = $900, plus supplies $25,000 ⇒ **$25,900**.',
          'Implicit costs: forgone salary $40,000 + forgone interest 3% × $20,000 = $600 ⇒ **$40,600**.',
          'Total (economic) cost = $66,500.',
          'Economic profit = 60,000 − 66,500 = **−$6,500**; accounting profit = 60,000 − 25,900 = **$34,100**.',
        ], answer: 'Walter makes an accounting profit but an economic **loss** — he would be better off teaching.' },
        { type: 'callout', tone: 'warning', text: 'The interest Walter **pays** his uncle is explicit; the interest he **forgoes** on his own savings is implicit. Both are costs of financial capital.' },
      ],
    },
    {
      id: 'production', title: 'Production and costs', kind: 'definitions',
      blocks: [
        { type: 'definition', term: 'Production function', conceptId: 'production-function', text: 'The relationship between the quantity of inputs used to make a good and the quantity of output. It gets **flatter** as production rises.' },
        { type: 'definition', term: 'Marginal product', conceptId: 'marginal-product', text: 'The increase in output from one additional unit of input — the slope of the production function (with one input, the first derivative).' },
        { type: 'definition', term: 'Diminishing marginal product', conceptId: 'diminishing-mp', text: 'The marginal product of an input declines as the quantity of the input increases (more workers crowd a fixed factory).' },
        { type: 'table', table: { caption: "Course Table 1: Caroline's Cookie Factory (factory $30/hour, workers $10/hour)", headers: ['Workers', 'Output (cookies/hour)', 'Marginal product', 'Cost of factory', 'Cost of workers', 'Total cost'], rows: [
          [0, 0, '—', '$30', '$0', '$30'], [1, 50, 50, '$30', '$10', '$40'], [2, 90, 40, '$30', '$20', '$50'], [3, 120, 30, '$30', '$30', '$60'], [4, 140, 20, '$30', '$40', '$70'], [5, 150, 10, '$30', '$50', '$80'], [6, 155, 5, '$30', '$60', '$90'],
        ] } },
        { type: 'p', text: '**The total-cost curve** plots total cost against **output**. It gets **steeper** as output rises: because each extra worker adds less output, producing one more cookie requires more and more labour. **Diminishing marginal product (in inputs) ⇔ increasing marginal cost (in output).** Formally, with one variable input costing $w$:' },
        { type: 'math', tex: 'MC = \\frac{\\Delta TC}{\\Delta Q} = \\frac{w \\cdot \\Delta L}{\\Delta Q} = \\frac{w}{MP_L}' },
        { type: 'model', model: 'production' },
      ],
    },
    {
      id: 'measures', title: 'The various measures of cost', kind: 'math',
      blocks: [
        { type: 'table', table: { caption: 'Course Table 3: the many types of cost', headers: ['Term', 'Definition', 'Formula'], rows: [
          ['Explicit costs', 'Costs requiring an outlay of money', '—'], ['Implicit costs', 'Costs not requiring an outlay of money', '—'],
          ['Fixed costs', 'Do not vary with the quantity of output', '$FC$'], ['Variable costs', 'Vary with the quantity of output', '$VC$'],
          ['Total cost', 'Market value of all inputs', '$TC = FC + VC$'],
          ['Average fixed cost', 'Fixed cost per unit', '$AFC = FC/Q$'], ['Average variable cost', 'Variable cost per unit', '$AVC = VC/Q$'],
          ['Average total cost', 'Total cost per unit (a "typical" unit)', '$ATC = TC/Q = AFC + AVC$'],
          ['Marginal cost', 'Increase in TC from one extra unit', '$MC = \\Delta TC/\\Delta Q$'],
        ] } },
        { type: 'p', text: 'Marginal cost is the derivative of the total-cost curve — and also of the variable-cost curve, since fixed cost does not change with output.' },
        { type: 'table', table: { caption: "Course Table 2: Conrad's Coffee Shop (cups per hour)", headers: ['Q', 'TC', 'FC', 'VC', 'AFC', 'AVC', 'ATC', 'MC'], rows: [
          [0, '$3.00', '$3.00', '$0.00', '—', '—', '—', ''], [1, '3.30', '3.00', '0.30', '3.00', '0.30', '3.30', '0.30'], [2, '3.80', '3.00', '0.80', '1.50', '0.40', '1.90', '0.50'], [3, '4.50', '3.00', '1.50', '1.00', '0.50', '1.50', '0.70'], [4, '5.40', '3.00', '2.40', '0.75', '0.60', '1.35', '0.90'], [5, '6.50', '3.00', '3.50', '0.60', '0.70', '1.30', '1.10'], [6, '7.80', '3.00', '4.80', '0.50', '0.80', '1.30', '1.30'], [7, '9.30', '3.00', '6.30', '0.43', '0.90', '1.33', '1.50'], [8, '11.00', '3.00', '8.00', '0.38', '1.00', '1.38', '1.70'], [9, '12.90', '3.00', '9.90', '0.33', '1.10', '1.43', '1.90'], [10, '15.00', '3.00', '12.00', '0.30', '1.20', '1.50', '2.10'],
        ] } },
        { type: 'callout', tone: 'intuition', text: 'Conrad’s total cost is exactly $TC = 3 + 0.2Q + 0.1Q^2$. Check: at Q = 4, 3 + 0.8 + 1.6 = 5.40 ✓. ATC is lowest (≈ $1.30) between 5 and 6 cups — where MC rises through ATC.' },
      ],
    },
    {
      id: 'shapes', title: 'The shapes of the cost curves', kind: 'interpretation',
      blocks: [
        { type: 'list', items: [
          '**Rising marginal cost** — because of diminishing marginal product.',
          '**U-shaped average total cost**: ATC = AVC + AFC. AFC always declines as output rises (fixed cost spread over more units); AVC typically rises. At low output the falling AFC dominates, at high output the rising AVC dominates.',
          'The bottom of the U is the **efficient scale**: the quantity that minimises ATC.',
        ] },
        { type: 'definition', term: 'MC–ATC relationship', conceptId: 'mc-atc', text: 'When **MC < ATC**, ATC is **falling**; when **MC > ATC**, ATC is **rising**. Therefore the MC curve crosses the ATC curve **at its minimum** (the same holds for AVC).' },
        { type: 'callout', tone: 'intuition', text: 'Grades analogy: if your next exam score (marginal) is below your average, your average falls; if it is above, the average rises. The average stops falling exactly when the marginal equals it.' },
        { type: 'p', text: '**Typical firms** experience increasing marginal product before diminishing marginal product (the first few workers can specialise). Then MC and AVC **fall for a while before rising** (course Figure 5) — the shape used in the interactive model below.' },
        { type: 'model', model: 'cost-curves' },
        { type: 'callout', tone: 'exam', title: 'Taxes and cost curves (lecture question & PS Ch. 14, P8)', text: ['A **per-unit tax** of t shifts **MC, AVC and ATC up by t**; AFC is unchanged.', 'A **lump-sum** tax raises fixed cost: **AFC and ATC** shift up (by tax/Q, a shrinking amount), while **MC and AVC are unchanged**.'] },
      ],
    },
    {
      id: 'long-run', title: 'Costs in the short run and the long run', kind: 'application',
      blocks: [
        { type: 'p', text: 'Many decisions are fixed in the short run but variable in the long run (factory size, exit). Firms have more flexibility in the long run, so **long-run cost curves are much flatter**, and short-run ATC curves lie **on or above** the long-run ATC curve (each SR curve corresponds to one factory size).' },
        { type: 'list', items: [
          '**Economies of scale**: LRATC falls as output increases — increasing specialisation among workers.',
          '**Constant returns to scale**: LRATC stays the same as output changes.',
          '**Diseconomies of scale**: LRATC rises as output increases — coordination problems in large organisations.',
        ] },
      ],
    },
    {
      id: 'examples', title: 'Worked examples from the problem sets', kind: 'example',
      blocks: [
        { type: 'example', title: 'Nimbus, Inc. (PS Ch. 14, P4)', problem: 'Workers 0–7 produce 0, 20, 50, 90, 120, 140, 150, 155 brooms. A worker costs $100 a day; fixed costs are $200. Fill in MP, TC, ATC and MC; explain the patterns.', steps: [
          'MP = 20, 30, 40, 30, 20, 10, 5 — **rising, then diminishing** marginal product.',
          'TC = 200 + 100 × workers = 200, 300, 400, 500, 600, 700, 800, 900.',
          'ATC = TC/Q: —, 15.00, 8.00, 5.56, 5.00, 5.00, 5.33, 5.81 — U-shaped.',
          'MC = $100 / MP: 5.00, 3.33, 2.50, 3.33, 5.00, 10.00, 20.00 — falls while MP rises, then rises as MP diminishes (MC and MP are mirror images).',
          'MC < ATC while ATC falls (up to ~120 brooms) and MC > ATC after: MC crosses ATC at its minimum.',
        ], answer: 'MP rises then falls; MC falls then rises; ATC is U-shaped with its minimum (≈ $5) where MC crosses it.' },
        { type: 'example', title: 'Gaming consoles (Self-practice Ch. 14, P5)', problem: 'ATC is $300 at 600 consoles and $301 at 601. All 600 are sold; a caller offers $550 for one more. Accept?', steps: [
          'TC(600) = 600 × 300 = $180,000; TC(601) = 601 × 301 = $180,901.',
          'Marginal cost of the 601st console = **$901**.',
          'Offer $550 < MC $901 ⇒ selling it lowers profit by $351.',
        ], answer: '**Reject.** A tiny rise in ATC can hide a large marginal cost — always use MC, not ATC.' },
        { type: 'example', title: 'Vinnie’s painting (PS Ch. 14, P7)', problem: 'Fixed cost $200; variable costs for 1–7 houses: $10, 20, 40, 80, 160, 320, 640. Find AFC, AVC, ATC and the efficient scale.', steps: [
          'AFC = 200/Q: 200, 100, 66.7, 50, 40, 33.3, 28.6.',
          'AVC = VC/Q: 10, 10, 13.3, 20, 32, 53.3, 91.4.',
          'ATC = AFC + AVC: 210, 110, 80, **70**, 72, 86.7, 120.',
        ], answer: 'Efficient scale: **4 houses** (minimum ATC $70).' },
      ],
    },
    {
      id: 'mistakes', title: 'Common mistakes', kind: 'mistakes',
      blocks: [
        { type: 'mistakes', items: [
          { wrong: 'Leaving forgone salary or forgone interest out of costs.', right: 'Economic costs include **implicit** costs; accounting profit ignores them.' },
          { wrong: 'Computing MC as TC/Q.', right: 'That is ATC. MC = **ΔTC/ΔQ** — the change from the previous row.' },
          { wrong: 'Letting fixed cost affect marginal cost (Q35: "FC is $3, so produce less").', right: 'FC does not change with Q, so it never affects MC or the profit-maximising quantity.' },
          { wrong: 'Thinking MC crosses ATC wherever ATC is falling.', right: 'MC crosses ATC (and AVC) **at their minimum points**.' },
          { wrong: 'Shifting MC after a lump-sum tax.', right: 'A lump-sum tax shifts only AFC and ATC; a **per-unit** tax shifts MC, AVC and ATC.' },
        ] },
      ],
    },
    {
      id: 'check', title: 'Concept checks', kind: 'check',
      blocks: [
        { type: 'check', question: { prompt: 'A pizzeria’s total cost is $300 at 0 dozen pizzas and $350 at 1 dozen; its variable cost at 1 dozen is $50. What is the fixed cost, and is MC from TC the same as MC from VC?', options: ['$300; yes', '$350; yes', '$300; no', '$50; no'], answer: 0, explanation: 'FC = TC at Q = 0 = **$300**. MC from TC and from VC are identical because FC does not change with output (Self-practice Ch. 14, P6).' } },
        { type: 'check', question: { prompt: 'At the current output MC = $8 and ATC = $10. If the firm produces one more unit, ATC will…', options: ['rise', 'fall', 'stay the same', 'equal MC'], answer: 1, explanation: 'MC < ATC ⇒ the extra unit pulls the average **down**.' } },
        { type: 'check', question: { prompt: 'A fisherman’s catch for 0–5 hours is 0, 10, 18, 24, 28, 30 lb. His marginal product of the 4th hour is…', options: ['28 lb', '7 lb', '4 lb', '2 lb'], answer: 2, explanation: 'MP of the 4th hour = 28 − 24 = **4 lb** — diminishing marginal product (Self-practice Ch. 14, P3).' } },
      ],
    },
    {
      id: 'practice', title: 'Exam practice', kind: 'practice',
      blocks: [
        { type: 'questions', ids: ['pq04', 'pq35'] },
        { type: 'p', text: 'Then work through [Problem set Ch. 14](#/practice/problems/ps-ch14) and [Self-practice Ch. 14](#/practice/problems/ps-sp-ch14).' },
      ],
    },
  ],
  recap: [
    'Total cost includes **explicit and implicit** opportunity costs ⇒ economic profit ≤ accounting profit.',
    '**Diminishing marginal product** makes the production function flatter and the total-cost curve steeper: $MC = w/MP$.',
    'TC = FC + VC; AFC = FC/Q falls; AVC eventually rises; ATC = AFC + AVC is **U-shaped**.',
    'MC < ATC ⇒ ATC falls; MC > ATC ⇒ ATC rises; **MC crosses ATC at its minimum** — the efficient scale.',
    'A per-unit tax shifts MC, AVC and ATC up; a lump-sum tax shifts only AFC and ATC.',
    'Long-run ATC is flatter; economies, constant returns and diseconomies of scale describe its shape.',
  ],
};

export default ch14;
