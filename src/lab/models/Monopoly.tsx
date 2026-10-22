import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, Dot, Guide, Handle, Legend, Plot, VLine } from '../../components/charts';
import { Slider, Stat, Toggle, fmt, money } from '../../components/ui';
import { calculateMonopolyOptimum, marginalRevenue, monopolyATC, monopolyMC, monopolyTC } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface MonopolyState {
  a: number; b: number; fixed: number; c: number; e: number;
  /** Quantity the student tries (to show why MR = MC is best). */
  qTry: number;
  showCompetitive: boolean;
}

const PRESETS: { name: string; description: string; state: MonopolyState }[] = [
  { name: 'Figure 15-4 (Q39)', description: 'D: P = 120 − Q, MC = Q, ATC = 450/Q + Q/2', state: { a: 120, b: 1, fixed: 450, c: 0, e: 1, qTry: 30, showCompetitive: true } },
  { name: 'Constant marginal cost', description: 'D: P = 100 − Q, MC = $20', state: { a: 100, b: 1, fixed: 400, c: 20, e: 0, qTry: 55, showCompetitive: true } },
  { name: 'Loss-making monopoly', description: 'High fixed cost: P < ATC even at the optimum', state: { a: 100, b: 1, fixed: 2000, c: 20, e: 0, qTry: 40, showCompetitive: false } },
];

