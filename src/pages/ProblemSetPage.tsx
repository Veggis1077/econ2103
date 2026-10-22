import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getProblemSet } from '../content/problems';
import { getModel } from '../lab/registry';
import { shortLectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { addRecent } from '../storage/progress';
import { Breadcrumbs } from '../components/layout/AppLayout';
import { DataTable } from '../components/learning/DataTable';
import { RichBlock } from '../components/ui/Rich';
import type { ProblemPart } from '../types/content';
import NotFound from './NotFound';

export default function ProblemSetPage() {
  const { psId } = useParams();
  const ps = getProblemSet(psId);
  const { update } = useActiveProfile();
  const loc = useLocation();
  useEffect(() => { if (ps) update((d) => addRecent(d, `/practice/problems/${ps.id}`, ps.title)); }, [ps?.id]); // eslint-disable-line
  useEffect(() => { const id = loc.hash.slice(1); if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80); }, [loc.hash]);
  if (!ps) return <NotFound />;
  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: ps.title }]} />
      <h1 className="font-serif text-3xl font-semibold">{ps.title}</h1>
      <p className="mt-1 text-sm text-ink-500">{ps.lectures.map((l) => (l === 'ch15' ? 'Ch. 15 (slides pending)' : shortLectureLabel(l))).join(' · ')} — Work each part on paper first, then reveal the worked solution.</p>
      <div className="mt-8 space-y-8">
        {ps.problems.map((p) => (
          <article key={p.id} id={p.id} className="card scroll-mt-24 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <span className="chip bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">{p.source}</span>
              {p.officialSolution && <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Course solution sheet</span>}
            </div>
            <RichBlock text={p.intro} className="prose-econ mt-3 space-y-2" />
            {p.table && <DataTable table={p.table} />}
            <div className="mt-4 space-y-3">{p.parts.map((part) => <Part key={part.label} part={part} />)}</div>
            {p.models?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">{p.models.map((m) => getModel(m)).filter(Boolean).map((m) => <Link key={m!.id} to={`/lab/${m!.id}`} className="chip border border-ink-200 hover:border-[var(--accent)] dark:border-ink-700">{m!.icon} Explore in Lab: {m!.title}</Link>)}</div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function Part({ part }: { part: ProblemPart }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState<null | boolean>(null);
  const check = () => {
    if (!part.check) return;
    const v = parseFloat(val);
    setChecked(Math.abs(v - part.check.answer) <= (part.check.tolerance ?? 0.01) * Math.max(1, Math.abs(part.check.answer)));
  };
  return (
    <div className="rounded-xl border border-ink-200/70 p-4 dark:border-ink-800">
      <div className="flex gap-3">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-100 text-xs font-semibold dark:bg-ink-800">{part.label}</span>
        <RichBlock text={part.prompt} className="prose-econ flex-1 space-y-2" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 pl-9">
        {part.check && (
          <>
            <input type="number" value={val} onChange={(e) => { setVal(e.target.value); setChecked(null); }} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder="Your answer" aria-label="Your numeric answer"
              className="h-9 w-36 rounded-lg border border-ink-200 bg-white px-2 font-mono text-sm dark:border-ink-700 dark:bg-ink-900" />
            {part.check.unit && <span className="text-xs text-ink-500">{part.check.unit}</span>}
            <button className="btn-secondary !py-1.5 text-xs" onClick={check} disabled={!val}>Check</button>
            {checked !== null && <span className={`text-sm font-medium ${checked ? 'text-emerald-600' : 'text-rose-600'}`}>{checked ? '✓ Correct' : '✗ Not quite — try again or reveal the solution'}</span>}
          </>
        )}
        <button className="btn-ghost !py-1.5 text-xs" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide solution' : 'Show worked solution'}</button>
      </div>
      {open && <RichBlock text={part.solution} className="prose-econ mt-3 space-y-2 rounded-lg bg-emerald-50/50 p-3 text-[14.5px] dark:bg-emerald-950/20 animate-fade-up" />}
    </div>
  );
}
