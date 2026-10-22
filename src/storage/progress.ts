import { keys, store } from './store';

export type PracticeMode = 'learning' | 'exam' | 'mistakes' | 'adaptive' | 'challenge' | 'concept-check';

export interface QuestionStat {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  lastAt: string;
  /** Answered wrong at least once and not yet answered right since. */
  inMistakes: boolean;
}

export interface LectureProgress {
  firstVisited: string;
  lastVisited: string;
  /** Section ids the student marked as done. */
  sectionsDone: string[];
  completed: boolean;
}

export interface FlashcardState {
  /** Leitner box 1 (new/hard) … 5 (mastered). */
  box: number;
  due: string;
  reviews: number;
}

export interface ExamResult {
  id: string;
  at: string;
  durationSec: number;
  timeLimitSec: number;
  score: number;
  total: number;
  /** questionId → correct? */
  answers: Record<string, { chosen: number | null; correct: boolean }>;
  topics: string[];
}

export interface ProfileData {
  version: 1;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  lectures: Record<string, LectureProgress>;
  questions: Record<string, QuestionStat>;
  /** Raw attempt log (capped) for statistics over time. */
  attempts: { q: string; ok: boolean; at: string; mode: PracticeMode }[];
  flashcards: Record<string, FlashcardState>;
  exams: ExamResult[];
  bookmarks: string[];
  recent: { path: string; title: string; at: string }[];
  lab: Record<string, { visits: number; lastAt: string }>;
  challenges: Record<string, { completedAt: string; tries: number }>;
}

export function emptyProfileData(profileId: string): ProfileData {
  const now = new Date().toISOString();
  return {
    version: 1, profileId, createdAt: now, updatedAt: now,
    lectures: {}, questions: {}, attempts: [], flashcards: {}, exams: [], bookmarks: [], recent: [], lab: {}, challenges: {},
  };
}

export function loadProfileData(profileId: string): ProfileData {
  const raw = store.get(keys.profileData(profileId));
  if (!raw) return emptyProfileData(profileId);
  try {
    return migrate(JSON.parse(raw), profileId);
  } catch {
    return emptyProfileData(profileId);
  }
}

