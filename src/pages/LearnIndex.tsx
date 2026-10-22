import { Link } from 'react-router-dom';
import { LECTURES, UPCOMING } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { PageHeader, ProgressBar } from '../components/ui';
import { Rich } from '../components/ui/Rich';

export default function LearnIndex() {
  const { data } = useActiveProfile();
  return (
    <div>
      <PageHeader eyebrow="Learn" title="Lecture modules" subtitle="Every module follows the same path: intuition → definitions → maths → interactive graphs → worked examples → common mistakes → checks → practice → recap. Mark sections as done to track your progress." />
      <div className="space-y-4">
        {LECTURES.map((l) => {
          const lp = data.lectures[l.id];
          const share = lp ? Math.min(1, lp.sectionsDone.length / l.sections.length) : 0;
          return (
            <Link key={l.id} to={`/learn/${l.id}`} className="card group flex flex-col gap-4 p-5 transition hover:shadow-md sm:flex-row sm:items-center">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-serif text-2xl font-bold text-white" style={{ background: l.color }}>{l.number}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink-900 group-hover:text-[var(--accent)] dark:text-white">{l.title}</h2>
                  {lp?.completed && <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">✓ Completed</span>}
                </div>
                <p className="text-sm text-ink-500">{l.subtitle}</p>
                <ul className="mt-2 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500 md:flex">
                  {l.objectives.slice(0, 3).map((o, i) => <li key={i} className="before:mr-1 before:content-['→']"><Rich text={o} /></li>)}
                </ul>
              </div>
              <div className="w-full sm:w-44">
                <div className="mb-1 flex justify-between text-xs text-ink-500"><span>{lp?.sectionsDone.length ?? 0}/{l.sections.length} sections</span><span>{l.estMinutes} min</span></div>
                <ProgressBar value={share} color={l.color} />
              </div>
            </Link>
          );
        })}
        {UPCOMING.map((u) => (
          <div key={u.id} className="flex items-center gap-4 rounded-2xl border border-dashed border-ink-300 p-5 dark:border-ink-700">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink-100 font-serif text-2xl font-bold text-ink-400 dark:bg-ink-800">{u.number}</span>
            <div><div className="font-semibold text-ink-600 dark:text-ink-300">{u.title}</div><div className="text-sm text-ink-500">{u.note}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
