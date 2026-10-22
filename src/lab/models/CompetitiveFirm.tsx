import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, DragHLine, Dot, Guide, HLine, Legend, Plot } from '../../components/charts';
import { Slider, Stat, fmt, money } from '../../components/ui';
import { averageTotalCost, averageVariableCost, calculateCompetitiveFirm, marginalCost, minAverageTotalCost, minAverageVariableCost, type CubicCost } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface FirmState extends CubicCost { price: number; qMax: number; yMax: number }

const PRESETS: { name: string; description: string; state: FirmState }[] = [
  { name: 'Typical firm', description: 'U-shaped AVC and ATC, rising MC', state: { fixed: 30, alpha: 12, beta: 1.2, gamma: 0.05, price: 9, qMax: 25, yMax: 30 } },
  { name: 'Problem 11 (Ch. 15)', description: 'TC = 50 + ½q², MC = q; short-run price $12', state: { fixed: 50, alpha: 0, beta: -0.5, gamma: 0, price: 12, qMax: 20, yMax: 24 } },
  { name: 'Problem 10 (Ch. 15)', description: 'FC $16, AVC = q (smooth version: MC = 2q), P = $10', state: { fixed: 16, alpha: 0, beta: -1, gamma: 0, price: 10, qMax: 8, yMax: 16 } },
];

