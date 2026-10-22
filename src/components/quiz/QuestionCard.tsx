import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BankQuestion } from '../../types/content';
import { DIFFICULTY_LABEL, getAnswer, isCorrect, topicLabel } from '../../content/questionBank';
import { shortLectureLabel } from '../../content/lectures';
import { Rich, RichBlock } from '../ui/Rich';
import { Badge } from '../ui';
import { FigureView } from '../learning/FigureView';
import { DataTable } from '../learning/DataTable';

export interface QuestionCardProps {
  question: BankQuestion;
  /** Display order of options (indices into the original options). */
  order?: number[];
  /** 'learning' shows feedback after submit; 'exam' records silently. */
  mode: 'learning' | 'exam';
  /** Controlled selection (exam mode). */
  selected?: number | null;
  onSelect?: (originalIndex: number | null) => void;
  onSubmit?: (correct: boolean, response: number) => void;
  /** Exam review: show result for a given response. */
  reviewResponse?: number | null;
  number?: number;
  footer?: React.ReactNode;
}

const LETTERS = 'ABCDEFGH';

export function QuestionCard({ question: q, order, mode, selected, onSelect, onSubmit, reviewResponse, number, footer }: QuestionCardProps) {
  const opts = q.options ?? [];
  const displayOrder = useMemo(() => order ?? opts.map((_, i) => i), [order, opts]);
  const [local, setLocal] = useState<number | null>(null);
  const [numeric, setNumeric] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const choice = selected !== undefined ? selected : local;
  const reviewing = reviewResponse !== undefined;
  const shownResponse = reviewing ? reviewResponse : submitted ? (q.kind === 'numeric' ? parseFloat(numeric) : choice) : null;
  const showFeedback = reviewing || (mode === 'learning' && submitted);
  const answer = showFeedback ? getAnswer(q.id) : undefined;
  const correct = showFeedback ? isCorrect(q, shownResponse ?? null) : false;

  const pick = (i: number) => {
    if (submitted || reviewing) return;
    if (selected !== undefined) onSelect?.(i);
    else setLocal(i);
  };
  const submit = () => {
    const resp = q.kind === 'numeric' ? parseFloat(numeric) : choice;
    if (resp === null || resp === undefined || Number.isNaN(resp)) return;
    setSubmitted(true);
    onSubmit?.(isCorrect(q, resp), resp);
  };
  const retry = () => { setSubmitted(false); setLocal(null); setNumeric(''); };

  return (
    <article className="card p-5 sm:p-6" aria-labelledby={`q-${q.id}`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {number !== undefined && <span className="font-mono text-sm font-semibold text-ink-500">Q{number}</span>}
        <Badge color="ink">{q.source}</Badge>
        {q.lectures.map((l) => <Badge key={l} color="blue">{l === 'beyond' ? 'Beyond slides' : shortLectureLabel(l)}</Badge>)}
        <Badge color={q.difficulty === 1 ? 'green' : q.difficulty === 2 ? 'amber' : 'red'}>{DIFFICULTY_LABEL[q.difficulty]}</Badge>
        {q.topics.slice(0, 2).map((t) => <Badge key={t} color="violet">{topicLabel(t)}</Badge>)}
      </div>
      <div id={`q-${q.id}`} className="prose-econ space-y-3">
        {q.preamble && <RichBlock text={q.preamble} />}
        {q.stem && <RichBlock text={q.stem} />}
        {q.figures && <div className={`grid gap-4 ${q.figures.length > 1 ? 'md:grid-cols-2' : ''}`}>{q.figures.map((f, i) => <figure key={i}><FigureView spec={f.spec} />{f.caption && <figcaption className="mt-1 text-center text-xs text-ink-500">{f.caption}</figcaption>}</figure>)}</div>}
        {q.table && <DataTable table={q.table} />}
        {q.question && <RichBlock text={q.question} className="font-medium text-ink-900 dark:text-white" />}
      </div>

      {q.kind === 'mcq' ? (
        <div className="mt-5 space-y-2" role="radiogroup" aria-label="Answer options">
          {displayOrder.map((oi, pos) => {
            const isChosen = (reviewing ? reviewResponse : choice) === oi;
            const isAnswer = answer && answer.answer === oi;
            let cls = 'border-ink-200 hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800/60';
            if (showFeedback && isAnswer) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
            else if (showFeedback && isChosen) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
            else if (isChosen) cls = 'border-[var(--accent)] bg-[var(--accent-tint)] dark:bg-ink-800';
            return (
              <button key={oi} type="button" role="radio" aria-checked={isChosen} onClick={() => pick(oi)} disabled={submitted || reviewing}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition ${cls} disabled:cursor-default`}>
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${isChosen ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-ink-300 text-ink-500 dark:border-ink-600'}`}>{LETTERS[pos]}</span>
                <span className="flex-1"><Rich text={opts[oi]} /></span>
                {showFeedback && isAnswer && <span className="text-emerald-600" aria-label="correct answer">✓</span>}
                {showFeedback && isChosen && !isAnswer && <span className="text-rose-600" aria-label="your answer">✗</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2">
          <input type="number" inputMode="decimal" value={numeric} onChange={(e) => setNumeric(e.target.value)} disabled={submitted || reviewing}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="h-11 w-48 rounded-xl border border-ink-200 bg-white px-3 font-mono outline-none focus:border-[var(--accent)] dark:border-ink-700 dark:bg-ink-900" placeholder="Your answer" aria-label="Numeric answer" />
          {q.unit && <span className="text-sm text-ink-500">{q.unit}</span>}
        </div>
      )}

      {mode === 'learning' && !reviewing && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {!submitted ? (
            <button className="btn-primary" onClick={submit} disabled={q.kind === 'mcq' ? choice === null : numeric.trim() === ''}>Submit answer</button>
          ) : (
            <button className="btn-secondary" onClick={retry}>Try again</button>
          )}
          {footer}
        </div>
      )}

      {showFeedback && answer && (
        <div className={`mt-5 rounded-xl border p-4 animate-fade-up ${correct ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30' : 'border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'}`} role="status">
          <div className={`mb-2 font-semibold ${correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
            {correct ? 'Correct!' : shownResponse === null || shownResponse === undefined ? 'Not answered' : 'Not quite.'}
            {q.kind === 'numeric' && <span className="ml-2 font-normal text-ink-600 dark:text-ink-300">Answer: {answer.answer}{q.unit ? ` ${q.unit}` : ''}</span>}
          </div>
          <RichBlock text={answer.explanation} className="prose-econ space-y-2 text-sm" />
          {answer.reviewNote && <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">⚠ Note on the source question: {answer.reviewNote}</p>}
          {answer.status === 'review' && <p className="mt-2 text-xs text-amber-700">This answer is flagged for review — discuss it with your tutor.</p>}
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {q.lectures.filter((l) => l !== 'beyond').map((l) => <Link key={l} to={`/learn/${l}`} className="link">Review {shortLectureLabel(l)} →</Link>)}
          </div>
        </div>
      )}
    </article>
  );
}

/** Fisher–Yates shuffle of option indices (unless the question requires fixed order). */
export function optionOrder(q: BankQuestion, randomize: boolean): number[] {
  const idx = (q.options ?? []).map((_, i) => i);
  if (!randomize || q.fixedOrder) return idx;
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
