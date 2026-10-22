import { useEffect, useMemo, useState } from 'react';
import { Curve, Dot, Guide, Handle, Legend, Plot, Segment } from '../../components/charts';
import { Slider, Stat, fmt } from '../../components/ui';
import { bowedOpportunityCost, bowedPPF, classifyPoint } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface PPFState {
  maxX: number; maxY: number;
  /** Curvature: 1 = straight line (constant OC), larger = more bowed out. */
  k: number;
  x: number; y: number;
  /** Technological progress (% increase in max output of each good). */
  growthX: number; growthY: number;
  xName: string; yName: string;
}

const PRESETS: { name: string; description: string; state: PPFState }[] = [
  { name: 'Cars & computers', description: 'Course Figure 2: bowed-out PPF', state: p({ maxX: 1000, maxY: 3000, k: 2, x: 600, y: 2400, xName: 'Cars', yName: 'Computers' }) },
  { name: 'Guns & butter', description: 'Problem set Ch. 2, P2 (Hawks vs Doves)', state: p({ maxX: 100, maxY: 200, k: 2.2, x: 70, y: 120, xName: 'Guns', yName: 'Butter' }) },
  { name: 'Environment vs output', description: 'Problem set Ch. 2, P3: cleaner technology', state: p({ maxX: 100, maxY: 100, k: 1.8, x: 50, y: 60, xName: 'Industrial output', yName: 'Clean environment' }) },
  { name: "Peru (constant cost)", description: 'Q13: straight-line PPF, 8 peanuts or 240 cashews', state: p({ maxX: 8, maxY: 240, k: 1, x: 3, y: 150, xName: 'Peanuts (lb)', yName: 'Cashews (lb)' }) },
];

function p(s: Partial<PPFState>): PPFState {
  return { maxX: 100, maxY: 100, k: 2, x: 50, y: 50, growthX: 0, growthY: 0, xName: 'Good X', yName: 'Good Y', ...s };
}

