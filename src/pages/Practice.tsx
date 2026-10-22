import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DIFFICULTY_LABEL, QUESTIONS, topicLabel } from '../content/questionBank';
import { LECTURES, shortLectureLabel } from '../content/lectures';
import { PROBLEM_SETS } from '../content/problems';
import { CHALLENGES } from '../content/challenges';
import { useActiveProfile } from '../profiles/ProfileContext';
import { Card, PageHeader, SectionTitle } from '../components/ui';
import { plain } from '../components/ui/Rich';

export default function Practice() {
  const { data } = useActiveProfile();
  const nav = useNavigate();
  const [lecture, setLecture] = useState('all');
  const [topic, setTopic] = useState('all');
  const [diff, setDiff] = useState('all');
  const [status, setStatus] = useState('all');
  const mistakes = Object.entries(data.questions).filter(([id, s]) => s.inMistakes && !id.startsWith('cc:')).length;
  const topics = useMemo(() => [...new Set(QUESTIONS.flatMap((q) => q.topics))].sort((a, b) => topicLabel(a).localeCompare(topicLabel(b))), []);
  const list = QUESTIONS.filter((q) => (lecture === 'all' || q.lectures.includes(lecture)) && (topic === 'all' || q.topics.includes(topic)) && (diff === 'all' || String(q.difficulty) === diff)
    && (status === 'all' || (status === 'new' && !data.questions[q.id]) || (status === 'wrong' && data.questions[q.id]?.inMistakes) || (status === 'right' && data.questions[q.id]?.lastCorrect)));
  const params = new URLSearchParams({ mode: 'learning', ids: list.map((q) => q.id).join(',') });

  const modes = [
    { title: 'Learning mode', desc: 'Detailed explanation right after each answer.', to: '/practice/session?mode=learning', icon: '📘', tone: 'from-blue-500/10' },
    { title: 'Mistakes mode', desc: mistakes ? `Re-try the ${mistakes} question${mistakes > 1 ? 's' : ''} you got wrong.` : 'Questions you get wrong will collect here.', to: '/practice/session?mode=mistakes', icon: '🔁', tone: 'from-rose-500/10', disabled: !mistakes },
    { title: 'Adaptive practice', desc: 'Questions picked from your weakest topics and unseen material.', to: '/practice/session?mode=adaptive', icon: '🧭', tone: 'from-emerald-500/10' },
    { title: 'Graph challenges', desc: `Manipulate a graph to hit a target — ${CHALLENGES.length} challenges.`, to: '/practice/challenges', icon: '🎯', tone: 'from-amber-500/10' },
    { title: 'Exam mode', desc: 'Timed, no feedback until you submit.', to: '/exam', icon: '⏱', tone: 'from-violet-500/10' },
  ];

  const sel = 'h-9 rounded-lg border border-ink-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-900';
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Practice" title="Practise like it's the exam" subtitle={`${QUESTIONS.length} questions — including all 39 source practice questions with reconstructed graphs — plus ${PROBLEM_SETS.reduce((s, p) => s + p.problems.length, 0)} problem-set problems with worked solutions.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {modes.map((m) => (
          <Link key={m.title} to={m.disabled ? '#' : m.to} aria-disabled={m.disabled} className={`card bg-gradient-to-br ${m.tone} to-transparent p-5 transition ${m.disabled ? 'pointer-events-none opacity-60' : 'hover:-translate-y-0.5 hover:shadow-md'}`}>
            <div className="text-2xl" aria-hidden>{m.icon}</div>
            <div className="mt-3 font-semibold">{m.title}</div>
            <div className="mt-1 text-sm text-ink-500">{m.desc}</div>
          </Link>
        ))}
      </div>

      <section>
        <SectionTitle eyebrow="Question bank" title="Browse and filter" action={list.length > 0 && <button className="btn-primary" onClick={() => nav(`/practice/session?${params}`)}>Practise these {list.length} →</button>} />
        <div className="mb-4 flex flex-wrap gap-2">
          <select className={sel} value={lecture} onChange={(e) => setLecture(e.target.value)} aria-label="Lecture">
            <option value="all">All lectures</option>
            {LECTURES.map((l) => <option key={l.id} value={l.id}>Ch. {l.number} · {l.title}</option>)}
            <option value="ch15">Ch. 15 (problem set)</option>
            <option value="beyond">Beyond slides (monopoly)</option>
          </select>
          <select className={sel} value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
            <option value="all">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{topicLabel(t)}</option>)}
          </select>
          <select className={sel} value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Difficulty">
            <option value="all">Any difficulty</option>
            {[1, 2, 3].map((d) => <option key={d} value={d}>{DIFFICULTY_LABEL[d as 1 | 2 | 3]}</option>)}
          </select>
          <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="all">Any status</option><option value="new">Not tried</option><option value="wrong">In mistakes</option><option value="right">Last answer correct</option>
          </select>
        </div>
        <Card className="divide-y divide-ink-100 dark:divide-ink-800">
          {list.map((q) => {
            const st = data.questions[q.id];
            return (
              <Link key={q.id} to={`/practice/q/${q.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-ink-50 dark:hover:bg-ink-800/50">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${!st ? 'bg-ink-200 dark:bg-ink-700' : st.lastCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="w-24 shrink-0 font-mono text-xs text-ink-500">{q.source.replace('ECON2103 practice questions · ', 'Source ').replace('Platform exercise · ', '')}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{plain(q.stem || q.question || '')}</span>
                <span className="hidden shrink-0 gap-1 sm:flex">{q.lectures.map((l) => <span key={l} className="chip bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{l === 'beyond' ? 'Beyond' : shortLectureLabel(l)}</span>)}</span>
                {q.figures && <span className="hidden text-xs text-ink-400 sm:inline" title="Has a graph">📈</span>}
              </Link>
            );
          })}
          {!list.length && <div className="p-6 text-center text-sm text-ink-500">No questions match these filters.</div>}
        </Card>
      </section>

      <section>
        <SectionTitle eyebrow="Problem sets" title="Course problem sets with worked solutions">Open-ended problems from the course folders. Try each part first, then reveal the solution; numeric parts can be self-checked.</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_SETS.map((ps) => (
            <Link key={ps.id} to={`/practice/problems/${ps.id}`} className="card p-4 transition hover:shadow-md">
              <div className="font-semibold">{ps.title}</div>
              <div className="mt-1 text-sm text-ink-500">{ps.problems.length} problems · {ps.lectures.map(shortLectureLabel).join(', ')}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
