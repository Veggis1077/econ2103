import { useEffect, useMemo, useState } from 'react';
import { Curve, Dot, Guide, Handle, Legend, Plot, Segment } from '../../components/charts';
import { Slider, Stat, fmt } from '../../components/ui';
import { calculateOpportunityCost, jointPPF, linearPPF, produce, producerFromTimes, simulateTrade, type Producer } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface TradeState {
  nameA: string; nameB: string; xName: string; yName: string; unit: string;
  totalTime: number;
  timeXA: number; timeYA: number; timeXB: number; timeYB: number;
  /** Share of time on X without trade. */
  noTradeA: number; noTradeB: number;
  /** Share of time on X with trade. */
  tradeShareA: number; tradeShareB: number;
  unitsOfX: number; unitsOfY: number;
}

const PRESETS: { name: string; description: string; state: TradeState }[] = [
  { name: 'Frank & Ruby', description: 'The Chapter 3 parable: meat and potatoes, 8 hours each', state: t({ nameA: 'Frank', nameB: 'Ruby', xName: 'Meat', yName: 'Potatoes', unit: 'oz', totalTime: 480, timeXA: 60, timeYA: 15, timeXB: 20, timeYB: 10, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0, tradeShareB: 0.75, unitsOfX: 5, unitsOfY: 15 }) },
  { name: 'Billy & Tony (Q6)', description: 'Minutes per pound of walnut / bread; 1 hour each', state: t({ nameA: 'Billy', nameB: 'Tony', xName: 'Walnut', yName: 'Bread', unit: 'lb', totalTime: 60, timeXA: 10, timeYA: 12, timeXB: 6, timeYB: 10, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0, tradeShareB: 0.85, unitsOfX: 3.2, unitsOfY: 2.3 }) },
  { name: 'Diego & Darnell', description: 'Problem set Ch. 3, P3: hours per pizza / gallon of root beer (12 h)', state: t({ nameA: 'Diego', nameB: 'Darnell', xName: 'Pizza', yName: 'Root beer', unit: 'units', totalTime: 12, timeXA: 2, timeYA: 4, timeXB: 4, timeYB: 6, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0.8, tradeShareB: 0, unitsOfX: 1.65, unitsOfY: 0.95 }) },
  { name: 'US & Japan', description: 'Per worker-month: US 1 car or 2 t food; Japan 1 car or 1 t food', state: t({ nameA: 'United States', nameB: 'Japan', xName: 'Cars', yName: 'Food (t)', unit: '', totalTime: 10, timeXA: 1, timeYA: 0.5, timeXB: 1, timeYB: 1, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0, tradeShareB: 1, unitsOfX: 5, unitsOfY: 7 }) },
];

function t(s: Partial<TradeState>): TradeState {
  return { nameA: 'A', nameB: 'B', xName: 'X', yName: 'Y', unit: '', totalTime: 100, timeXA: 1, timeYA: 1, timeXB: 1, timeYB: 1, noTradeA: 0.5, noTradeB: 0.5, tradeShareA: 0, tradeShareB: 1, unitsOfX: 0, unitsOfY: 0, ...s };
}

