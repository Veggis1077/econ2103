import type { ReactNode } from 'react';

export function Card({ children, className = '', as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <As className={`card ${className}`}>{children}</As>;
}

export function SectionTitle({ eyebrow, title, action, children }: { eyebrow?: string; title: ReactNode; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="label mb-1">{eyebrow}</div>}
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">{title}</h2>
        {children && <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 animate-fade-up">
      {eyebrow && <div className="label mb-2">{eyebrow}</div>}
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">{title}</h1>
      {subtitle && <p className="mt-2 max-w-3xl text-[15px] leading-7 text-ink-600 dark:text-ink-300">{subtitle}</p>}
      {children}
    </header>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'good' | 'bad' | 'accent' }) {
  const color = tone === 'good' ? 'text-emerald-600 dark:text-emerald-400' : tone === 'bad' ? 'text-rose-600 dark:text-rose-400' : tone === 'accent' ? 'text-[var(--accent)]' : 'text-ink-900 dark:text-white';
  return (
    <div className="min-w-0">
      <div className="label truncate">{label}</div>
      <div className={`mt-1 font-mono text-xl font-medium tabular-nums ${color}`}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{hint}</div>}
    </div>
  );
}

export function ProgressBar({ value, className = '', color }: { value: number; className?: string; color?: string }) {
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800 ${className}`} role="progressbar" aria-valuenow={Math.round(v * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${v * 100}%`, background: color ?? 'var(--accent)' }} />
    </div>
  );
}

export function ProgressRing({ value, size = 56, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const v = Math.max(0, Math.min(1, value || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-ink-100 dark:text-ink-800" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <span className="absolute font-mono text-xs font-semibold tabular-nums">{label ?? `${Math.round(v * 100)}%`}</span>
    </div>
  );
}

export function Badge({ children, color = 'ink' }: { children: ReactNode; color?: 'ink' | 'green' | 'red' | 'amber' | 'blue' | 'violet' }) {
  const map = {
    ink: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  } as const;
  return <span className={`chip ${map[color]}`}>{children}</span>;
}

export function Slider({ label, value, min, max, step = 1, onChange, format, hint, color }: {
  label: ReactNode; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; hint?: ReactNode; color?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 font-medium text-ink-700 dark:text-ink-200">
          {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}
          {label}
        </span>
        <span className="font-mono text-xs tabular-nums text-ink-500 dark:text-ink-400">{format ? format(value) : value}</span>
      </div>
      <input type="range" className="w-full cursor-pointer" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <div className="mt-0.5 text-xs text-ink-500">{hint}</div>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-[var(--accent)]' : 'bg-ink-200 dark:bg-ink-700'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
      {label}
    </label>
  );
}

export function Segmented<T extends string>({ value, options, onChange, size = 'md' }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; size?: 'sm' | 'md' }) {
  return (
    <div className="inline-flex flex-wrap rounded-xl border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-800">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={`rounded-lg font-medium transition ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'} ${value === o.value ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-900 dark:text-white' : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 p-8 text-center dark:border-ink-700">
      <div className="font-medium text-ink-700 dark:text-ink-200">{title}</div>
      {children && <div className="mt-1 text-sm text-ink-500">{children}</div>}
    </div>
  );
}

export const fmt = (v: number, digits = 2) => (Number.isFinite(v) ? (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(digits)) : '∞');
export const money = (v: number, digits = 2) => (Number.isFinite(v) ? `${v < 0 ? '−' : ''}$${fmt(Math.abs(v), digits)}` : '—');
export const pct = (v: number, digits = 1) => `${(v * 100).toFixed(digits)}%`;
