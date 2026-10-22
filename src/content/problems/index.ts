import type { ProblemSet } from '../../types/content';

const modules = import.meta.glob<{ default: ProblemSet }>('./ps-*.ts', { eager: true });

/** Problem sets from ../ProblemSets, with worked solutions. Auto-registered like lectures. */
export const PROBLEM_SETS: ProblemSet[] = Object.values(modules).map((m) => m.default).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export const getProblemSet = (id: string | undefined) => PROBLEM_SETS.find((p) => p.id === id);
export const problemSetsForLecture = (lectureId: string) => PROBLEM_SETS.filter((p) => p.lectures.includes(lectureId));