export default function CompetitiveFirm({ initial, onChange, preset = 0 }: ModelProps<FirmState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<FirmState>(start);
  const set = (p: Partial<FirmState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const cost: CubicCost = { fixed: st.fixed, alpha: st.alpha, beta: st.beta, gamma: st.gamma };
  const o = calculateCompetitiveFirm(cost, st.price);
  const minAVC = minAverageVariableCost(cost);
  const minATC = minAverageTotalCost(cost, st.qMax * 4);
  const mc = (q: number) => marginalCost(cost, q);
  const atc = (q: number) => averageTotalCost(cost, q);
  const avc = (q: number) => averageVariableCost(cost, q);
  const q = o.quantity;
  const profitColor = o.profit >= 0 ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)';

  const chart = (
    <Plot xDomain={[0, st.qMax]} yDomain={[0, st.yMax]} xLabel="Quantity (firm)" yLabel="Costs and revenue ($)" title="Competitive firm"
      readout={(x) => [`q = ${fmt(x)}`, `MC ${fmt(mc(x))}`, `ATC ${fmt(atc(x))}`, `AVC ${fmt(avc(x))}`, `profit at q: ${fmt((st.price - atc(x)) * x)}`]}>
      {q > 0 && <Area points={[[0, st.price], [q, st.price], [q, o.averageTotalCost], [0, o.averageTotalCost]]} fill={profitColor} label={o.profit >= 0 ? 'Profit' : 'Loss'} />}
      <Curve fn={avc} from={0} color="var(--c-avc)" label="AVC" labelAt={[st.qMax * 0.96, Math.min(st.yMax * 0.88, avc(st.qMax * 0.96)) - st.yMax * 0.05]} labelAnchor="end" />
      <Curve fn={atc} from={st.qMax * 0.02} color="var(--c-atc)" label="ATC" labelAt={[st.qMax * 0.96, Math.min(st.yMax * 0.95, atc(st.qMax * 0.96)) + st.yMax * 0.04]} labelAnchor="end" />
      <Curve fn={mc} from={0} color="var(--c-mc)" width={2} />
      <Curve fn={mc} from={Math.max(minAVC.quantity, 0)} color="var(--c-mc)" width={5} label="MC = firm’s supply" labelAt={[Math.min(st.qMax * 0.6, qAt(mc, st.yMax * 0.85, st.qMax)), st.yMax * 0.9]} labelAnchor="end" />
      <HLine y={minAVC.value} color="var(--c-avc)" dashed width={1} label={`shutdown price ${money(minAVC.value)}`} />
      <HLine y={minATC.value} color="var(--c-atc)" dashed width={1} label={`break-even price ${money(minATC.value)}`} />
      <Dot x={minATC.quantity} y={minATC.value} r={4} color="var(--c-atc)" />
      {minAVC.quantity > 0 && <Dot x={minAVC.quantity} y={minAVC.value} r={4} color="var(--c-avc)" />}
      {q > 0 && <Guide x={q} y={st.price} xLabel="q*" />}
      {q > 0 && <Dot x={q} y={st.price} r={6} label="P = MC" />}
      <DragHLine y={st.price} onDrag={(price) => set({ price })} color="#2563eb" label={`P = MR = ${money(st.price)}`} />
    </Plot>
  );

  const controls = (
    <>
      <ControlGroup title="Market price (drag the blue line)">
        <Slider label="Price P" value={st.price} min={0} max={st.yMax} step={st.yMax / 400} onChange={(price) => set({ price })} format={(v) => money(v)} />
      </ControlGroup>
      <ControlGroup title="Costs  TC = F + αq − βq² + γq³">
        <Slider label="Fixed cost F" value={st.fixed} min={0} max={start.fixed * 3 + 10} step={0.5} onChange={(fixed) => set({ fixed })} format={(v) => money(v)} />
        <Slider label="α" value={st.alpha} min={0} max={st.yMax * 0.8} step={st.yMax / 400} onChange={(alpha) => set({ alpha })} format={(v) => fmt(v, 2)} />
        <Slider label="β" value={st.beta} min={-st.yMax / st.qMax} max={st.yMax / st.qMax * 0.5} step={st.yMax / st.qMax / 200} onChange={(beta) => set({ beta })} format={(v) => fmt(v, 3)} />
        <Slider label="γ" value={st.gamma} min={0} max={0.2} step={0.001} onChange={(gamma) => set({ gamma })} format={(v) => fmt(v, 3)} />
      </ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label="Output q*" value={fmt(q, 2)} />
      <Stat label="Revenue" value={money(o.revenue)} hint="P × q" />
      <Stat label="Total cost" value={money(o.totalCost)} />
      <Stat label={o.profit >= 0 ? 'Profit' : 'Loss'} value={money(o.profit)} tone={o.profit >= 0 ? 'good' : 'bad'} />
      <Stat label="Decision" value={o.decision} />
      <Stat label="Long run" value={o.longRun === 'entry' ? 'firms enter' : o.longRun === 'exit' ? 'firms exit' : 'no entry/exit'} hint={`P vs min ATC ${money(minATC.value)}`} />
    </>
  );

  const explain = <Explain text={[
    '**A price taker** faces a horizontal demand curve at the market price, so P = average revenue = marginal revenue. It maximises profit by producing where **P = MC** (on the rising part of MC): if P > MC, one more unit adds more to revenue than to cost.',
    o.decision === 'shut down'
      ? `**Shut down:** the price ${money(st.price)} is below minimum AVC (${money(minAVC.value)}). Producing would not even cover variable costs, so the firm produces nothing and loses only its fixed cost (${money(st.fixed)}).`
      : o.profit >= 0
        ? `**Profit:** P > ATC at q* = ${fmt(q, 2)}, so the green rectangle (P − ATC) × q = ${money(o.profit)} is economic profit. In the long run this attracts **entry**, market supply shifts right and the price falls towards min ATC (${money(minATC.value)}).`
        : `**Loss, but keep producing (short run):** AVC ≤ P < ATC. Revenue covers variable costs and part of the fixed cost, so producing loses ${money(-o.profit)} — less than shutting down (${money(-st.fixed)}). In the long run firms **exit** until P rises to min ATC.`,
    'The firm’s **short-run supply curve** is the MC curve above minimum AVC (thick red). In long-run equilibrium P = min ATC and economic profit is zero.',
  ].join('\n\n')} />;

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'MC (supply above min AVC)', color: 'var(--c-mc)' }, { label: 'ATC', color: 'var(--c-atc)' }, { label: 'AVC', color: 'var(--c-avc)' }, { label: 'P = MR', color: '#2563eb' }]} />} />;
}

function qAt(f: (q: number) => number, target: number, qMax: number) {
  for (let i = 1; i <= 200; i++) { const q = (qMax * i) / 200; if (f(q) >= target) return q; }
  return qMax * 0.9;
}
