import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QUESTIONS, getQuestion } from '../content/questionBank';
import { useActiveProfile } from '../profiles/ProfileContext';
import { recordAnswer } from '../storage/progress';
import { QuestionCard, optionOrder } from '../components/quiz/QuestionCard';
import { Breadcrumbs } from '../components/layout/AppLayout';
import NotFound from './NotFound';

export default function QuestionPage() {
  const { qid } = useParams();
  const q = getQuestion(qid ?? '');
  const { data, update } = useActiveProfile();
  const order = useMemo(() => (q ? optionOrder(q, false) : []), [q]);
  if (!q) return <NotFound />;
  const idx = QUESTIONS.findIndex((x) => x.id === q.id);
  const prev = QUESTIONS[idx - 1];
  const next = QUESTIONS[idx + 1];
  const st = data.questions[q.id];
  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Practice', to: '/practice' }, { label: q.source }]} />
      {st && <p className="mb-3 text-sm text-ink-500">You have tried this {st.attempts}× ({st.correct} correct). Last attempt: {st.lastCorrect ? '✓ correct' : '✗ wrong'}.</p>}
      <QuestionCard key={q.id} question={q} order={order} mode="learning" onSubmit={(ok) => update((d) => recordAnswer(d, q.id, ok, 'learning'))} />
      <div className="mt-4 flex justify-between">
        {prev ? <Link to={`/practice/q/${prev.id}`} className="btn-ghost">← {prev.source.split('·').pop()}</Link> : <span />}
        {next ? <Link to={`/practice/q/${next.id}`} className="btn-ghost">{next.source.split('·').pop()} →</Link> : <span />}
      </div>
    </div>
  );
}
