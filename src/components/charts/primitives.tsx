import { useRef, type ReactNode } from 'react';
import { usePlot } from './Plot';
import { clamp, sample } from './scale';

const toPath = (pts: [number, number][], x: (v: number) => number, y: (v: number) => number, close = false) =>
  pts.length ? `M${pts.map(([a, b]) => `${x(a).toFixed(2)},${y(b).toFixed(2)}`).join('L')}${close ? 'Z' : ''}` : '';

/** A curve y = f(x) or a polyline through data points, clipped to the plot area. */
export function Curve({ fn, points, from, to, color = 'var(--c-text)', width = 2.5, dashed, label, labelAt, labelAnchor = 'start', samples = 100 }: {
  fn?: (x: number) => number; points?: [number, number][]; from?: number; to?: number; color?: string; width?: number; dashed?: boolean;
  label?: ReactNode; labelAt?: [number, number]; labelAnchor?: 'start' | 'middle' | 'end'; samples?: number;
}) {
  const { x, y, xDomain, yDomain, clipId } = usePlot();
  const pts = points ?? (fn ? sample(fn, from ?? xDomain[0], to ?? xDomain[1], samples) : []);
  // Keep the polyline within a generous band around the y-domain so clipping behaves.
  const span = yDomain[1] - yDomain[0];
  const safe = pts.map(([a, b]) => [a, clamp(b, yDomain[0] - span * 2, yDomain[1] + span * 2)] as [number, number]);
  return (
    <g>
      <path d={toPath(safe, x, y)} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${clipId})`} />
      {label && labelAt && <text x={x(labelAt[0])} y={y(labelAt[1])} fill={color} fontSize={12.5} fontWeight={650} textAnchor={labelAnchor} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>{label}</text>}
    </g>
  );
}

/** Straight segment between two data points. */
export function Segment({ from, to, color = 'var(--c-text)', width = 2.5, dashed, label, labelAt }: {
  from: [number, number]; to: [number, number]; color?: string; width?: number; dashed?: boolean; label?: ReactNode; labelAt?: [number, number];
}) {
  return <Curve points={[from, to]} color={color} width={width} dashed={dashed} label={label} labelAt={labelAt ?? to} />;
}

/** Filled polygon (surplus, deadweight loss, revenue…). */
export function Area({ points, fill, label, labelAt, stroke, title }: { points: [number, number][]; fill: string; label?: ReactNode; labelAt?: [number, number]; stroke?: string; title?: string }) {
  const { x, y, clipId } = usePlot();
  if (points.length < 3) return null;
  const cx = labelAt ?? centroid(points);
  return (
    <g>
      <path d={toPath(points, x, y, true)} fill={fill} stroke={stroke} strokeWidth={stroke ? 1 : 0} clipPath={`url(#${clipId})`}>{title && <title>{title}</title>}</path>
      {label && <text x={x(cx[0])} y={y(cx[1]) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--c-text)" opacity={0.85} pointerEvents="none">{label}</text>}
    </g>
  );
}

const centroid = (pts: [number, number][]): [number, number] => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

/** Dashed guide lines from a point down to the x-axis and across to the y-axis, with optional axis labels. */
export function Guide({ x: gx, y: gy, toX = true, toY = true, xLabel, yLabel, color = 'var(--c-guide)' }: { x: number; y: number; toX?: boolean; toY?: boolean; xLabel?: string; yLabel?: string; color?: string }) {
  const { x, y, inner } = usePlot();
  return (
    <g pointerEvents="none">
      {toX && <line x1={x(gx)} x2={x(gx)} y1={y(gy)} y2={inner.bottom} stroke={color} strokeDasharray="4 4" strokeWidth={1.2} />}
      {toY && <line x1={inner.left} x2={x(gx)} y1={y(gy)} y2={y(gy)} stroke={color} strokeDasharray="4 4" strokeWidth={1.2} />}
      {xLabel && <AxisTag px={x(gx)} py={inner.bottom + 31} text={xLabel} />}
      {yLabel && <AxisTag px={inner.left + 5} py={y(gy) - 5} text={yLabel} anchor="start" />}
    </g>
  );
}

function AxisTag({ px, py, text, anchor = 'middle' }: { px: number; py: number; text: string; anchor?: 'middle' | 'end' | 'start' }) {
  return <text x={px} y={py} textAnchor={anchor} fontSize={11} fontWeight={700} fill="var(--accent)" paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>{text}</text>;
}

export function Dot({ x: dx, y: dy, r = 5, color = 'var(--c-text)', label, labelOffset = [8, -8] }: { x: number; y: number; r?: number; color?: string; label?: ReactNode; labelOffset?: [number, number] }) {
  const { x, y } = usePlot();
  return (
    <g pointerEvents="none">
      <circle cx={x(dx)} cy={y(dy)} r={r} fill={color} stroke="var(--c-bg)" strokeWidth={1.5} />
      {label && <text x={x(dx) + labelOffset[0]} y={y(dy) + labelOffset[1]} fontSize={12} fontWeight={700} fill="var(--c-text)" paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>{label}</text>}
    </g>
  );
}

export function Label({ x: lx, y: ly, children, color = 'var(--c-text)', anchor = 'middle', size = 12, weight = 600 }: { x: number; y: number; children: ReactNode; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number }) {
  const { x, y } = usePlot();
  return <text x={x(lx)} y={y(ly)} fill={color} textAnchor={anchor} fontSize={size} fontWeight={weight} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3} pointerEvents="none">{children}</text>;
}

