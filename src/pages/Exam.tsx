import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS, isCorrect, topicLabel } from '../content/questionBank';
import { LECTURES, shortLectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { addExam, recordAnswer, type ExamResult } from '../storage/progress';
import { QuestionCard, optionOrder, shuffle } from '../components/quiz/QuestionCard';
import { Card, PageHeader, ProgressBar, Segmented, Stat, Toggle, pct } from '../components/ui';
import type { BankQuestion } from '../types/content';

interface Config { n: number; minutes: number; lectures: string[]; difficulty: 'all' | '1' | '2' | '3'; randomOrder: boolean; randomOptions: boolean; sourceOnly: boolean }

const ALL_SCOPES = [...LECTURES.map((l) => l.id), 'ch15', 'beyond'];

export default function Exam() {
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup');
  const [cfg, setCfg] = useState<Config>({ n: 20, minutes: 30, lectures: ALL_SCOPES.filter((l) => l !== 'beyond'), difficulty: 'all', randomOrder: true, randomOptions: true, sourceOnly: false });
  const [paper, setPaper] = useState<{ qs: BankQuestion[]; orders: number[][] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const { update } = useActiveProfile();

  const pool = useMemo(() => QUESTIONS.filter((q) => q.kind === 'mcq' && q.lectures.some((l) => cfg.lectures.includes(l)) && (cfg.difficulty === 'all' || String(q.difficulty) === cfg.difficulty) && (!cfg.sourceOnly || q.id.startsWith('pq'))), [cfg]);

  const start = () => {
    const chosen = (cfg.randomOrder ? shuffle(pool) : pool).slice(0, Math.min(cfg.n, pool.length));
    setPaper({ qs: chosen, orders: chosen.map((q) => optionOrder(q, cfg.randomOptions)) });
    setAnswers({});
    setPhase('run');
  };

  const finish = (elapsed: number) => {
    if (!paper) return;
    const res: ExamResult = {
      id: `exam-${Date.now()}`, at: new Date().toISOString(), durationSec: elapsed, timeLimitSec: cfg.minutes * 60,
      score: 0, total: paper.qs.length, answers: {}, topics: [...new Set(paper.qs.flatMap((q) => q.topics))],
    };
    for (const q of paper.qs) {
      const chosen = answers[q.id] ?? null;
      const ok = isCorrect(q, chosen);
      res.answers[q.id] = { chosen, correct: ok };
      if (ok) res.score++;
    }
    update((d) => {
      let nd = d;
      for (const q of paper.qs) if (answers[q.id] !== undefined && answers[q.id] !== null) nd = recordAnswer(nd, q.id, res.answers[q.id].correct, 'exam');
      return addExam(nd, res);
    });
    setResult(res);
    setPhase('done');
  };

  if (phase === 'run' && paper) return <ExamRun paper={paper} minutes={cfg.minutes} answers={answers} setAnswers={setAnswers} onFinish={finish} />;
  if (phase === 'done' && paper && result) return <ExamResults paper={paper} result={result} onRestart={() => setPhase('setup')} />;

  const toggleScope = (id: string) => setCfg((c) => ({ ...c, lectures: c.lectures.includes(id) ? c.lectures.filter((x) => x !== id) : [...c.lectures, id] }));
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Exam simulator" title="Timed multiple-choice exam" subtitle="Realistic conditions: a timer, no feedback until you submit, randomised question order and answer choices. Afterwards you get a full review, weakness analysis and revision recommendations." />
      <Card className="space-y-6 p-6">
        <div>
          <div className="label mb-2">Number of questions</div>
          <Segmented value={String(cfg.n)} onChange={(v) => setCfg({ ...cfg, n: Number(v), minutes: Math.round(Number(v) * 1.5) })} options={[10, 20, 30, 40].map((n) => ({ value: String(n), label: `${n}` }))} />
          <span className="ml-3 text-sm text-ink-500">{pool.length} available with these settings</span>
        </div>
        <div>
          <div className="label mb-2">Time limit: {cfg.minutes} minutes</div>
          <input type="range" min={5} max={90} step={5} value={cfg.minutes} onChange={(e) => setCfg({ ...cfg, minutes: Number(e.target.value) })} className="w-full max-w-md" aria-label="Time limit in minutes" />
        </div>
        <div>
          <div className="label mb-2">Topics (lectures)</div>
          <div className="flex flex-wrap gap-2">
            {ALL_SCOPES.map((id) => (
              <button key={id} onClick={() => toggleScope(id)} aria-pressed={cfg.lectures.includes(id)} className={`chip border px-3 py-1 ${cfg.lectures.includes(id) ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800' : 'border-ink-200 text-ink-500 dark:border-ink-700'}`}>
                {id === 'beyond' ? 'Monopoly (beyond slides)' : id === 'ch15' ? 'Ch. 15' : shortLectureLabel(id)}
              </button>
            ))}
            <button className="btn-ghost !py-1 text-xs" onClick={() => setCfg({ ...cfg, lectures: ALL_SCOPES })}>All</button>
            <button className="btn-ghost !py-1 text-xs" onClick={() => setCfg({ ...cfg, lectures: [] })}>None</button>
          </div>
        </div>
        <div>
          <div className="label mb-2">Difficulty</div>
          <Segmented value={cfg.difficulty} onChange={(v) => setCfg({ ...cfg, difficulty: v })} options={[{ value: 'all', label: 'Mixed' }, { value: '1', label: 'Basic' }, { value: '2', label: 'Intermediate' }, { value: '3', label: 'Challenging' }]} />
        </div>
        <div className="flex flex-wrap gap-6">
          <Toggle checked={cfg.randomOrder} onChange={(randomOrder) => setCfg({ ...cfg, randomOrder })} label="Randomise question order" />
          <Toggle checked={cfg.randomOptions} onChange={(randomOptions) => setCfg({ ...cfg, randomOptions })} label="Randomise answer choices" />
          <Toggle checked={cfg.sourceOnly} onChange={(sourceOnly) => setCfg({ ...cfg, sourceOnly })} label="Only the 39 source questions" />
        </div>
        <p className="text-xs text-ink-500">Questions whose options depend on their order (e.g. ordered numeric choices) keep their original order.</p>
        <button className="btn-primary" disabled={!pool.length} onClick={start}>Start exam ({Math.min(cfg.n, pool.length)} questions, {cfg.minutes} min)</button>
      </Card>
    </div>
  );
}

function ExamRun({ paper, minutes, answers, setAnswers, onFinish }: { paper: { qs: BankQuestion[]; orders: number[][] }; minutes: number; answers: Record<string, number | null>; setAnswers: React.Dispatch<React.SetStateAction<Record<string, number | null>>>; onFinish: (elapsedSec: number) => void }) {
  const [i, setI] = useState(0);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const startRef = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const limit = minutes * 60;
  const elapsed = Math.floor((now - startRef.current) / 1000);
  const left = Math.max(0, limit - elapsed);
  const finished = useRef(false);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (left === 0 && !finished.current) { finished.current = true; onFinish(limit); } }, [left]); // eslint-disable-line
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  const q = paper.qs[i];
  const answered = paper.qs.filter((x) => answers[x.id] !== undefined && answers[x.id] !== null).length;
  const submit = () => {
    const missing = paper.qs.length - answered;
    if (missing > 0 && !window.confirm(`${missing} question(s) unanswered. Submit anyway?`)) return;
    finished.current = true;
    onFinish(elapsed);
  };
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">
        <QuestionCard key={q.id} question={q} order={paper.orders[i]} mode="exam" number={i + 1} selected={answers[q.id] ?? null} onSelect={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <button className="btn-secondary" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
          <button className="btn-ghost" onClick={() => setFlags((f) => { const n = new Set(f); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })}>{flags.has(q.id) ? '⚑ Unflag' : '⚐ Flag for review'}</button>
          {i < paper.qs.length - 1 ? <button className="btn-primary" onClick={() => setI(i + 1)}>Next →</button> : <button className="btn-primary" onClick={submit}>Submit exam</button>}
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="p-4">
          <div className="label">Time remaining</div>
          <div className={`font-mono text-3xl font-semibold tabular-nums ${left < 60 ? 'text-rose-600' : left < 300 ? 'text-amber-600' : ''}`} role="timer" aria-live="off">{mm}:{ss}</div>
          <ProgressBar value={elapsed / limit} className="mt-2" color={left < 300 ? '#f59e0b' : undefined} />
          <div className="mt-4 text-sm text-ink-500">{answered}/{paper.qs.length} answered</div>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {paper.qs.map((x, k) => {
              const a = answers[x.id] !== undefined && answers[x.id] !== null;
              return (
                <button key={x.id} onClick={() => setI(k)} aria-label={`Question ${k + 1}${a ? ', answered' : ''}${flags.has(x.id) ? ', flagged' : ''}`}
                  className={`relative h-8 rounded-md text-xs font-medium ${k === i ? 'ring-2 ring-[var(--accent)]' : ''} ${a ? 'bg-[var(--accent)] text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
                  {k + 1}{flags.has(x.id) && <span className="absolute -right-0.5 -top-1 text-[10px] text-amber-500">⚑</span>}
                </button>
              );
            })}
          </div>
          <button className="btn-secondary mt-4 w-full" onClick={submit}>Submit exam</button>
        </Card>
      </aside>
    </div>
  );
}

function ExamResults({ paper, result, onRestart }: { paper: { qs: BankQuestion[]; orders: number[][] }; result: ExamResult; onRestart: () => void }) {
  const [review, setReview] = useState<'all' | 'wrong'>('wrong');
  const byTopic = new Map<string, { n: number; ok: number }>();
  for (const q of paper.qs) for (const t of q.topics) {
    const e = byTopic.get(t) ?? { n: 0, ok: 0 };
    e.n++; if (result.answers[q.id].correct) e.ok++;
    byTopic.set(t, e);
  }
  const topics = [...byTopic.entries()].sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
  const weak = topics.filter(([, v]) => v.ok / v.n < 0.6);
  const lecturesToRevise = [...new Set(paper.qs.filter((q) => !result.answers[q.id].correct).flatMap((q) => q.lectures))].filter((l) => l !== 'beyond');
  const wrongIds = paper.qs.filter((q) => !result.answers[q.id].correct).map((q) => q.id);
  const share = result.score / result.total;
  const shown = paper.qs.map((q, k) => ({ q, k })).filter(({ q }) => review === 'all' || !result.answers[q.id].correct);
  return (
    <div className="space-y-8">
      <Card className="p-6 sm:p-8 animate-fade-up">
        <div className="grid gap-6 sm:grid-cols-4">
          <Stat label="Score" value={`${result.score}/${result.total}`} tone={share >= 0.7 ? 'good' : 'bad'} hint={pct(share, 0)} />
          <Stat label="Time used" value={`${Math.floor(result.durationSec / 60)}m ${result.durationSec % 60}s`} hint={`limit ${result.timeLimitSec / 60} min`} />
          <Stat label="Unanswered" value={Object.values(result.answers).filter((a) => a.chosen === null).length} />
          <Stat label="Grade band" value={share >= 0.85 ? 'Excellent' : share >= 0.7 ? 'Good' : share >= 0.5 ? 'Pass-level' : 'Needs work'} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {wrongIds.length > 0 && <Link className="btn-primary" to={`/practice/session?mode=learning&ids=${wrongIds.join(',')}`}>Retry the {wrongIds.length} incorrect questions</Link>}
          <button className="btn-secondary" onClick={onRestart}>New exam</button>
          <Link className="btn-ghost" to="/progress">See exam history</Link>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="label mb-3">Performance by topic</div>
          <div className="space-y-3">
            {topics.map(([t, v]) => (
              <div key={t}>
                <div className="mb-1 flex justify-between text-sm"><span>{topicLabel(t)}</span><span className="font-mono text-xs">{v.ok}/{v.n}</span></div>
                <ProgressBar value={v.ok / v.n} color={v.ok / v.n >= 0.75 ? '#10b981' : v.ok / v.n >= 0.5 ? '#f59e0b' : '#f43f5e'} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="label mb-3">Personalised revision plan</div>
          {weak.length === 0 && lecturesToRevise.length === 0 ? <p className="text-sm">Excellent — no weak topics in this exam. Try a harder difficulty or a full 40-question exam.</p> : (
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {weak.map(([t]) => <li key={t}>Strengthen <strong>{topicLabel(t)}</strong>: <Link className="link" to={`/practice/session?mode=learning&topic=${t}`}>practise this topic</Link>.</li>)}
              {lecturesToRevise.map((l) => <li key={l}>Re-read <Link className="link" to={`/learn/${l}`}>{shortLectureLabel(l)}</Link> — especially the worked examples and common mistakes.</li>)}
              <li>Use <Link className="link" to="/practice/session?mode=mistakes">Mistakes mode</Link> until your mistakes list is empty.</li>
            </ol>
          )}
        </Card>
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold">Review answers</h2><Segmented size="sm" value={review} onChange={setReview} options={[{ value: 'wrong', label: 'Incorrect only' }, { value: 'all', label: 'All questions' }]} /></div>
        <div className="space-y-6">
          {shown.map(({ q, k }) => <QuestionCard key={q.id} question={q} order={paper.orders[k]} mode="exam" number={k + 1} reviewResponse={result.answers[q.id].chosen} />)}
          {!shown.length && <p className="text-sm text-ink-500">No incorrect answers 🎉</p>}
        </div>
      </section>
    </div>
  );
}
