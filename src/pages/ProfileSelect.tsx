import { useProfile } from '../profiles/ProfileContext';
import { PROFILES } from '../profiles/profiles';
import { Avatar } from '../components/ui/Avatar';
import { loadProfileData } from '../storage/progress';
import { LECTURES } from '../content/lectures';
import { store } from '../storage/store';

export default function ProfileSelect() {
  const { selectProfile } = useProfile();
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
      <BackgroundGraph />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="animate-fade-up text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#2552eb] font-serif text-2xl font-bold text-white shadow-lg">μ</div>
          <div className="label mb-2">HKUST · ECON2103 Microeconomics</div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl dark:text-white">Who is studying today?</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-600 dark:text-ink-300">Lectures, interactive models, practice questions and exam simulations — with progress tracked separately for each of you.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILES.map((p, i) => {
            const d = loadProfileData(p.id);
            const done = LECTURES.filter((l) => d.lectures[l.id]?.completed).length;
            const answered = Object.keys(d.questions).length;
            return (
              <button key={p.id} onClick={() => selectProfile(p.id)} style={{ animationDelay: `${i * 70}ms` }}
                className="card group animate-fade-up p-6 text-left transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2"
                aria-label={`Continue as ${p.name}`}>
                <div className="flex items-center justify-between">
                  <Avatar profile={p} size={64} />
                  <span className="text-ink-300 transition group-hover:translate-x-1 group-hover:text-ink-600 dark:group-hover:text-ink-200">→</span>
                </div>
                <div className="mt-5 text-lg font-semibold text-ink-900 dark:text-white">{p.name}</div>
                <div className="text-sm" style={{ color: p.color }}>{p.tagline}</div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <div className="h-full rounded-full" style={{ width: `${LECTURES.length ? (done / LECTURES.length) * 100 : 0}%`, background: p.color }} />
                </div>
                <div className="mt-2 text-xs text-ink-500">{done}/{LECTURES.length} lectures · {answered} questions tried</div>
              </button>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-5 text-ink-500">
          These are <strong>local study profiles, not accounts</strong> — there is no password and no server. Progress is stored in this browser on this device{store.persistent === false ? ' (storage is currently blocked, so progress will be lost when the tab closes)' : ''} and does not sync between devices. Use <em>My Progress → Export</em> to back up or move your progress.
        </p>
      </div>
    </div>
  );
}

function BackgroundGraph() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] dark:opacity-[0.1]" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path d="M80 60 L920 560" stroke="#2552eb" strokeWidth="5" />
      <path d="M80 560 L920 60" stroke="#ea580c" strokeWidth="5" />
      <path d="M80 60 L500 310 L80 310Z" fill="#2552eb" />
      <path d="M80 560 L500 310 L80 310Z" fill="#16a34a" />
    </svg>
  );
}