/** Horizontal line across the plot (price ceilings/floors, market price). */
export function HLine({ y: hy, color = 'var(--c-text)', dashed, label, width = 2 }: { y: number; color?: string; dashed?: boolean; label?: ReactNode; width?: number }) {
  const { y, inner } = usePlot();
  return (
    <g pointerEvents="none">
      <line x1={inner.left} x2={inner.right} y1={y(hy)} y2={y(hy)} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} />
      {label && <text x={inner.right - 4} y={y(hy) - 6} textAnchor="end" fontSize={12} fontWeight={650} fill={color} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>{label}</text>}
    </g>
  );
}

export function VLine({ x: vx, color = 'var(--c-text)', dashed, label, width = 2 }: { x: number; color?: string; dashed?: boolean; label?: ReactNode; width?: number }) {
  const { x, inner } = usePlot();
  return (
    <g pointerEvents="none">
      <line y1={inner.top} y2={inner.bottom} x1={x(vx)} x2={x(vx)} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 5' : undefined} />
      {label && <text x={x(vx) + 6} y={inner.top + 14} fontSize={12} fontWeight={650} fill={color} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>{label}</text>}
    </g>
  );
}

/** Generic pointer-drag hook: reports data-space deltas or absolute positions while dragging. */
function useDrag(onMove: (data: [number, number], delta: [number, number]) => void, onEnd?: () => void) {
  const { toData, setDragging } = usePlot();
  const last = useRef<[number, number] | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      last.current = toData(e.clientX, e.clientY);
      setDragging(true);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!last.current) return;
      const p = toData(e.clientX, e.clientY);
      onMove(p, [p[0] - last.current[0], p[1] - last.current[1]]);
      last.current = p;
    },
    onPointerUp: (e: React.PointerEvent) => {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      last.current = null;
      setDragging(false);
      onEnd?.();
    },
  };
}

/** Draggable point. `axis` restricts movement; values are clamped to the plot domain. */
export function Handle({ x: hx, y: hy, onDrag, axis = 'both', color = 'var(--accent)', label, r = 8, ariaLabel, step }: {
  x: number; y: number; onDrag: (x: number, y: number) => void; axis?: 'x' | 'y' | 'both'; color?: string; label?: ReactNode; r?: number; ariaLabel?: string; step?: number;
}) {
  const { x, y, xDomain, yDomain } = usePlot();
  const drag = useDrag(([dx, dy]) => {
    const nx = axis === 'y' ? hx : clamp(dx, xDomain[0], xDomain[1]);
    const ny = axis === 'x' ? hy : clamp(dy, yDomain[0], yDomain[1]);
    onDrag(nx, ny);
  });
  const kstep = step ?? (axis === 'x' ? (xDomain[1] - xDomain[0]) / 100 : (yDomain[1] - yDomain[0]) / 100);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? kstep * 10 : kstep;
    if (e.key === 'ArrowRight' && axis !== 'y') onDrag(clamp(hx + d, xDomain[0], xDomain[1]), hy);
    else if (e.key === 'ArrowLeft' && axis !== 'y') onDrag(clamp(hx - d, xDomain[0], xDomain[1]), hy);
    else if (e.key === 'ArrowUp' && axis !== 'x') onDrag(hx, clamp(hy + d, yDomain[0], yDomain[1]));
    else if (e.key === 'ArrowDown' && axis !== 'x') onDrag(hx, clamp(hy - d, yDomain[0], yDomain[1]));
    else return;
    e.preventDefault();
  };
  const cursor = axis === 'x' ? 'ew-resize' : axis === 'y' ? 'ns-resize' : 'grab';
  return (
    <g style={{ cursor }} {...drag} tabIndex={0} role="slider" aria-label={ariaLabel ?? 'draggable point'} onKeyDown={onKey} className="focus:outline-none [&:focus>circle:last-of-type]:stroke-[3]">
      <circle cx={x(hx)} cy={y(hy)} r={r + 10} fill="transparent" />
      <circle cx={x(hx)} cy={y(hy)} r={r + 4} fill={color} opacity={0.15} />
      <circle cx={x(hx)} cy={y(hy)} r={r} fill={color} stroke="white" strokeWidth={2} />
      {label && <text x={x(hx) + r + 6} y={y(hy) - r - 2} fontSize={12} fontWeight={700} fill={color} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3} pointerEvents="none">{label}</text>}
    </g>
  );
}

