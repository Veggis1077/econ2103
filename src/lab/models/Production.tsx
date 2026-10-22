import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, Dot, Guide, Handle, Plot } from '../../components/charts';
import { Slider, Stat, fmt, money } from '../../components/ui';
import { marginalProducts } from '../../economics';
import { DataTable } from '../../components/learning/DataTable';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface ProductionState {
  name: string;
  inputName: string;
  outputName: string;
  /** Output for 0, 1, 2, … units of the variable input. */
  output: number[];
  inputCost: number;
  fixedCost: number;
  workers: number;
}

const PRESETS: { name: string; description: string; state: ProductionState }[] = [
  { name: "Caroline's cookies", description: 'Course Table 1: factory $30/h, workers $10/h', state: { name: "Caroline's Cookie Factory", inputName: 'Workers', outputName: 'Cookies per hour', output: [0, 50, 90, 120, 140, 150, 155], inputCost: 10, fixedCost: 30, workers: 3 } },
  { name: 'Nimbus brooms', description: 'Problem set Ch. 14, P4: worker $100/day, fixed $200', state: { name: 'Nimbus, Inc.', inputName: 'Workers', outputName: 'Brooms per day', output: [0, 20, 50, 90, 120, 140, 150, 155], inputCost: 100, fixedCost: 200, workers: 3 } },
  { name: 'Fisherman', description: 'Self-practice Ch. 14, P3: pole $10, time $5/hour', state: { name: 'Commercial fisherman', inputName: 'Hours', outputName: 'Pounds of fish', output: [0, 10, 18, 24, 28, 30], inputCost: 5, fixedCost: 10, workers: 2 } },
];

export default function Production({ initial, onChange, preset = 0 }: ModelProps<ProductionState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<ProductionState>(start);
  const set = (p: Partial<ProductionState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const n = st.output.length - 1;
  const mp = marginalProducts(st.output);
  const tc = st.output.map((_, L) => st.fixedCost + st.inputCost * L);
  const L = Math.round(Math.min(n, Math.max(0, st.workers)));
  const yMax = st.output[n] * 1.15;
  const tcMax = tc[n] * 1.15;
  const mcAt = (i: number) => (i > 0 ? st.inputCost / mp[i - 1] : NaN);

  const prodChart = (
    <div>
      <div className="label mb-1">(a) Production function</div>
      <Plot xDomain={[0, n + 0.5]} yDomain={[0, yMax]} xLabel={st.inputName} yLabel={st.outputName} height={320} xTicks={st.output.map((_, i) => i)} title="Production function">
        {mp.map((m, i) => i < L && <Area key={i} points={[[i, st.output[i]], [i + 1, st.output[i]], [i + 1, st.output[i + 1]]]} fill="rgba(22,163,74,0.25)" label={`+${fmt(m)}`} labelAt={[i + 0.75, st.output[i] + m * 0.3]} />)}
        <Curve points={st.output.map((y, i) => [i, y] as [number, number])} color="var(--accent)" width={3} />
        {st.output.map((y, i) => <Dot key={i} x={i} y={y} r={i === L ? 6 : 3.5} color={i === L ? 'var(--accent)' : 'var(--c-guide)'} />)}
        <Guide x={L} y={st.output[L]} />
        <Handle x={L} y={st.output[L]} axis="x" ariaLabel={`Number of ${st.inputName.toLowerCase()}`} step={1} onDrag={(x) => set({ workers: Math.round(x) })} />
      </Plot>
    </div>
  );

  const costChart = (
    <div>
      <div className="label mb-1">(b) Total-cost curve</div>
      <Plot xDomain={[0, yMax]} yDomain={[0, tcMax]} xLabel={st.outputName} yLabel="Total cost ($)" height={320} title="Total cost as a function of output">
        <Curve points={st.output.map((y, i) => [y, tc[i]] as [number, number])} color="var(--c-text)" width={3} label="TC" labelAt={[st.output[n] * 0.98, tc[n] * 1.04]} labelAnchor="end" />
        {st.output.map((y, i) => <Dot key={i} x={y} y={tc[i]} r={i === L ? 6 : 3.5} color={i === L ? 'var(--accent)' : 'var(--c-guide)'} />)}
        <Guide x={st.output[L]} y={tc[L]} />
      </Plot>
    </div>
  );

  const table = {
    headers: [st.inputName, 'Output', 'Marginal product', 'Total cost', 'Marginal cost'],
    rows: st.output.map((y, i) => [i, y, i ? fmt(mp[i - 1]) : '—', money(tc[i], 0), i ? money(mcAt(i)) : '—']),
  };

  const chart = (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">{prodChart}{costChart}</div>
      <DataTable table={{ caption: st.name, ...table }} />
    </div>
  );

  const controls = (
    <>
      <ControlGroup title={st.inputName}>
        <Slider label={`Number of ${st.inputName.toLowerCase()}`} value={L} min={0} max={n} step={1} onChange={(workers) => set({ workers })} />
      </ControlGroup>
      <ControlGroup title="Input prices">
        <Slider label={`Cost per ${st.inputName.toLowerCase().replace(/s$/, '')}`} value={st.inputCost} min={1} max={start.inputCost * 3} step={1} onChange={(inputCost) => set({ inputCost })} format={(v) => money(v, 0)} />
        <Slider label="Fixed cost" value={st.fixedCost} min={0} max={start.fixedCost * 3 + 10} step={1} onChange={(fixedCost) => set({ fixedCost })} format={(v) => money(v, 0)} />
      </ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label={st.inputName} value={L} />
      <Stat label="Output" value={st.output[L]} />
      <Stat label="Marginal product" value={L ? fmt(mp[L - 1]) : '—'} hint={`of input number ${L}`} />
      <Stat label="Total cost" value={money(tc[L], 0)} />
      <Stat label="Marginal cost" value={L ? money(mcAt(L)) : '—'} hint="input price ÷ MP" />
      <Stat label="ATC" value={L ? money(tc[L] / st.output[L]) : '—'} />
    </>
  );

  const increasing = mp.findIndex((m, i) => i > 0 && m < mp[i - 1]);
  const explain = <Explain text={[
    `**Marginal product** is the extra output from one more unit of input — the slope of the production function (green steps). Here MP is ${mp.map((m) => fmt(m)).join(', ')}. ${increasing > 1 ? `It first **rises** (specialisation) and then falls from input ${increasing + 1} on.` : 'It **falls** with every extra unit: **diminishing marginal product**.'}`,
    '**From production to cost:** each unit of input costs the same, but adds less and less output. So each extra unit of *output* needs more input and costs more: $MC = \\frac{\\text{input price}}{MP}$. The production function gets **flatter**, the total-cost curve gets **steeper**.',
  ].join('\n\n')} />;

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)} />;
}
