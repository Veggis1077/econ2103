import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveProfile } from '../profiles/ProfileContext';
import { LECTURES } from '../content/lectures';
import { QUESTIONS, topicLabel } from '../content/questionBank';
import { CONCEPTS } from '../content/library';
import { CHALLENGES } from '../content/challenges';
import { activityByDay, lectureCompletion, overallAccuracy, topicMastery } from '../stats/analytics';
import { exportProfile, parseImport, resetProfileData } from '../storage/progress';
import { Card, PageHeader, ProgressBar, SectionTitle, Stat, pct } from '../components/ui';

export default function ProgressPage() {
  const { profile, data, replaceData } = useActiveProfile();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const comp = lectureCompletion(LECTURES, data);
  const acc = overallAccuracy(data);
  const mastery = topicMastery(QUESTIONS, data).sort((a, b) => b.total - a.total);
  const activity = activityByDay(data, 14);
  const maxAct = Math.max(1, ...activity.map((a) => a.attempts));
  const cards = Object.values(data.flashcards);

  const doExport = () => {
    const blob = new Blob([exportProfile(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `econ2103-progress-${profile.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ ok: true, text: 'Backup downloaded.' });
  };
  const doImport = async (f: File) => {
    const r = parseImport(await f.text(), profile.id);
    if (!r.ok) return setMsg({ ok: false, text: r.error });
    if (!window.confirm(`Replace ${profile.name}'s current progress with the backup${r.fromProfile !== profile.id ? ` from profile "${r.fromProfile}"` : ''}?`)) return;
    replaceData(r.data);
    setMsg({ ok: true, text: 'Progress restored from backup.' });
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={`${profile.name}'s statistics`} title="My progress" subtitle="Everything here is computed from your own answers on this device." />
      <Card className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Lectures done" value={`${comp.done}/${comp.total}`} hint={pct(comp.share, 0) + ' of sections'} />
        <Stat label="Questions tried" value={`${acc.attempted}/${QUESTIONS.length}`} />
        <Stat label="Accuracy (latest)" value={pct(acc.accuracy, 0)} tone={acc.accuracy >= 0.7 ? 'good' : acc.attempted ? 'bad' : undefined} />
        <Stat label="Total answers" value={data.attempts.length} />
        <Stat label="Exams taken" value={data.exams.length} hint={data.exams.length ? `best ${Math.max(...data.exams.map((e) => Math.round((e.score / e.total) * 100)))}%` : undefined} />
        <Stat label="Cards mastered" value={`${cards.filter((c) => c.box >= 5).length}/${CONCEPTS.length}`} hint={`${Object.keys(data.challenges).length}/${CHALLENGES.length} challenges`} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle eyebrow="Lectures" title="Completion" />
          <div className="space-y-3">
            {LECTURES.map((l) => {
              const lp = data.lectures[l.id];
              return (
                <div key={l.id}>
                  <div className="mb-1 flex justify-between text-sm"><Link to={`/learn/${l.id}`} className="hover:text-[var(--accent)]">Ch. {l.number} · {l.title}</Link><span className="text-xs text-ink-500">{lp?.completed ? '✓' : `${lp?.sectionsDone.length ?? 0}/${l.sections.length}`}</span></div>
                  <ProgressBar value={lp?.completed ? 1 : (lp?.sectionsDone.length ?? 0) / l.sections.length} color={l.color} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle eyebrow="Topics" title="Mastery by topic" />
          <div className="space-y-3">
            {mastery.map((m) => (
              <div key={m.topic}>
                <div className="mb-1 flex justify-between text-sm"><span>{topicLabel(m.topic)}</span><span className="font-mono text-xs text-ink-500">{m.attempted}/{m.total} tried{m.attempted ? ` · ${pct(m.accuracy, 0)}` : ''}</span></div>
                <ProgressBar value={m.mastery} color={!m.attempted ? '#b8b8c4' : m.accuracy >= 0.75 ? '#10b981' : m.accuracy >= 0.5 ? '#f59e0b' : '#f43f5e'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle eyebrow="Activity" title="Answers in the last 14 days" />
          <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of answers per day">
            {activity.map((a) => (
              <div key={a.day} className="flex flex-1 flex-col items-center gap-1" title={`${a.day}: ${a.correct}/${a.attempts} correct`}>
                <div className="flex w-full flex-col justify-end overflow-hidden rounded-t" style={{ height: `${(a.attempts / maxAct) * 100}%`, minHeight: a.attempts ? 4 : 0 }}>
                  <div className="bg-rose-400" style={{ flex: a.attempts - a.correct }} />
                  <div className="bg-emerald-500" style={{ flex: a.correct }} />
                </div>
                <span className="text-[10px] text-ink-400">{a.day.slice(8)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-ink-500"><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500" />correct</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-rose-400" />incorrect</span></div>
        </Card>
        <Card className="p-5">
          <SectionTitle eyebrow="Exam simulator" title="Exam history" />
          {data.exams.length ? (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-ink-500"><th className="pb-2">Date</th><th>Score</th><th>Time</th></tr></thead>
              <tbody>{[...data.exams].reverse().slice(0, 10).map((e) => <tr key={e.id} className="border-t border-ink-100 dark:border-ink-800"><td className="py-1.5">{new Date(e.at).toLocaleString()}</td><td className="font-mono">{e.score}/{e.total} ({Math.round((e.score / e.total) * 100)}%)</td><td className="font-mono">{Math.round(e.durationSec / 60)} min</td></tr>)}</tbody>
            </table>
          ) : <p className="text-sm text-ink-500">No exams yet. <Link to="/exam" className="link">Take one →</Link></p>}
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle eyebrow="Backup" title="Export, import & reset">Progress lives only in this browser on this device — it does not sync automatically. Export a JSON backup to move it to another computer or keep it safe, and import it there.</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={doExport}>⬇ Export {profile.name}'s progress</button>
          <button className="btn-secondary" onClick={() => file.current?.click()}>⬆ Import backup…</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ''; }} />
          <button className="btn-ghost text-rose-600" onClick={() => { if (window.confirm(`Delete ALL of ${profile.name}'s progress on this device? Export a backup first if unsure.`)) { replaceData(resetProfileData(profile.id)); setMsg({ ok: true, text: 'Progress reset.' }); } }}>Reset progress</button>
        </div>
        {msg && <p className={`mt-3 text-sm ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`} role="status">{msg.text}</p>}
      </Card>
    </div>
  );
}
