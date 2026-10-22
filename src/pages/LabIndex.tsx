import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LAB_MODELS } from '../lab/registry';
import { LECTURES, shortLectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { PageHeader, Segmented } from '../components/ui';

export default function LabIndex() {
  const { data } = useActiveProfile();
  const [filter, setFilter] = useState<string>('all');
  const models = LAB_MODELS.filter((m) => filter === 'all' || m.lectures.includes(filter));
  return (
    <div>
      <PageHeader eyebrow="Interactive Economics Lab" title="Experiment with the models"
        subtitle="Every graph here is computed live from the underlying equations. Drag curves, points and price lines directly on the graph, or use the sliders. Hover over any graph to read off values." />
      <div className="mb-6">
        <Segmented size="sm" value={filter} onChange={setFilter}
          options={[{ value: 'all', label: 'All models' }, ...LECTURES.filter((l) => LAB_MODELS.some((m) => m.lectures.includes(l.id))).map((l) => ({ value: l.id, label: `Ch. ${l.number}` })), { value: 'ch15', label: 'Ch. 15' }, { value: 'beyond', label: 'Beyond' }]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => (
          <Link key={m.id} to={`/lab/${m.id}`} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-tint)] text-xl text-[var(--accent)] dark:bg-ink-800">{m.icon}</span>
              <div className="flex gap-1">
                {m.enrichment && <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Ahead of slides</span>}
                {data.lab[m.id] && <span className="chip bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">visited {data.lab[m.id].visits}×</span>}
              </div>
            </div>
            <h2 className="mt-4 font-semibold text-ink-900 group-hover:text-[var(--accent)] dark:text-white">{m.title}</h2>
            <p className="mt-1 flex-1 text-sm text-ink-500">{m.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {m.lectures.map((l) => <span key={l} className="chip bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{l === 'beyond' ? 'Beyond slides' : shortLectureLabel(l)}</span>)}
              {m.tags.slice(0, 3).map((t) => <span key={t} className="chip bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