export default function Monopoly({ initial, onChange, preset = 0 }: ModelProps<MonopolyState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<MonopolyState>(start);
  const set = (p: Partial<MonopolyState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const D = { a: st.a, b: st.b };
  const k = { fixed: st.fixed, c: st.c, e: st.e };
  const m = calculateMonopolyOptimum(D, k);
  const xMax = (st.a / st.b) * 1.05;
  const yMax = st.a * 1.05;
  const dp = (q: number) => st.a - st.b * q;
  const mr = (q: number) => marginalRevenue(D, q);
  const mc = (q: number) => monopolyMC(k, q);
  const atc = (q: number) => monopolyATC(k, q);
  const profitAt = (q: number) => dp(q) * q - monopolyTC(k, q);
  const qt = Math.min(xMax, Math.max(0.01, st.qTry));
  const qm = m.quantity;
  const qc = m.competitive.quantity;

  const chart = (
    <div className="space-y-4">
      <Plot xDomain={[0, xMax]} yDomain={[0, yMax]} xLabel="Quantity" yLabel="Price / cost ($)" title="Monopoly profit maximisation"
        readout={(x) => [`Q = ${fmt(x)}`, `P (demand) ${fmt(dp(x))}`, `MR ${fmt(mr(x))}`, `MC ${fmt(mc(x))}`, `ATC ${fmt(atc(x))}`]}>
        {qm > 0 && <Area points={[[0, m.price], [qm, m.price], [qm, m.averageTotalCost], [0, m.averageTotalCost]]} fill={m.profit >= 0 ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)'} label={m.profit >= 0 ? 'Profit' : 'Loss'} />}
        {qm > 0 && qc > qm && <Area points={[[qm, m.price], [qc, m.competitive.price], [qm, mc(qm)]]} fill="var(--c-dwl)" label="DWL" />}
        <Curve fn={dp} from={0} to={st.a / st.b} color="var(--c-demand)" label="D = AR" labelAt={[st.a / st.b * 0.9, dp(st.a / st.b * 0.9) + yMax * 0.04]} />
        <Curve fn={mr} from={0} to={st.a / (2 * st.b)} color="var(--c-mr)" label="MR" labelAt={[st.a / (2 * st.b) * 1.02, yMax * 0.04]} />
        <Curve fn={mc} from={0} color="var(--c-mc)" label="MC" labelAt={[Math.min(xMax * 0.9, (yMax * 0.9 - st.c) / Math.max(st.e, 1e-9)), Math.min(yMax * 0.94, mc(xMax * 0.9))]} />
        <Curve fn={atc} from={Math.max(0.5, xMax * 0.04)} color="var(--c-atc)" label="ATC" labelAt={[xMax * 0.88, Math.min(yMax * 0.9, atc(xMax * 0.88)) + yMax * 0.04]} labelAnchor="end" />
        {st.showCompetitive && qc > 0 && <><Guide x={qc} y={m.competitive.price} xLabel="Q_c" /><Dot x={qc} y={m.competitive.price} r={4} color="var(--c-guide)" label="P = MC" /></>}
        {qm > 0 && <><Guide x={qm} y={m.price} xLabel="Q_M" yLabel="P_M" /><Guide x={qm} y={mc(qm)} toX={false} /><Dot x={qm} y={m.price} r={6} label="monopoly" /><Dot x={qm} y={mc(qm)} r={5} color="var(--c-mr)" label="MR = MC" labelOffset={[8, 16]} /></>}
        <VLine x={qt} color="#9333ea" dashed width={1.2} />
        <Handle x={qt} y={dp(qt)} axis="x" color="#9333ea" label="try Q" ariaLabel="Try a different quantity" onDrag={(x) => set({ qTry: x })} step={xMax / 200} />
      </Plot>
      <div>
        <div className="label mb-1">Profit at every quantity — the peak is where MR = MC</div>
        <ProfitCurve f={profitAt} xMax={st.a / st.b} qm={qm} qt={qt} />
      </div>
    </div>
  );

  const controls = (
    <>
      <ControlGroup title="Demand  P = a − bQ" color="var(--c-demand)">
        <Slider label="Intercept a" value={st.a} min={40} max={200} step={1} onChange={(a) => set({ a })} />
        <Slider label="Slope b" value={st.b} min={0.3} max={3} step={0.05} onChange={(b) => set({ b })} format={(v) => fmt(v, 2)} />
      </ControlGroup>
      <ControlGroup title="Cost  TC = F + cQ + (e/2)Q²" color="var(--c-mc)">
        <Slider label="Fixed cost F" value={st.fixed} min={0} max={3000} step={10} onChange={(fixed) => set({ fixed })} format={(v) => money(v, 0)} />
        <Slider label="MC intercept c" value={st.c} min={0} max={160} step={1} onChange={(c) => set({ c })} />
        <Slider label="MC slope e" value={st.e} min={0} max={3} step={0.05} onChange={(e) => set({ e })} format={(v) => fmt(v, 2)} />
      </ControlGroup>
      <ControlGroup title="Explore">
        <Slider label="Try quantity" value={qt} min={0} max={Math.round(xMax)} step={0.5} onChange={(qTry) => set({ qTry })} format={(v) => fmt(v, 1)} />
        <Toggle checked={st.showCompetitive} onChange={(showCompetitive) => set({ showCompetitive })} label="Show competitive benchmark (P = MC)" />
      </ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label="Q_M (MR = MC)" value={fmt(qm, 2)} />
      <Stat label="Monopoly price" value={money(m.price)} hint={`MC there: ${money(m.marginalCost)}`} />
      <Stat label={m.profit >= 0 ? 'Profit' : 'Loss'} value={money(m.profit)} tone={m.profit >= 0 ? 'good' : 'bad'} hint={`(P − ATC) × Q = (${fmt(m.price)} − ${fmt(m.averageTotalCost)}) × ${fmt(qm)}`} />
      <Stat label="Deadweight loss" value={money(m.deadweightLoss)} tone="bad" />
      <Stat label="Competitive Q, P" value={`${fmt(qc, 2)}, ${money(m.competitive.price)}`} />
      <Stat label="Consumer surplus" value={money(m.consumerSurplus)} hint={`vs ${money(m.competitive.consumerSurplus)} if P = MC`} />
      <Stat label="Profit at tried Q" value={money(profitAt(qt))} hint={`MR ${fmt(mr(qt))} vs MC ${fmt(mc(qt))}`} />
    </>
  );

  const explain = <Explain text={[
    '**Why MR < P.** To sell one more unit a monopolist must lower the price on **all** units, so marginal revenue is below the price (linear demand: MR = a − 2bQ, twice as steep). Average revenue = price, so AR falls and MR falls as output rises.',
    mr(qt) > mc(qt) + 1e-9
      ? `**At your tried Q = ${fmt(qt, 1)}:** MR (${fmt(mr(qt))}) > MC (${fmt(mc(qt))}) — one more unit adds more revenue than cost, so profit rises if output **increases**.`
      : mr(qt) < mc(qt) - 1e-9
        ? `**At your tried Q = ${fmt(qt, 1)}:** MR (${fmt(mr(qt))}) < MC (${fmt(mc(qt))}) — the last unit costs more than it brings in, so profit rises if output **falls**.`
        : '**MR = MC:** no change in output can raise profit — this is the optimum.',
    `**MR = MC, not P = MC.** Profit peaks at Q_M = ${fmt(qm, 2)}; the price is read off the **demand curve** above it: ${money(m.price)} > MC. A competitive market would produce where P = MC (Q = ${fmt(qc, 2)}). The units between them are valued above their cost but not produced: the **deadweight loss** (red). Profit = (P − ATC) × Q — not (P − MC) × Q.`,
  ].join('\n\n')} />;

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'Demand', color: 'var(--c-demand)' }, { label: 'MR', color: 'var(--c-mr)' }, { label: 'MC', color: 'var(--c-mc)' }, { label: 'ATC', color: 'var(--c-atc)' }, { label: 'Deadweight loss', color: 'var(--c-dwl)', kind: 'area' }]} />} />;
}

function ProfitCurve({ f, xMax, qm, qt }: { f: (q: number) => number; xMax: number; qm: number; qt: number }) {
  const pts: [number, number][] = Array.from({ length: 121 }, (_, i) => { const q = (xMax * i) / 120; return [q, f(q)]; });
  const ys = pts.map((p) => p[1]);
  const lo = Math.min(0, ...ys);
  const hi = Math.max(1, ...ys);
  return (
    <Plot xDomain={[0, xMax]} yDomain={[lo, hi * 1.15]} height={200} xLabel="Quantity" yLabel="Profit ($)" title="Profit as a function of quantity">
      <Curve fn={() => 0} color="var(--c-guide)" width={1} />
      <Curve points={pts} color="#16a34a" width={2.5} />
      <Dot x={qm} y={f(qm)} r={5} color="#16a34a" label="max" />
      <Dot x={qt} y={f(qt)} r={5} color="#9333ea" />
    </Plot>
  );
}
