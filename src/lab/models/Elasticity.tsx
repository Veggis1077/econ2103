import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, Dot, Guide, Handle, Label, Legend, Plot } from '../../components/charts';
import { Slider, Stat, Toggle, fmt, money, pct } from '../../components/ui';
import { calculateElasticity, demandPrice, pointElasticityLinear, totalRevenueChange } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface ElasticityState {
  a: number; b: number;
  /** Quantities of the two selected points (prices follow from the demand curve). */
  q1: number; q2: number;
  showRegions: boolean;
  xMax: number; yMax: number;
}

const PRESETS: { name: string; description: string; state: ElasticityState }[] = [
  { name: 'Linear demand (Fig. 4)', description: 'P = 7 − 0.5Q: the course table of elasticities along a line', state: e({ a: 7, b: 0.5, q1: 4, q2: 6, xMax: 15, yMax: 8 }) },
  { name: 'Inelastic (Fig. 3a)', description: '$4 → $5 cuts Q from 100 to 90: revenue rises', state: e({ a: 14, b: 0.1, q1: 100, q2: 90, xMax: 150, yMax: 15 }) },
  { name: 'Elastic (Fig. 3b)', description: '$4 → $5 cuts Q from 100 to 70: revenue falls', state: e({ a: 22 / 3, b: 1 / 30, q1: 100, q2: 70, xMax: 220, yMax: 8 }) },
  { name: "Sara's scanning (Q9)", description: 'Price 600 → 750, Q 20 → 18', state: e({ a: 2100, b: 75, q1: 20, q2: 18, xMax: 30, yMax: 2200 }) },
];

function e(p: Partial<ElasticityState>): ElasticityState {
  return { a: 7, b: 0.5, q1: 4, q2: 6, showRegions: true, xMax: 15, yMax: 8, ...p };
}

