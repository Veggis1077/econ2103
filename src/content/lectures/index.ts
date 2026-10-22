import type { Lecture, UpcomingLecture } from '../../types/content';

/**
 * Lecture registry. Every file named `chNN.ts` in this folder that default-exports
 * a `Lecture` is registered automatically and appears in navigation, search,
 * the dashboard and progress tracking. See ADDING_LECTURES.md.
 */
const modules = import.meta.glob<{ default: Lecture }>('./ch*.ts', { eager: true });

export const LECTURES: Lecture[] = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => a.number - b.number);

const released = new Set(LECTURES.map((l) => l.number));

/** Announced lectures without slides yet. Remove an entry once its chNN.ts exists. */
const ANNOUNCED: UpcomingLecture[] = [
  {
    id: 'ch15',
    number: 15,
    title: 'Lecture 15 (slides not yet released)',
    note: 'The Chapter 15 problem set (competitive firms, shutdown, entry and exit) is already available under Practice → Problem sets, and the Competitive Firm and Monopoly models are in the Lab.',
    problemSets: ['ps-ch15'],
    models: ['competitive-firm'],
  },
];

export const UPCOMING: UpcomingLecture[] = ANNOUNCED.filter((u) => !released.has(u.number));

export const getLecture = (id: string | undefined) => LECTURES.find((l) => l.id === id);

export function lectureLabel(id: string): string {
  const l = getLecture(id);
  if (l) return `Ch. ${l.number} · ${l.title}`;
  const u = ANNOUNCED.find((x) => x.id === id);
  return u ? `Ch. ${u.number}` : id;
}

export function shortLectureLabel(id: string): string {
  const l = getLecture(id) ?? ANNOUNCED.find((x) => x.id === id);
  return l ? `Ch. ${l.number}` : id;
}
