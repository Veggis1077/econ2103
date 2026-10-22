import { useEffect, useMemo, useState } from 'react';
import { Curve, Dot, Guide, Legend, Plot, Segment } from '../../components/charts';
import { Slider, Stat, fmt, money } from '../../components/ui';
import { calculateEquilibrium, demandPrice, shiftDemand, shiftSupply, supplyPrice } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

interface Event {
  id: string;
  group: string;
  label: string;
  /** +1 increase (right), −1 decrease (left), 0 no shift. */
  demand: -1 | 0 | 1;
  supply: -1 | 0 | 1;
  determinant: string;
  why: string;
  /** For own-price changes: a movement along the curve. */
  movement?: boolean;
}

const EVENTS: Event[] = [
  { id: 'inc-normal', group: 'Demand shifters', label: 'Income rises (normal good)', demand: 1, supply: 0, determinant: 'Income', why: 'For a normal good, higher income raises the quantity demanded at every price.' },
  { id: 'inc-inferior', group: 'Demand shifters', label: 'Income rises (inferior good)', demand: -1, supply: 0, determinant: 'Income', why: 'For an inferior good (e.g. bus rides), higher income lowers demand.' },
  { id: 'sub-up', group: 'Demand shifters', label: 'Price of a substitute rises', demand: 1, supply: 0, determinant: 'Prices of related goods', why: 'When frozen yogurt gets dearer, some buyers switch to ice cream.' },
  { id: 'comp-up', group: 'Demand shifters', label: 'Price of a complement rises', demand: -1, supply: 0, determinant: 'Prices of related goods', why: 'When hot fudge gets dearer, ice cream sundaes are less attractive.' },
  { id: 'tastes', group: 'Demand shifters', label: 'Tastes shift toward the good / hot summer', demand: 1, supply: 0, determinant: 'Tastes', why: 'Buyers want more at any given price (course example: heat wave and ice cream).' },
  { id: 'exp-price', group: 'Demand shifters', label: 'Buyers expect a higher price tomorrow', demand: 1, supply: 0, determinant: 'Expectations', why: 'Buying now before the price rises increases current demand.' },
  { id: 'buyers-down', group: 'Demand shifters', label: 'Number of buyers falls (Q22)', demand: -1, supply: 0, determinant: 'Number of buyers', why: 'Market demand is the horizontal sum of individual demands: fewer buyers, less demand.' },
  { id: 'own-price', group: 'Not a shift!', label: "The good's own price rises", demand: 0, supply: 0, movement: true, determinant: 'Price of the good itself', why: 'A change in the good’s own price is a **movement along** the curves (quantity demanded falls, quantity supplied rises) — neither curve shifts.' },
  { id: 'input-up', group: 'Supply shifters', label: 'Input prices rise (sugar for ice cream)', demand: 0, supply: -1, determinant: 'Input prices', why: 'Higher costs make production less profitable at every price.' },
  { id: 'tech', group: 'Supply shifters', label: 'Technology improves', demand: 0, supply: 1, determinant: 'Technology', why: 'Lower marginal costs let firms supply more at any price.' },
  { id: 'exp-sellers', group: 'Supply shifters', label: 'Sellers expect a higher price tomorrow', demand: 0, supply: -1, determinant: 'Expectations', why: 'Sellers hold back current supply to sell later at the higher price.' },
  { id: 'sellers-up', group: 'Supply shifters', label: 'Number of sellers rises', demand: 0, supply: 1, determinant: 'Number of sellers', why: 'More sellers ⇒ more supplied at every price.' },
  { id: 'trucks-a', group: 'Pickup trucks (PS Ch. 4, P3)', label: 'a. Fracking lowers the price of gasoline', demand: 1, supply: 0, determinant: 'Price of a complement', why: 'Gasoline and trucks are complements: cheaper gas raises truck demand.' },
  { id: 'trucks-b', group: 'Pickup trucks (PS Ch. 4, P3)', label: 'b. Steel strike raises steel prices', demand: 0, supply: -1, determinant: 'Input prices', why: 'Steel is an input: higher cost lowers truck supply.' },
  { id: 'trucks-c', group: 'Pickup trucks (PS Ch. 4, P3)', label: 'c. New automated machinery', demand: 0, supply: 1, determinant: 'Technology', why: 'Cheaper production raises truck supply.' },
  { id: 'trucks-d', group: 'Pickup trucks (PS Ch. 4, P3)', label: 'd. Price of SUVs rises', demand: 1, supply: 0, determinant: 'Price of a substitute', why: 'SUVs are substitutes: buyers switch to pickup trucks.' },
  { id: 'trucks-e', group: 'Pickup trucks (PS Ch. 4, P3)', label: 'e. Stock market crash lowers wealth', demand: -1, supply: 0, determinant: 'Income / wealth', why: 'Trucks are a normal good: lower wealth lowers demand.' },
  { id: 'both-heat', group: 'Both curves shift', label: 'Heat wave + hurricane hits sugar', demand: 1, supply: -1, determinant: 'Tastes and input prices', why: 'Demand rises and supply falls: the price **rises** for sure; the quantity depends on which shift is bigger (Figure 12).' },
  { id: 'both-oranges', group: 'Both curves shift', label: 'Oranges prevent diabetes + new fertilizer (PS P9)', demand: 1, supply: 1, determinant: 'Tastes and technology', why: 'Both increase: the quantity **rises** for sure; the price is ambiguous.' },
];

