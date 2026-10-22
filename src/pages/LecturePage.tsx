import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LECTURES, getLecture } from '../content/lectures';
import { problemSetsForLecture } from '../content/problems';
import { QUESTIONS } from '../content/questionBank';
import { getModel } from '../lab/registry';
import { useActiveProfile } from '../profiles/ProfileContext';
import { addRecent, setLectureCompleted, toggleSection, visitLecture } from '../storage/progress';
import { BlockRenderer } from '../components/learning/BlockRenderer';
import { Breadcrumbs } from '../components/layout/AppLayout';
import { ProgressBar } from '../components/ui';
import { Rich } from '../components/ui/Rich';
import NotFound from './NotFound';

const KIND_LABEL: Record<string, string> = {
  intro: 'Intuition', definitions: 'Definitions', math: 'Mathematics', interpretation: 'Interpretation', interactive: 'Interactive', example: 'Worked examples', mistakes: 'Common mistakes', check: 'Concept check', practice: 'Practice', recap: 'Recap', application: 'Application',
};

export default function LecturePage() {
  const { lectureId } = useParams();
  const lecture = getLecture(lectureId);
  const { data, update } = useActiveProfile();
  const loc = useLocation();
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (!lecture) return;
    update((d) => addRecent(visitLecture(d, lecture.id), `/learn/${lecture.id}`, `Ch. ${lecture.number} · ${lecture.title}`));
  }, [lecture?.id]); // eslint-disable-line

  useEffect(() => {
    const id = loc.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, [loc.hash, lecture?.id]);

  useEffect(() => {
    if (!lecture) return;
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-80px 0px -65% 0px' });
    lecture.sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [lecture?.id]); // eslint-disable-line

  const related = useMemo(() => (lecture ? QUESTIONS.filter((q) => q.lectures.includes(lecture.id)) : []), [lecture]);
  if (!lecture) return <NotFound />;

  const lp = data.lectures[lecture.id];
  const done = new Set(lp?.sectionsDone ?? []);
  const idx = LECTURES.findIndex((l) => l.id === lecture.id);
  const prev = LECTURES[idx - 1];
  const next = LECTURES[idx + 1];
  const sets = problemSetsForLecture(lecture.id);

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Learn', to: '/learn' }, { label: `Ch. ${lecture.number} · ${lecture.title}` }]} />
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <header className="mb-8 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl font-serif text-xl font-bold text-white" style={{ background: lecture.color }}>{lecture.number}</span>
              <div className="label">Chapter {lecture.number} · ≈ {lecture.estMinutes} min</div>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">{lecture.title}</h1>
            <p className="mt-2 max-w-3xl text-[15px] text-ink-600 dark:text-ink-300">{lecture.subtitle}</p>
            <div className="card mt-6 p-5">
              <div className="label mb-2">Learning objectives — after this module you can…</div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {lecture.objectives.map((o, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-[var(--accent)]">◆</span><Rich text={o} /></li>)}
              </ul>
              {lecture.models.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
                  <span className="label mr-1">Models</span>
                  {lecture.models.map((m) => getModel(m)).filter(Boolean).map((m) => <Link key={m!.id} to={`/lab/${m!.id}`} className="chip border border-ink-200 hover:border-[var(--accent)] dark:border-ink-700">{m!.icon} {m!.title}</Link>)}
                </div>
              )}
            </div>
          </header>

          <div className="space-y-12">
            {lecture.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink-200/70 pb-3 dark:border-ink-800">
                  <div>
                    <div className="label">{i + 1}. {KIND_LABEL[s.kind] ?? s.kind}</div>
                    <h2 className="font-serif text-2xl font-semibold text-ink-900 dark:text-white">{s.title}</h2>
                  </div>
                  <button onClick={() => update((d) => toggleSection(d, lecture.id, s.id, lecture.sections.length))}
                    className={`chip border px-3 py-1 transition ${done.has(s.id) ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'border-ink-200 text-ink-500 hover:border-ink-300 dark:border-ink-700'}`} aria-pressed={done.has(s.id)}>
                    {done.has(s.id) ? '✓ Done' : 'Mark as done'}
                  </button>
                </div>
                <div className="space-y-5">{s.blocks.map((b, j) => <BlockRenderer key={j} block={b} lectureId={lecture.id} />)}</div>
              </section>
            ))}

            <section id="recap" className="scroll-mt-24">
              <div className="card p-6" style={{ borderTop: `4px solid ${lecture.color}` }}>
                <div className="label">Lecture recap</div>
                <h2 className="mb-3 font-serif text-2xl font-semibold">The {lecture.recap.length} things to remember</h2>
                <ol className="prose-econ list-decimal space-y-2 pl-5 marker:font-semibold marker:text-ink-400">{lecture.recap.map((r, i) => <li key={i}><Rich text={r} /></li>)}</ol>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button className={lp?.completed ? 'btn-secondary' : 'btn-primary'} onClick={() => update((d) => setLectureCompleted(d, lecture.id, !lp?.completed, lecture.sections.map((x) => x.id)))}>
                    {lp?.completed ? '✓ Lecture completed (undo)' : 'Mark lecture as completed'}
                  </button>
                  {related.length > 0 && <Link className="btn-secondary" to={`/practice/session?mode=learning&lecture=${lecture.id}`}>Practise {related.length} questions</Link>}
                  {sets.map((ps) => <Link key={ps.id} className="btn-secondary" to={`/practice/problems/${ps.id}`}>{ps.title}</Link>)}
                </div>
              </div>
            </section>

            <nav className="flex justify-between gap-4 border-t border-ink-200/70 pt-6 dark:border-ink-800">
              {prev ? <Link to={`/learn/${prev.id}`} className="btn-ghost">← Ch. {prev.number}: {prev.title}</Link> : <span />}
              {next ? <Link to={`/learn/${next.id}`} className="btn-ghost">Ch. {next.number}: {next.title} →</Link> : <span />}
            </nav>
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="card p-4">
              <div className="mb-2 flex justify-between text-xs text-ink-500"><span>Progress</span><span>{done.size}/{lecture.sections.length}</span></div>
              <ProgressBar value={done.size / lecture.sections.length} color={lecture.color} />
              <nav className="mt-4 space-y-0.5" aria-label="Sections">
                {lecture.sections.map((s) => (
                  <a key={s.id} href={`#/learn/${lecture.id}#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${active === s.id ? 'bg-ink-100 font-medium text-ink-900 dark:bg-ink-800 dark:text-white' : 'text-ink-500 hover:text-ink-900 dark:hover:text-white'}`}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${done.has(s.id) ? 'bg-emerald-500' : 'bg-ink-300 dark:bg-ink-600'}`} />
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
                <a href="#recap" onClick={(e) => { e.preventDefault(); document.getElementById('recap')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white"><span className="h-1.5 w-1.5 rounded-full bg-ink-300" />Recap</a>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
