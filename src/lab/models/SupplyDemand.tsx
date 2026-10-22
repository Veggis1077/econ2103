import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, DragCurve, DragHLine, Dot, Guide, Handle, Legend, Plot } from '../../components/charts';
import { Segmented, Slider, Stat, Toggle, fmt, money } from '../../components/ui';
import {
  calculateEquilibrium, calculatePriceControl, demandPrice, marketWelfare, shiftDemand, shiftSupply, supplyPrice, type LinearDemand, type LinearSupply,
} from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface SDState {
  a: number; b: number; c: number; d: number;
  /** Horizontal shifts in quantity units (+ = right). */
  dShift: number; sShift: number;
  control: 'none' | 'ceiling' | 'floor';
  controlPrice: number;
  showSurplus: boolean;
  showOriginal: boolean;
  xMax: number; yMax: number;
  qLabel: string; pLabel: string;
}

const PRESETS: { name: string; description: string; state: SDState }[] = [
  { name: 'Generic market', description: 'P = 10 − 0.1Q and P = 2 + 0.06Q', state: base({ a: 10, b: 0.1, c: 2, d: 0.06, xMax: 100, yMax: 12 }) },
  { name: 'Ice cream (Ch. 4)', description: 'Catherine + Nicholas demand, Ben + Jerry supply: equilibrium $2, 7 cones', state: base({ a: 19 / 6, b: 1 / 6, c: 5 / 6, d: 1 / 6, xMax: 20, yMax: 3.5, qLabel: 'Ice-cream cones', pLabel: 'Price of cone ($)' }) },
  { name: 'Heat wave', description: 'Demand shifts right: P rises to $2.50, Q to 10', state: base({ a: 19 / 6, b: 1 / 6, c: 5 / 6, d: 1 / 6, dShift: 6, xMax: 20, yMax: 3.5, qLabel: 'Ice-cream cones', pLabel: 'Price of cone ($)' }) },
  { name: 'Problem 10: ceiling $90', description: 'Qs = 2P, Qd = 300 − P with a $90 price ceiling', state: base({ a: 300, b: 1, c: 0, d: 0.5, control: 'ceiling', controlPrice: 90, xMax: 320, yMax: 320 }) },
  { name: 'Binding floor', description: 'Minimum price above equilibrium creates a surplus', state: base({ a: 300, b: 1, c: 0, d: 0.5, control: 'floor', controlPrice: 130, xMax: 320, yMax: 320 }) },
];

function base(s: Partial<SDState>): SDState {
  return { a: 10, b: 0.1, c: 2, d: 0.06, dShift: 0, sShift: 0, control: 'none', controlPrice: 0, showSurplus: true, showOriginal: true, xMax: 100, yMax: 12, qLabel: 'Quantity', pLabel: 'Price ($)', ...s };
}

