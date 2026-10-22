import { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LAB_MODELS, getModel } from '../lab/registry';
import { getLecture, lectureLabel } from '../content/lectures';
import { CONCEPTS, FORMULAS } from '../content/library';
import { QUESTIONS } from '../content/questionBank';
import { CHALLENGES } from '../content/challenges';
import { useActiveProfile } from '../profiles/ProfileContext';
import { addRecent, visitLab } from '../storage/progress';
import { Breadcrumbs } from '../components/layout/AppLayout';
import { Tex } from '../components/ui/Tex';
import NotFound from './NotFound';

export default function LabModelPage() {
  const { modelId } = useParams();
  const m = getModel(modelId);
  const { update } = useActiveProfile();
  useEffect(() => {
    if (m) update((d) => addRecent(visitLab(d, m.id), `/lab/${m.id}`, `Lab · ${m.title}`));
  }, [m?.id]); // eslint-disable-line
  if (!m) return <NotFound />;
  const C = m.component;
  const formulas = FORMULAS.filter((f) => f.model === m.id || (m.id === 'price-controls' && f.model === 'price-controls'));
  const concepts = CONCEPTS.filter((c) => c.model === m.id);
  const questions = QUESTIONS.filter((q) => q.lectures.some((l) => m.lectures.includes(l))).slice(0, 6);
  const challenges = CHALLENGES.filter((c) => c.model === m.id);
  const idx = LAB_MODELS.findIndex((x) => x.id === m.id);
  const next = LAB_MODELS[(idx + 1) % LAB_MODELS.length];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Economics Lab', to: '/lab' }, { label: m.title }]} />
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">{m.title}</h1>
          <p className="mt-1 max-w-3xl text-ink-600 dark:text-ink-300">{m.summary}</p>
          {m.enrichment && <p className="mt-2 max-w-3xl rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">This model goes beyond the lecture slides provided so far ({m.lectures.includes('ch15') ? 'it supports the Chapter 15 problem set' : 'it supports the monopoly practice questions'}). Treat it as preparation, not as a summary of a lecture.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {m.lectures.filter((l) => getLecture(l)).map((l) => <Link key={l} to={`/learn/${l}`} className="btn-secondary !py-1.5 text-xs">📖 {lectureLabel(l)}</Link>)}
        </div>
      </header>
      <div className="card p-4 sm:p-6">
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-ink-100 dark:bg-ink-800" />}>
          <C key={m.id} preset={m.preset ?? 0} />
        </Suspense>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {formulas.length > 0 && (
          <div className="card p-5">
            <div className="label mb-3">Formulas used</div>
            <ul className="space-y-3">{formulas.map((f) => <li key={f.id}><div className="text-sm font-medium">{f.name}</div><Tex tex={f.tex} block /></li>)}</ul>
          </div>
        )}
        {concepts.length > 0 && (
          <div className="card p-5">
            <div className="label mb-3">Key concepts</div>
            <ul className="space-y-2">{concepts.map((c) => <li key={c.id}><Link to={`/library?concept=${c.id}`} className="text-sm font-medium hover:text-[var(--accent)]">{c.term}</Link></li>)}</ul>
          </div>
        )}
        <div className="card p-5">
          <div className="label mb-3">Practise this</div>
          <ul className="space-y-2 text-sm">
            {challenges.map((c) => <li key={c.id}><Link to={`/practice/challenges/${c.id}`} className="link">🎯 Graph challenge: {c.title}</Link></li>)}
            {questions.map((q) => <li key={q.id}><Link to={`/practice/q/${q.id}`} className="hover:text-[var(--accent)]">{q.source}</Link></li>)}
          </ul>
          <Link to={`/lab/${next.id}`} className="btn-ghost mt-4 !px-0 text-sm">Next model: {next.title} →</Link>
        </div>
      </div>
    </div>
  );
}
