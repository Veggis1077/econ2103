import type { AnswerKeyEntry, BankQuestion } from '../../types/content';
import { ANSWER_KEY } from './answerKey';
import { AUTHORED_ANSWERS, AUTHORED_QUESTIONS } from './authored';
import { SOURCE_QUESTIONS } from './sourceQuestions';

/** All practice questions: the 39 source questions + platform-authored exercises. */
export const QUESTIONS: BankQuestion[] = [...SOURCE_QUESTIONS, ...AUTHORED_QUESTIONS];

const KEY: Record<string, AnswerKeyEntry> = { ...ANSWER_KEY, ...AUTHORED_ANSWERS };

export const getQuestion = (id: string) => QUESTIONS.find((q) => q.id === id);

/** Only call after the student has submitted — the UI never reads this before. */
export const getAnswer = (id: string): AnswerKeyEntry | undefined => KEY[id];

export function isCorrect(q: BankQuestion, response: number | null): boolean {
  const k = KEY[q.id];
  if (!k || response === null || Number.isNaN(response)) return false;
  if (q.kind === 'numeric') return Math.abs(response - k.answer) <= (k.tolerance ?? 1e-6) * Math.max(1, Math.abs(k.answer));
  return response === k.answer;
}

export const TOPIC_LABELS: Record<string, string> = {
  'opportunity-cost': 'Opportunity cost',
  'marginal-thinking': 'Marginal thinking',
  'sunk-cost': 'Sunk costs',
  ppf: 'Production possibilities',
  'comparative-advantage': 'Comparative advantage',
  'gains-from-trade': 'Gains from trade',
  'positive-normative': 'Positive vs normative',
  'supply-demand': 'Supply & demand',
  shifts: 'Shifts vs movements',
  'competitive-market': 'Competitive markets',
  elasticity: 'Elasticity',
  'total-revenue': 'Total revenue',
  'price-controls': 'Price controls',
  'tax-incidence': 'Tax incidence',
  'consumer-surplus': 'Consumer surplus',
  'producer-surplus': 'Producer surplus',
  'willingness-to-pay': 'Willingness to pay',
  efficiency: 'Market efficiency',
  'deadweight-loss': 'Deadweight loss',
  'tax-revenue': 'Tax revenue & Laffer',
  costs: 'Costs of production',
  'competitive-firm': 'Competitive firms',
  monopoly: 'Monopoly',
};

export const topicLabel = (t: string) => TOPIC_LABELS[t] ?? t;

export const DIFFICULTY_LABEL = { 1: 'Basic', 2: 'Intermediate', 3: 'Challenging' } as const;