export default function PPF({ initial, onChange, preset = 0 }: ModelProps<PPFState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<PPFState>(start);
  const set = (q: Partial<PPFState>) => setSt((o) => ({ ...o, ...q }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const X = st.maxX * (1 + st.growthX / 100);
  const Y = st.maxY * (1 + st.growthY / 100);
  const f0 = (x: number) => bowedPPF(st.maxX, st.maxY, st.k, x);
  const f = (x: number) => bowedPPF(X, Y, st.k, x);
  const xDom = st.maxX * 1.4;
  const yDom = st.maxY * 1.4;
  const status = classifyPoint(f, X, st.x, st.y, 0.004);
  const onX = Math.min(st.x, X);
  const oc = bowedOpportunityCost(X, Y, st.k, onX);
  const step = st.maxX / 10;
  const nextX = Math.min(X, onX + step);
  const shifted = st.growthX !== 0 || st.growthY !== 0;
  const color = status === 'efficient' ? '#16a34a' : status === 'inefficient' ? '#f59e0b' : '#dc2626';

  const chart = (
    <Plot xDomain={[0, xDom]} yDomain={[0, yDom]} xLabel={st.xName} yLabel={st.yName} title="Production possibilities frontier"
      readout={(x, y) => [`${st.xName}: ${fmt(x, 1)}`, `${st.yName}: ${fmt(y, 1)}`, classifyPoint(f, X, x, y, 0.01)]}>
      {shifted && <Curve fn={f0} from={0} to={st.maxX} color="var(--c-guide)" dashed width={1.5} label="old PPF" labelAt={[st.maxX * 0.55, f0(st.maxX * 0.55) * 0.92]} />}
      <Curve fn={f} from={0} to={X} samples={160} color="var(--accent)" width={3} label="PPF" labelAt={[X * 0.72, f(X * 0.72) + yDom * 0.04]} />
      {status !== 'unattainable' && onX < X && (
        <>
          <Segment from={[onX, f(onX)]} to={[nextX, f(onX)]} color="#9333ea" width={1.5} dashed />
          <Segment from={[nextX, f(onX)]} to={[nextX, f(nextX)]} color="#9333ea" width={1.5} dashed />
          <Dot x={nextX} y={f(nextX)} r={3.5} color="#9333ea" />
        </>
      )}
      <Guide x={st.x} y={st.y} />
      <Handle x={st.x} y={st.y} color={color} label={status} ariaLabel="Production point" onDrag={(x, y) => set({ x, y })} step={st.maxX / 100} />
    </Plot>
  );

  const controls = (
    <>
      <ControlGroup title="Production point">
        <Slider label={st.xName} value={st.x} min={0} max={xDom} step={st.maxX / 200} onChange={(x) => set({ x })} format={(v) => fmt(v, 1)} />
        <Slider label={st.yName} value={st.y} min={0} max={yDom} step={st.maxY / 200} onChange={(y) => set({ y })} format={(v) => fmt(v, 1)} />
        <button className="btn-secondary w-full !py-1.5 text-xs" onClick={() => set({ y: f(Math.min(st.x, X)), x: Math.min(st.x, X) })}>Move to the frontier (efficient)</button>
      </ControlGroup>
      <ControlGroup title="Resources & technology">
        <Slider label="Curvature (1 = straight line)" value={st.k} min={1} max={4} step={0.05} onChange={(k) => set({ k })} format={(v) => fmt(v, 2)} hint="Bowed out = resources are specialised ⇒ rising opportunity cost" />
        <Slider label={`Productivity in ${st.xName}`} value={st.growthX} min={-40} max={60} step={1} onChange={(growthX) => set({ growthX })} format={(v) => `${v > 0 ? '+' : ''}${v}%`} />
        <Slider label={`Productivity in ${st.yName}`} value={st.growthY} min={-40} max={60} step={1} onChange={(growthY) => set({ growthY })} format={(v) => `${v > 0 ? '+' : ''}${v}%`} />
      </ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label="Point is" value={status} tone={status === 'efficient' ? 'good' : 'bad'} />
      <Stat label={`Max ${st.yName} at this ${st.xName}`} value={fmt(f(onX), 1)} />
      <Stat label={`OC of 1 ${st.xName}`} value={`${fmt(oc, 2)}`} hint={`units of ${st.yName} (|slope|)`} />
      <Stat label={`Next ${fmt(step, 0)} ${st.xName}`} value={`−${fmt(f(onX) - f(nextX), 1)}`} hint={`${st.yName} given up`} />
    </>
  );

  const explain = (
    <Explain text={[
      status === 'efficient' ? `**Efficient:** the point is on the frontier — the economy gets all it can from its resources. Producing more ${st.xName} requires giving up ${st.yName}.`
        : status === 'inefficient' ? `**Inefficient:** the point is inside the frontier — resources are idle or misused (e.g. unemployment). The economy could produce more of **both** goods.`
        : `**Unattainable:** the point lies outside the frontier given current resources and technology. Only growth (an outward shift) or trade could make it reachable.`,
      st.k > 1.02 ? `**Increasing opportunity cost.** The purple step shows that ${fmt(step, 0)} more ${st.xName} cost ${fmt(f(onX) - f(nextX), 1)} ${st.yName} here. Drag the point right and watch the cost rise: resources best suited to ${st.yName} are pulled into ${st.xName} last.` : `**Constant opportunity cost.** On a straight-line PPF every extra unit of ${st.xName} costs the same ${fmt(oc, 2)} units of ${st.yName} — as for the individual producers in Chapter 3.`,
      shifted ? `**Technological change** shifts the frontier outward (or inward for negative values). Progress in only one good still lets the economy have more of **both** (point A → G in course Figure 3).` : 'Use the productivity sliders to model technological progress (Figure 3) or the "cleaner electricity" question in problem set Ch. 2.',
    ].join('\n\n')} />
  );

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'PPF', color: 'var(--accent)' }, { label: 'opportunity cost step', color: '#9333ea', kind: 'dashed' }, { label: 'efficient', color: '#16a34a' }, { label: 'inefficient', color: '#f59e0b' }, { label: 'unattainable', color: '#dc2626' }]} />} />;
}
