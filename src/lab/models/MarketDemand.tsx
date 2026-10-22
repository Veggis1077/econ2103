import { useEffect, useMemo, useState } from 'react';
import { Curve, Dot, HLine, Legend, Plot, Segment } from '../../components/charts';
import { Segmented, Slider, Stat, money } from '../../components/ui';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

const PRICES = [0, 0.5, 1, 1.5, 2, 2.5, 3];
const DEFAULT = {
  demand: { names: ['Catherine', 'Nicholas'], q: [[12, 10, 8, 6, 4, 2, 0], [7, 6, 5, 4, 3, 2, 1]] },
  supply: { names: ['Ben', 'Jerry'], q: [[0, 0, 1, 2, 3, 4, 5], [0, 0, 0, 2, 4, 6, 8]] },
};

export interface MarketDemandState {
  side: 'demand' | 'supply' | 'market';
  priceIndex: number;
  demand: number[][];
  supply: number[][];
}

export default function MarketDemand({ initial, onChange }: ModelProps<MarketDemandState>) {
  const start = useMemo<MarketDemandState>(() => ({ side: 'demand', priceIndex: 4, demand: DEFAULT.demand.q, supply: DEFAULT.supply.q, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<MarketDemandState>(start);
  const set = (p: Partial<MarketDemandState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const sum = (rows: number[][]) => PRICES.map((_, i) => rows.reduce((s, r) => s + r[i], 0));
  const mD = sum(st.demand);
  const mS = sum(st.supply);
  const pI = st.priceIndex;
  const P = PRICES[pI];
  const eqIdx = PRICES.findIndex((_, i) => mD[i] === mS[i]);
  const colorsD = ['#60a5fa', '#a78bfa'];
  const colorsS = ['#fdba74', '#f472b6'];
  const pts = (q: number[]) => q.map((x, i) => [x, PRICES[i]] as [number, number]);
  const show = st.side;
  const xMax = Math.max(20, ...mD, ...mS) * 1.05;

  const chart = (
    <Plot xDomain={[0, xMax]} yDomain={[0, 3.3]} xLabel="Ice-cream cones" yLabel="Price of cone ($)" yTicks={PRICES} title="Market demand and supply as horizontal sums">
      <HLine y={P} color="var(--c-guide)" dashed width={1} />
      {(show === 'demand' || show === 'market') && (
        <>
          {show === 'demand' && st.demand.map((q, k) => <Curve key={k} points={pts(q)} color={colorsD[k]} width={2} label={DEFAULT.demand.names[k]} labelAt={[q[1] + 0.3, PRICES[1] + 0.05]} />)}
          <Curve points={pts(mD)} color="var(--c-demand)" width={3.5} label="Market demand" labelAt={[mD[5] + 0.4, PRICES[5] + 0.07]} />
          {show === 'demand' && (
            <>
              <Segment from={[0, P]} to={[st.demand[0][pI], P]} color={colorsD[0]} width={5} />
              <Segment from={[st.demand[0][pI], P]} to={[mD[pI], P]} color={colorsD[1]} width={5} />
            </>
          )}
          <Dot x={mD[pI]} y={P} r={5} color="var(--c-demand)" label={`${mD[pI]}`} />
        </>
      )}
      {(show === 'supply' || show === 'market') && (
        <>
          {show === 'supply' && st.supply.map((q, k) => <Curve key={k} points={pts(q)} color={colorsS[k]} width={2} label={DEFAULT.supply.names[k]} labelAt={[q[6] + 0.3, PRICES[6] - 0.05]} />)}
          <Curve points={pts(mS)} color="var(--c-supply)" width={3.5} label="Market supply" labelAt={[mS[6] + 0.3, PRICES[6] + 0.05]} />
          {show === 'supply' && (
            <>
              <Segment from={[0, P]} to={[st.supply[0][pI], P]} color={colorsS[0]} width={5} />
              <Segment from={[st.supply[0][pI], P]} to={[mS[pI], P]} color={colorsS[1]} width={5} />
            </>
          )}
          <Dot x={mS[pI]} y={P} r={5} color="var(--c-supply)" label={`${mS[pI]}`} labelOffset={[8, 16]} />
        </>
      )}
      {show === 'market' && eqIdx >= 0 && <Dot x={mD[eqIdx]} y={PRICES[eqIdx]} r={7} color="var(--c-text)" label="equilibrium" />}
    </Plot>
  );

  const editRow = (side: 'demand' | 'supply', k: number) => (
    <tr key={`${side}${k}`} className="border-t border-ink-100 dark:border-ink-800">
      <td className="py-1 pr-2 text-xs font-medium">{DEFAULT[side].names[k]}</td>
      {PRICES.map((_, i) => (
        <td key={i} className="px-0.5"><input type="number" min={0} value={st[side][k][i]} aria-label={`${DEFAULT[side].names[k]} at $${PRICES[i]}`}
          onChange={(e) => set({ [side]: st[side].map((r, rk) => (rk === k ? r.map((v, vi) => (vi === i ? Math.max(0, Number(e.target.value)) : v)) : r)) } as Partial<MarketDemandState>)}
          className={`h-8 w-11 rounded border border-ink-200 bg-white text-center font-mono text-xs dark:border-ink-700 dark:bg-ink-900 ${i === pI ? 'ring-1 ring-[var(--accent)]' : ''}`} /></td>
      ))}
    </tr>
  );

  const tableView = (
    <div className="overflow-x-auto">
      <table className="text-sm">
        <thead><tr><th className="pr-2 text-left text-xs text-ink-500">Price</th>{PRICES.map((p) => <th key={p} className="px-0.5 text-xs font-medium">{money(p)}</th>)}</tr></thead>
        <tbody>
          {(show !== 'supply') && st.demand.map((_, k) => editRow('demand', k))}
          {(show !== 'supply') && <tr className="border-t-2 border-ink-300 dark:border-ink-600"><td className="py-1 pr-2 text-xs font-semibold text-blue-600">Market Qd</td>{mD.map((v, i) => <td key={i} className="text-center font-mono text-xs font-semibold">{v}</td>)}</tr>}
          {(show !== 'demand') && st.supply.map((_, k) => editRow('supply', k))}
          {(show !== 'demand') && <tr className="border-t-2 border-ink-300 dark:border-ink-600"><td className="py-1 pr-2 text-xs font-semibold text-orange-600">Market Qs</td>{mS.map((v, i) => <td key={i} className="text-center font-mono text-xs font-semibold">{v}</td>)}</tr>}
        </tbody>
      </table>
    </div>
  );

  const controls = (
    <>
      <Segmented size="sm" value={st.side} onChange={(side) => set({ side })} options={[{ value: 'demand', label: 'Demand' }, { value: 'supply', label: 'Supply' }, { value: 'market', label: 'Market' }]} />
      <ControlGroup title="Price"><Slider label="Price of a cone" value={pI} min={0} max={PRICES.length - 1} step={1} onChange={(priceIndex) => set({ priceIndex })} format={(i) => money(PRICES[i])} /></ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label="Price" value={money(P)} />
      <Stat label="Market Qd" value={mD[pI]} hint={st.demand.map((r) => r[pI]).join(' + ')} />
      <Stat label="Market Qs" value={mS[pI]} hint={st.supply.map((r) => r[pI]).join(' + ')} />
      <Stat label="Market status" value={mD[pI] > mS[pI] ? `shortage ${mD[pI] - mS[pI]}` : mD[pI] < mS[pI] ? `surplus ${mS[pI] - mD[pI]}` : 'equilibrium'} tone={mD[pI] === mS[pI] ? 'good' : 'bad'} />
    </>
  );

  const explain = <div className="space-y-4">{tableView}<Explain text={[
    `**Horizontal summation:** at each price, add the **quantities** of all buyers (or sellers). At ${money(P)}: ${st.demand.map((r, k) => `${DEFAULT.demand.names[k]} ${r[pI]}`).join(' + ')} = **${mD[pI]}** cones demanded; ${st.supply.map((r, k) => `${DEFAULT.supply.names[k]} ${r[pI]}`).join(' + ')} = **${mS[pI]}** supplied. Never add prices vertically.`,
    eqIdx >= 0 ? `In the market view, quantity supplied equals quantity demanded at **${money(PRICES[eqIdx])}** (${mD[eqIdx]} cones). Above it there is a surplus that pushes the price down; below it a shortage pushes it up — the **law of supply and demand**.` : 'Edit the schedules: with these numbers no listed price clears the market exactly.',
  ].join('\n\n')} /></div>;

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'Market demand', color: 'var(--c-demand)' }, { label: 'Market supply', color: 'var(--c-supply)' }, { label: 'individual schedules', color: '#a78bfa' }]} />} />;
}