export default function SupplyDemand({ initial, onChange, preset = 0 }: ModelProps<SDState>) {
  const start = useMemo(() => ({ ...PRESETS[preset].state, ...initial }), []); // eslint-disable-line
  const [s, setS] = useState<SDState>(start);
  const set = (p: Partial<SDState>) => setS((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(s); }, [s]); // eslint-disable-line

  const D0: LinearDemand = { a: s.a, b: s.b };
  const S0: LinearSupply = { c: s.c, d: s.d };
  const D = shiftDemand(D0, s.dShift);
  const S = shiftSupply(S0, s.sShift);
  const sValid = S.c >= 0;
  const eq0 = calculateEquilibrium(D0, S0);
  const eq = calculateEquilibrium(D, S);
  const w = marketWelfare(D, S);
  const ctrl = s.control !== 'none' ? calculatePriceControl(D, S, s.control, s.controlPrice || eq.price) : null;
  const shifted = s.dShift !== 0 || s.sShift !== 0;

  const P = ctrl?.binding ? ctrl.marketPrice : eq.price;
  const qT = ctrl?.binding ? ctrl.quantityTraded : eq.quantity;
  const dp = (q: number) => demandPrice(D, q);
  const sp = (q: number) => supplyPrice(S, q);
  const yStep = s.yMax / 100;
  const xStep = s.xMax / 100;

  const ensureControlPrice = (k: SDState['control']) => set({ control: k, controlPrice: k === 'ceiling' ? +(eq.price * 0.8).toFixed(2) : +(eq.price * 1.2).toFixed(2) });

  const chart = (
    <Plot xDomain={[0, s.xMax]} yDomain={[0, s.yMax]} xLabel={s.qLabel} yLabel={s.pLabel} title="Supply and demand diagram"
      readout={(x, y) => [`Q = ${fmt(x)}`, `P = ${fmt(y)}`, `demand price ${fmt(dp(x))}`, `supply price ${fmt(Math.max(0, sp(x)))}`]}>
      {s.showSurplus && qT > 0 && (
        <>
          <Area points={[[0, D.a], [qT, dp(qT)], [qT, P], [0, P]]} fill="var(--c-cs)" label="CS" labelAt={[qT / 3, (D.a + 2 * P) / 3 + (dp(qT) - P) / 3]} title="Consumer surplus" />
          <Area points={[[0, P], [qT, P], [qT, Math.max(0, sp(qT))], [0, Math.max(0, S.c)]]} fill="var(--c-ps)" label="PS" labelAt={[qT / 3, (P * 2 + S.c) / 3 - (P - sp(qT)) / 3]} title="Producer surplus" />
          {ctrl?.binding && eq.quantity - qT > 1e-9 && <Area points={[[qT, dp(qT)], [eq.quantity, eq.price], [qT, sp(qT)]]} fill="var(--c-dwl)" label="DWL" title="Deadweight loss" />}
        </>
      )}
      {s.showOriginal && shifted && (
        <>
          <Curve fn={(q) => demandPrice(D0, q)} color="var(--c-demand)" width={1.5} dashed />
          <Curve fn={(q) => supplyPrice(S0, q)} color="var(--c-supply)" width={1.5} dashed />
          <Dot x={eq0.quantity} y={eq0.price} r={3.5} color="var(--c-guide)" />
        </>
      )}
      <Curve fn={dp} color="var(--c-demand)" label={shifted ? 'D₂' : 'D'} labelAt={[Math.min(s.xMax * 0.92, Math.max(0, (D.a - s.yMax * 0.08) / D.b)), s.yMax * 0.08]} />
      <Curve fn={sp} color="var(--c-supply)" label={shifted ? 'S₂' : 'S'} labelAt={[s.xMax * 0.9, Math.min(s.yMax * 0.95, sp(s.xMax * 0.9)) + s.yMax * 0.03]} />
      <DragCurve fn={dp} title="Drag to shift demand" onDrag={(dx, dy) => set({ dShift: s.dShift + dx + dy / s.b })} />
      <DragCurve fn={sp} title="Drag to shift supply" onDrag={(dx, dy) => set({ sShift: s.sShift + dx - dy / s.d })} />
      {ctrl && (
        <>
          {ctrl.binding && <Guide x={ctrl.quantitySupplied} y={P} toY={false} xLabel={s.control === 'ceiling' ? 'Qs' : 'Qs'} />}
          {ctrl.binding && <Guide x={ctrl.quantityDemanded} y={P} toY={false} xLabel="Qd" />}
          <DragHLine y={s.controlPrice} onDrag={(v) => set({ controlPrice: +v.toFixed(3) })} color={s.control === 'ceiling' ? '#0d9488' : '#9333ea'} label={`${s.control === 'ceiling' ? 'Ceiling' : 'Floor'} ${money(s.controlPrice)}${ctrl.binding ? '' : ' (not binding)'}`} dashed />
        </>
      )}
      {eq.quantity > 0 && <Guide x={eq.quantity} y={eq.price} xLabel="Q*" yLabel="P*" />}
      {eq.quantity > 0 && <Dot x={eq.quantity} y={eq.price} r={6} color="var(--c-text)" label="E" />}
      <Handle x={0} y={D.a} axis="y" color="var(--c-demand)" ariaLabel="Demand intercept" step={yStep} onDrag={(_, y) => set({ a: Math.max(yStep, y - s.b * s.dShift) })} />
      <Handle x={Math.min(D.a / D.b, s.xMax)} y={D.a / D.b <= s.xMax ? 0 : dp(s.xMax)} axis={D.a / D.b <= s.xMax ? 'x' : 'y'} color="var(--c-demand)" r={6} ariaLabel="Demand slope (quantity intercept)" step={xStep}
        onDrag={(x, y) => {
          if (D.a / D.b <= s.xMax) { const b = D.a / Math.max(xStep, x); set({ b, a: D.a - b * s.dShift }); }
          else { const b = (D.a - y) / s.xMax; if (b > 0) set({ b, a: D.a - b * s.dShift }); }
        }} />
      <Handle x={0} y={Math.max(0, S.c)} axis="y" color="var(--c-supply)" ariaLabel="Supply intercept" step={yStep} onDrag={(_, y) => set({ c: y + s.d * s.sShift })} />
      <Handle x={s.xMax * 0.8} y={sp(s.xMax * 0.8)} axis="y" color="var(--c-supply)" r={6} ariaLabel="Supply slope" step={yStep}
        onDrag={(_, y) => { const d = (y - S.c) / (s.xMax * 0.8); if (d > 1e-4) set({ d, c: S.c + d * s.sShift }); }} />
    </Plot>
  );

  const controls = (
    <>
      <ControlGroup title="Demand  P = a − bQ" color="var(--c-demand)">
        <Slider label="Intercept a" value={s.a} min={s.yMax * 0.1} max={s.yMax * 1.5} step={yStep / 2} onChange={(a) => set({ a })} format={(v) => fmt(v)} />
        <Slider label="Slope b" value={s.b} min={(s.yMax / s.xMax) * 0.1} max={(s.yMax / s.xMax) * 5} step={(s.yMax / s.xMax) / 100} onChange={(b) => set({ b })} format={(v) => fmt(v, 3)} />
        <Slider label="Shift (← decrease · increase →)" value={s.dShift} min={-s.xMax / 2} max={s.xMax / 2} step={xStep / 2} onChange={(dShift) => set({ dShift })} format={(v) => `${v > 0 ? '+' : ''}${fmt(v, 1)}`} />
      </ControlGroup>
      <ControlGroup title="Supply  P = c + dQ" color="var(--c-supply)">
        <Slider label="Intercept c" value={s.c} min={0} max={s.yMax} step={yStep / 2} onChange={(c) => set({ c })} format={(v) => fmt(v)} />
        <Slider label="Slope d" value={s.d} min={(s.yMax / s.xMax) * 0.05} max={(s.yMax / s.xMax) * 5} step={(s.yMax / s.xMax) / 100} onChange={(d) => set({ d })} format={(v) => fmt(v, 3)} />
        <Slider label="Shift (← decrease · increase →)" value={s.sShift} min={-s.xMax / 2} max={s.xMax / 2} step={xStep / 2} onChange={(sShift) => set({ sShift })} format={(v) => `${v > 0 ? '+' : ''}${fmt(v, 1)}`} />
      </ControlGroup>
      <ControlGroup title="Government price control">
        <Segmented size="sm" value={s.control} onChange={(k) => (k === 'none' ? set({ control: 'none' }) : ensureControlPrice(k))}
          options={[{ value: 'none', label: 'None' }, { value: 'ceiling', label: 'Ceiling' }, { value: 'floor', label: 'Floor' }]} />
        {s.control !== 'none' && <Slider label={s.control === 'ceiling' ? 'Ceiling price' : 'Floor price'} value={s.controlPrice} min={0} max={s.yMax} step={yStep / 2} onChange={(controlPrice) => set({ controlPrice })} format={(v) => money(v)} />}
      </ControlGroup>
      <div className="space-y-2 px-1">
        <Toggle checked={s.showSurplus} onChange={(showSurplus) => set({ showSurplus })} label="Shade surplus areas" />
        <Toggle checked={s.showOriginal} onChange={(showOriginal) => set({ showOriginal })} label="Show original curves after a shift" />
      </div>
    </>
  );

  const stats = (
    <>
      <Stat label="Equilibrium price" value={money(eq.price)} hint={shifted ? `was ${money(eq0.price)}` : undefined} />
      <Stat label="Equilibrium qty" value={fmt(eq.quantity)} hint={shifted ? `was ${fmt(eq0.quantity)}` : undefined} />
      {ctrl?.binding ? (
        <>
          <Stat label="Market price" value={money(ctrl.marketPrice)} tone="accent" />
          <Stat label="Qd / Qs" value={`${fmt(ctrl.quantityDemanded)} / ${fmt(ctrl.quantitySupplied)}`} />
          <Stat label={ctrl.shortage > 0 ? 'Shortage' : 'Surplus'} value={fmt(ctrl.shortage || ctrl.surplus)} tone="bad" />
          <Stat label="Consumer surplus" value={money(ctrl.consumerSurplus)} hint={`free market ${money(w.consumerSurplus)}`} />
          <Stat label="Producer surplus" value={money(ctrl.producerSurplus)} hint={`free market ${money(w.producerSurplus)}`} />
          <Stat label="Deadweight loss" value={money(ctrl.deadweightLoss)} tone="bad" />
        </>
      ) : (
        <>
          <Stat label="Consumer surplus" value={money(w.consumerSurplus)} />
          <Stat label="Producer surplus" value={money(w.producerSurplus)} />
          <Stat label="Total surplus" value={money(w.totalSurplus)} tone="good" />
          {ctrl && <Stat label="Price control" value="not binding" hint="no effect on P or Q" />}
        </>
      )}
    </>
  );

  const explain = (
    <Explain text={[
      !sValid ? '**Note:** the shifted supply curve starts below a price of zero; surplus figures assume costs are non-negative, so read them with care.' : '',
      shifted ? `**What happened?** ${describeShift(s.dShift, s.sShift, eq0, eq)}` : '**Try it:** drag a curve sideways to shift it, drag the coloured dots on the axes to change intercepts and slopes, or hover anywhere to read off values.',
      ctrl ? (ctrl.binding
        ? (s.control === 'ceiling'
          ? `The ceiling of ${money(s.controlPrice)} is **below** the equilibrium price, so it binds. Buyers want ${fmt(ctrl.quantityDemanded)} but sellers offer only ${fmt(ctrl.quantitySupplied)}: a **shortage** of ${fmt(ctrl.shortage)}. Only ${fmt(ctrl.quantityTraded)} units trade, so the red triangle of mutually beneficial trades is lost (deadweight loss). Surplus numbers assume the scarce units reach the buyers who value them most — with queues or discrimination the real loss is larger.`
          : `The floor of ${money(s.controlPrice)} is **above** the equilibrium price, so it binds. Sellers offer ${fmt(ctrl.quantitySupplied)} but buyers take only ${fmt(ctrl.quantityDemanded)}: a **surplus** of ${fmt(ctrl.surplus)} (for labour: unemployment). Only ${fmt(ctrl.quantityTraded)} units trade.`)
        : `A ${s.control} at ${money(s.controlPrice)} is **not binding**: a ceiling only matters below $P^*$, a floor only above $P^*$. The market stays at equilibrium.`) : '',
    ].filter(Boolean).join('\n\n')} />
  );

  return (
    <ModelShell chart={chart} controls={controls} stats={stats} explain={explain}
      presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setS(PRESETS[i].state)} onReset={() => setS(start)}
      legend={<Legend items={[{ label: 'Demand', color: 'var(--c-demand)' }, { label: 'Supply', color: 'var(--c-supply)' }, { label: 'Consumer surplus', color: 'var(--c-cs)', kind: 'area' }, { label: 'Producer surplus', color: 'var(--c-ps)', kind: 'area' }, { label: 'Deadweight loss', color: 'var(--c-dwl)', kind: 'area' }]} />} />
  );
}

function describeShift(dShift: number, sShift: number, e0: { price: number; quantity: number }, e1: { price: number; quantity: number }): string {
  const parts: string[] = [];
  if (dShift > 0) parts.push('demand **increased** (shifted right)');
  if (dShift < 0) parts.push('demand **decreased** (shifted left)');
  if (sShift > 0) parts.push('supply **increased** (shifted right)');
  if (sShift < 0) parts.push('supply **decreased** (shifted left)');
  const dir = (v: number) => (Math.abs(v) < 1e-9 ? 'unchanged' : v > 0 ? 'rose' : 'fell');
  const both = dShift !== 0 && sShift !== 0;
  return `${parts.join(' and ')}. The price ${dir(e1.price - e0.price)} from ${money(e0.price)} to ${money(e1.price)} and the quantity ${dir(e1.quantity - e0.quantity)} from ${fmt(e0.quantity)} to ${fmt(e1.quantity)}.${both ? ' With **both** curves shifting, one of P or Q is ambiguous in general — its direction depends on the relative size of the shifts (Table 4 of Ch. 4).' : ' Note: the shift of one curve causes a *movement along* the other curve (a change in quantity supplied/demanded, not in supply/demand).'}`;
}
