import { describe, expect, it } from 'vitest';
import { emptyProfileData, exportProfile, parseImport, recordAnswer, reviewFlashcard, toggleSection } from './progress';

describe('profile progress', () => {
  it('records answers and the mistakes list', () => {
    let d = emptyProfileData('vegard');
    d = recordAnswer(d, 'q1', false, 'learning');
    expect(d.questions.q1.inMistakes).toBe(true);
    d = recordAnswer(d, 'q1', true, 'mistakes');
    expect(d.questions.q1).toMatchObject({ attempts: 2, correct: 1, inMistakes: false });
  });
  it('completes a lecture when all sections are done', () => {
    let d = emptyProfileData('martin');
    d = toggleSection(d, 'ch01', 'a', 2);
    expect(d.lectures.ch01.completed).toBe(false);
    d = toggleSection(d, 'ch01', 'b', 2);
    expect(d.lectures.ch01.completed).toBe(true);
  });
  it('round-trips export/import and re-keys to the target profile', () => {
    const d = recordAnswer(emptyProfileData('henrick'), 'q5', true, 'exam');
    const r = parseImport(exportProfile(d), 'mcconel');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.profileId).toBe('mcconel');
      expect(r.fromProfile).toBe('henrick');
      expect(r.data.questions.q5.correct).toBe(1);
    }
  });
  it('rejects foreign files', () => {
    expect(parseImport('{"hello":1}', 'x').ok).toBe(false);
    expect(parseImport('not json', 'x').ok).toBe(false);
  });
  it('Leitner boxes move up and reset', () => {
    let d = emptyProfileData('v');
    d = reviewFlashcard(d, 'c', true);
    d = reviewFlashcard(d, 'c', true);
    expect(d.flashcards.c.box).toBe(3);
    d = reviewFlashcard(d, 'c', false);
    expect(d.flashcards.c.box).toBe(1);
  });
});
