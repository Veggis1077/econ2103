import { useEffect, useMemo, useState } from 'react';
import { Curve, Dot, Guide, Handle, Legend, Plot, VLine } from '../../components/charts';
import { Segmented, Slider, Stat, Toggle, fmt, money } from '../../components/ui';
import { averageFixedCost, averageTotalCost, averageVariableCost, marginalCost, minAverageTotalCost, minAverageVariableCost, totalCost, variableCost, type CubicCost } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface CostState extends CubicCost {
  q: number;
  unitTax: number;
  lumpTax: number;
  showAFC: boolean;
  view: 'per-unit' | 'total';
  qMax: number; yMax: number; tcMax: number;
}

const PRESETS: { name: string; description: string; state: CostState }[] = [
  { name: 'Typical firm (Fig. 5)', description: 'Increasing then diminishing marginal product: MC and AVC fall, then rise', state: c({ fixed: 30, alpha: 12, beta: 1.2, gamma: 0.05, q: 12, qMax: 25, yMax: 30, tcMax: 600 }) },
  { name: "Conrad's coffee shop", description: 'Table 2: TC = $3 + 0.2Q + 0.1Q² (cups per hour)', state: c({ fixed: 3, alpha: 0.2, beta: -0.1, gamma: 0, q: 5, qMax: 12, yMax: 3.6, tcMax: 18 }) },
  { name: 'Problem 11 (Ch. 15)', description: 'TC = 50 + ½q², MC = q', state: c({ fixed: 50, alpha: 0, beta: -0.5, gamma: 0, q: 10, qMax: 20, yMax: 25, tcMax: 260 }) },
];

function c(s: Partial<CostState>): CostState {
  return { fixed: 30, alpha: 12, beta: 1.2, gamma: 0.05, q: 10, unitTax: 0, lumpTax: 0, showAFC: true, view: 'per-unit', qMax: 25, yMax: 30, tcMax: 600, ...s };
}

