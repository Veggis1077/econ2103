import { describe, expect, it } from 'vitest';
import { adaptiveSelection, topicMastery, weakTopics } from './analytics';
import { emptyProfileData, recordAnswer } from '../storage/progress';
import type { BankQuestion } from '../types/content';

const mk = (id: string, topics: string[]): BankQuestion => ({ id, source: 't', kind: 'mcq', stem: id, options: ['a', 'b'], lectures: ['ch01'], topics, difficulty: 1 });
const qs = [mk('a', ['tax']), mk('b', ['tax']), mk('c', ['ppf']), mk('d', ['ppf'])];

describe('analytics', () => {
  it('computes mastery and weak topics', () => {
    let d = emptyProfileData('x');
    d = recordAnswer(d, 'a', false, 'learning');
    d = recordAnswer(d, 'c', true, 'learning');
    const m = topicMastery(qs, d);
    expect(m.find((t) => t.topic === 'tax')!.accuracy).toBe(0);
    expect(weakTopics(m).map((t) => t.topic)).toEqual(['tax']);
  });
  it('adaptive selection returns unique questions and favours mistakes', () => {
    let d = emptyProfileData('x');
    d = recordAnswer(d, 'a', false, 'learning');
    d = recordAnswer(d, 'c', true, 'learning');
    d = recordAnswer(d, 'd', true, 'learning');
    let firstIsA = 0;
    for (let i = 0; i < 200; i++) {
      const s = adaptiveSelection(qs, d, 3);
      expect(new Set(s.map((q) => q.id)).size).toBe(3);
      if (s[0].id === 'a') firstIsA++;
    }
    expect(firstIsA).toBeGreaterThan(60);
  });
});
