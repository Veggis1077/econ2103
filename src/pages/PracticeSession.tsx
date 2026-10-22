import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { QUESTIONS, topicLabel } from '../content/questionBank';
import { lectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { recordAnswer, type PracticeMode } from '../storage/progress';
import { adaptiveSelection } from '../stats/analytics';
import { QuestionCard, optionOrder, shuffle } from '../components/quiz/QuestionCard';
import { Breadcrumbs } from '../components/layout/AppLayout';
import { Empty, ProgressBar } from '../components/ui';

/** Remount the session whenever the query string changes (new set, retry…). */
export default function PracticeSessionRoute() {
  const loc = useLocation();
  return <PracticeSession key={loc.search} />;
}

function PracticeSession() {
  const [sp] = useSearchParams();
  const { data, update } = useActiveProfile();
  const mode = (sp.get('mode') ?? 'learning') as 'learning' | 'mistakes' | 'adaptive';
  const lecture = sp.get('lecture');
  const topic = sp.get('topic');
  const ids = sp.get('ids');
  const n = Number(sp.get('n') ?? 10);

  // Build the question list once per session (do not reshuffle as progress updates).
  const questions = useMemo(() => {
    let pool = QUESTIONS;
    if (ids) pool = ids.split(',').map((id) => QUESTIONS.find((q) => q.id === id)!).filter(Boolean);
    if (lecture) pool = pool.filter((q) => q.lectures.includes(lecture));
    if (topic) pool = pool.filter((q) => q.topics.includes(topic));
    if (mode === 'mistakes') return shuffle(pool.filter((q) => data.questions[q.id]?.inMistakes));
    if (mode === 'adaptive') return adaptiveSelection(pool, data, Math.min(n, pool.length));
    return ids ? pool : shuffle(pool);
  }, []); // eslint-disable-line
  const orders = useMemo(() => questions.map((q) => optionOrder(q, true)), [questions]);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const title = mode === 'mistakes' ? 'Mistakes mode' : mode === 'adaptive' ? 'Adaptive practice' : 'Learning mode';
  const scope = [lecture && lectureLabel(lecture), topic && topicLabel(topic)].filter(Boolean).join(' · ');
  if (!questions.length) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: title }]} />
        <Empty title={mode === 'mistakes' ? 'Your mistakes list is empty 🎉' : 'No questions for this selection'}><Link to="/practice" className="link">Back to practice</Link></Empty>
      </div>
    );
  }
  const finished = i >= questions.length;
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const recordMode: PracticeMode = mode;

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: title }]} />
      <div className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div><h1 className="font-serif text-2xl font-semibold">{title}</h1>{scope && <div className="text-sm text-ink-500">{scope}</div>}</div>
          <div className="font-mono text-sm text-ink-500">{Math.min(i + 1, questions.length)}/{questions.length} · {correct}/{answered} correct</div>
        </div>
        <ProgressBar value={i / questions.length} className="mt-3" />
      </div>
      {!finished ? (
        <>
          <QuestionCard key={questions[i].id} question={questions[i]} order={orders[i]} mode="learning" number={i + 1}
            onSubmit={(ok) => { if (!(questions[i].id in results)) { setResults((r) => ({ ...r, [questions[i].id]: ok })); update((d) => recordAnswer(d, questions[i].id, ok, recordMode)); } }}
            footer={<button className="btn-ghost ml-auto" onClick={() => setI(i + 1)}>{questions[i].id in results ? 'Next question →' : 'Skip →'}</button>} />
          <div className="mt-4 flex justify-between">
            <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center animate-fade-up">
          <div className="text-5xl">{answered && correct / answered >= 0.8 ? '🏆' : '📈'}</div>
          <h2 className="mt-3 font-serif text-2xl font-semibold">Session complete</h2>
          <p className="mt-1 text-ink-600 dark:text-ink-300">You answered {correct} of {answered} correctly{questions.length > answered ? ` (${questions.length - answered} skipped)` : ''}.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Object.values(results).some((v) => !v) && <Link to={`/practice/session?mode=learning&ids=${Object.entries(results).filter(([, v]) => !v).map(([k]) => k).join(',')}`} className="btn-primary">Retry the ones I missed</Link>}
            <Link to={`/practice/session?mode=adaptive&t=${Date.now()}`} className="btn-secondary">New adaptive set</Link>
            <Link to="/practice" className="btn-ghost">Back to practice</Link>
          </div>
        </div>
      )}
    </div>
  );
}
