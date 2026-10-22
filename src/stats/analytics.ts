import type { BankQuestion, Lecture } from '../types/content';
import type { ProfileData } from '../storage/progress';

export interface TopicMastery {
  topic: string;
  attempted: number;
  total: number;
  /** Share of attempted questions whose latest attempt was correct (0–1). */
  accuracy: number;
  /** Combines accuracy and coverage: accuracy × attempted/total, smoothed. */
  mastery: number;
}

export function topicMastery(questions: BankQuestion[], d: ProfileData): TopicMastery[] {
  const byTopic = new Map<string, BankQuestion[]>();
  for (const q of questions) for (const t of q.topics) byTopic.set(t, [...(byTopic.get(t) ?? []), q]);
  return [...byTopic.entries()].map(([topic, qs]) => {
    const tried = qs.filter((q) => d.questions[q.id]);
    const right = tried.filter((q) => d.questions[q.id].lastCorrect).length;
    const accuracy = tried.length ? right / tried.length : 0;
    // Bayesian-style smoothing so 1/1 is not "100% mastered".
    const mastery = (right + 0.5) / (qs.length + 1);
    return { topic, attempted: tried.length, total: qs.length, accuracy, mastery };
  });
}

/** Topics with attempts and low accuracy, worst first. */
export function weakTopics(m: TopicMastery[], limit = 4): TopicMastery[] {
  return m.filter((t) => t.attempted > 0 && t.accuracy < 0.75).sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted).slice(0, limit);
}

export function lectureCompletion(lectures: Lecture[], d: ProfileData) {
  const done = lectures.filter((l) => d.lectures[l.id]?.completed).length;
  const sectionShare = lectures.length
    ? lectures.reduce((s, l) => s + Math.min(1, (d.lectures[l.id]?.sectionsDone.length ?? 0) / Math.max(1, l.sections.length)), 0) / lectures.length
    : 0;
  return { done, total: lectures.length, share: sectionShare };
}

/** First lecture (in course order) not yet completed; prefers one already started. */
export function suggestedLecture(lectures: Lecture[], d: ProfileData): Lecture | undefined {
  const started = lectures.find((l) => d.lectures[l.id] && !d.lectures[l.id].completed);
  return started ?? lectures.find((l) => !d.lectures[l.id]?.completed);
}

/**
 * Adaptive practice: weight each question by weakness of its topics, recency of
 * mistakes and whether it is unseen, then sample without replacement.
 */
export function adaptiveSelection(questions: BankQuestion[], d: ProfileData, n: number, rand = Math.random): BankQuestion[] {
  const mastery = new Map(topicMastery(questions, d).map((t) => [t.topic, t]));
  const weights = questions.map((q) => {
    const st = d.questions[q.id];
    const topicWeak = Math.max(...q.topics.map((t) => 1 - (mastery.get(t)?.mastery ?? 0.5)));
    let w = 0.4 + topicWeak * 1.6;
    if (!st) w += 0.8;
    else if (st.inMistakes) w += 2;
    else if (st.lastCorrect) w *= 0.35;
    return Math.max(0.05, w);
  });
  const pool = questions.map((q, i) => ({ q, w: weights[i] }));
  const out: BankQuestion[] = [];
  while (out.length < n && pool.length) {
    const total = pool.reduce((s, p) => s + p.w, 0);
    let r = rand() * total;
    let idx = 0;
    while (idx < pool.length - 1 && r > pool[idx].w) { r -= pool[idx].w; idx++; }
    out.push(pool[idx].q);
    pool.splice(idx, 1);
  }
  return out;
}

export function overallAccuracy(d: ProfileData, filter?: (qid: string) => boolean) {
  const entries = Object.entries(d.questions).filter(([id]) => !id.startsWith('cc:') && (!filter || filter(id)));
  const right = entries.filter(([, s]) => s.lastCorrect).length;
  return { attempted: entries.length, correct: right, accuracy: entries.length ? right / entries.length : 0 };
}

/** Attempts per day for the last `days` days (for the activity chart). */
export function activityByDay(d: ProfileData, days = 14) {
  const out: { day: string; attempts: number; correct: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    const list = d.attempts.filter((a) => a.at.slice(0, 10) === key);
    out.push({ day: key, attempts: list.length, correct: list.filter((a) => a.ok).length });
  }
  return out;
}
