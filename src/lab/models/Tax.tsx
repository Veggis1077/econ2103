import { useEffect, useMemo, useState } from 'react';
import { Area, Curve, Dot, Guide, Handle, Label, Legend, Plot, VLine } from '../../components/charts';
import { Segmented, Slider, Stat, Toggle, fmt, money, pct } from '../../components/ui';
import { calculateSubsidy, calculateTaxIncidence, demandPrice, lafferCurve, marketWelfare, revenueMaximizingTax, supplyPrice } from '../../economics';
import { ControlGroup, Explain, ModelShell, type ModelProps } from '../ModelShell';

export interface TaxState {
  a: number; b: number; c: number; d: number;
  /** Per-unit tax (positive) or subsidy (negative). */
  t: number;
  leviedOn: 'sellers' | 'buyers';
  showAreas: boolean;
  xMax: number; yMax: number;
}

const PRESETS: { name: string; description: string; state: TaxState }[] = [
  { name: 'Generic market', description: 'P = 10 − 0.1Q, P = 2 + 0.06Q', state: s({ a: 10, b: 0.1, c: 2, d: 0.06, t: 2, xMax: 100, yMax: 12 }) },
  { name: 'Problem 10 (Ch. 8)', description: 'Qs = 2P, Qd = 300 − P with tax T', state: s({ a: 300, b: 1, c: 0, d: 0.5, t: 30, xMax: 320, yMax: 320 }) },
  { name: 'Q10 figure', description: 'Demand P = 44 − 0.8Q, supply P = 4 + 0.8Q, tax $16', state: s({ a: 44, b: 0.8, c: 4, d: 0.8, t: 16, xMax: 60, yMax: 48 }) },
  { name: 'Luxury tax (yachts)', description: 'Elastic demand, inelastic supply: sellers bear most', state: s({ a: 14, b: 0.04, c: 0, d: 0.16, t: 3, xMax: 100, yMax: 16 }) },
  { name: 'Cigarettes', description: 'Inelastic demand, elastic supply: buyers bear most', state: s({ a: 18, b: 0.18, c: 3, d: 0.03, t: 3, xMax: 100, yMax: 20 }) },
];

function s(p: Partial<TaxState>): TaxState {
  return { a: 10, b: 0.1, c: 2, d: 0.06, t: 2, leviedOn: 'sellers', showAreas: true, xMax: 100, yMax: 12, ...p };
}