export default function Elasticity({ initial, onChange, preset = 0 }: ModelProps<ElasticityState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<ElasticityState>(start);
  const set = (p: Partial<ElasticityState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const D = { a: st.a, b: st.b };
  const qMaxCurve = st.a / st.b;
  const clampQ = (q: number) => Math.min(qMaxCurve * 0.999, Math.max(qMaxCurve * 0.001, q));
  const q1 = clampQ(st.q1);
  const q2 = clampQ(st.q2);
  const p1 = demandPrice(D, q1);
  const p2 = demandPrice(D, q2);
  const el = calculateElasticity(q1, q2, p1, p2);
  const tr = totalRevenueChange(q1, p1, q2, p2);
  const pHigh = Math.max(p1, p2), pLow = Math.min(p1, p2), qLow = Math.min(q1, q2), qHigh = Math.max(q1, q2);
  const qMid = qMaxCurve / 2;
  const dp = (q: number) => demandPrice(D, q);
  const fromHighPrice = p1 >= p2; // moving from point 1 to 2 is a price cut

  const chart = (
    <Plot xDomain={[0, st.xMax]} yDomain={[0, st.yMax]} xLabel="Quantity" yLabel="Price" title="Elasticity and total revenue"
      readout={(x) => { const qq = Math.min(x, qMaxCurve); const pp = dp(qq); return [`Q = ${fmt(qq)}`, `P = ${fmt(pp)}`, `TR = P×Q = ${fmt(pp * qq)}`, `point |ε| = ${fmt(pointElasticityLinear(st.b, pp, qq))}`]; }}>
      <Area points={[[0, pHigh], [qLow, pHigh], [qLow, pLow], [0, pLow]]} fill="rgba(234,179,8,0.32)" label="A" title="A: price change × units still sold" />
      <Area points={[[0, pLow], [qLow, pLow], [qLow, 0], [0, 0]]} fill="rgba(147,51,234,0.14)" label="B" title="B: revenue kept in both cases" />
      <Area points={[[qLow, pLow], [qHigh, pLow], [qHigh, 0], [qLow, 0]]} fill="rgba(37,99,235,0.24)" label="D" title="D: units gained/lost × lower price" />
      {st.showRegions && (
        <>
          <Curve fn={dp} from={0} to={qMid} color="#dc2626" width={6} />
          <Curve fn={dp} from={qMid} to={qMaxCurve} color="#16a34a" width={6} />
          <Dot x={qMid} y={dp(qMid)} r={4} color="var(--c-text)" label="|ε| = 1" />
          <Label x={qMid * 0.45} y={dp(qMid * 0.45) + st.yMax * 0.06} color="#dc2626" anchor="middle">elastic</Label>
          <Label x={qMid * 1.45} y={dp(qMid * 1.45) + st.yMax * 0.06} color="#16a34a" anchor="middle">inelastic</Label>
        </>
      )}
      <Curve fn={dp} from={0} to={qMaxCurve} color="var(--c-demand)" width={2.5} label="Demand" labelAt={[Math.min(st.xMax * 0.95, qMaxCurve * 0.92), st.yMax * 0.06]} />
      <Guide x={q1} y={p1} xLabel="Q₁" yLabel="P₁" />
      <Guide x={q2} y={p2} xLabel="Q₂" yLabel="P₂" />
      <Handle x={q1} y={p1} axis="x" color="#2563eb" label="1" ariaLabel="Point 1 on the demand curve" step={st.xMax / 200} onDrag={(x) => set({ q1: clampQ(x) })} />
      <Handle x={q2} y={p2} axis="x" color="#ea580c" label="2" ariaLabel="Point 2 on the demand curve" step={st.xMax / 200} onDrag={(x) => set({ q2: clampQ(x) })} />
    </Plot>
  );

  const controls = (
    <>
      <ControlGroup title="Demand  P = a − bQ" color="var(--c-demand)">
        <Slider label="Intercept a" value={st.a} min={st.yMax * 0.3} max={st.yMax} step={st.yMax / 200} onChange={(a) => set({ a })} format={(v) => fmt(v)} />
        <Slider label="Slope b" value={st.b} min={(st.yMax / st.xMax) * 0.2} max={(st.yMax / st.xMax) * 3} step={(st.yMax / st.xMax) / 200} onChange={(b) => set({ b })} format={(v) => fmt(v, 3)} />
      </ControlGroup>
      <ControlGroup title="Selected points (or drag them)">
        <Slider label="Point 1 quantity" color="#2563eb" value={q1} min={0} max={qMaxCurve} step={qMaxCurve / 400} onChange={(q1) => set({ q1 })} format={(v) => `Q=${fmt(v)}, P=${fmt(dp(v))}`} />
        <Slider label="Point 2 quantity" color="#ea580c" value={q2} min={0} max={qMaxCurve} step={qMaxCurve / 400} onChange={(q2) => set({ q2 })} format={(v) => `Q=${fmt(v)}, P=${fmt(dp(v))}`} />
      </ControlGroup>
      <div className="px-1"><Toggle checked={st.showRegions} onChange={(showRegions) => set({ showRegions })} label="Colour elastic / inelastic ranges" /></div>
    </>
  );

  const stats = (
    <>
      <Stat label="%ΔP (midpoint)" value={pct(el.pctChangePrice)} hint={`${fmt(p1)} → ${fmt(p2)}`} />
      <Stat label="%ΔQ (midpoint)" value={pct(el.pctChangeQuantity)} hint={`${fmt(q1)} → ${fmt(q2)}`} />
      <Stat label="Elasticity |ε|" value={fmt(el.elasticity)} tone="accent" hint={el.classification} />
      <Stat label="TR at point 1" value={money(tr.before)} />
      <Stat label="TR at point 2" value={money(tr.after)} />
      <Stat label="Change in TR" value={money(tr.change)} tone={tr.change >= 0 ? 'good' : 'bad'} />
      <Stat label="Rectangle A" value={money(Math.abs(tr.priceEffect))} hint="price effect" />
      <Stat label="Rectangle D" value={money(Math.abs(tr.quantityEffect))} hint="quantity effect" />
    </>
  );

  const priceRise = !fromHighPrice;
  const explain = (
    <Explain text={[
      `**Midpoint method.** $\\%\\Delta Q = \\frac{${fmt(q2)} - ${fmt(q1)}}{(${fmt(q1)} + ${fmt(q2)})/2} = ${pct(el.pctChangeQuantity)}$ and $\\%\\Delta P = \\frac{${fmt(p2)} - ${fmt(p1)}}{(${fmt(p1)} + ${fmt(p2)})/2} = ${pct(el.pctChangePrice)}$, so $|\\varepsilon| = ${fmt(el.elasticity)}$ — demand is **${el.classification}** between these points.`,
      `**Revenue rectangles.** Moving from point 1 to point 2 the price ${priceRise ? 'rises' : 'falls'}. Rectangle **A** = $|\\Delta P| \\times Q_{\\text{low}}$ = ${money(Math.abs(tr.priceEffect))} is revenue ${priceRise ? 'gained' : 'lost'} on the units sold either way; rectangle **D** = $|\\Delta Q| \\times P_{\\text{low}}$ = ${money(Math.abs(tr.quantityEffect))} is revenue ${priceRise ? 'lost on units no longer sold' : 'gained on extra units'}. ${Math.abs(tr.priceEffect) > Math.abs(tr.quantityEffect) ? 'A > D' : Math.abs(tr.priceEffect) < Math.abs(tr.quantityEffect) ? 'A < D' : 'A = D'}, so total revenue ${tr.change > 1e-9 ? 'rises' : tr.change < -1e-9 ? 'falls' : 'stays the same'}.`,
      '**Rule:** inelastic ⇒ price and TR move in the **same** direction; elastic ⇒ **opposite** directions; unit elastic ⇒ TR unchanged. On a straight-line demand curve the slope is constant but elasticity is not: elastic above the midpoint (high P, low Q), inelastic below it — so total revenue is maximised at the midpoint.',
    ].join('\n\n')} />
  );

  return (
    <ModelShell chart={chart} controls={controls} stats={stats} explain={explain}
      presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
      legend={<Legend items={[{ label: 'A: price effect', color: 'rgba(234,179,8,0.45)', kind: 'area' }, { label: 'B: unchanged revenue', color: 'rgba(147,51,234,0.25)', kind: 'area' }, { label: 'D: quantity effect', color: 'rgba(37,99,235,0.35)', kind: 'area' }, { label: 'elastic range', color: '#dc2626' }, { label: 'inelastic range', color: '#16a34a' }]} />} />
  );
}
