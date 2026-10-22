/**
 * Concept glossary and formula sheet. Concepts double as flashcards.
 * Definitions follow the wording of the lecture slides (Mankiw).
 */
export interface Concept {
  id: string;
  term: string;
  definition: string;
  lecture: string;
  /** Optional example or exam hint. */
  note?: string;
  model?: string;
}

export interface Formula {
  id: string;
  name: string;
  tex: string;
  explanation: string;
  lecture: string;
  model?: string;
}

export const CONCEPTS: Concept[] = [
  // Ch 1
  { id: 'scarcity', term: 'Scarcity', lecture: 'ch01', definition: "Society's resources are insufficient to satisfy everyone's wants — availability *and* wants together." },
  { id: 'economics', term: 'Economics', lecture: 'ch01', definition: 'The study of how society manages its scarce resources: choices of people under constraints, assuming they maximise.' },
  { id: 'efficiency', term: 'Efficiency', lecture: 'ch01', definition: 'Society gets the most it can from its scarce resources (the size of the economic pie). In Ch. 7: maximising total surplus.' },
  { id: 'equality', term: 'Equality', lecture: 'ch01', definition: "Prosperity is distributed uniformly among society's members (how the pie is sliced)." },
  { id: 'opportunity-cost', term: 'Opportunity cost', lecture: 'ch01', model: 'opportunity-cost', definition: 'Whatever must be given up to obtain an item: the value of the **best** forgone alternative. It is forward-looking — sunk costs are not part of it.', note: 'Anne: OC(concert) = $150 ticket + max(net value of movie $70, party $90) = $240.' },
  { id: 'sunk-cost', term: 'Sunk cost', lecture: 'ch01', definition: 'A cost already incurred that cannot be recovered. It should not affect decisions ("lost movie ticket", the $10,000 already spent on repairs).' },
  { id: 'rational', term: 'Rational people', lecture: 'ch01', definition: 'Systematically and purposefully do the best they can to achieve their objectives, given the opportunities they have.' },
  { id: 'marginal-change', term: 'Marginal change', lecture: 'ch01', definition: 'A small incremental adjustment to a plan. Rational people act if and only if marginal benefit ≥ marginal cost.' },
  { id: 'incentive', term: 'Incentive', lecture: 'ch01', definition: 'Something (a prospect of reward or punishment) that induces a person to act. Rational people respond to incentives.' },
  { id: 'market', term: 'Market', lecture: 'ch04', definition: 'A group of buyers and sellers of a particular good or service (need not be in one location).' },
  { id: 'market-economy', term: 'Market economy', lecture: 'ch01', definition: 'An economy that allocates resources through the decentralised decisions of many firms and households as they interact in markets.' },
  { id: 'invisible-hand', term: 'Invisible hand', lecture: 'ch01', definition: "Adam Smith's insight: through prices, self-interested households and firms are guided to outcomes that in many cases maximise society's well-being." },
  { id: 'property-rights', term: 'Property rights', lecture: 'ch01', definition: 'The ability of an individual to own and exercise control over scarce resources; enforcing them is a key government role.' },
  { id: 'market-failure', term: 'Market failure', lecture: 'ch01', definition: 'A situation in which a market left on its own fails to allocate resources efficiently — e.g. externalities, market power.' },
  { id: 'externality', term: 'Externality', lecture: 'ch01', definition: 'The impact of one person’s actions (production or consumption) on the well-being of a bystander, e.g. pollution.' },
  { id: 'market-power', term: 'Market power', lecture: 'ch01', definition: 'The ability of a single economic actor (or small group) to have a substantial influence on market prices, e.g. monopoly.' },
  // Ch 2
  { id: 'circular-flow', term: 'Circular-flow diagram', lecture: 'ch02', definition: 'Visual model of the economy: households and firms interact in markets for goods & services (households buy) and markets for factors of production (firms buy); money flows opposite to goods/inputs.' },
  { id: 'ppf', term: 'Production possibilities frontier (PPF)', lecture: 'ch02', model: 'ppf', definition: 'A graph showing the combinations of output the economy can possibly produce given the available factors of production and technology.', note: 'On the frontier = efficient; inside = inefficient; outside = unattainable. |slope| = opportunity cost.' },
  { id: 'bowed-ppf', term: 'Bowed-out PPF', lecture: 'ch02', model: 'ppf', definition: 'A concave PPF: the opportunity cost of a good rises as more of it is produced, because resources are specialised.' },
  { id: 'microeconomics', term: 'Microeconomics', lecture: 'ch02', definition: 'The study of how households and firms make decisions and how they interact in markets.' },
  { id: 'macroeconomics', term: 'Macroeconomics', lecture: 'ch02', definition: 'The study of economy-wide phenomena, including inflation, unemployment and economic growth.' },
  { id: 'positive', term: 'Positive statement', lecture: 'ch02', definition: 'A descriptive claim about how the world *is*; can be tested with evidence. "Minimum-wage laws cause unemployment."' },
  { id: 'normative', term: 'Normative statement', lecture: 'ch02', definition: 'A prescriptive claim about how the world *should be*; involves values. "The government should raise the minimum wage."' },
  { id: 'natural-experiment', term: 'Natural experiment', lecture: 'ch02', definition: 'A situation offered by history that mimics a controlled experiment, used because lab experiments are often impractical in economics (e.g. AJR settler mortality).' },
  { id: 'omitted-variable', term: 'Omitted variable', lecture: 'ch02', definition: 'A variable not shown in a graph that drives both plotted variables, creating a misleading apparent causation (lighters and cancer).' },
  { id: 'reverse-causality', term: 'Reverse causality', lecture: 'ch02', definition: 'Concluding A causes B when actually B causes A (police and crime).' },
  // Ch 3
  { id: 'absolute-advantage', term: 'Absolute advantage', lecture: 'ch03', model: 'trade', definition: 'The ability to produce a good using fewer inputs than another producer.' },
  { id: 'comparative-advantage', term: 'Comparative advantage', lecture: 'ch03', model: 'trade', definition: 'The ability to produce a good at a **lower opportunity cost** than another producer. One person cannot have comparative advantage in both goods (unless costs are equal).' },
  { id: 'gains-from-trade', term: 'Gains from trade', lecture: 'ch03', model: 'trade', definition: 'Specialising according to comparative advantage raises total production; trade at a price between the two opportunity costs lets everyone consume beyond their own PPF.' },
  { id: 'terms-of-trade', term: 'Price of trade', lecture: 'ch03', model: 'trade', definition: 'For both parties to gain, the price of a good must lie between the two producers’ opportunity costs of that good.' },
  { id: 'imports', term: 'Imports / exports', lecture: 'ch03', definition: 'Imports: goods produced abroad and sold domestically. Exports: goods produced domestically and sold abroad.' },
  // Ch 4
  { id: 'competitive-market', term: 'Competitive market', lecture: 'ch04', definition: 'A market with many buyers and many sellers, each with a negligible impact on the market price.' },
  { id: 'perfect-competition', term: 'Perfectly competitive market', lecture: 'ch04', definition: 'Goods offered are exactly the same and buyers and sellers are so numerous that each is a **price taker**.' },
  { id: 'monopoly', term: 'Monopoly', lecture: 'ch04', model: 'monopoly', definition: 'A market with only one seller, who sets the price.' },
  { id: 'quantity-demanded', term: 'Quantity demanded', lecture: 'ch04', definition: 'The amount of a good that buyers are willing and able to purchase (at a given price).' },
  { id: 'law-of-demand', term: 'Law of demand', lecture: 'ch04', definition: 'Other things equal, when the price of a good rises, the quantity demanded falls (and vice versa).' },
  { id: 'demand-schedule', term: 'Demand schedule / curve', lecture: 'ch04', definition: 'A table / graph of the relationship between the price of a good and the quantity demanded (price on the vertical axis).' },
  { id: 'market-demand', term: 'Market demand', lecture: 'ch04', model: 'market-demand', definition: 'The sum of all individual demands; the market demand curve adds individual curves **horizontally** (add quantities at each price).' },
  { id: 'normal-good', term: 'Normal good', lecture: 'ch04', definition: 'A good for which an increase in income leads to an increase in demand (income elasticity > 0).' },
  { id: 'inferior-good', term: 'Inferior good', lecture: 'ch04', definition: 'A good for which an increase in income leads to a decrease in demand (income elasticity < 0).' },
  { id: 'substitutes', term: 'Substitutes', lecture: 'ch04', definition: 'Two goods for which an increase in the price of one leads to an increase in the demand for the other (cross-price elasticity > 0).' },
  { id: 'complements', term: 'Complements', lecture: 'ch04', definition: 'Two goods for which an increase in the price of one leads to a decrease in the demand for the other (cross-price elasticity < 0).' },
  { id: 'law-of-supply', term: 'Law of supply', lecture: 'ch04', definition: 'Other things equal, when the price of a good rises, the quantity supplied also rises.' },
  { id: 'supply-shifters', term: 'Supply shifters', lecture: 'ch04', model: 'shift-analyzer', definition: 'Input prices, technology, expectations, number of sellers. (The good’s own price only moves along the curve.)' },
  { id: 'demand-shifters', term: 'Demand shifters', lecture: 'ch04', model: 'shift-analyzer', definition: 'Income, prices of related goods, tastes, expectations, number of buyers. (The good’s own price only moves along the curve.)' },
  { id: 'equilibrium', term: 'Equilibrium', lecture: 'ch04', model: 'supply-demand', definition: 'The price at which quantity supplied equals quantity demanded (market-clearing price); supply and demand intersect.' },
  { id: 'surplus-excess', term: 'Surplus (excess supply)', lecture: 'ch04', definition: 'Quantity supplied > quantity demanded; puts downward pressure on price.' },
  { id: 'shortage', term: 'Shortage (excess demand)', lecture: 'ch04', definition: 'Quantity demanded > quantity supplied; puts upward pressure on price.' },
  { id: 'law-supply-demand', term: 'Law of supply and demand', lecture: 'ch04', definition: 'The price of any good adjusts to bring quantity supplied and quantity demanded into balance.' },
  { id: 'shift-vs-movement', term: 'Shift vs movement along', lecture: 'ch04', definition: 'A change in the good’s own price = movement along the curve (change in *quantity* demanded/supplied). A change in any other determinant = shift of the curve (change in demand/supply).' },
  // Ch 5
  { id: 'elasticity', term: 'Elasticity', lecture: 'ch05', model: 'elasticity', definition: 'A measure of the responsiveness of quantity demanded or supplied to a change in one of its determinants.' },
  { id: 'ped', term: 'Price elasticity of demand', lecture: 'ch05', model: 'elasticity', definition: 'Percentage change in quantity demanded ÷ percentage change in price (absolute value, midpoint method).' },
  { id: 'ped-determinants', term: 'Determinants of demand elasticity', lecture: 'ch05', definition: 'Close substitutes (more elastic), necessities vs luxuries (luxuries more elastic), definition of the market (narrow ⇒ more elastic), time horizon (longer ⇒ more elastic).' },
  { id: 'elastic', term: 'Elastic / inelastic / unit elastic', lecture: 'ch05', definition: 'Elastic: elasticity > 1; inelastic: < 1; unit elastic: = 1. Perfectly inelastic = 0 (vertical); perfectly elastic = ∞ (horizontal).' },
  { id: 'total-revenue', term: 'Total revenue', lecture: 'ch05', model: 'elasticity', definition: 'P × Q: the amount paid by buyers and received by sellers. Inelastic demand ⇒ P and TR move together; elastic ⇒ opposite directions; unit elastic ⇒ TR constant.' },
  { id: 'linear-demand-elasticity', term: 'Elasticity along a linear demand curve', lecture: 'ch05', model: 'elasticity', definition: 'Slope is constant but elasticity is not: elastic at high prices/low quantities, inelastic at low prices/high quantities.' },
  { id: 'income-elasticity', term: 'Income elasticity of demand', lecture: 'ch05', definition: '%ΔQd ÷ %Δincome. Normal goods > 0 (necessities 0–1, luxuries > 1); inferior goods < 0.' },
  { id: 'cross-elasticity', term: 'Cross-price elasticity of demand', lecture: 'ch05', definition: '%ΔQd of good 1 ÷ %ΔP of good 2. Substitutes > 0, complements < 0.' },
  { id: 'pes', term: 'Price elasticity of supply', lecture: 'ch05', definition: '%ΔQs ÷ %ΔP; depends on sellers’ flexibility. More elastic in the long run; often very elastic at low quantities and inelastic near capacity.' },
  // Ch 6
  { id: 'price-ceiling', term: 'Price ceiling', lecture: 'ch06', model: 'price-controls', definition: 'A legal maximum price. Binding only if set **below** equilibrium ⇒ shortage, rationing (queues, discrimination). Example: rent control.' },
  { id: 'price-floor', term: 'Price floor', lecture: 'ch06', model: 'price-controls', definition: 'A legal minimum price. Binding only if set **above** equilibrium ⇒ surplus. Example: minimum wage (surplus of labour = unemployment).' },
  { id: 'tax-incidence', term: 'Tax incidence', lecture: 'ch06', model: 'tax', definition: 'The manner in which the burden of a tax is shared among market participants. It falls more heavily on the **less elastic** side, regardless of who legally pays.' },
  { id: 'tax-wedge', term: 'Tax wedge', lecture: 'ch06', model: 'tax', definition: 'A tax places a wedge between the price buyers pay and the price sellers receive; taxes on buyers and on sellers are equivalent.' },
  { id: 'payroll-tax', term: 'Payroll tax', lecture: 'ch06', definition: 'A tax on wages. Lawmakers can split who *pays* it, but not who *bears* it — the true burden depends on the elasticities of labour supply and demand.' },
  // Ch 7
  { id: 'welfare-economics', term: 'Welfare economics', lecture: 'ch07', definition: 'The study of how the allocation of resources affects economic well-being.' },
  { id: 'wtp', term: 'Willingness to pay', lecture: 'ch07', model: 'surplus', definition: 'The maximum amount a buyer will pay for a good — how much the buyer values it. The height of the demand curve is the WTP of the marginal buyer.' },
  { id: 'consumer-surplus', term: 'Consumer surplus', lecture: 'ch07', model: 'surplus', definition: 'Willingness to pay minus the amount actually paid; the area below the demand curve and above the price.' },
  { id: 'cost-seller', term: 'Cost (of a seller)', lecture: 'ch07', definition: 'The value of everything a seller must give up to produce a good; measures willingness to sell. The height of the supply curve is the cost of the marginal seller.' },
  { id: 'producer-surplus', term: 'Producer surplus', lecture: 'ch07', model: 'surplus', definition: 'Amount received minus the seller’s cost; the area above the supply curve and below the price.' },
  { id: 'total-surplus', term: 'Total surplus', lecture: 'ch07', model: 'surplus', definition: 'CS + PS = value to buyers − cost to sellers. Maximised at the competitive equilibrium (if no market failure).' },
  { id: 'social-planner', term: 'Benevolent social planner', lecture: 'ch07', definition: 'An all-knowing, all-powerful, well-intentioned dictator who wants to maximise economic well-being — used as a benchmark to judge market outcomes.' },
  { id: 'market-efficiency', term: 'Efficiency of market equilibrium', lecture: 'ch07', definition: 'Free markets allocate goods to buyers who value them most, production to sellers with lowest cost, and produce the surplus-maximising quantity.' },
  // Ch 8
  { id: 'deadweight-loss', term: 'Deadweight loss', lecture: 'ch08', model: 'tax', definition: 'The fall in total surplus that results from a market distortion such as a tax: lost gains from trades that no longer happen.' },
  { id: 'dwl-elasticity', term: 'DWL and elasticity', lecture: 'ch08', model: 'tax', definition: 'The more elastic supply and/or demand, the larger the deadweight loss of a given tax.' },
  { id: 'laffer-curve', term: 'Laffer curve', lecture: 'ch08', model: 'tax', definition: 'Tax revenue as a function of the tax size: first rises, then falls as the tax shrinks the market. DWL rises faster than the tax (≈ with its square).' },
  { id: 'subsidy', term: 'Subsidy', lecture: 'ch08', model: 'tax', definition: 'A negative tax: sellers receive more than buyers pay. Raises quantity above the efficient level, so it also creates deadweight loss.' },
  { id: 'supply-side', term: 'Supply-side economics', lecture: 'ch08', definition: 'The view (Laffer, Reagan) that tax rates were so high that cutting them could raise revenue by encouraging work. Economists disagree about the elasticities involved.' },
  // Ch 14
  { id: 'profit', term: 'Profit', lecture: 'ch14', definition: 'Total revenue − total cost. Firms are assumed to maximise profit.' },
  { id: 'explicit-cost', term: 'Explicit costs', lecture: 'ch14', definition: 'Input costs that require an outlay of money by the firm.' },
  { id: 'implicit-cost', term: 'Implicit costs', lecture: 'ch14', definition: 'Input costs that do not require an outlay of money (forgone salary, forgone interest on own capital); ignored by accountants.' },
  { id: 'economic-profit', term: 'Economic vs accounting profit', lecture: 'ch14', definition: 'Economic profit = TR − (explicit + implicit costs). Accounting profit = TR − explicit costs; usually larger.', note: 'Walter: accounting profit $34,100, economic profit −$6,500.' },
  { id: 'production-function', term: 'Production function', lecture: 'ch14', model: 'production', definition: 'The relationship between the quantity of inputs used and the quantity of output; gets flatter as production rises.' },
  { id: 'marginal-product', term: 'Marginal product', lecture: 'ch14', model: 'production', definition: 'The increase in output from one additional unit of input; the slope of the production function.' },
  { id: 'diminishing-mp', term: 'Diminishing marginal product', lecture: 'ch14', model: 'production', definition: 'The marginal product of an input declines as its quantity increases ⇒ total-cost curve gets steeper ⇒ rising MC.' },
  { id: 'fixed-cost', term: 'Fixed costs', lecture: 'ch14', model: 'cost-curves', definition: 'Costs that do not vary with the quantity of output produced.' },
  { id: 'variable-cost', term: 'Variable costs', lecture: 'ch14', model: 'cost-curves', definition: 'Costs that vary with the quantity of output produced.' },
  { id: 'atc', term: 'Average total cost', lecture: 'ch14', model: 'cost-curves', definition: 'TC/Q — cost of a typical unit. ATC = AFC + AVC; U-shaped.' },
  { id: 'marginal-cost', term: 'Marginal cost', lecture: 'ch14', model: 'cost-curves', definition: 'ΔTC/ΔQ — the increase in total cost from one more unit. Rises due to diminishing marginal product.' },
  { id: 'efficient-scale', term: 'Efficient scale', lecture: 'ch14', model: 'cost-curves', definition: 'The quantity that minimises average total cost; MC crosses ATC there.' },
  { id: 'mc-atc', term: 'MC–ATC relationship', lecture: 'ch14', model: 'cost-curves', definition: 'MC < ATC ⇒ ATC falling; MC > ATC ⇒ ATC rising; MC crosses ATC (and AVC) at its minimum.' },
  { id: 'economies-of-scale', term: 'Economies of scale', lecture: 'ch14', definition: 'Long-run ATC falls as output increases (specialisation). Constant returns: LRATC flat. Diseconomies: LRATC rises (coordination problems).' },
  { id: 'sr-lr-costs', term: 'Short-run vs long-run costs', lecture: 'ch14', definition: 'Many costs are fixed in the short run but variable in the long run; SR ATC curves lie on or above the flatter LR ATC curve.' },
  // Ch 15 (problem set) / beyond
  { id: 'price-taker', term: 'Price taker', lecture: 'ch15', model: 'competitive-firm', definition: 'A firm that must accept the market price; it faces a horizontal demand curve, so P = AR = MR.' },
  { id: 'shutdown', term: 'Shutdown rule (short run)', lecture: 'ch15', model: 'competitive-firm', definition: 'Shut down if P < min AVC (revenue does not cover variable cost); the fixed cost is sunk in the short run.' },
  { id: 'exit-entry', term: 'Entry and exit (long run)', lecture: 'ch15', model: 'competitive-firm', definition: 'Firms enter if P > min ATC and exit if P < min ATC, so in long-run equilibrium P = min ATC and economic profit is zero.' },
  { id: 'marginal-revenue', term: 'Marginal revenue', lecture: 'beyond', model: 'monopoly', definition: 'ΔTR/ΔQ. For a monopolist MR < P because selling more requires lowering the price on all units (linear demand: MR is twice as steep).' },
];