export default function Tax({ initial, onChange, preset = 0 }: ModelProps<TaxState>) {
  const start = useMemo(() => ({ ...PRESETS[Math.min(preset, PRESETS.length - 1)].state, ...initial }), []); // eslint-disable-line
  const [st, setSt] = useState<TaxState>(start);
  const set = (p: Partial<TaxState>) => setSt((o) => ({ ...o, ...p }));
  useEffect(() => { onChange?.(st); }, [st]); // eslint-disable-line

  const D = { a: st.a, b: st.b };
  const S = { c: st.c, d: st.d };
  const w = marketWelfare(D, S);
  const eq = w.equilibrium;
  const isSubsidy = st.t < 0;
  const tax = isSubsidy ? null : calculateTaxIncidence(D, S, st.t);
  const sub = isSubsidy ? calculateSubsidy(D, S, -st.t) : null;
  const q = tax ? tax.quantity : sub!.quantity;
  const pB = tax ? tax.buyerPrice : sub!.buyerPrice;
  const pS = tax ? tax.sellerPrice : sub!.sellerPrice;
  const dp = (x: number) => demandPrice(D, x);
  const sp = (x: number) => supplyPrice(S, x);
  const maxTax = Math.max(0, st.a - st.c);
  const laffer = useMemo(() => lafferCurve(D, S, 80), [st.a, st.b, st.c, st.d]); // eslint-disable-line
  const tStar = revenueMaximizingTax(D, S);

  const chart = (
    <Plot xDomain={[0, st.xMax]} yDomain={[0, st.yMax]} xLabel="Quantity" yLabel="Price ($)" title="Tax wedge diagram"
      readout={(x, y) => [`Q = ${fmt(x)}`, `P = ${fmt(y)}`, `buyers' value ${fmt(dp(x))}`, `sellers' cost ${fmt(Math.max(0, sp(x)))}`]}>
      {st.showAreas && q > 0 && !isSubsidy && (
        <>
          <Area points={[[0, st.a], [q, pB], [0, pB]]} fill="var(--c-cs)" label="CS" title="Consumer surplus with tax" />
          <Area points={[[0, pS], [q, pS], [0, st.c]]} fill="var(--c-ps)" label="PS" title="Producer surplus with tax" />
          <Area points={[[0, pB], [q, pB], [q, pS], [0, pS]]} fill="var(--c-rev)" label="Tax revenue" title="Government revenue = t × Q" />
          {eq.quantity - q > 1e-9 && <Area points={[[q, pB], [eq.quantity, eq.price], [q, pS]]} fill="var(--c-dwl)" label="DWL" title="Deadweight loss" />}
        </>
      )}
      {st.showAreas && isSubsidy && q > eq.quantity && (
        <Area points={[[eq.quantity, eq.price], [q, pS], [q, pB]]} fill="var(--c-dwl)" label="DWL" title="Deadweight loss of the subsidy: units whose cost exceeds their value" />
      )}
      {st.t !== 0 && (st.leviedOn === 'sellers'
        ? <Curve fn={(x) => sp(x) + st.t} color="var(--c-supply)" dashed width={2} label={isSubsidy ? 'S − s' : 'S + t'} labelAt={[st.xMax * 0.78, Math.min(st.yMax * 0.96, sp(st.xMax * 0.78) + st.t) + st.yMax * 0.03]} />
        : <Curve fn={(x) => dp(x) - st.t} color="var(--c-demand)" dashed width={2} label={isSubsidy ? 'D + s' : 'D − t'} labelAt={[Math.min(st.xMax * 0.85, Math.max(0, (st.a - st.t) / st.b) * 0.85), Math.max(0, dp(Math.min(st.xMax * 0.85, Math.max(0, (st.a - st.t) / st.b) * 0.85)) - st.t) + st.yMax * 0.03]} />)}
      <Curve fn={dp} color="var(--c-demand)" label="D" labelAt={[Math.min(st.xMax * 0.95, st.a / st.b * 0.97), st.yMax * 0.04]} />
      <Curve fn={sp} color="var(--c-supply)" label="S" labelAt={[st.xMax * 0.93, Math.min(st.yMax * 0.92, sp(st.xMax * 0.93))]} />
      <Guide x={eq.quantity} y={eq.price} toX={false} />
      <Dot x={eq.quantity} y={eq.price} r={4} color="var(--c-guide)" label="E₀" />
      {q > 0 && (
        <>
          <Guide x={q} y={Math.max(pB, pS)} yLabel={isSubsidy ? 'Ps' : 'Pb'} xLabel="Q_T" />
          <Guide x={q} y={Math.min(pB, pS)} yLabel={isSubsidy ? 'Pb' : 'Ps'} toX={false} />
                    <Dot x={q} y={pB} r={5} color="var(--c-demand)" />
          <Dot x={q} y={pS} r={5} color="var(--c-supply)" />
          <Label x={q} y={Math.max(pB, pS) + st.yMax * 0.06} anchor="middle" color="#9333ea" weight={700}>{isSubsidy ? `subsidy ${money(-st.t)}` : `wedge t = ${money(st.t)}`}</Label>
          <Handle x={q} y={pB} axis="x" color="#9333ea" ariaLabel="Drag to change the quantity traded (and so the tax)" step={st.xMax / 200}
            onDrag={(x) => { const nt = Math.max(-(st.yMax), dp(x) - sp(x)); set({ t: +Math.min(maxTax, nt).toFixed(3) }); }} />
        </>
      )}
    </Plot>
  );

  const lafferChart = (
    <div>
      <div className="label mb-1">Revenue and deadweight loss as the tax grows (Laffer curve)</div>
      <Plot xDomain={[0, Math.max(1e-6, maxTax)]} yDomain={[0, Math.max(1e-6, ...laffer.map((p) => Math.max(p.revenue, p.deadweightLoss))) * 1.1]} height={230} xLabel="Tax per unit" yLabel="$" title="Laffer curve"
        readout={(x) => { const o = calculateTaxIncidence(D, S, Math.min(maxTax, Math.max(0, x))); return [`t = ${fmt(x)}`, `revenue ${money(o.revenue)}`, `DWL ${money(o.deadweightLoss)}`]; }}>
        <Curve points={laffer.map((p) => [p.tax, p.revenue])} color="#9333ea" label="Revenue" labelAt={[tStar, laffer[40]?.revenue * 1.04]} labelAnchor="middle" />
        <Curve points={laffer.map((p) => [p.tax, p.deadweightLoss])} color="#dc2626" label="DWL" labelAt={[maxTax * 0.9, laffer[72]?.deadweightLoss * 0.92]} labelAnchor="end" />
        <VLine x={tStar} color="var(--c-guide)" dashed width={1} label="max revenue" />
        {!isSubsidy && <VLine x={st.t} color="#9333ea" width={1.5} />}
        {!isSubsidy && <Dot x={st.t} y={tax!.revenue} r={5} color="#9333ea" />}
        {!isSubsidy && <Dot x={st.t} y={tax!.deadweightLoss} r={5} color="#dc2626" />}
      </Plot>
    </div>
  );

  const controls = (
    <>
      <ControlGroup title={isSubsidy ? 'Subsidy per unit' : 'Tax per unit'}>
        <Slider label={isSubsidy ? 'Subsidy s' : 'Tax t'} value={st.t} min={-maxTax / 2} max={maxTax} step={maxTax / 400} onChange={(t) => set({ t })} format={(v) => (v < 0 ? `subsidy ${money(-v)}` : money(v))} hint="Drag left of 0 for a subsidy. You can also drag the purple handle on the graph." />
        <Segmented size="sm" value={st.leviedOn} onChange={(leviedOn) => set({ leviedOn })} options={[{ value: 'sellers', label: 'Levied on sellers' }, { value: 'buyers', label: 'Levied on buyers' }]} />
      </ControlGroup>
      <ControlGroup title="Demand  P = a − bQ" color="var(--c-demand)">
        <Slider label="Intercept a" value={st.a} min={st.yMax * 0.3} max={st.yMax * 1.4} step={st.yMax / 200} onChange={(a) => set({ a })} format={(v) => fmt(v)} />
        <Slider label="Slope b (steeper = less elastic)" value={st.b} min={(st.yMax / st.xMax) * 0.1} max={(st.yMax / st.xMax) * 4} step={(st.yMax / st.xMax) / 200} onChange={(b) => set({ b })} format={(v) => fmt(v, 3)} />
      </ControlGroup>
      <ControlGroup title="Supply  P = c + dQ" color="var(--c-supply)">
        <Slider label="Intercept c" value={st.c} min={0} max={st.yMax * 0.7} step={st.yMax / 200} onChange={(c) => set({ c })} format={(v) => fmt(v)} />
        <Slider label="Slope d (steeper = less elastic)" value={st.d} min={(st.yMax / st.xMax) * 0.05} max={(st.yMax / st.xMax) * 4} step={(st.yMax / st.xMax) / 200} onChange={(d) => set({ d })} format={(v) => fmt(v, 3)} />
      </ControlGroup>
      <div className="px-1"><Toggle checked={st.showAreas} onChange={(showAreas) => set({ showAreas })} label="Shade welfare areas" /></div>
    </>
  );

  const shares = tax ? { buyer: tax.buyerShare, seller: tax.sellerShare } : { buyer: sub!.buyerShare, seller: 1 - sub!.buyerShare };
  const stats = tax ? (
    <>
      <Stat label="Quantity" value={fmt(tax.quantity)} hint={`was ${fmt(eq.quantity)}`} />
      <Stat label="Price buyers pay" value={money(tax.buyerPrice)} hint={`was ${money(eq.price)}`} />
      <Stat label="Price sellers get" value={money(tax.sellerPrice)} hint={`was ${money(eq.price)}`} />
      <Stat label="Tax revenue" value={money(tax.revenue)} tone="accent" hint="t × Q_T" />
      <Stat label="Consumer surplus" value={money(tax.consumerSurplus)} hint={`−${money(tax.consumerSurplusLoss)}`} />
      <Stat label="Producer surplus" value={money(tax.producerSurplus)} hint={`−${money(tax.producerSurplusLoss)}`} />
      <Stat label="Deadweight loss" value={money(tax.deadweightLoss)} tone="bad" hint="½ · t · ΔQ" />
      <Stat label="Burden: buyers / sellers" value={`${pct(shares.buyer, 0)} / ${pct(shares.seller, 0)}`} />
    </>
  ) : (
    <>
      <Stat label="Quantity" value={fmt(sub!.quantity)} hint={`was ${fmt(eq.quantity)}`} />
      <Stat label="Price buyers pay" value={money(sub!.buyerPrice)} />
      <Stat label="Price sellers get" value={money(sub!.sellerPrice)} />
      <Stat label="Government cost" value={money(sub!.governmentCost)} tone="bad" />
      <Stat label="Consumer surplus" value={money(sub!.consumerSurplus)} hint={`+${money(sub!.consumerSurplus - w.consumerSurplus)}`} />
      <Stat label="Producer surplus" value={money(sub!.producerSurplus)} hint={`+${money(sub!.producerSurplus - w.producerSurplus)}`} />
      <Stat label="Deadweight loss" value={money(sub!.deadweightLoss)} tone="bad" />
      <Stat label="Benefit: buyers / sellers" value={`${pct(shares.buyer, 0)} / ${pct(shares.seller, 0)}`} />
    </>
  );

  const elasticSide = st.b > st.d ? 'demand is steeper (less elastic) than supply, so **buyers** bear more of the tax' : st.b < st.d ? 'supply is steeper (less elastic) than demand, so **sellers** bear more of the tax' : 'both curves are equally steep, so the burden is split 50/50';
  const explain = (
    <div className="space-y-4">
      <div className="flex h-7 overflow-hidden rounded-lg text-xs font-semibold text-white" aria-label="Tax incidence bar">
        <div className="flex items-center justify-center bg-blue-600" style={{ width: `${shares.buyer * 100}%` }}>{shares.buyer > 0.12 && `Buyers ${pct(shares.buyer, 0)}`}</div>
        <div className="flex items-center justify-center bg-orange-600" style={{ width: `${shares.seller * 100}%` }}>{shares.seller > 0.12 && `Sellers ${pct(shares.seller, 0)}`}</div>
      </div>
      <Explain text={isSubsidy
        ? `A **subsidy** is a negative tax: sellers receive ${money(-st.t)} more than buyers pay. Quantity rises to ${fmt(q)}, above the efficient ${fmt(eq.quantity)}. The extra units cost more to produce than buyers value them, so the government spends more (${money(sub!.governmentCost)}) than buyers and sellers gain — the red triangle is the **deadweight loss**. The side with the less elastic curve gets more of the benefit.`
        : [
          `**Who pays?** Switch between "levied on sellers" (supply shifts up by t) and "levied on buyers" (demand shifts down by t): the dashed curve moves, but the outcome — Q, the buyer price, the seller price, revenue and DWL — is **identical**. The tax is a wedge of ${money(st.t)} between what buyers pay and what sellers keep.`,
          `**Incidence depends on elasticities, not on the law.** Here ${elasticSide}. Formally buyers bear $\\frac{b}{b+d}$ = ${pct(shares.buyer, 0)} of the tax. Try the *Luxury tax* and *Cigarettes* scenarios.`,
          `**Deadweight loss.** Losses of CS + PS (${money(tax!.consumerSurplusLoss + tax!.producerSurplusLoss)}) exceed the revenue raised (${money(tax!.revenue)}) by ${money(tax!.deadweightLoss)}: the trades between ${fmt(q)} and ${fmt(eq.quantity)} units no longer happen even though buyers value them more than they cost. DWL grows with the **square** of the tax — double the tax and the DWL roughly quadruples.`,
          st.t > tStar ? `**Beyond the Laffer peak:** the tax exceeds ${money(tStar)}, so *cutting* it would raise more revenue and reduce the DWL.` : `Revenue peaks at a tax of ${money(tStar)} for this market (the Laffer curve below).`,
        ].join('\n\n')} />
      {lafferChart}
    </div>
  );

  return (
    <ModelShell chart={chart} controls={controls} stats={stats} explain={explain}
      presets={PRESETS} initialPreset={Math.min(preset, PRESETS.length - 1)} onPreset={(i) => setSt(PRESETS[i].state)} onReset={() => setSt(start)}
      legend={<Legend items={[{ label: 'Consumer surplus', color: 'var(--c-cs)', kind: 'area' }, { label: 'Producer surplus', color: 'var(--c-ps)', kind: 'area' }, { label: 'Tax revenue', color: 'var(--c-rev)', kind: 'area' }, { label: 'Deadweight loss', color: 'var(--c-dwl)', kind: 'area' }]} />} />
  );
}
