import { useState, type ReactNode } from 'react';
import { RichBlock } from '../components/ui/Rich';

export interface Preset<S> {
  name: string;
  description?: string;
  state: S;
}

/** Common layout for every interactive model: chart left, controls right, numbers + explanation below. */
export function ModelShell({ chart, controls, stats, explain, presets, onPreset, onReset, legend, compact, toolbar, initialPreset = 0 }: {
  chart: ReactNode;
  controls?: ReactNode;
  stats?: ReactNode;
  explain?: ReactNode;
  presets?: { name: string; description?: string }[];
  onPreset?: (index: number) => void;
  onReset?: () => void;
  legend?: ReactNode;
  compact?: boolean;
  toolbar?: ReactNode;
  /** Index of the preset the model started from (highlighted chip). */
  initialPreset?: number;
}) {
  const [active, setActive] = useState(initialPreset);
  return (
    <div className="space-y-4">
      {(presets || onReset || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {presets && presets.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="label mr-1">Scenario</span>
              {presets.map((p, i) => (
                <button key={p.name} type="button" title={p.description} onClick={() => { setActive(i); onPreset?.(i); }}
                  className={`chip border transition ${active === i ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800' : 'border-ink-200 text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:text-ink-300'}`}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {toolbar}
            {onReset && <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { setActive(initialPreset); onReset(); }}>↺ Reset</button>}
          </div>
        </div>
      )}
      <div className={`grid gap-5 ${compact || !controls ? '' : 'lg:grid-cols-[minmax(0,1fr)_300px]'}`}>
        <div className="min-w-0 space-y-2">
          {chart}
          {legend}
        </div>
        {controls && <div className="space-y-4">{controls}</div>}
      </div>
      {stats && <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-ink-50 p-4 sm:grid-cols-3 lg:grid-cols-4 dark:bg-ink-800/50">{stats}</div>}
      {explain && <div className="prose-econ rounded-xl border border-ink-200/70 p-4 text-sm dark:border-ink-800">{explain}</div>}
    </div>
  );
}

export function ControlGroup({ title, children, color }: { title: string; children: ReactNode; color?: string }) {
  return (
    <div className="rounded-xl border border-ink-200/70 p-3 dark:border-ink-800">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function Explain({ text }: { text: string }) {
  return <RichBlock text={text} className="space-y-2" />;
}

/** Props every lab model accepts, so models can be embedded in lectures and graph challenges. */
export interface ModelProps<S> {
  initial?: Partial<S>;
  /** Called with the full state whenever it changes (used by graph challenges). */
  onChange?: (s: S) => void;
  compact?: boolean;
  /** Preset index to start from. */
  preset?: number;
}
