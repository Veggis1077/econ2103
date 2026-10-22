import { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Block, CalloutTone, InlineQuestion } from '../../types/content';
import { getModel } from '../../lab/registry';
import { getQuestion } from '../../content/questionBank';
import { getConcept } from '../../content/library';
import { useProfile } from '../../profiles/ProfileContext';
import { recordAnswer, toggleBookmark } from '../../storage/progress';
import { Rich, RichBlock } from '../ui/Rich';
import { Tex } from '../ui/Tex';
import { DataTable } from './DataTable';
import { FigureView } from './FigureView';

const TONES: Record<CalloutTone, { label: string; cls: string; icon: string }> = {
  intuition: { label: 'Intuition', cls: 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/30', icon: '💡' },
  warning: { label: 'Common mistake', cls: 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30', icon: '⚠' },
  exam: { label: 'Exam tip', cls: 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30', icon: '🎯' },
  note: { label: 'Note', cls: 'border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-800/50', icon: 'ℹ' },
  example: { label: 'Example', cls: 'border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30', icon: '✎' },
  key: { label: 'Key idea', cls: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30', icon: '★' },
};

export function BlockRenderer({ block, lectureId }: { block: Block; lectureId?: string }) {
  switch (block.type) {
    case 'p':
      return <RichBlock text={block.text} className="prose-econ space-y-3" />;
    case 'h':
      return <h3 className="mt-2 font-serif text-xl font-semibold text-ink-900 dark:text-white">{block.text}</h3>;
    case 'list': {
      const L = block.ordered ? 'ol' : 'ul';
      return (
        <L className={`prose-econ space-y-1.5 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-ink-400`}>
          {block.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}
        </L>
      );
    }
    case 'definition':
      return <Definition term={block.term} text={block.text} conceptId={block.conceptId} />;
    case 'math':
      return (
        <div className="rounded-xl border border-ink-200/70 bg-white px-4 py-2 dark:border-ink-800 dark:bg-ink-900">
          <Tex tex={block.tex} block />
          {block.caption && <div className="pb-1 text-center text-sm text-ink-500"><Rich text={block.caption} /></div>}
        </div>
      );
    case 'callout': {
      const t = TONES[block.tone];
      const texts = Array.isArray(block.text) ? block.text : [block.text];
      return (
        <aside className={`rounded-xl border p-4 ${t.cls}`}>
          <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-ink-800 dark:text-ink-100"><span aria-hidden>{t.icon}</span>{block.title ?? t.label}</div>
          <div className="prose-econ space-y-2 text-[14.5px]">{texts.map((x, i) => <RichBlock key={i} text={x} />)}</div>
        </aside>
      );
    }
    case 'table':
      return <DataTable table={block.table} />;
    case 'figure':
      return <figure className="card p-4"><FigureView spec={block.figure} />{block.caption && <figcaption className="mt-2 text-center text-sm text-ink-500"><Rich text={block.caption} /></figcaption>}</figure>;
    case 'model':
      return <EmbeddedModel id={block.model} props={block.props} caption={block.caption} />;
    case 'example':
      return <WorkedExample title={block.title} problem={block.problem} steps={block.steps} answer={block.answer} />;
    case 'mistakes':
      return (
        <div className="grid gap-3">
          {block.items.map((m, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-ink-200/70 p-3 sm:grid-cols-2 dark:border-ink-800">
              <div className="text-sm"><span className="mr-1 font-semibold text-rose-600">✗ Mistake:</span><Rich text={m.wrong} /></div>
              <div className="text-sm"><span className="mr-1 font-semibold text-emerald-600">✓ Instead:</span><Rich text={m.right} /></div>
            </div>
          ))}
        </div>
      );
    case 'check':
      return <ConceptCheck q={block.question} id={`${lectureId ?? 'x'}:${block.question.prompt.slice(0, 40)}`} />;
    case 'questions':
      return <QuestionLinks ids={block.ids} title={block.title} />;
    case 'compare':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[block.left, block.right].map((c, i) => (
            <div key={i} className="rounded-xl border border-ink-200/70 p-4 dark:border-ink-800">
              <div className="mb-2 font-semibold">{c.title}</div>
              <ul className="prose-econ list-disc space-y-1 pl-5 text-sm marker:text-ink-400">{c.items.map((x, j) => <li key={j}><Rich text={x} /></li>)}</ul>
            </div>
          ))}
        </div>
      );
  }
}

function Definition({ term, text, conceptId }: { term: string; text: string; conceptId?: string }) {
  const { data, update } = useProfile();
  const id = conceptId ?? (getConcept(term.toLowerCase().replace(/\s+/g, '-')) ? term.toLowerCase().replace(/\s+/g, '-') : undefined);
  const marked = id ? data?.bookmarks.includes(id) : false;
  return (
    <div className="rounded-xl border-l-4 border-[var(--accent)] bg-white p-4 shadow-card dark:bg-ink-900">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--accent)]">Definition · {term}</div>
        {id && (
          <button onClick={() => update((d) => toggleBookmark(d, id))} className="text-xs text-ink-400 hover:text-[var(--accent)]" aria-pressed={marked} title={marked ? 'Remove bookmark' : 'Bookmark concept'}>
            {marked ? '★ Saved' : '☆ Save'}
          </button>
        )}
      </div>
      <RichBlock text={text} className="prose-econ mt-1" />
    </div>
  );
}