/**
 * Invisible wide hit-area along a curve that lets the student grab and move the
 * whole curve; reports data-space deltas (dx, dy).
 */
export function DragCurve({ fn, from, to, onDrag, cursor = 'grab', title }: { fn: (x: number) => number; from?: number; to?: number; onDrag: (dx: number, dy: number) => void; cursor?: string; title?: string }) {
  const { x, y, xDomain, clipId } = usePlot();
  const drag = useDrag((_p, [dx, dy]) => onDrag(dx, dy));
  const pts = sample(fn, from ?? xDomain[0], to ?? xDomain[1], 60);
  return (
    <path d={toPath(pts, x, y)} fill="none" stroke="transparent" strokeWidth={22} style={{ cursor }} clipPath={`url(#${clipId})`} {...drag}>
      {title && <title>{title}</title>}
    </path>
  );
}

/** Draggable horizontal line (e.g. price ceiling, market price). */
export function DragHLine({ y: hy, onDrag, color = 'var(--c-text)', label, dashed, min, max }: { y: number; onDrag: (y: number) => void; color?: string; label?: ReactNode; dashed?: boolean; min?: number; max?: number }) {
  const { y, inner, yDomain } = usePlot();
  const drag = useDrag(([, dy]) => onDrag(clamp(dy, min ?? yDomain[0], max ?? yDomain[1])));
  const onKey = (e: React.KeyboardEvent) => {
    const d = (yDomain[1] - yDomain[0]) / (e.shiftKey ? 10 : 100);
    if (e.key === 'ArrowUp') onDrag(clamp(hy + d, min ?? yDomain[0], max ?? yDomain[1]));
    else if (e.key === 'ArrowDown') onDrag(clamp(hy - d, min ?? yDomain[0], max ?? yDomain[1]));
    else return;
    e.preventDefault();
  };
  return (
    <g style={{ cursor: 'ns-resize' }} {...drag} tabIndex={0} role="slider" aria-label={typeof label === 'string' ? label : 'draggable line'} onKeyDown={onKey}>
      <line x1={inner.left} x2={inner.right} y1={y(hy)} y2={y(hy)} stroke="transparent" strokeWidth={20} />
      <line x1={inner.left} x2={inner.right} y1={y(hy)} y2={y(hy)} stroke={color} strokeWidth={2.5} strokeDasharray={dashed ? '7 5' : undefined} />
      <rect x={inner.right - 18} y={y(hy) - 9} width={14} height={18} rx={4} fill={color} />
      <path d={`M${inner.right - 14} ${y(hy) - 3}h6M${inner.right - 14} ${y(hy) + 3}h6`} stroke="white" strokeWidth={1.5} />
      {label && <text x={inner.right - 24} y={y(hy) - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={color} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3} pointerEvents="none">{label}</text>}
    </g>
  );
}

/** Small legend row rendered in HTML under a chart. */
export function Legend({ items }: { items: { label: ReactNode; color: string; kind?: 'line' | 'area' | 'dashed' }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-600 dark:text-ink-300">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.kind === 'area' ? <span className="h-3 w-4 rounded-sm" style={{ background: it.color }} /> : <span className="h-0.5 w-5 rounded" style={{ background: it.color, borderTop: it.kind === 'dashed' ? `2px dashed ${it.color}` : undefined }} />}
          {it.label}
        </span>
      ))}
    </div>
  );
}
