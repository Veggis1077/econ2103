import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, DragHLine, Dot, Guide, Handle, Label, Legend, Plot } from '../../components/charts';
import { Segmented, Slider, Stat, fmt, money } from '../../components/ui';
import { calculateDeadweightLoss, calculateEquilibrium, calculateTotalSurplus, demandPrice, discreteConsumerSurplus, discreteProducerSurplus, marketWelfare, supplyPrice, welfareAtPrice } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface SurplusState {
  mode: 'smooth' | 'planner' | 'buyers' | 'sellers' | 'water';
  price: number;
  plannerQ: number;
  a: number; b: number; c: number; d: number;
}

const BUYERS = [{ n: 'Taylor', v: 100 }, { n: 'Carrie', v: 80 }, { n: 'Rihanna', v: 70 }, { n: 'Gaga', v: 50 }];
const SELLERS = [{ n: 'Andy', v: 500 }, { n: 'Pablo', v: 600 }, { n: 'Claude', v: 800 }, { n: 'Vincent', v: 900 }];
const BERT = [7, 5, 3, 1];
const ERNIE = [1, 3, 5, 7];

const PRESETS: { name: string; description: string; state: Partial<SurplusState> }[] = [
  { name: 'Market price', description: 'Drag the price: CS and PS at any price', state: { mode: 'smooth', price: 6.5 } },
  { name: 'Social planner', description: 'Choose the quantity: why equilibrium maximises total surplus', state: { mode: 'planner', plannerQ: 30 } },
  { name: 'Elvis album buyers', description: 'Table 1: Taylor $100, Carrie $80, Rihanna $70, Gaga $50', state: { mode: 'buyers', price: 70 } },
  { name: 'Painting sellers', description: 'Table 2: Vincent $900, Claude $800, Pablo $600, Andy $500', state: { mode: 'sellers', price: 600 } },
  { name: 'Bert & Ernie water', description: 'Problem set Ch. 7: values 7,5,3,1 and costs 1,3,5,7', state: { mode: 'water', price: 4 } },
];

const BASE: SurplusState = { mode: 'smooth', price: 6.5, plannerQ: 30, a: 10, b: 0.1, c: 2, d: 0.06 };

