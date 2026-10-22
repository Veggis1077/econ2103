import type { FigureSpec } from '../../types/content';
import { Area, Curve, Dot, Guide, Label, Plot } from '../charts';

const evalFn = (f: Extract<NonNullable<FigureSpec['curves']>[number], { kind: 'fn' }>['fn']) => (x: number) => {
  if (f.type === 'poly') return f.coeffs.reduce((s, c, i) => s + c * x ** i, 0);
  return x > 0 ? f.fixed / x + f.c + (f.e / 2) * x : NaN;
};

/** Renders a static, data-defined figure (used for reconstructed question graphs). Hover shows coordinates. */
export function FigureView({ spec }: { spec: FigureSpec }) {
  return (
    <div className="mx-auto max-w-xl">
      <Plot xDomain={spec.xDomain} yDomain={spec.yDomain} xLabel={spec.xLabel} yLabel={spec.yLabel} xTicks={spec.xTicks} yTicks={spec.yTicks} height={spec.height ?? 400} axes={!spec.hideAxes} grid={!spec.hideAxes}
        readout={spec.xTicks?.length === 0 ? undefined : (x, y) => [`${spec.xLabel.split(' ')[0].toLowerCase()} ${x.toFixed(2)}`, `${spec.yLabel.split(' ')[0].toLowerCase()} ${y.toFixed(2)}`]}>
        {spec.regions?.map((r, i) => <Area key={`r${i}`} points={r.points} fill={r.fill ?? 'var(--c-cs)'} label={r.label} labelAt={r.labelAt} />)}
        {spec.guides?.map((g, i) => <Guide key={`g${i}`} x={g.x} y={g.y} toX={g.toX ?? true} toY={g.toY ?? true} />)}
        {spec.curves?.map((c, i) =>
          c.kind === 'line'
            ? <Curve key={`c${i}`} points={[c.from, c.to]} color={c.color ?? 'var(--c-text)'} dashed={c.dashed} label={c.label} labelAt={c.labelAt ?? c.to} />
            : <Curve key={`c${i}`} fn={evalFn(c.fn)} from={c.xFrom} to={c.xTo} color={c.color ?? 'var(--c-text)'} label={c.label} labelAt={c.labelAt} />,
        )}
        {spec.points?.map((p, i) => <Dot key={`p${i}`} x={p.x} y={p.y} r={4.5} label={p.label} labelOffset={[p.dx ?? 8, p.dy ?? -8]} />)}
        {spec.labels?.map((l, i) => <Label key={`l${i}`} x={l.x} y={l.y} color={l.color} size={13} weight={700}>{l.text}</Label>)}
      </Plot>
    </div>
  );
}
