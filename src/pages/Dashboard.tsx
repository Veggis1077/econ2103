import { Link } from 'react-router-dom';
import { useActiveProfile } from '../profiles/ProfileContext';
import { LECTURES, UPCOMING, shortLectureLabel } from '../content/lectures';
import { QUESTIONS, topicLabel } from '../content/questionBank';
import { LAB_MODELS } from '../lab/registry';
import { lectureCompletion, overallAccuracy, suggestedLecture, topicMastery, weakTopics } from '../stats/analytics';
import { Card, ProgressBar, ProgressRing, SectionTitle, Stat, pct } from '../components/ui';
import { Avatar } from '../components/ui/Avatar';

export default function Dashboard() {
  const { profile, data } = useActiveProfile();
  const comp = lectureCompletion(LECTURES, data);
  const acc = overallAccuracy(data, (id) => !id.startsWith('cc:'));
  const next = suggestedLecture(LECTURES, data);
  const mastery = topicMastery(QUESTIONS, data);
  const weak = weakTopics(mastery);
  const mistakes = Object.values(data.questions).filter((s) => s.inMistakes).length;
  const lastExam = data.exams[data.exams.length - 1];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10">
      <section className="card relative overflow-hidden p-6 sm:p-8 animate-fade-up">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-2xl" style={{ background: profile.color }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar profile={profile} size={72} />
          <div className="flex-1">
            <div className="label">{greet}</div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">{profile.name}, ready to think at the margin?</h1>
            <p className="mt-1 text-ink-600 dark:text-ink-300">{comp.done} of {comp.total} lectures completed · {acc.attempted} of {QUESTIONS.length} practice questions tried{mistakes ? ` · ${mistakes} in your mistakes list` : ''}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><ProgressRing value={comp.share} size={76} stroke={7} /><div className="mt-1 text-xs text-ink-500">Course</div></div>
            <div className="text-center"><ProgressRing value={acc.accuracy} size={76} stroke={7} /><div className="mt-1 text-xs text-ink-500">Accuracy</div></div>
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3">
          {next && <Link to={`/learn/${next.id}`} className="btn-primary">{data.lectures[next.id] ? 'Continue' : 'Start'} Ch. {next.number}: {next.title} →</Link>}
          <Link to="/practice/session?mode=adaptive" className="btn-secondary">Adaptive practice</Link>
          {mistakes > 0 && <Link to="/practice/session?mode=mistakes" className="btn-secondary">Review {mistakes} mistake{mistakes > 1 ? 's' : ''}</Link>}
          <Link to="/exam" className="btn-secondary">Exam simulator</Link>
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Course overview" title="Lectures" action={<Link to="/learn" className="link text-sm">All lectures →</Link>}>
          Each lecture combines explanations, interactive graphs, worked examples and checks. Lectures follow the slide numbering (Mankiw chapters).
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LECTURES.map((l) => {
            const lp = data.lectures[l.id];
            const share = lp ? Math.min(1, lp.sectionsDone.length / l.sections.length) : 0;
            return (
              <Link key={l.id} to={`/learn/${l.id}`} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl font-serif text-lg font-bold text-white" style={{ background: l.color }}>{l.number}</span>
                  {lp?.completed ? <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">✓ Completed</span> : lp ? <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">In progress</span> : <span className="text-xs text-ink-400">{l.estMinutes} min</span>}
                </div>
                <div className="mt-4 font-semibold text-ink-900 group-hover:text-[var(--accent)] dark:text-white">{l.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-ink-500">{l.keywords.join(' · ')}</div>
                <ProgressBar value={share} className="mt-auto pt-0" color={l.color} />
              </Link>
            );
          })}
          {UPCOMING.map((u) => (
            <div key={u.id} className="flex flex-col rounded-2xl border border-dashed border-ink-300 p-5 dark:border-ink-700">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 font-serif text-lg font-bold text-ink-400 dark:bg-ink-800">{u.number}</span>
              <div className="mt-4 font-semibold text-ink-500">{u.title}</div>
              <div className="mt-1 text-sm text-ink-500">{u.note}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle eyebrow="Topic mastery" title="Where you stand" action={<Link to="/progress" className="link text-sm">Details →</Link>} />
          {acc.attempted === 0 ? (
            <p className="text-sm text-ink-500">Answer a few practice questions and your topic mastery will appear here.</p>
          ) : (
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {mastery.filter((m) => m.attempted > 0).sort((a, b) => a.accuracy - b.accuracy).slice(0, 10).map((m) => (
                <div key={m.topic}>
                  <div className="mb-1 flex justify-between text-sm"><span>{topicLabel(m.topic)}</span><span className="font-mono text-xs text-ink-500">{m.attempted}/{m.total} · {pct(m.accuracy, 0)}</span></div>
                  <ProgressBar value={m.accuracy} color={m.accuracy >= 0.75 ? '#10b981' : m.accuracy >= 0.5 ? '#f59e0b' : '#f43f5e'} />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <SectionTitle eyebrow="Focus" title="Weak areas" />
          {weak.length ? (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.topic} className="flex items-center justify-between gap-2 rounded-xl bg-rose-50/60 px-3 py-2 dark:bg-rose-950/20">
                  <span className="text-sm font-medium">{topicLabel(w.topic)}</span>
                  <Link to={`/practice/session?mode=learning&topic=${w.topic}`} className="link text-xs">Practise →</Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-ink-500">No weak areas detected yet. Keep practising — this list updates with every answer.</p>}
          {lastExam && (
            <div className="mt-5 border-t border-ink-100 pt-4 dark:border-ink-800">
              <Stat label="Last exam" value={`${lastExam.score}/${lastExam.total}`} hint={new Date(lastExam.at).toLocaleDateString()} tone={lastExam.score / lastExam.total >= 0.7 ? 'good' : 'bad'} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle eyebrow="Economics Lab" title="Quick access to interactive models" action={<Link to="/lab" className="link text-sm">Open the Lab →</Link>} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LAB_MODELS.slice(0, 9).map((m) => (
              <Link key={m.id} to={`/lab/${m.id}`} className="flex items-center gap-3 rounded-xl border border-ink-200/70 p-3 transition hover:border-[var(--accent)] dark:border-ink-800">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800">{m.icon}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-medium">{m.title}</span><span className="block text-xs text-ink-500">{m.lectures.map(shortLectureLabel).join(', ')}</span></span>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle eyebrow="History" title="Recently studied" />
          {data.recent.length ? (
            <ul className="space-y-1">
              {data.recent.slice(0, 7).map((r) => (
                <li key={r.path}><Link to={r.path} className="flex justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-ink-50 dark:hover:bg-ink-800"><span className="truncate">{r.title}</span><span className="shrink-0 text-xs text-ink-400">{timeAgo(r.at)}</span></Link></li>
              ))}
            </ul>
          ) : <p className="text-sm text-ink-500">Nothing yet — open a lecture or a model to get started.</p>}
        </Card>
      </div>
    </div>
  );
}

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
