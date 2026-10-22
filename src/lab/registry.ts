import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { ModelProps } from './ModelShell';

export interface LabModel {
  id: string;
  title: string;
  /** One-line description for cards and search. */
  summary: string;
  lectures: string[];
  tags: string[];
  /** Which preset of the component to open with. */
  preset?: number;
  icon: string;
  component: LazyExoticComponent<ComponentType<ModelProps<any>>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Marks models that go beyond the lectures released so far. */
  enrichment?: boolean;
}

const SupplyDemand = lazy(() => import('./models/SupplyDemand'));
const Tax = lazy(() => import('./models/Tax'));
const Elasticity = lazy(() => import('./models/Elasticity'));
const PPF = lazy(() => import('./models/PPF'));
const Trade = lazy(() => import('./models/Trade'));
const Surplus = lazy(() => import('./models/Surplus'));
const Costs = lazy(() => import('./models/CostCurves'));
const Firm = lazy(() => import('./models/CompetitiveFirm'));
const Monopoly = lazy(() => import('./models/Monopoly'));
const OppCost = lazy(() => import('./models/OpportunityCost'));
const Shifts = lazy(() => import('./models/ShiftAnalyzer'));
const MarketDemand = lazy(() => import('./models/MarketDemand'));
const Production = lazy(() => import('./models/Production'));

export const LAB_MODELS: LabModel[] = [
  { id: 'supply-demand', title: 'Supply & Demand', summary: 'Shift curves, find equilibrium, see consumer and producer surplus update live.', lectures: ['ch04', 'ch07'], tags: ['equilibrium', 'shifts', 'surplus'], icon: '✕', component: SupplyDemand },
  { id: 'shift-analyzer', title: 'Shift Analyzer', summary: 'Pick an event (income, input prices, tastes…) and see which curve shifts and why.', lectures: ['ch04'], tags: ['determinants', 'normal goods', 'substitutes', 'complements'], icon: '⇄', component: Shifts },
  { id: 'market-demand', title: 'Market Demand & Supply', summary: 'Build market curves by adding individual demand and supply schedules horizontally.', lectures: ['ch04'], tags: ['horizontal summation', 'schedules'], icon: 'Σ', component: MarketDemand },
  { id: 'price-controls', title: 'Price Ceilings & Floors', summary: 'Drag a ceiling or floor; watch shortages, surpluses and deadweight loss appear.', lectures: ['ch06'], tags: ['rent control', 'minimum wage', 'shortage', 'surplus'], preset: 3, icon: '▭', component: SupplyDemand },
  { id: 'tax', title: 'Taxation & Deadweight Loss', summary: 'Move the tax wedge; see incidence, revenue, DWL and the Laffer curve.', lectures: ['ch06', 'ch08'], tags: ['tax incidence', 'wedge', 'Laffer curve', 'subsidy'], icon: '⊿', component: Tax },
  { id: 'elasticity', title: 'Price Elasticity of Demand', summary: 'Pick two points on a demand curve: midpoint elasticity and revenue rectangles.', lectures: ['ch05'], tags: ['midpoint method', 'total revenue', 'elastic', 'inelastic'], icon: 'ε', component: Elasticity },
  { id: 'ppf', title: 'Production Possibilities Frontier', summary: 'Move along a bowed-out PPF, see rising opportunity cost, shift it with technology.', lectures: ['ch02'], tags: ['opportunity cost', 'efficiency', 'growth'], icon: '◜', component: PPF },
  { id: 'trade', title: 'Comparative Advantage & Trade', summary: 'Two producers, two goods: opportunity costs, specialisation and gains from trade.', lectures: ['ch03'], tags: ['absolute advantage', 'comparative advantage', 'terms of trade'], icon: '⇆', component: Trade },
  { id: 'surplus', title: 'Consumer & Producer Surplus', summary: 'Move the price and watch welfare areas change — step curves and smooth curves.', lectures: ['ch07'], tags: ['willingness to pay', 'cost', 'efficiency'], icon: '◢', component: Surplus },
  { id: 'opportunity-cost', title: 'Opportunity Cost Calculator', summary: 'Compare choices: explicit cost + best forgone alternative; sunk costs ignored.', lectures: ['ch01'], tags: ['marginal thinking', 'sunk cost'], icon: '⚖', component: OppCost },
  { id: 'production', title: 'Production & Total Cost', summary: 'Diminishing marginal product and why it makes the total-cost curve steepen.', lectures: ['ch14'], tags: ['marginal product', 'production function'], icon: '⚙', component: Production },
  { id: 'cost-curves', title: 'Cost Curves', summary: 'MC, ATC, AVC, AFC: see why MC cuts ATC at its minimum (efficient scale).', lectures: ['ch14'], tags: ['marginal cost', 'average total cost', 'efficient scale'], icon: '∪', component: Costs },
  { id: 'competitive-firm', title: 'Competitive Firm', summary: 'Price-taking firm: P = MC, profit or loss, shutdown and break-even prices.', lectures: ['ch15'], tags: ['price taker', 'shutdown', 'entry', 'exit'], icon: '▤', component: Firm, enrichment: true },
  { id: 'monopoly', title: 'Monopoly', summary: 'MR = MC vs P = MC: monopoly price, profit and deadweight loss.', lectures: ['beyond'], tags: ['marginal revenue', 'market power'], icon: '◆', component: Monopoly, enrichment: true },
];

export const getModel = (id: string | undefined) => LAB_MODELS.find((m) => m.id === id);
