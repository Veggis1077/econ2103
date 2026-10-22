import { describe, expect, it } from 'vitest';
import { QUESTIONS, getAnswer } from './index';
import { SOURCE_QUESTIONS } from './sourceQuestions';

describe('question bank integrity', () => {
  it('contains all 39 source questions with unique ids', () => {
    expect(SOURCE_QUESTIONS).toHaveLength(39);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
  });
  it('every question has an answer key entry that points at a real option', () => {
    for (const q of QUESTIONS) {
      const k = getAnswer(q.id);
      expect(k, q.id).toBeDefined();
      if (q.kind === 'mcq') {
        expect(q.options?.length, q.id).toBeGreaterThanOrEqual(2);
        expect(k!.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(k!.answer, q.id).toBeLessThan(q.options!.length);
      }
      expect(k!.explanation.length, q.id).toBeGreaterThan(20);
    }
  });
  it('question objects never carry answers', () => {
    for (const q of QUESTIONS) expect(Object.keys(q)).not.toContain('answer');
  });
});

import { calculateElasticity, calculateEquilibrium, calculatePriceControl, calculateTaxIncidence, revenueMaximizingTax, longRunEquilibrium } from '../../economics';

describe('authored numeric answers agree with the economics models', () => {
  const D = { a: 300, b: 1 };
  const S = { c: 0, d: 0.5 };
  const ans = (id: string) => getAnswer(id)!.answer;
  it('ax15 ice-cream equilibrium', () => expect(calculateEquilibrium({ a: 19 / 6, b: 1 / 6 }, { c: 5 / 6, d: 1 / 6 }).price).toBeCloseTo(ans('ax15')));
  it('ax17 midpoint elasticity', () => expect(calculateElasticity(100, 70, 4, 5).elasticity).toBeCloseTo(ans('ax17'), 2));
  it('ax22 shortage', () => expect(calculatePriceControl(D, S, 'ceiling', 80).shortage).toBeCloseTo(ans('ax22')));
  it('ax25 buyer price', () => expect(calculateTaxIncidence(D, S, 30).buyerPrice).toBeCloseTo(ans('ax25')));
  it('ax31 DWL', () => expect(calculateTaxIncidence(D, S, 60).deadweightLoss).toBeCloseTo(ans('ax31')));
  it('ax32 revenue-maximising tax', () => expect(revenueMaximizingTax(D, S)).toBeCloseTo(ans('ax32')));
  it('ax42 long-run firms', () => expect(longRunEquilibrium({ fixed: 50, a: 0, k: 1 }, 120, 1).firms).toBeCloseTo(ans('ax42')));
});