export default function Trade({ initial, onChange, preset = 0 }: ModelProps<TradeState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<TradeState>(start);
  const set = (p: Partial<TradeState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const A = producerFromTimes(st.nameA, st.timeXA, st.timeYA, st.totalTime);
  const B = producerFromTimes(st.nameB, st.timeXB, st.timeYB, st.totalTime);
  const adv = calculateOpportunityCost(A, B);
  const xExporter = adv.comparativeAdvantageX ?? st.nameB;
  const noTrade = { [A.name]: produce(A, st.noTradeA), [B.name]: produce(B, st.noTradeB) };
  const trade = simulateTrade(A, B, noTrade, { shareOnX: { [A.name]: st.tradeShareA, [B.name]: st.tradeShareB }, xExporter, unitsOfX: st.unitsOfX, unitsOfY: st.unitsOfY });
  const price = st.unitsOfX > 0 ? st.unitsOfY / st.unitsOfX : NaN;
  const range = adv.tradePriceRangeX;
  const priceOk = range ? price >= range[0] - 1e-9 && price <= range[1] + 1e-9 : false;
  const joint = jointPPF(A, B);

  const panel = (P: Producer, key: 'A' | 'B') => {
    const shareKey = key === 'A' ? 'tradeShareA' : 'tradeShareB';
    const ntKey = key === 'A' ? 'noTradeA' : 'noTradeB';
    const prod = trade.production[P.name];
    const cons = trade.consumption[P.name];
    const nt = noTrade[P.name];
    const xm = Math.max(P.maxX, cons.x, nt.x) * 1.25;
    const ym = Math.max(P.maxY, cons.y, nt.y) * 1.25;
    return (
      <div className="min-w-0">
        <div className="mb-1 text-center text-sm font-semibold">{P.name}</div>
        <Plot xDomain={[0, xm]} yDomain={[0, ym]} xLabel={st.xName} yLabel={st.yName} height={330} width={420} title={`${P.name}'s production possibilities frontier`}
          readout={(x, y) => [`${st.xName} ${fmt(x, 2)}`, `${st.yName} ${fmt(y, 2)}`, y > linearPPF(P, x) + 1e-9 ? 'outside own PPF' : 'feasible alone']}>
          <Curve points={[[0, P.maxY], [P.maxX, 0]]} color="var(--accent)" width={2.5} label="PPF" labelAt={[P.maxX * 0.55, linearPPF(P, P.maxX * 0.55) + ym * 0.05]} />
          <Segment from={[nt.x, nt.y]} to={[cons.x, cons.y]} color="#16a34a" dashed width={1.5} />
          <Guide x={cons.x} y={cons.y} />
          <Dot x={nt.x} y={nt.y} r={5} color="var(--c-guide)" label="N" labelOffset={[-16, -8]} />
          <Dot x={cons.x} y={cons.y} r={6} color="#16a34a" label="C" labelOffset={[8, -8]} />
          <Handle x={prod.x} y={prod.y} axis="x" color="var(--accent)" label="P" ariaLabel={`${P.name}'s production with trade`} step={P.maxX / 100}
            onDrag={(x) => set({ [shareKey]: Math.min(1, Math.max(0, x / P.maxX)) } as Partial<TradeState>)} />
          <Handle x={nt.x} y={nt.y} axis="x" color="var(--c-guide)" r={5} ariaLabel={`${P.name}'s production without trade`} step={P.maxX / 100}
            onDrag={(x) => set({ [ntKey]: Math.min(1, Math.max(0, x / P.maxX)) } as Partial<TradeState>)} />
        </Plot>
      </div>
    );
  };

  const chart = (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">{panel(A, 'A')}{panel(B, 'B')}</div>
      <details className="rounded-xl border border-ink-200/70 p-3 dark:border-ink-800">
        <summary className="cursor-pointer text-sm font-medium">Joint PPF of the two-person economy (digression in the slides)</summary>
        <div className="mx-auto mt-2 max-w-lg">
          <Plot xDomain={[0, (A.maxX + B.maxX) * 1.1]} yDomain={[0, (A.maxY + B.maxY) * 1.1]} xLabel={st.xName} yLabel={st.yName} height={300} title="Joint production possibilities frontier">
            <Curve points={joint.map((p) => [p.x, p.y] as [number, number])} color="var(--accent)" width={2.5} label="joint PPF" labelAt={[joint[1].x * 1.04, joint[1].y * 1.06]} />
            <Dot x={joint[1].x} y={joint[1].y} r={5} label="kink" />
          </Plot>
          <p className="text-xs text-ink-500">Start producing {st.xName} with the person who has the comparative advantage in it ({adv.comparativeAdvantageX ?? '—'}); only when they are fully specialised does the other person switch — hence the kink.</p>
        </div>
      </details>
    </div>
  );

  const controls = (
    <>
      <ControlGroup title={`Time per unit (total ${st.totalTime})`}>
        <Slider label={`${st.nameA}: ${st.xName}`} value={st.timeXA} min={st.timeXA / 4} max={st.timeXA * 3} step={st.timeXA / 40} onChange={(timeXA) => set({ timeXA })} format={(v) => fmt(v, 2)} />
        <Slider label={`${st.nameA}: ${st.yName}`} value={st.timeYA} min={st.timeYA / 4} max={st.timeYA * 3} step={st.timeYA / 40} onChange={(timeYA) => set({ timeYA })} format={(v) => fmt(v, 2)} />
        <Slider label={`${st.nameB}: ${st.xName}`} value={st.timeXB} min={st.timeXB / 4} max={st.timeXB * 3} step={st.timeXB / 40} onChange={(timeXB) => set({ timeXB })} format={(v) => fmt(v, 2)} />
        <Slider label={`${st.nameB}: ${st.yName}`} value={st.timeYB} min={st.timeYB / 4} max={st.timeYB * 3} step={st.timeYB / 40} onChange={(timeYB) => set({ timeYB })} format={(v) => fmt(v, 2)} />
      </ControlGroup>
      <ControlGroup title="Trade">
        <Slider label={`${xExporter} ships ${st.xName}`} value={st.unitsOfX} min={0} max={Math.max(A.maxX, B.maxX)} step={Math.max(A.maxX, B.maxX) / 200} onChange={(unitsOfX) => set({ unitsOfX })} format={(v) => fmt(v, 2)} />
        <Slider label={`…in exchange for ${st.yName}`} value={st.unitsOfY} min={0} max={Math.max(A.maxY, B.maxY)} step={Math.max(A.maxY, B.maxY) / 200} onChange={(unitsOfY) => set({ unitsOfY })} format={(v) => fmt(v, 2)} />
        {range && <button className="btn-secondary w-full !py-1.5 text-xs" onClick={() => set({ unitsOfY: +(st.unitsOfX * (range[0] + range[1]) / 2).toFixed(4) })}>Set price to the middle of the range</button>}
      </ControlGroup>
    </>
  );

  const stats = (
    <>
      <Stat label={`${st.nameA}: OC of 1 ${st.xName}`} value={fmt(adv.opportunityCosts[0].costOfX, 3)} hint={`${st.yName}; OC of ${st.yName}: ${fmt(adv.opportunityCosts[0].costOfY, 3)}`} />
      <Stat label={`${st.nameB}: OC of 1 ${st.xName}`} value={fmt(adv.opportunityCosts[1].costOfX, 3)} hint={`${st.yName}; OC of ${st.yName}: ${fmt(adv.opportunityCosts[1].costOfY, 3)}`} />
      <Stat label="Absolute advantage" value={`${st.xName}: ${adv.absoluteAdvantageX ?? 'tie'}`} hint={`${st.yName}: ${adv.absoluteAdvantageY ?? 'tie'}`} />
      <Stat label="Comparative advantage" value={`${st.xName}: ${adv.comparativeAdvantageX ?? 'none'}`} hint={`${st.yName}: ${adv.comparativeAdvantageY ?? 'none'}`} tone="accent" />
      <Stat label={`Price of 1 ${st.xName}`} value={Number.isFinite(price) ? fmt(price, 3) : '—'} hint={range ? `mutually beneficial: ${fmt(range[0], 3)}–${fmt(range[1], 3)}` : 'no gains possible'} tone={priceOk ? 'good' : 'bad'} />
      <Stat label={`${st.nameA} gains`} value={`${fmt(trade.gains[A.name].x, 2)} ${st.xName}`} hint={`${fmt(trade.gains[A.name].y, 2)} ${st.yName}`} tone={trade.gains[A.name].x >= -1e-9 && trade.gains[A.name].y >= -1e-9 ? 'good' : 'bad'} />
      <Stat label={`${st.nameB} gains`} value={`${fmt(trade.gains[B.name].x, 2)} ${st.xName}`} hint={`${fmt(trade.gains[B.name].y, 2)} ${st.yName}`} tone={trade.gains[B.name].x >= -1e-9 && trade.gains[B.name].y >= -1e-9 ? 'good' : 'bad'} />
      <Stat label="Both better off?" value={trade.bothBetterOff ? 'Yes' : 'No'} tone={trade.bothBetterOff ? 'good' : 'bad'} />
    </>
  );

  const ca = adv.comparativeAdvantageX;
  const explain = (
    <Explain text={[
      `**Opportunity costs** come from the times: for ${st.nameA}, one ${st.xName} takes ${fmt(st.timeXA)} while one ${st.yName} takes ${fmt(st.timeYA)}, so 1 ${st.xName} costs ${fmt(st.timeXA)}/${fmt(st.timeYA)} = ${fmt(adv.opportunityCosts[0].costOfX, 3)} ${st.yName}. The two opportunity costs of each person are **reciprocals**.`,
      ca ? `**Comparative advantage:** ${ca} has the lower opportunity cost of ${st.xName}, so ${ca} should specialise in ${st.xName}; the other person specialises in ${st.yName}. ${adv.absoluteAdvantageX && adv.absoluteAdvantageX === adv.absoluteAdvantageY ? `Note that ${adv.absoluteAdvantageX} has the **absolute** advantage in both goods — yet trade still benefits both, because no one can have the comparative advantage in both.` : ''}`
        : '**Equal opportunity costs:** neither has a comparative advantage, so there are no gains from specialisation and trade at any price.',
      range ? `**Price of trade:** for both to gain, 1 ${st.xName} must trade for between ${fmt(range[0], 3)} and ${fmt(range[1], 3)} ${st.yName} — between the two opportunity costs. Current price: ${Number.isFinite(price) ? fmt(price, 3) : '—'} ${priceOk ? '✓ inside the range' : '✗ outside the range'}.` : '',
      trade.bothBetterOff ? '**Result:** both consume **outside their own PPF** (green points) — trade expands consumption possibilities.' : 'Adjust the production shares (drag the blue production points) and the trade until both green consumption points lie on or beyond the no-trade points.',
    ].filter(Boolean).join('\n\n')} />
  );

  return <ModelShell chart={chart} controls={controls} stats={stats} explain={explain} presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
    legend={<Legend items={[{ label: 'PPF (= consumption possibilities without trade)', color: 'var(--accent)' }, { label: 'P = production with trade (drag)', color: 'var(--accent)' }, { label: 'N = no-trade point (drag)', color: 'var(--c-guide)' }, { label: 'C = consumption with trade', color: '#16a34a' }]} />} />;
}
