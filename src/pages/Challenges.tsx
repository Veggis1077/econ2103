import { Suspense, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CHALLENGES, getChallenge } from '../content/challenges';
import { getModel } from '../lab/registry';
import { shortLectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { completeChallenge } from '../storage/progress';
import { Breadcrumbs } from '../components/layout/AppLayout';
import { PageHeader } from '../components/ui';
import { Rich, RichBlock } from '../components/ui/Rich';
import NotFound from './NotFound';

export function ChallengeList() {
  const { data } = useActiveProfile();
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: 'Graph challenges' }]} />
      <PageHeader eyebrow="Graph challenge mode" title="Hit the target by moving the graph" subtitle="Instead of choosing an answer, manipulate the model until the market reaches the target. The check runs live on the same equations the graph is drawn from." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHALLENGES.map((c) => {
          const done = data.challenges[c.id];
          const m = getModel(c.model);
          return (
            <Link key={c.id} to={`/practice/challenges/${c.id}`} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800">{m?.icon ?? '🎯'}</span>
                {done ? <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">✓ Solved</span> : <span className="chip bg-ink-100 text-ink-500 dark:bg-ink-800">Open</span>}
              </div>
              <div className="mt-3 font-semibold">{c.title}</div>
              <div className="mt-1 text-xs text-ink-500">{m?.title} · {c.lectures.map(shortLectureLabel).join(', ')}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ChallengePage() {
  const { cid } = useParams();
  const c = getChallenge(cid);
  const { data, update } = useActiveProfile();
  const [status, setStatus] = useState<[boolean, string]>([false, '']);
  const [hint, setHint] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const onChange = useCallback((s: unknown) => {
    if (!c) return;
    const r = c.check(s);
    setStatus(r);
    if (r[0] && !recorded) { setRecorded(true); update((d) => completeChallenge(d, c.id)); }
  }, [c, recorded, update]);
  if (!c) return <NotFound />;
  const m = getModel(c.model);
  if (!m) return <NotFound />;
  const C = m.component;
  const idx = CHALLENGES.findIndex((x) => x.id === c.id);
  const next = CHALLENGES[idx + 1];
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: 'Graph challenges', to: '/practice/challenges' }, { label: c.title }]} />
      <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card p-5">
          <div className="label mb-1">Your task {data.challenges[c.id] && <span className="ml-2 text-emerald-600">· solved before</span>}</div>
          <h1 className="font-serif text-2xl font-semibold">{c.title}</h1>
          <RichBlock text={c.prompt} className="prose-econ mt-2" />
        </div>
        <div className={`card flex flex-col justify-center p-5 transition ${status[0] ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : ''}`} role="status" aria-live="polite">
          <div className="label">{status[0] ? 'Target reached 🎉' : 'Live status'}</div>
          <div className={`mt-1 font-mono text-sm ${status[0] ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>{status[1] || 'Move the graph…'}</div>
          <button className="btn-ghost mt-2 !justify-start !px-0 text-xs" onClick={() => setHint(!hint)}>{hint ? 'Hide hint' : 'Need a hint?'}</button>
          {hint && <p className="text-sm text-ink-600 dark:text-ink-300"><Rich text={c.hint} /></p>}
        </div>
      </div>
      {status[0] && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/20 animate-fade-up"><strong>Why it works: </strong><Rich text={c.success} />{next && <Link to={`/practice/challenges/${next.id}`} className="link ml-2">Next challenge →</Link>}</div>}
      <div className="card p-4 sm:p-6">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-ink-100 dark:bg-ink-800" />}>
          <C key={c.id} preset={c.preset ?? 0} initial={c.initial as never} onChange={onChange} />
        </Suspense>
      </div>
    </div>
  );
}
