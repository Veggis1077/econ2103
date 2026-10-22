import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, type SearchKind } from '../../search';

const KIND_COLOR: Record<SearchKind, string> = {
  Lecture: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Section: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  Concept: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Formula: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Model: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Question: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  Problem: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
};

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q), [q]);
  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => setSel(0), [q]);

  const go = (path: string) => { onClose(); nav(path); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter' && results[sel]) go(results[sel].path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/40 p-4 pt-[10vh] backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div className="card w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-ink-100 px-4 dark:border-ink-800">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-400" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search: elasticity, deadweight loss, comparative advantage, Q17…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-400" aria-label="Search query" />
          <kbd className="rounded border border-ink-200 px-1.5 font-mono text-[10px] text-ink-400 dark:border-ink-700">esc</kbd>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2" role="listbox">
          {!q && <li className="px-3 py-6 text-center text-sm text-ink-500">Search across lectures, sections, concepts, formulas, lab models, questions and problem sets.</li>}
          {q && !results.length && <li className="px-3 py-6 text-center text-sm text-ink-500">No results for “{q}”.</li>}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.path}-${i}`} role="option" aria-selected={i === sel}>
              <button onMouseEnter={() => setSel(i)} onClick={() => go(r.path)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${i === sel ? 'bg-ink-100 dark:bg-ink-800' : ''}`}>
                <span className={`chip mt-0.5 w-20 shrink-0 justify-center ${KIND_COLOR[r.kind]}`}>{r.kind}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink-900 dark:text-white">{r.title}</span>
                  <span className="block truncate text-xs text-ink-500">{r.subtitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
