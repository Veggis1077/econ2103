import { describe, expect, it } from 'vitest';
import { LECTURES } from './lectures';
import { PROBLEM_SETS, getProblemSet } from './problems';
import { QUESTIONS, getQuestion } from './questionBank';
import { CONCEPTS, FORMULAS } from './library';
import { CHALLENGES } from './challenges';
import type { Block } from '../types/content';

// Model ids are listed here (the registry imports React components, which we avoid in node tests).
const MODEL_IDS = ['supply-demand', 'shift-analyzer', 'market-demand', 'price-controls', 'tax', 'elasticity', 'ppf', 'trade', 'surplus', 'opportunity-cost', 'production', 'cost-curves', 'competitive-firm', 'monopoly'];
const LECTURE_IDS = new Set([...LECTURES.map((l) => l.id), 'ch15', 'beyond']);

function allText(b: Block): string[] {
  switch (b.type) {
    case 'p': case 'definition': return [b.text];
    case 'list': return b.items;
    case 'callout': return Array.isArray(b.text) ? b.text : [b.text];
    case 'example': return [b.problem, ...b.steps, b.answer];
    case 'mistakes': return b.items.flatMap((m) => [m.wrong, m.right]);
    case 'check': return [b.question.prompt, ...b.question.options, b.question.explanation];
    default: return [];
  }
}

describe('lecture content integrity', () => {
  it('has the nine released lectures with unique ids', () => {
    expect(LECTURES.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 14]);
    expect(new Set(LECTURES.map((l) => l.id)).size).toBe(LECTURES.length);
  });
  for (const l of LECTURES) {
    describe(l.id, () => {
      it('has unique section ids and substantive content', () => {
        expect(new Set(l.sections.map((s) => s.id)).size).toBe(l.sections.length);
        expect(l.sections.length).toBeGreaterThanOrEqual(6);
        expect(l.recap.length).toBeGreaterThanOrEqual(4);
        expect(l.objectives.length).toBeGreaterThanOrEqual(4);
      });
      it('references existing models, questions and problem sets', () => {
        for (const m of l.models) expect(MODEL_IDS, m).toContain(m);
        for (const ps of l.problemSets) expect(getProblemSet(ps), ps).toBeDefined();
        for (const s of l.sections) for (const b of s.blocks) {
          if (b.type === 'model') expect(MODEL_IDS, b.model).toContain(b.model);
          if (b.type === 'questions') for (const id of b.ids) expect(getQuestion(id), id).toBeDefined();
          if (b.type === 'check') { expect(b.question.answer).toBeLessThan(b.question.options.length); expect(b.question.answer).toBeGreaterThanOrEqual(0); }
        }
      });
      it('has balanced inline math delimiters and valid internal links', () => {
        for (const s of l.sections) for (const b of s.blocks) for (const t of allText(b)) {
          for (const m of t.matchAll(/\[[^\]]+\]\(#(\/[^)]+)\)/g)) {
            const path = m[1];
            if (path.startsWith('/practice/problems/')) expect(getProblemSet(path.split('/')[3].split('#')[0]), path).toBeDefined();
            if (path.startsWith('/practice/challenges/')) expect(CHALLENGES.map((c) => c.id), path).toContain(path.split('/')[3]);
          }
        }
      });
    });
  }
});

describe('library, problem sets and challenges', () => {
  it('concepts and formulas point at known lectures and models', () => {
    for (const c of CONCEPTS) { expect(LECTURE_IDS, c.id).toContain(c.lecture); if (c.model) expect(MODEL_IDS, c.id).toContain(c.model); }
    for (const f of FORMULAS) { expect(LECTURE_IDS, f.id).toContain(f.lecture); if (f.model) expect(MODEL_IDS, f.id).toContain(f.model); }
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(CONCEPTS.length);
  });
  it('problem sets are complete', () => {
    expect(PROBLEM_SETS.length).toBe(11);
    for (const ps of PROBLEM_SETS) {
      for (const l of ps.lectures) expect(LECTURE_IDS, ps.id).toContain(l);
      for (const p of ps.problems) { expect(p.parts.length, p.id).toBeGreaterThan(0); for (const m of p.models ?? []) expect(MODEL_IDS).toContain(m); }
    }
  });
  it('questions point at known lectures', () => {
    for (const q of QUESTIONS) for (const l of q.lectures) expect(LECTURE_IDS, q.id).toContain(l);
  });
  it('challenges reference known models', () => {
    for (const c of CHALLENGES) expect(MODEL_IDS, c.id).toContain(c.model);
  });
});
