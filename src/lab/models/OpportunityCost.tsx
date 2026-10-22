import { useEffect, useMemo, useState } from 'react';
import { Segmented, Stat, money } from '../../components/ui';
import { analyseChoices, marginalDecision, type Option } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface OppCostState {
  tab: 'choices' | 'margin';
  options: Option[];
  sunk: number; repairCost: number; priceIfFixed: number; priceIfNot: number;
  sunkLabel: string;
}

const CHOICES: { name: string; options: Option[] }[] = [
  { name: "Anne's Saturday (lecture)", options: [{ name: 'Movie', price: 50, benefit: 120 }, { name: 'Concert', price: 150, benefit: 250 }, { name: 'Party', price: 80, benefit: 170 }] },
  { name: 'Q12: movie with coupon', options: [{ name: 'First movie (with $3 coupon)', price: 4, benefit: 10 }, { name: 'New release with friend', price: 7, benefit: 15 }] },
  { name: 'Study, game or date', options: [{ name: 'Study', price: 0, benefit: 60 }, { name: 'Game', price: 0, benefit: 40 }, { name: 'Dating', price: 30, benefit: 100 }] },
];

const MARGINS = [
  { name: 'Toyota transmission A', state: { sunk: 10000, repairCost: 6000, priceIfFixed: 65000, priceIfNot: 57000, sunkLabel: 'Already spent on repairs' } },
  { name: 'Toyota transmission B', state: { sunk: 10000, repairCost: 6000, priceIfFixed: 60000, priceIfNot: 55000, sunkLabel: 'Already spent on repairs' } },
  { name: 'Q16: house & landfill', state: { sunk: 400000, repairCost: 50000, priceIfFixed: 390000, priceIfNot: 350000, sunkLabel: 'Price already paid for the house' } },
  { name: 'Problem 5: new product', state: { sunk: 5000000, repairCost: 1000000, priceIfFixed: 3000000, priceIfNot: 0, sunkLabel: 'Already invested in development' } },
];