export default function Surplus({ initial, onChange, preset = 0 }: ModelProps<SurplusState>) {
  const start = useMemo(() => ({ ...BASE, ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<SurplusState>(start);
  const set = (p: Partial<SurplusState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const D = { a: st.a, b: st.b };
  const S = { c: st.c, d: st.d };
  const eq = calculateEquilibrium(D, S);
  const w = marketWelfare(D, S);
  const dp = (q: number) => demandPrice(D, q);
  const sp = (q: number) => supplyPrice(S, q);

  let chart: React.ReactNode; let stats: React.ReactNode; let explainText = ''; let controls: React.ReactNode;

  if (st.mode === 'smooth') {
    const r = welfareAtPrice(D, S, st.price);
    const q = r.quantityTraded;
    chart = (
      <Plot xDomain={[0, 100]} yDomain={[0, 12]} xLabel="Quantity" yLabel="Price ($)" title="Consumer and producer surplus at a market price"
        readout={(x) => [`Q = ${fmt(x)}`, `WTP of marginal buyer ${fmt(dp(x))}`, `cost of marginal seller ${fmt(sp(x))}`]}>
        {q > 0 && <Area points={[[0, st.a], [q, dp(q)], [q, st.price], [0, st.price]]} fill="var(--c-cs)" label="CS" />}
        {q > 0 && <Area points={[[0, st.price], [q, st.price], [q, sp(q)], [0, st.c]]} fill="var(--c-ps)" label="PS" />}
        {eq.quantity - q > 1e-6 && <Area points={[[q, dp(q)], [eq.quantity, eq.price], [q, sp(q)]]} fill="var(--c-dwl)" label="lost" />}
        <Curve fn={dp} color="var(--c-demand)" label="Demand = WTP" labelAt={[80, 1.4]} />
        <Curve fn={sp} color="var(--c-supply)" label="Supply = cost" labelAt={[76, 7.4]} />
        <Dot x={eq.quantity} y={eq.price} r={4} color="var(--c-guide)" label="E" />
        <Guide x={q} y={st.price} toY={false} xLabel="Q traded" />
        <DragHLine y={st.price} onDrag={(price) => set({ price })} color="#9333ea" label={`Price ${money(st.price)}`} />
      </Plot>
    );
    controls = <ControlGroup title="Market price"><Slider label="Price" value={st.price} min={0} max={11} step={0.05} onChange={(price) => set({ price })} format={(v) => money(v)} /><button className="btn-secondary w-full !py-1.5 text-xs" onClick={() => set({ price: eq.price })}>Snap to equilibrium price</button></ControlGroup>;
    stats = (<><Stat label="Qd / Qs" value={`${fmt(r.quantityDemanded)} / ${fmt(r.quantitySupplied)}`} /><Stat label="Traded" value={fmt(q)} /><Stat label="Consumer surplus" value={money(r.consumerSurplus)} /><Stat label="Producer surplus" value={money(r.producerSurplus)} /><Stat label="Total surplus" value={money(r.totalSurplus)} tone="good" hint={`max ${money(w.totalSurplus)}`} /><Stat label="Lost surplus" value={money(r.deadweightLoss)} tone={r.deadweightLoss > 1e-6 ? 'bad' : undefined} /></>);
    explainText = `**Consumer surplus** is the area under the demand curve (each buyer’s willingness to pay) and above the price; **producer surplus** is the area above the supply curve (each seller’s cost) and below the price. A **lower price** raises CS in two ways — existing buyers pay less and new buyers enter — and lowers PS. Away from ${money(eq.price)}, the short side of the market limits trade, so part of the potential surplus (red) is lost. Total surplus is largest at the equilibrium price.`;
  } else if (st.mode === 'planner') {
    const q = st.plannerQ;
    const ts = calculateTotalSurplus(D, S, q);
    const dwl = calculateDeadweightLoss(D, S, q);
    const lo = Math.min(q, eq.quantity), hi = Math.max(q, eq.quantity);
    chart = (
      <Plot xDomain={[0, 100]} yDomain={[0, 12]} xLabel="Quantity" yLabel="Value / cost ($)" title="Efficiency of the equilibrium quantity"
        readout={(x) => [`Q = ${fmt(x)}`, `value to buyers ${fmt(dp(x))}`, `cost to sellers ${fmt(sp(x))}`, dp(x) > sp(x) ? 'value > cost: produce' : 'cost > value: do not produce']}>
        <Area points={[[0, st.a], [lo, dp(lo)], [lo, sp(lo)], [0, st.c]]} fill="rgba(22,163,74,0.22)" label="TS" />
        {hi - lo > 1e-6 && <Area points={[[lo, dp(lo)], [hi, dp(hi)], [hi, sp(hi)], [lo, sp(lo)]]} fill="var(--c-dwl)" label="DWL" />}
        <Curve fn={dp} color="var(--c-demand)" label="value to buyers" labelAt={[78, 1.6]} />
        <Curve fn={sp} color="var(--c-supply)" label="cost to sellers" labelAt={[74, 7.6]} />
        <Dot x={eq.quantity} y={eq.price} r={4} label="Q*" />
        <Handle x={q} y={0.01} axis="x" color="#9333ea" label="planner's Q" ariaLabel="Quantity chosen by the planner" onDrag={(x) => set({ plannerQ: x })} />
        <Guide x={q} y={Math.max(dp(q), sp(q))} toY={false} />
      </Plot>
    );
    controls = <ControlGroup title="Benevolent social planner"><Slider label="Quantity produced" value={q} min={0} max={100} step={0.5} onChange={(plannerQ) => set({ plannerQ })} /><button className="btn-secondary w-full !py-1.5 text-xs" onClick={() => set({ plannerQ: eq.quantity })}>Choose the market equilibrium</button></ControlGroup>;
    stats = (<><Stat label="Quantity" value={fmt(q)} hint={`Q* = ${fmt(eq.quantity)}`} /><Stat label="Total surplus" value={money(ts)} tone="good" hint={`max ${money(w.totalSurplus)}`} /><Stat label="Deadweight loss" value={money(dwl)} tone={dwl > 1e-6 ? 'bad' : undefined} /><Stat label="Marginal unit" value={dp(q) > sp(q) ? 'value > cost' : dp(q) < sp(q) ? 'cost > value' : 'value = cost'} /></>);
    explainText = q < eq.quantity - 0.01
      ? `At Q = ${fmt(q)} the **value to the marginal buyer** (${money(dp(q))}) exceeds the **cost to the marginal seller** (${money(sp(q))}): producing more would raise total surplus. The red area is the surplus lost by producing too little.`
      : q > eq.quantity + 0.01
        ? `At Q = ${fmt(q)} the cost of the marginal unit (${money(sp(q))}) exceeds its value (${money(dp(q))}): the extra units **destroy** surplus (red area). Producing less would raise total surplus.`
        : `**Total surplus = value to buyers − cost to sellers** is maximised exactly at the equilibrium quantity, where the marginal buyer’s value equals the marginal seller’s cost. That is why the free-market outcome is **efficient** (absent market failures): the planner cannot do better by changing the quantity.`;
  } else {
    // Discrete step markets
    const isBuyers = st.mode === 'buyers';
    const isWater = st.mode === 'water';
    const yMax = isBuyers ? 120 : isWater ? 8 : 1000;
    const vals = isBuyers ? BUYERS.map((x) => x.v) : isWater ? BERT : [];
    const costs = st.mode === 'sellers' ? SELLERS.map((x) => x.v) : isWater ? ERNIE : [];
    const cs = discreteConsumerSurplus(vals, st.price);
    const ps = discreteProducerSurplus(costs, st.price);
    const names = isBuyers ? BUYERS.map((x) => x.n) : st.mode === 'sellers' ? SELLERS.map((x) => x.n) : [];
    const steps = (arr: number[]): [number, number][] => arr.flatMap((v, i) => [[i, v], [i + 1, v]] as [number, number][]);
    chart = (
      <Plot xDomain={[0, 4.6]} yDomain={[0, yMax]} xLabel={isWater ? 'Bottles of water' : isBuyers ? 'Albums' : 'Houses painted'} yLabel="Price ($)" xTicks={[1, 2, 3, 4]} title="Step demand and supply curves">
        {vals.map((v, i) => v >= st.price && <Area key={`c${i}`} points={[[i, st.price], [i + 1, st.price], [i + 1, v], [i, v]]} fill="var(--c-cs)" label={money(v - st.price, 0)} />)}
        {costs.map((c, i) => c <= st.price && <Area key={`p${i}`} points={[[i, c], [i + 1, c], [i + 1, st.price], [i, st.price]]} fill="var(--c-ps)" label={money(st.price - c, 0)} />)}
        {vals.length > 0 && <Curve points={steps(vals)} color="var(--c-demand)" label={isWater ? "Bert's demand" : 'Demand'} labelAt={[3.6, vals[3] + yMax * 0.04]} />}
        {costs.length > 0 && <Curve points={steps(costs)} color="var(--c-supply)" label={isWater ? "Ernie's supply" : 'Supply'} labelAt={[3.4, costs[3] + yMax * 0.04]} />}
        {names.map((n, i) => <Label key={n} x={i + 0.5} y={(isBuyers ? vals[i] : costs[i]) + yMax * 0.03} size={11}>{n}</Label>)}
        <DragHLine y={st.price} onDrag={(price) => set({ price: Math.round(price * (isWater ? 4 : 1)) / (isWater ? 4 : 1) })} color="#9333ea" label={`Price ${money(st.price)}`} />
      </Plot>
    );
    controls = <ControlGroup title="Price"><Slider label="Price" value={st.price} min={0} max={yMax} step={isWater ? 0.25 : 5} onChange={(price) => set({ price })} format={(v) => money(v)} /></ControlGroup>;
    stats = (
      <>
        {vals.length > 0 && <Stat label="Units bought" value={cs.units} />}
        {vals.length > 0 && <Stat label="Consumer surplus" value={money(cs.surplus)} tone="accent" hint={cs.perUnit.map((x) => fmt(x)).join(' + ') || '—'} />}
        {costs.length > 0 && <Stat label="Units sold" value={ps.units} />}
        {costs.length > 0 && <Stat label="Producer surplus" value={money(ps.surplus)} tone="accent" hint={ps.perUnit.map((x) => fmt(x)).join(' + ') || '—'} />}
        {isWater && <Stat label="Traded" value={Math.min(cs.units, ps.units)} hint={cs.units === ps.units ? 'market clears' : cs.units > ps.units ? 'shortage' : 'surplus'} />}
      </>
    );
    explainText = isBuyers
      ? `Each buyer buys if the price is at or below their **willingness to pay**; their consumer surplus is WTP − price. At ${money(st.price)}: ${cs.units} buyer(s), CS = ${money(cs.surplus)}. (Course check: at $80 CS = $20; at $70 CS = $40.) The height of the step curve is the WTP of the **marginal buyer** — the one who would leave first if the price rose.`
      : st.mode === 'sellers'
        ? `A seller paints if the price covers their **cost** (willingness to sell); producer surplus = price − cost. At ${money(st.price)}: ${ps.units} seller(s), PS = ${money(ps.surplus)}. (Course check: at $600 PS = $100; at $800 PS = $500.)`
        : `Bert values bottles at $7, $5, $3, $1; Ernie’s costs are $1, $3, $5, $7. Only at **$4** do 2 bottles get demanded and supplied: CS = 3 + 1 = $4, PS = 3 + 1 = $4, total $8. A third bottle would cost $5 but be worth only $3 — producing it would **lower** total surplus by $2.`;
  }

  const explain = <Explain text={explainText} />;
  return <ModelShell chart={chart} controls={<><Segmented size="sm" value={st.mode} onChange={(mode) => set({ ...PRESETS.find((p) => p.state.mode === mode)!.state })} options={[{ value: 'smooth', label: 'Price' }, { value: 'planner', label: 'Planner' }, { value: 'buyers', label: 'Buyers' }, { value: 'sellers', label: 'Sellers' }, { value: 'water', label: 'Water' }]} />{controls}</>}
    stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt({ ...BASE, ...PRESETS[i].state })} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'Consumer surplus', color: 'var(--c-cs)', kind: 'area' }, { label: 'Producer surplus', color: 'var(--c-ps)', kind: 'area' }, { label: 'Lost surplus / DWL', color: 'var(--c-dwl)', kind: 'area' }]} />} />;
}