export const FORMULAS: Formula[] = [
  { id: 'f-oc-choice', name: 'Opportunity cost of a choice', lecture: 'ch01', model: 'opportunity-cost', tex: '\\text{OC}(A) = \\text{explicit cost of }A + \\max_{j\\neq A}(\\text{benefit}_j - \\text{cost}_j)', explanation: 'Pay for A, and give up the net value of the best alternative (Anne’s example).' },
  { id: 'f-marginal-rule', name: 'Marginal decision rule', lecture: 'ch01', tex: '\\text{Do it} \\iff MB \\ge MC', explanation: 'Compare the extra benefit with the extra cost of the next step; sunk costs never enter.' },
  { id: 'f-ppf-oc', name: 'Opportunity cost on a PPF', lecture: 'ch02', model: 'ppf', tex: '\\text{OC of } X = \\left|\\frac{\\Delta Y}{\\Delta X}\\right| = |\\text{slope of PPF}|', explanation: 'How much Y must be given up for one more X.' },
  { id: 'f-oc-reciprocal', name: 'Reciprocal opportunity costs', lecture: 'ch03', model: 'trade', tex: '\\text{OC}_Y = \\frac{1}{\\text{OC}_X}', explanation: 'If 1 meat costs 4 potatoes, 1 potato costs ¼ meat.' },
  { id: 'f-oc-time', name: 'Opportunity cost from time per unit', lecture: 'ch03', model: 'trade', tex: '\\text{OC of } X \\text{ (in } Y) = \\frac{\\text{time per } X}{\\text{time per } Y}', explanation: 'Frank: 60 min per meat ÷ 15 min per potato = 4 potatoes per meat.' },
  { id: 'f-trade-range', name: 'Mutually beneficial price', lecture: 'ch03', model: 'trade', tex: '\\text{OC}^{\\text{low}}_X \\le P_X \\le \\text{OC}^{\\text{high}}_X', explanation: 'The price of X (in units of Y) must lie between the two producers’ opportunity costs.' },
  { id: 'f-demand', name: 'Linear demand & supply', lecture: 'ch04', model: 'supply-demand', tex: 'P = a - bQ^D, \\qquad P = c + dQ^S', explanation: 'Inverse form used in graphs (price on the vertical axis).' },
  { id: 'f-equilibrium', name: 'Equilibrium', lecture: 'ch04', model: 'supply-demand', tex: 'Q^* = \\frac{a-c}{b+d}, \\qquad P^* = a - bQ^*', explanation: 'Set demand price = supply price.' },
  { id: 'f-midpoint', name: 'Midpoint (arc) elasticity', lecture: 'ch05', model: 'elasticity', tex: '\\varepsilon = \\left|\\frac{(Q_2-Q_1)/[(Q_1+Q_2)/2]}{(P_2-P_1)/[(P_1+P_2)/2]}\\right|', explanation: 'Same answer whichever direction the change goes.' },
  { id: 'f-general-elasticity', name: 'Elasticity of Y with respect to X', lecture: 'ch05', tex: 'E_{Y,X} = \\frac{\\%\\Delta Y}{\\%\\Delta X} = \\frac{dY}{dX}\\cdot\\frac{X}{Y}', explanation: 'General definition: income, cross-price, supply elasticities are all special cases.' },
  { id: 'f-point-elasticity', name: 'Point elasticity on linear demand', lecture: 'ch05', model: 'elasticity', tex: '|\\varepsilon| = \\frac{1}{b}\\cdot\\frac{P}{Q}', explanation: 'Equals 1 at the midpoint of a linear demand curve; elastic above, inelastic below.' },
  { id: 'f-tr', name: 'Total revenue', lecture: 'ch05', model: 'elasticity', tex: 'TR = P \\times Q', explanation: 'Price ↑ ⇒ TR ↑ if inelastic, TR ↓ if elastic, unchanged if unit elastic.' },
  { id: 'f-income-el', name: 'Income elasticity', lecture: 'ch05', tex: 'E_I = \\frac{\\%\\Delta Q^D}{\\%\\Delta I}', explanation: '> 1 luxury, 0–1 necessity, < 0 inferior.' },
  { id: 'f-cross-el', name: 'Cross-price elasticity', lecture: 'ch05', tex: 'E_{12} = \\frac{\\%\\Delta Q^D_1}{\\%\\Delta P_2}', explanation: '> 0 substitutes, < 0 complements.' },
  { id: 'f-shortage', name: 'Shortage / surplus under price control', lecture: 'ch06', model: 'price-controls', tex: '\\text{Shortage} = Q^D(\\bar P) - Q^S(\\bar P), \\quad \\text{Surplus} = Q^S(\\underline P) - Q^D(\\underline P)', explanation: 'Quantity traded = the short side: min(Qd, Qs).' },
  { id: 'f-tax-q', name: 'Quantity with a per-unit tax', lecture: 'ch06', model: 'tax', tex: 'Q_T = \\frac{a - c - t}{b + d},\\quad P_B = a - bQ_T,\\quad P_S = P_B - t', explanation: 'Same result whether buyers or sellers are taxed.' },
  { id: 'f-incidence', name: 'Tax incidence shares', lecture: 'ch06', model: 'tax', tex: '\\frac{\\Delta P_B}{t} = \\frac{b}{b+d},\\qquad \\frac{\\Delta P_S}{t} = \\frac{d}{b+d}', explanation: 'The steeper (less elastic) side bears more of the tax.' },
  { id: 'f-cs', name: 'Consumer surplus (linear)', lecture: 'ch07', model: 'surplus', tex: 'CS = \\tfrac12 \\, Q^* \\,(a - P^*)', explanation: 'Triangle under demand, above price.' },
  { id: 'f-ps', name: 'Producer surplus (linear)', lecture: 'ch07', model: 'surplus', tex: 'PS = \\tfrac12 \\, Q^* \\,(P^* - c)', explanation: 'Triangle above supply, below price.' },
  { id: 'f-ts', name: 'Total surplus', lecture: 'ch07', model: 'surplus', tex: 'TS = CS + PS = \\text{value to buyers} - \\text{cost to sellers}', explanation: 'Maximised at the competitive equilibrium.' },
  { id: 'f-revenue', name: 'Tax revenue', lecture: 'ch08', model: 'tax', tex: 'R = t \\times Q_T', explanation: 'Rectangle between supply and demand at the taxed quantity.' },
  { id: 'f-dwl', name: 'Deadweight loss of a tax', lecture: 'ch08', model: 'tax', tex: 'DWL = \\tfrac12 \\, t \\, (Q^* - Q_T)', explanation: 'Triangle; with linear curves DWL $= \\frac{t^2}{2(b+d)}$ — quadruples when the tax doubles.' },
  { id: 'f-laffer', name: 'Revenue-maximising tax (linear)', lecture: 'ch08', model: 'tax', tex: 't^{\\max} = \\frac{a - c}{2}', explanation: 'Peak of the Laffer curve; beyond it, raising the tax lowers revenue.' },
  { id: 'f-welfare-tax', name: 'Welfare with a tax', lecture: 'ch08', model: 'tax', tex: '\\Delta CS + \\Delta PS + R = -DWL', explanation: 'Areas: CS loses B+C, PS loses D+E, revenue B+D, DWL C+E.' },
  { id: 'f-profit', name: 'Profit', lecture: 'ch14', tex: '\\pi = TR - TC', explanation: 'Economic profit uses explicit + implicit costs.' },
  { id: 'f-tc', name: 'Total cost', lecture: 'ch14', model: 'cost-curves', tex: 'TC = FC + VC', explanation: '' },
  { id: 'f-averages', name: 'Average costs', lecture: 'ch14', model: 'cost-curves', tex: 'AFC = \\frac{FC}{Q},\\quad AVC = \\frac{VC}{Q},\\quad ATC = \\frac{TC}{Q} = AFC + AVC', explanation: 'AFC always falls; AVC eventually rises; ATC is U-shaped.' },
  { id: 'f-mc', name: 'Marginal cost', lecture: 'ch14', model: 'cost-curves', tex: 'MC = \\frac{\\Delta TC}{\\Delta Q} = \\frac{dTC}{dQ} = \\frac{dVC}{dQ}', explanation: 'Fixed cost does not affect MC.' },
  { id: 'f-mp', name: 'Marginal product', lecture: 'ch14', model: 'production', tex: 'MP_L = \\frac{\\Delta Q}{\\Delta L}, \\qquad MC = \\frac{w}{MP_L}', explanation: 'When labour is the only variable input with wage w: diminishing MP ⇒ rising MC.' },
  { id: 'f-firm', name: 'Competitive firm optimum', lecture: 'ch15', model: 'competitive-firm', tex: 'P = MR = MC, \\quad \\text{produce iff } P \\ge \\min AVC', explanation: 'Short-run supply curve = MC above min AVC; long run P = min ATC.' },
  { id: 'f-mr', name: 'Monopoly: MR = MC', lecture: 'beyond', model: 'monopoly', tex: 'MR = a - 2bQ = MC \\;\\Rightarrow\\; Q_M = \\frac{a - c}{2b + e}', explanation: 'Price from the demand curve: P_M = a − bQ_M > MC.' },
];

export const getConcept = (id: string) => CONCEPTS.find((c) => c.id === id);