export interface ShiftState { eventId: string; size: number; size2: number }

export default function ShiftAnalyzer({ initial, onChange }: ModelProps<ShiftState>) {
  const start = useMemo<ShiftState>(() => ({ eventId: 'inc-normal', size: 20, size2: 20, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<ShiftState>(start);
  const set = (p: Partial<ShiftState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line
  const ev = EVENTS.find((e) => e.id === st.eventId)!;
  const D0 = { a: 10, b: 0.1 };
  const S0 = { c: 2, d: 0.06 };
  const both = ev.demand !== 0 && ev.supply !== 0;
  const D1 = shiftDemand(D0, ev.demand * st.size);
  const S1 = shiftSupply(S0, ev.supply * (both ? st.size2 : st.size));
  const e0 = calculateEquilibrium(D0, S0);
  const e1 = calculateEquilibrium(D1, S1);
  const ownP = e0.price + 1.5;
  const dir = (v: number) => (Math.abs(v) < 1e-9 ? 'unchanged' : v > 0 ? '↑ rises' : '↓ falls');
  const groups = [...new Set(EVENTS.map((e) => e.group))];

  const chart = (
    <Plot xDomain={[0, 120]} yDomain={[0, 14]} xLabel="Quantity" yLabel="Price ($)" title="Shift of supply or demand">
      {ev.demand !== 0 && <Curve fn={(q) => demandPrice(D0, q)} color="var(--c-demand)" dashed width={1.5} label="D₁" labelAt={[96, demandPrice(D0, 96) + 0.6]} />}
      {ev.supply !== 0 && <Curve fn={(q) => supplyPrice(S0, q)} color="var(--c-supply)" dashed width={1.5} label="S₁" labelAt={[110, supplyPrice(S0, 110) + 0.5]} />}
      <Curve fn={(q) => demandPrice(D1, q)} color="var(--c-demand)" label={ev.demand ? 'D₂' : 'D'} labelAt={[Math.min(115, D1.a / D1.b * 0.97), 0.8]} />
      <Curve fn={(q) => supplyPrice(S1, q)} color="var(--c-supply)" label={ev.supply ? 'S₂' : 'S'} labelAt={[100, Math.min(13.4, supplyPrice(S1, 100) + 0.5)]} />
      {ev.demand !== 0 && <Segment from={[60, demandPrice(D0, 60)]} to={[60 + ev.demand * st.size * 0.8, demandPrice(D0, 60)]} color="var(--c-demand)" width={2} label={ev.demand > 0 ? '→' : '←'} />}
      {ev.supply !== 0 && <Segment from={[40, supplyPrice(S0, 40)]} to={[40 + ev.supply * (both ? st.size2 : st.size) * 0.8, supplyPrice(S0, 40)]} color="var(--c-supply)" width={2} label={ev.supply > 0 ? '→' : '←'} />}
      <Dot x={e0.quantity} y={e0.price} r={4.5} color="var(--c-guide)" label="E₁" />
      {!ev.movement && (ev.demand || ev.supply) && <><Guide x={e1.quantity} y={e1.price} xLabel="Q₂" yLabel="P₂" /><Dot x={e1.quantity} y={e1.price} r={6} label="E₂" /></>}
      {ev.movement && (
        <>
          <Guide x={(D0.a - ownP) / D0.b} y={ownP} xLabel="Qd" />
          <Guide x={(ownP - S0.c) / S0.d} y={ownP} xLabel="Qs" />
          <Dot x={(D0.a - ownP) / D0.b} y={ownP} r={5} color="var(--c-demand)" label="along D" />
          <Dot x={(ownP - S0.c) / S0.d} y={ownP} r={5} color="var(--c-supply)" label="along S" />
        </>
      )}
    </Plot>
  );

  const controls = (
    <>
      <ControlGroup title="Choose an event">
        <select value={st.eventId} onChange={(e) => set({ eventId: e.target.value })} className="h-10 w-full rounded-lg border border-ink-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-900" aria-label="Event">
          {groups.map((g) => <optgroup key={g} label={g}>{EVENTS.filter((e) => e.group === g).map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}</optgroup>)}
        </select>
      </ControlGroup>
      {!ev.movement && (
        <ControlGroup title="Size of the shift">
          <Slider label={both ? 'Demand shift' : 'Shift'} value={st.size} min={5} max={40} onChange={(size) => set({ size })} />
          {both && <Slider label="Supply shift" value={st.size2} min={5} max={40} onChange={(size2) => set({ size2 })} hint="Change the relative sizes: the ambiguous variable can go either way." />}
        </ControlGroup>
      )}
    </>
  );

  const stats = ev.movement
    ? <><Stat label="Curves shift?" value="No" tone="accent" /><Stat label="Quantity demanded" value="↓ falls" /><Stat label="Quantity supplied" value="↑ rises" /><Stat label="At P above P*" value="surplus" hint="price falls back" /></>
    : <><Stat label="Curve" value={[ev.demand ? `Demand ${ev.demand > 0 ? '↑' : '↓'}` : '', ev.supply ? `Supply ${ev.supply > 0 ? '↑' : '↓'}` : ''].filter(Boolean).join(', ')} /><Stat label="Determinant" value={ev.determinant} /><Stat label="Equilibrium price" value={dir(e1.price - e0.price)} hint={`${money(e0.price)} → ${money(e1.price)}`} /><Stat label="Equilibrium quantity" value={dir(e1.quantity - e0.quantity)} hint={`${fmt(e0.quantity)} → ${fmt(e1.quantity)}`} /></>;

  const explain = <Explain text={[
    `**Step 1 — which curve?** ${ev.movement ? 'Neither.' : ev.demand && ev.supply ? 'Both demand and supply.' : ev.demand ? 'Demand (it changes what buyers want at each price).' : 'Supply (it changes what sellers offer at each price).'} ${ev.why}`,
    ev.movement ? '' : `**Step 2 — which direction?** ${[ev.demand ? `demand shifts ${ev.demand > 0 ? 'right (increase)' : 'left (decrease)'}` : '', ev.supply ? `supply shifts ${ev.supply > 0 ? 'right (increase)' : 'left (decrease)'}` : ''].filter(Boolean).join(' and ')}.`,
    ev.movement ? '' : `**Step 3 — compare equilibria:** price ${dir(e1.price - e0.price)}, quantity ${dir(e1.quantity - e0.quantity)}.${both ? ' With both curves shifting, try different relative sizes — one of the two results flips (Table 4 in the lecture).' : ''}`,
  ].filter(Boolean).join('\n\n')} />;

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'before (dashed)', color: 'var(--c-guide)', kind: 'dashed' }, { label: 'Demand', color: 'var(--c-demand)' }, { label: 'Supply', color: 'var(--c-supply)' }]} />} />;
}
