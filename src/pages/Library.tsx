import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CONCEPTS, FORMULAS } from '../content/library';
import { LECTURES, shortLectureLabel } from '../content/lectures';
import { getModel } from '../lab/registry';
import { useActiveProfile } from '../profiles/ProfileContext';
import { toggleBookmark } from '../storage/progress';
import { PageHeader, Segmented } from '../components/ui';
import { Rich, plain } from '../components/ui/Rich';
import { Tex } from '../components/ui/Tex';

export default function Library() {
  const [sp] = useSearchParams();
  const focusConcept = sp.get('concept');
  const focusFormula = sp.get('formula');
  const [tab, setTab] = useState<'concepts' | 'formulas' | 'saved'>(focusFormula ? 'formulas' : 'concepts');
  const [q, setQ] = useState('');
  const [lec, setLec] = useState('all');
  const { data, update } = useActiveProfile();
  useEffect(() => {
    const id = focusConcept ? `c-${focusConcept}` : focusFormula ? `f-${focusFormula}` : null;
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }, [focusConcept, focusFormula]);
  const match = (s: string) => !q || s.toLowerCase().includes(q.toLowerCase());
  const concepts = useMemo(() => CONCEPTS.filter((c) => (lec === 'all' || c.lecture === lec) && match(plain(`${c.term} ${c.definition} ${c.note ?? ''}`)) && (tab !== 'saved' || data.bookmarks.includes(c.id))), [q, lec, tab, data.bookmarks]); // eslint-disable-line
  const formulas = useMemo(() => FORMULAS.filter((f) => (lec === 'all' || f.lecture === lec) && match(`${f.name} ${f.explanation}`)), [q, lec]); // eslint-disable-line
  const scopes = [...LECTURES.map((l) => l.id), 'ch15', 'beyond'];
  return (
    <div>
      <PageHeader eyebrow="Reference" title="Formula & concept library" subtitle={`${CONCEPTS.length} concepts and ${FORMULAS.length} formulas, each linked to its lecture and interactive model. Save concepts (☆) to build your own revision list.`} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Segmented value={tab} onChange={setTab} options={[{ value: 'concepts', label: 'Concepts' }, { value: 'formulas', label: 'Formulas' }, { value: 'saved', label: `Saved (${data.bookmarks.length})` }]} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="h-10 w-56 rounded-xl border border-ink-200 bg-white px-3 text-sm dark:border-ink-700 dark:bg-ink-900" aria-label="Filter library" />
        <select value={lec} onChange={(e) => setLec(e.target.value)} className="h-10 rounded-xl border border-ink-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-900" aria-label="Lecture">
          <option value="all">All lectures</option>
          {scopes.map((s) => <option key={s} value={s}>{s === 'beyond' ? 'Beyond slides' : shortLectureLabel(s)}</option>)}
        </select>
      </div>
      {tab !== 'formulas' ? (
        <div className="grid gap-3 md:grid-cols-2">
          {concepts.map((c) => {
            const m = c.model ? getModel(c.model) : undefined;
            const saved = data.bookmarks.includes(c.id);
            return (
              <div key={c.id} id={`c-${c.id}`} className={`card p-4 ${focusConcept === c.id ? 'ring-2 ring-[var(--accent)]' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-ink-900 dark:text-white">{c.term}</div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link to={`/learn/${c.lecture}`} className="chip bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{c.lecture === 'beyond' ? 'Beyond' : shortLectureLabel(c.lecture)}</Link>
                    <button onClick={() => update((d) => toggleBookmark(d, c.id))} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save concept'} className={saved ? 'text-amber-500' : 'text-ink-300 hover:text-amber-500'}>{saved ? '★' : '☆'}</button>
                  </div>
                </div>
                <p className="prose-econ mt-1 text-sm"><Rich text={c.definition} /></p>
                {c.note && <p className="mt-2 rounded-lg bg-ink-50 px-2 py-1 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-300"><Rich text={c.note} /></p>}
                {m && <Link to={`/lab/${m.id}`} className="link mt-2 inline-block text-xs">{m.icon} See it in the {m.title} model →</Link>}
              </div>
            );
          })}
          {!concepts.length && <p className="text-sm text-ink-500">{tab === 'saved' ? 'No saved concepts yet — click ☆ on any concept or definition.' : 'Nothing matches.'}</p>}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {formulas.map((f) => {
            const m = f.model ? getModel(f.model) : undefined;
            return (
              <div key={f.id} id={`f-${f.id}`} className={`card p-4 ${focusFormula === f.id ? 'ring-2 ring-[var(--accent)]' : ''}`}>
                <div className="flex items-start justify-between gap-2"><div className="font-semibold">{f.name}</div><span className="chip bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{f.lecture === 'beyond' ? 'Beyond' : shortLectureLabel(f.lecture)}</span></div>
                <Tex tex={f.tex} block className="my-1" />
                {f.explanation && <p className="text-sm text-ink-600 dark:text-ink-300"><Rich text={f.explanation} /></p>}
                {m && <Link to={`/lab/${m.id}`} className="link mt-2 inline-block text-xs">{m.icon} Try it in {m.title} →</Link>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