function EmbeddedModel({ id, props, caption }: { id: string; props?: Record<string, unknown>; caption?: string }) {
  const m = getModel(id);
  if (!m) return <div className="text-sm text-rose-600">Unknown model: {id}</div>;
  const C = m.component;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-2.5 dark:border-ink-800">
        <div className="flex items-center gap-2 text-sm font-semibold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800">{m.icon}</span>Interactive: {m.title}</div>
        <Link to={`/lab/${m.id}`} className="text-xs link">Open in Lab ↗</Link>
      </div>
      <div className="p-4">
        <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-ink-100 dark:bg-ink-800" />}>
          <C preset={(props?.preset as number | undefined) ?? m.preset} initial={props?.initial as never} />
        </Suspense>
        {caption && <div className="mt-3 text-sm text-ink-500"><Rich text={caption} /></div>}
      </div>
    </div>
  );
}

function WorkedExample({ title, problem, steps, answer }: { title: string; problem: string; steps: string[]; answer: string }) {
  const [shown, setShown] = useState(0);
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">✎ Worked example · {title}</div>
      <RichBlock text={problem} className="prose-econ" />
      <ol className="mt-3 space-y-2">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="flex gap-3 animate-fade-up">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-semibold text-white">{i + 1}</span>
            <RichBlock text={s} className="prose-econ flex-1 text-[14.5px]" />
          </li>
        ))}
      </ol>
      {shown >= steps.length && <div className="mt-3 rounded-lg bg-white p-3 text-[14.5px] font-medium dark:bg-ink-900"><span className="text-violet-700 dark:text-violet-300">Answer: </span><Rich text={answer} /></div>}
      <div className="mt-3 flex gap-2">
        {shown < steps.length && <button className="btn-secondary !py-1.5 text-xs" onClick={() => setShown(shown + 1)}>Show step {shown + 1} of {steps.length}</button>}
        {shown < steps.length && <button className="btn-ghost !py-1.5 text-xs" onClick={() => setShown(steps.length)}>Show full solution</button>}
        {shown > 0 && <button className="btn-ghost !py-1.5 text-xs" onClick={() => setShown(0)}>Hide</button>}
      </div>
    </div>
  );
}

function ConceptCheck({ q, id }: { q: InlineQuestion; id: string }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const { update } = useProfile();
  const ok = choice === q.answer;
  return (
    <div className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
      <div className="label mb-2">Concept check</div>
      <RichBlock text={q.prompt} className="prose-econ font-medium" />
      <div className="mt-3 grid gap-2">
        {q.options.map((o, i) => (
          <button key={i} disabled={done} onClick={() => setChoice(i)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${done && i === q.answer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : done && i === choice ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40' : choice === i ? 'border-[var(--accent)] bg-[var(--accent-tint)] dark:bg-ink-800' : 'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'}`}>
            <Rich text={o} />
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {!done ? (
          <button className="btn-primary !py-1.5 text-xs" disabled={choice === null} onClick={() => { setDone(true); update((d) => recordAnswer(d, `cc:${id}`, choice === q.answer, 'concept-check')); }}>Check</button>
        ) : (
          <button className="btn-ghost !py-1.5 text-xs" onClick={() => { setDone(false); setChoice(null); }}>Try again</button>
        )}
      </div>
      {done && (
        <div className={`mt-3 rounded-lg p-3 text-sm animate-fade-up ${ok ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-rose-50 dark:bg-rose-950/30'}`}>
          <strong className={ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>{ok ? 'Correct. ' : 'Not quite. '}</strong>
          <Rich text={q.explanation} />
        </div>
      )}
    </div>
  );
}

function QuestionLinks({ ids, title }: { ids: string[]; title?: string }) {
  const { data } = useProfile();
  const qs = ids.map(getQuestion).filter(Boolean);
  return (
    <div className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
      <div className="label mb-2">{title ?? 'Practice questions on this topic'}</div>
      <ul className="divide-y divide-ink-100 dark:divide-ink-800">
        {qs.map((q) => {
          const st = data?.questions[q!.id];
          return (
            <li key={q!.id} className="flex items-center gap-3 py-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${!st ? 'bg-ink-200 dark:bg-ink-700' : st.lastCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} title={!st ? 'not tried' : st.lastCorrect ? 'last attempt correct' : 'last attempt wrong'} />
              <Link to={`/practice/q/${q!.id}`} className="flex-1 truncate text-sm hover:text-[var(--accent)]">
                <span className="mr-2 font-mono text-xs text-ink-400">{q!.source.split('·').pop()?.trim()}</span>
                {(q!.stem || q!.question || '').replace(/\$/g, '$').slice(0, 110)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