export default function CostCurves({ initial, onChange, preset = 0 }: ModelProps<CostState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<CostState>(start);
  const set = (p: Partial<CostState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  // Taxes: a per-unit tax adds t to MC/AVC/ATC; a lump-sum tax adds to fixed cost.
  const cost: CubicCost = { fixed: st.fixed + st.lumpTax, alpha: st.alpha + st.unitTax, beta: st.beta, gamma: st.gamma };
  const mc = (q: number) => marginalCost(cost, q);
  const atc = (q: number) => averageTotalCost(cost, q);
  const avc = (q: number) => averageVariableCost(cost, q);
  const afc = (q: number) => averageFixedCost(cost, q);
  const minAVC = minAverageVariableCost(cost);
  const minATC = minAverageTotalCost(cost, st.qMax * 4);
  const q = Math.max(st.qMax * 0.01, st.q);
  const qFrom = st.qMax * 0.02;
  const taxed = st.unitTax !== 0 || st.lumpTax !== 0;
  const base: CubicCost = { fixed: st.fixed, alpha: st.alpha, beta: st.beta, gamma: st.gamma };

  const perUnit = (
    <Plot xDomain={[0, st.qMax]} yDomain={[0, st.yMax]} xLabel="Quantity of output" yLabel="Cost per unit ($)" title="Average and marginal cost curves"
      readout={(x) => [`Q = ${fmt(x)}`, `MC ${fmt(mc(x))}`, `ATC ${fmt(atc(x))}`, `AVC ${fmt(avc(x))}`, `AFC ${fmt(afc(x))}`]}>
      {taxed && <Curve fn={(x) => averageTotalCost(base, x)} from={qFrom} color="var(--c-atc)" dashed width={1.3} />}
      {taxed && <Curve fn={(x) => marginalCost(base, x)} from={0} color="var(--c-mc)" dashed width={1.3} />}
      {st.showAFC && <Curve fn={afc} from={qFrom} color="#a3a3a3" width={2} label="AFC" labelAt={[st.qMax * 0.92, afc(st.qMax * 0.92) + st.yMax * 0.04]} />}
      <Curve fn={avc} from={0} color="var(--c-avc)" label="AVC" labelAt={[st.qMax * 0.96, Math.min(st.yMax * 0.9, avc(st.qMax * 0.96)) - st.yMax * 0.05]} labelAnchor="end" />
      <Curve fn={atc} from={qFrom} color="var(--c-atc)" label="ATC" labelAt={[st.qMax * 0.96, Math.min(st.yMax * 0.95, atc(st.qMax * 0.96)) + st.yMax * 0.04]} labelAnchor="end" />
      <Curve fn={mc} from={0} color="var(--c-mc)" width={3} label="MC" labelAt={[Math.min(st.qMax * 0.9, qWhere(mc, st.yMax * 0.92, st.qMax)), st.yMax * 0.95]} />
      {minAVC.quantity > 0 && <Dot x={minAVC.quantity} y={minAVC.value} r={5} color="var(--c-avc)" label="min AVC" labelOffset={[6, 16]} />}
      <Dot x={minATC.quantity} y={minATC.value} r={6} color="var(--c-atc)" label="efficient scale" labelOffset={[8, 18]} />
      <Guide x={minATC.quantity} y={minATC.value} toY={false} />
      <VLine x={q} color="var(--accent)" width={1.5} dashed />
      <Dot x={q} y={mc(q)} r={4} color="var(--c-mc)" />
      <Dot x={q} y={atc(q)} r={4} color="var(--c-atc)" />
      <Handle x={q} y={0} axis="x" ariaLabel="Output level" label={`Q = ${fmt(q, 1)}`} onDrag={(x) => set({ q: x })} step={st.qMax / 200} />
    </Plot>
  );

  const total = (
    <Plot xDomain={[0, st.qMax]} yDomain={[0, st.tcMax]} xLabel="Quantity of output" yLabel="Total cost ($)" title="Total cost curve"
      readout={(x) => [`Q = ${fmt(x)}`, `TC ${fmt(totalCost(cost, x))}`, `VC ${fmt(variableCost(cost, x))}`, `FC ${fmt(cost.fixed)}`]}>
      <Curve fn={() => cost.fixed} color="#a3a3a3" width={2} label="FC" labelAt={[st.qMax * 0.9, cost.fixed + st.tcMax * 0.03]} />
      <Curve fn={(x) => variableCost(cost, x)} color="var(--c-avc)" label="VC" labelAt={[qWhere((x) => variableCost(cost, x), st.tcMax * 0.85, st.qMax), st.tcMax * 0.88]} labelAnchor="end" />
      <Curve fn={(x) => totalCost(cost, x)} color="var(--c-text)" width={3} label="TC" labelAt={[qWhere((x) => totalCost(cost, x), st.tcMax * 0.92, st.qMax), st.tcMax * 0.95]} labelAnchor="end" />
      <Curve points={[[0, 0], [st.qMax, st.qMax * minATC.value]]} color="var(--c-atc)" dashed width={1.3} label="ray with slope = min ATC" labelAt={[st.qMax * 0.55, st.qMax * 0.55 * minATC.value + st.tcMax * 0.04]} />
      <Guide x={q} y={totalCost(cost, q)} />
      <Handle x={q} y={totalCost(cost, q)} axis="x" ariaLabel="Output level" onDrag={(x) => set({ q: x })} step={st.qMax / 200} />
    </Plot>
  );

  const controls = (
    <>
      <Segmented size="sm" value={st.view} onChange={(view) => set({ view })} options={[{ value: 'per-unit', label: 'Per-unit costs' }, { value: 'total', label: 'Total costs' }]} />
      <ControlGroup title="Cost function  TC = F + αQ − βQ² + γQ³">
        <Slider label="Fixed cost F" value={st.fixed} min={0} max={st.tcMax / 4} step={st.tcMax / 400} onChange={(fixed) => set({ fixed })} format={(v) => money(v)} />
        <Slider label="α (MC at Q = 0)" value={st.alpha} min={0} max={st.yMax * 0.8} step={st.yMax / 400} onChange={(alpha) => set({ alpha })} format={(v) => fmt(v, 2)} />
        <Slider label="β (early economies)" value={st.beta} min={-st.yMax / st.qMax} max={st.yMax / st.qMax * 0.5} step={st.yMax / st.qMax / 200} onChange={(beta) => set({ beta })} format={(v) => fmt(v, 3)} />
        <Slider label="γ (diminishing returns)" value={st.gamma} min={0} max={0.2} step={0.001} onChange={(gamma) => set({ gamma })} format={(v) => fmt(v, 3)} />
      </ControlGroup>
      <ControlGroup title="Taxes (Ch. 14 question)">
        <Slider label="Per-unit tax t" value={st.unitTax} min={0} max={st.yMax / 4} step={st.yMax / 400} onChange={(unitTax) => set({ unitTax })} format={(v) => money(v)} />
        <Slider label="Lump-sum tax" value={st.lumpTax} min={0} max={st.tcMax / 4} step={st.tcMax / 400} onChange={(lumpTax) => set({ lumpTax })} format={(v) => money(v)} />
      </ControlGroup>
      <div className="px-1"><Toggle checked={st.showAFC} onChange={(showAFC) => set({ showAFC })} label="Show AFC" /></div>
    </>
  );

  const stats = (
    <>
      <Stat label="Output Q" value={fmt(q, 2)} />
      <Stat label="Total cost" value={money(totalCost(cost, q))} hint={`FC ${money(cost.fixed)} + VC ${money(variableCost(cost, q))}`} />
      <Stat label="Marginal cost" value={money(mc(q))} />
      <Stat label="ATC" value={money(atc(q))} hint={`AVC ${money(avc(q))} + AFC ${money(afc(q))}`} />
      <Stat label="Efficient scale" value={fmt(minATC.quantity, 2)} tone="accent" hint={`min ATC ${money(minATC.value)}`} />
      <Stat label="Min AVC" value={money(minAVC.value)} hint={`at Q = ${fmt(minAVC.quantity, 2)}`} />
      <Stat label="MC vs ATC at Q" value={mc(q) < atc(q) - 1e-9 ? 'MC < ATC' : mc(q) > atc(q) + 1e-9 ? 'MC > ATC' : 'MC = ATC'} hint={mc(q) < atc(q) ? 'ATC falling' : 'ATC rising'} />
    </>
  );

  const explain = (
    <Explain text={[
      `At Q = ${fmt(q, 2)}, MC = ${money(mc(q))} ${mc(q) < atc(q) ? 'is **below** ATC, so producing one more unit pulls the average **down**' : 'is **above** ATC, so one more unit pulls the average **up**'}. That is why **MC crosses ATC (and AVC) at their minimum** — just like a new exam score below your average lowers the average.`,
      `**Why the shapes?** MC eventually rises because of **diminishing marginal product** (each extra worker adds less output, so each extra unit needs more input). ATC = AFC + AVC is U-shaped: AFC always falls as fixed cost is spread over more units, while AVC eventually rises. The bottom of the U is the **efficient scale** (here Q ≈ ${fmt(minATC.quantity, 2)}).`,
      st.view === 'total' ? 'In the total-cost view, MC is the **slope** of TC (and of VC — fixed cost does not affect MC). The dashed ray from the origin touches TC at the efficient scale: its slope TC/Q is the lowest average total cost.' : '',
      taxed ? `**Taxes:** a per-unit tax of ${money(st.unitTax)} shifts MC, AVC and ATC up by exactly ${money(st.unitTax)} (dashed = before). A lump-sum tax of ${money(st.lumpTax)} raises only fixed cost: AFC and ATC shift up, but **MC and AVC do not change**.` : '',
    ].filter(Boolean).join('\n\n')} />
  );

  return <ModelShell chart={st.view === 'per-unit' ? perUnit : total} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'MC', color: 'var(--c-mc)' }, { label: 'ATC', color: 'var(--c-atc)' }, { label: 'AVC', color: 'var(--c-avc)' }, { label: 'AFC', color: '#a3a3a3' }]} />} />;
}

/** Smallest q in (0, qMax] where an increasing function reaches `target` (for label placement). */
function qWhere(f: (q: number) => number, target: number, qMax: number): number {
  for (let i = 1; i <= 200; i++) { const q = (qMax * i) / 200; if (f(q) >= target) return q; }
  return qMax * 0.95;
}
