import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { niceTicks, tickDy, tickLabel, tickValue, type Tick } from './scale';

export interface PlotCtx {
  x: (v: number) => number;
  y: (v: number) => number;
  /** Convert client (screen) coordinates to data coordinates. */
  toData: (clientX: number, clientY: number) => [number, number];
  xDomain: [number, number];
  yDomain: [number, number];
  inner: { left: number; top: number; right: number; bottom: number };
  clipId: string;
  setDragging: (v: boolean) => void;
}

const Ctx = createContext<PlotCtx | null>(null);
export const usePlot = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Chart primitives must be used inside <Plot>');
  return c;
};

export interface PlotProps {
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel?: string;
  yLabel?: string;
  xTicks?: Tick[];
  yTicks?: Tick[];
  width?: number;
  height?: number;
  children: ReactNode;
  /** Hover readout: given data coordinates, return text lines (or null to hide). */
  readout?: (x: number, y: number) => string[] | null;
  /** Accessible description of the figure. */
  title?: string;
  grid?: boolean;
  /** Draw the two axis lines (default true). */
  axes?: boolean;
  className?: string;
}

const M = { left: 56, right: 24, top: 18, bottom: 60 };

/**
 * Responsive SVG plotting surface. All children receive data→pixel scales via context,
 * so every drawn element is derived from model numbers (no hand-placed shapes).
 */
export function Plot({ xDomain, yDomain, xLabel, yLabel, xTicks, yTicks, width: baseWidth = 640, height: baseHeight = 420, children, readout, title, grid = true, axes = true, className = '' }: PlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // On narrow containers shrink the coordinate system (not just the picture) so labels stay readable.
  const [cw, setCw] = useState<number | null>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setCw(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const width = cw && cw < baseWidth ? Math.max(380, Math.round(cw)) : baseWidth;
  const height = width < baseWidth ? Math.round(baseHeight * (width / baseWidth) * 1.2) : baseHeight;
  const clipId = useId().replace(/:/g, '');
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [dragging, setDragging] = useState(false);
  const inner = { left: M.left, top: M.top, right: width - M.right, bottom: height - M.bottom };

  const x = useCallback((v: number) => inner.left + ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) * (inner.right - inner.left), [xDomain[0], xDomain[1], width]); // eslint-disable-line
  const y = useCallback((v: number) => inner.bottom - ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) * (inner.bottom - inner.top), [yDomain[0], yDomain[1], height]); // eslint-disable-line

  const toData = useCallback((cx: number, cy: number): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    const p = ctm ? pt.matrixTransform(ctm.inverse()) : pt;
    const dx = xDomain[0] + ((p.x - inner.left) / (inner.right - inner.left)) * (xDomain[1] - xDomain[0]);
    const dy = yDomain[0] + ((inner.bottom - p.y) / (inner.bottom - inner.top)) * (yDomain[1] - yDomain[0]);
    return [dx, dy];
  }, [xDomain[0], xDomain[1], yDomain[0], yDomain[1], width, height]); // eslint-disable-line

  const ctx = useMemo<PlotCtx>(() => ({ x, y, toData, xDomain, yDomain, inner, clipId, setDragging }), [x, y, toData, clipId]); // eslint-disable-line

  const xt = xTicks ?? niceTicks(xDomain[0], xDomain[1], 7);
  const yt = yTicks ?? niceTicks(yDomain[0], yDomain[1], 6);

  const onMove = (e: React.PointerEvent) => {
    if (!readout) return;
    const [dx, dy] = toData(e.clientX, e.clientY);
    if (dx < xDomain[0] || dx > xDomain[1] || dy < yDomain[0] || dy > yDomain[1]) setHover(null);
    else setHover([dx, dy]);
  };

  const lines = hover && readout && !dragging ? readout(hover[0], hover[1]) : null;

  return (
    <Ctx.Provider value={ctx}>
      <div ref={wrapRef} className="w-full">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className={`w-full select-none touch-none ${className}`} role="img" aria-label={title}
        onPointerMove={onMove} onPointerLeave={() => setHover(null)} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {title && <title>{title}</title>}
        <defs>
          <clipPath id={clipId}><rect x={inner.left} y={inner.top - 2} width={inner.right - inner.left + 2} height={inner.bottom - inner.top + 2} /></clipPath>
        </defs>
        {grid && (
          <g>
            {xt.map((t, i) => <line key={`gx${i}`} x1={x(tickValue(t))} x2={x(tickValue(t))} y1={inner.top} y2={inner.bottom} stroke="var(--c-grid)" />)}
            {yt.map((t, i) => <line key={`gy${i}`} y1={y(tickValue(t))} y2={y(tickValue(t))} x1={inner.left} x2={inner.right} stroke="var(--c-grid)" />)}
          </g>
        )}
        <g fontSize={11} fill="var(--c-muted)">
          {xt.map((t, i) => <text key={`tx${i}`} x={x(tickValue(t))} y={inner.bottom + 16} textAnchor="middle">{tickLabel(t)}</text>)}
          {yt.map((t, i) => <text key={`ty${i}`} x={inner.left - 8} y={y(tickValue(t)) + 4 + tickDy(t)} textAnchor="end">{tickLabel(t)}</text>)}
        </g>
        <g fontSize={12} fontWeight={600} fill="var(--c-text)">
          {xLabel && <text x={(inner.left + inner.right) / 2} y={height - 6} textAnchor="middle">{xLabel}</text>}
          {yLabel && <text transform={`translate(14 ${(inner.top + inner.bottom) / 2}) rotate(-90)`} textAnchor="middle">{yLabel}</text>}
        </g>
        {children}
        {axes && <line x1={inner.left} x2={inner.right} y1={inner.bottom} y2={inner.bottom} stroke="var(--c-axis)" strokeWidth={1.5} />}
        {axes && <line x1={inner.left} x2={inner.left} y1={inner.top} y2={inner.bottom} stroke="var(--c-axis)" strokeWidth={1.5} />}
        {hover && lines && (
          <g pointerEvents="none">
            <line x1={x(hover[0])} x2={x(hover[0])} y1={inner.top} y2={inner.bottom} stroke="var(--c-guide)" strokeDasharray="2 3" />
            <line y1={y(hover[1])} y2={y(hover[1])} x1={inner.left} x2={inner.right} stroke="var(--c-guide)" strokeDasharray="2 3" />
            <Readout px={x(hover[0])} py={y(hover[1])} lines={lines} inner={inner} />
          </g>
        )}
      </svg>
      </div>
    </Ctx.Provider>
  );
}

function Readout({ px, py, lines, inner }: { px: number; py: number; lines: string[]; inner: PlotCtx['inner'] }) {
  const w = Math.max(...lines.map((l) => l.length)) * 6.6 + 16;
  const h = lines.length * 16 + 10;
  const left = px + w + 14 > inner.right ? px - w - 10 : px + 10;
  const top = py - h - 10 < inner.top ? py + 10 : py - h - 10;
  return (
    <g transform={`translate(${left} ${top})`}>
      <rect width={w} height={h} rx={8} fill="var(--c-bg)" stroke="var(--c-grid)" opacity={0.96} />
      {lines.map((l, i) => <text key={i} x={8} y={18 + i * 16} fontSize={11.5} fill="var(--c-text)" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{l}</text>)}
    </g>
  );
}