export function saveProfileData(data: ProfileData): void {
  store.set(keys.profileData(data.profileId), JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
}

export function resetProfileData(profileId: string): ProfileData {
  const fresh = emptyProfileData(profileId);
  saveProfileData(fresh);
  return fresh;
}

/** Fill in fields missing from older/partial saves so the UI can rely on the shape. */
function migrate(raw: unknown, profileId: string): ProfileData {
  const base = emptyProfileData(profileId);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<ProfileData>;
  return { ...base, ...r, version: 1, profileId };
}

// ---------------------------------------------------------------------------
// Export / import (backup between devices — there is no server)
// ---------------------------------------------------------------------------

export interface ExportFile {
  app: 'econ2103-platform';
  exportedAt: string;
  data: ProfileData;
}

export function exportProfile(data: ProfileData): string {
  const file: ExportFile = { app: 'econ2103-platform', exportedAt: new Date().toISOString(), data };
  return JSON.stringify(file, null, 2);
}

export type ImportResult = { ok: true; data: ProfileData; fromProfile: string } | { ok: false; error: string };

/** Parse a backup. The data is re-keyed to `targetProfileId` so a backup can be restored into any profile. */
export function parseImport(json: string, targetProfileId: string): ImportResult {
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { return { ok: false, error: 'The file is not valid JSON.' }; }
  const f = parsed as Partial<ExportFile>;
  if (!f || f.app !== 'econ2103-platform' || !f.data || typeof f.data !== 'object') {
    return { ok: false, error: 'This does not look like an ECON2103 progress backup.' };
  }
  const d = f.data as Partial<ProfileData>;
  if (d.version !== 1) return { ok: false, error: `Unsupported backup version: ${String(d.version)}` };
  return { ok: true, data: migrate(d, targetProfileId), fromProfile: String(d.profileId ?? 'unknown') };
}

// ---------------------------------------------------------------------------
// Pure update helpers (immutable) used by the profile context
// ---------------------------------------------------------------------------

const ATTEMPT_LOG_CAP = 2000;

export function recordAnswer(d: ProfileData, questionId: string, correct: boolean, mode: PracticeMode): ProfileData {
  const now = new Date().toISOString();
  const prev = d.questions[questionId];
  const stat: QuestionStat = {
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastCorrect: correct,
    lastAt: now,
    inMistakes: correct ? false : true,
  };
  const attempts = [...d.attempts, { q: questionId, ok: correct, at: now, mode }].slice(-ATTEMPT_LOG_CAP);
  return { ...d, questions: { ...d.questions, [questionId]: stat }, attempts };
}

export function visitLecture(d: ProfileData, lectureId: string): ProfileData {
  const now = new Date().toISOString();
  const prev = d.lectures[lectureId];
  return { ...d, lectures: { ...d.lectures, [lectureId]: { firstVisited: prev?.firstVisited ?? now, lastVisited: now, sectionsDone: prev?.sectionsDone ?? [], completed: prev?.completed ?? false } } };
}

export function toggleSection(d: ProfileData, lectureId: string, sectionId: string, totalSections: number): ProfileData {
  const v = visitLecture(d, lectureId).lectures[lectureId];
  const has = v.sectionsDone.includes(sectionId);
  const sectionsDone = has ? v.sectionsDone.filter((s) => s !== sectionId) : [...v.sectionsDone, sectionId];
  return { ...d, lectures: { ...d.lectures, [lectureId]: { ...v, sectionsDone, completed: sectionsDone.length >= totalSections } } };
}

export function setLectureCompleted(d: ProfileData, lectureId: string, completed: boolean, allSectionIds: string[]): ProfileData {
  const v = visitLecture(d, lectureId).lectures[lectureId];
  return { ...d, lectures: { ...d.lectures, [lectureId]: { ...v, completed, sectionsDone: completed ? allSectionIds : v.sectionsDone } } };
}

export function addRecent(d: ProfileData, path: string, title: string): ProfileData {
  const recent = [{ path, title, at: new Date().toISOString() }, ...d.recent.filter((r) => r.path !== path)].slice(0, 12);
  return { ...d, recent };
}

export function toggleBookmark(d: ProfileData, id: string): ProfileData {
  return { ...d, bookmarks: d.bookmarks.includes(id) ? d.bookmarks.filter((b) => b !== id) : [...d.bookmarks, id] };
}

export function visitLab(d: ProfileData, modelId: string): ProfileData {
  const prev = d.lab[modelId];
  return { ...d, lab: { ...d.lab, [modelId]: { visits: (prev?.visits ?? 0) + 1, lastAt: new Date().toISOString() } } };
}

export function completeChallenge(d: ProfileData, id: string): ProfileData {
  const prev = d.challenges[id];
  return { ...d, challenges: { ...d.challenges, [id]: { completedAt: prev?.completedAt ?? new Date().toISOString(), tries: (prev?.tries ?? 0) + 1 } } };
}

export function addExam(d: ProfileData, r: ExamResult): ProfileData {
  return { ...d, exams: [...d.exams, r].slice(-100) };
}

const LEITNER_DAYS = [0, 0, 1, 3, 7, 16];

/** Leitner spaced repetition: correct → next box, wrong → back to box 1. */
export function reviewFlashcard(d: ProfileData, cardId: string, knewIt: boolean): ProfileData {
  const prev = d.flashcards[cardId];
  const box = knewIt ? Math.min(5, (prev?.box ?? 1) + 1) : 1;
  const due = new Date(Date.now() + LEITNER_DAYS[box] * 86400000).toISOString();
  return { ...d, flashcards: { ...d.flashcards, [cardId]: { box, due, reviews: (prev?.reviews ?? 0) + 1 } } };
}