export default function OpportunityCost({ initial, onChange }: ModelProps<OppCostState>) {
  const start = useMemo<OppCostState>(() => ({ tab: 'choices', options: CHOICES[0].options, ...MARGINS[0].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<OppCostState>(start);
  const set = (p: Partial<OppCostState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line
  const r = analyseChoices(st.options);
  const maxV = Math.max(1, ...r.analysis.map((o) => Math.max(o.benefit, o.opportunityCost)));
  const md = marginalDecision(st.priceIfFixed - st.priceIfNot, st.repairCost);
  const inp = 'h-9 w-full rounded-lg border border-ink-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-900';
  const setOpt = (i: number, p: Partial<Option>) => set({ options: st.options.map((o, j) => (j === i ? { ...o, ...p } : o)) });

  const choices = (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">{CHOICES.map((c) => <button key={c.name} className="chip border border-ink-200 hover:border-[var(--accent)] dark:border-ink-700" onClick={() => set({ options: c.options })}>{c.name}</button>)}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-xs text-ink-500"><th className="pb-2 pr-2">Option</th><th className="pr-2">Price paid</th><th className="pr-2">Benefit (WTP)</th><th className="pr-2">Net value</th><th className="pr-2">Best alternative</th><th className="pr-2">Opportunity cost</th><th /></tr></thead>
          <tbody>
            {r.analysis.map((o, i) => (
              <tr key={i} className={`border-t border-ink-100 dark:border-ink-800 ${r.best === o.name ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''}`}>
                <td className="py-1.5 pr-2"><input className={inp} value={o.name} onChange={(e) => setOpt(i, { name: e.target.value })} aria-label="Option name" /></td>
                <td className="pr-2"><input type="number" className={`${inp} w-24 font-mono`} value={o.price} onChange={(e) => setOpt(i, { price: Number(e.target.value) })} aria-label="Price" /></td>
                <td className="pr-2"><input type="number" className={`${inp} w-24 font-mono`} value={o.benefit} onChange={(e) => setOpt(i, { benefit: Number(e.target.value) })} aria-label="Benefit" /></td>
                <td className="pr-2 font-mono">{money(o.netValue, 0)}</td>
                <td className="pr-2 text-xs text-ink-500">{o.bestAlternative ?? 'do nothing'}</td>
                <td className="pr-2 font-mono font-semibold">{money(o.opportunityCost, 0)}</td>
                <td><button className="btn-ghost !p-1 text-xs" onClick={() => set({ options: st.options.filter((_, j) => j !== i) })} aria-label="Remove option" disabled={st.options.length <= 1}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-secondary !py-1.5 text-xs" onClick={() => set({ options: [...st.options, { name: `Option ${st.options.length + 1}`, price: 0, benefit: 0 }] })}>+ Add option</button>
      <div className="space-y-2" aria-label="Benefit versus opportunity cost">
        {r.analysis.map((o, i) => (
          <div key={i}>
            <div className="mb-0.5 flex justify-between text-xs"><span className="font-medium">{o.name}</span><span className={o.economicSurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}>benefit − OC = {money(o.economicSurplus, 0)}</span></div>
            <div className="h-2.5 rounded bg-ink-100 dark:bg-ink-800"><div className="h-full rounded bg-blue-500" style={{ width: `${(o.benefit / maxV) * 100}%` }} /></div>
            <div className="mt-0.5 h-2.5 rounded bg-ink-100 dark:bg-ink-800"><div className="h-full rounded bg-orange-500" style={{ width: `${(Math.max(0, o.opportunityCost) / maxV) * 100}%` }} /></div>
          </div>
        ))}
        <div className="flex gap-4 text-xs text-ink-500"><span><span className="mr-1 inline-block h-2 w-3 rounded bg-blue-500" />benefit</span><span><span className="mr-1 inline-block h-2 w-3 rounded bg-orange-500" />opportunity cost</span></div>
      </div>
    </div>
  );

  const field = (label: string, key: 'sunk' | 'repairCost' | 'priceIfFixed' | 'priceIfNot') => (
    <label className="block text-sm"><span className="mb-1 block text-ink-600 dark:text-ink-300">{label}</span><input type="number" className={`${inp} font-mono`} value={st[key]} onChange={(e) => set({ [key]: Number(e.target.value) } as Partial<OppCostState>)} /></label>
  );
  const margin = (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">{MARGINS.map((m) => <button key={m.name} className="chip border border-ink-200 hover:border-[var(--accent)] dark:border-ink-700" onClick={() => set(m.state)}>{m.name}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {field(st.sunkLabel + ' (sunk)', 'sunk')}
        {field('Cost of the next step (marginal cost)', 'repairCost')}
        {field('Value if you go ahead', 'priceIfFixed')}
        {field('Value if you stop here', 'priceIfNot')}
      </div>
      <div className={`rounded-xl p-4 ${md.worthIt ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-rose-50 dark:bg-rose-950/30'}`}>
        <div className="text-lg font-semibold">{md.worthIt ? '✓ Go ahead' : '✗ Do not go ahead'}</div>
        <div className="text-sm">Marginal benefit {money(st.priceIfFixed - st.priceIfNot, 0)} {md.worthIt ? '≥' : '<'} marginal cost {money(st.repairCost, 0)} → net gain {money(md.netGain, 0)}. The {money(st.sunk, 0)} already spent does not appear anywhere in this comparison.</div>
      </div>
    </div>
  );

  const stats = st.tab === 'choices'
    ? <><Stat label="Best choice" value={r.best ?? 'do nothing'} tone="good" /><Stat label="Its opportunity cost" value={money(r.analysis.find((o) => o.name === r.best)?.opportunityCost ?? 0, 0)} /><Stat label="Its benefit" value={money(r.analysis.find((o) => o.name === r.best)?.benefit ?? 0, 0)} /></>
    : <><Stat label="Marginal benefit" value={money(st.priceIfFixed - st.priceIfNot, 0)} /><Stat label="Marginal cost" value={money(st.repairCost, 0)} /><Stat label="Decision" value={md.worthIt ? 'go ahead' : 'stop'} tone={md.worthIt ? 'good' : 'bad'} /><Stat label="Sunk cost" value={money(st.sunk, 0)} hint="irrelevant" /></>;

  const explain = <Explain text={st.tab === 'choices'
    ? '**Opportunity cost = what you pay for the option + the net value of the best alternative you give up.** Only the *best* alternative counts, because you could only have done one of them. The best choice is the only one whose benefit exceeds its opportunity cost (equivalently: the option with the highest net value). In the Q12 version, with the first movie valued at V, the opportunity cost of the new release is 7 + (V − 4) = V + 3.'
    : '**Rational people think at the margin.** Compare only what changes with the decision: the extra value created versus the extra cost. Costs already incurred and unrecoverable — **sunk costs** — are the same whatever you decide, so they cannot affect which choice is better. The maximum you should pay for the next step equals the marginal benefit.'} />;

  return <ModelShell chart={<div className="space-y-4"><Segmented value={st.tab} onChange={(tab) => set({ tab })} options={[{ value: 'choices', label: 'Choosing between options' }, { value: 'margin', label: 'Marginal decisions & sunk cost' }]} />{st.tab === 'choices' ? choices : margin}</div>}
    controls={<ControlGroup title="How to use"><p className="text-sm text-ink-600 dark:text-ink-300">Edit any number in the table or the fields. Results update instantly. Load the lecture and exam examples with the chips above.</p></ControlGroup>}
    stats={stats} explain={explain} onReset={() => setSt(start)} />;
}
