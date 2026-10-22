import { useMemo, useState } from 'react';
import { CONCEPTS } from '../content/library';
import { LECTURES, shortLectureLabel } from '../content/lectures';
import { useActiveProfile } from '../profiles/ProfileContext';
import { reviewFlashcard } from '../storage/progress';
import { PageHeader, ProgressBar } from '../components/ui';
import { Rich } from '../components/ui/Rich';

export default function Flashcards() {
  const { data, update } = useActiveProfile();
  const [lec, setLec] = useState('all');
  const [onlyDue, setOnlyDue] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [session, setSession] = useState(0);
  const now = Date.now();
  const deck = useMemo(() => {
    const cards = CONCEPTS.filter((c) => lec === 'all' || c.lecture === lec);
    const due = cards.filter((c) => !data.flashcards[c.id] || new Date(data.flashcards[c.id].due).getTime() <= now);
    const list = onlyDue ? due : cards;
    // Lowest box first, then unseen.
    return [...list].sort((a, b) => (data.flashcards[a.id]?.box ?? 0) - (data.flashcards[b.id]?.box ?? 0));
  }, [lec, onlyDue, session]); // eslint-disable-line
  const [i, setI] = useState(0);
  const card = deck[i];
  const boxes = [1, 2, 3, 4, 5].map((b) => CONCEPTS.filter((c) => (data.flashcards[c.id]?.box ?? 0) === b).length);
  const mastered = boxes[4];
  const answer = (knew: boolean) => {
    if (!card) return;
    update((d) => reviewFlashcard(d, card.id, knew));
    setFlipped(false);
    setI(i + 1);
  };
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Spaced repetition" title="Flashcards" subtitle="Concept cards in a Leitner system: cards you know move to higher boxes and come back less often (1, 3, 7, 16 days); cards you miss return to box 1." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select value={lec} onChange={(e) => { setLec(e.target.value); setI(0); }} className="h-10 rounded-xl border border-ink-200 bg-white px-2 text-sm dark:border-ink-700 dark:bg-ink-900" aria-label="Deck">
          <option value="all">All lectures ({CONCEPTS.length})</option>
          {[...LECTURES.map((l) => l.id), 'ch15', 'beyond'].map((l) => <option key={l} value={l}>{l === 'beyond' ? 'Beyond slides' : shortLectureLabel(l)} ({CONCEPTS.filter((c) => c.lecture === l).length})</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyDue} onChange={(e) => { setOnlyDue(e.target.checked); setI(0); }} /> Only cards due now</label>
        <div className="ml-auto text-sm text-ink-500">{mastered}/{CONCEPTS.length} mastered</div>
      </div>
      <div className="mb-6 grid grid-cols-5 gap-2">
        {boxes.map((n, b) => <div key={b} className="rounded-xl bg-ink-100 p-2 text-center dark:bg-ink-800"><div className="text-xs text-ink-500">Box {b + 1}</div><div className="font-mono font-semibold">{n}</div></div>)}
      </div>
      {card ? (
        <>
          <ProgressBar value={i / deck.length} className="mb-4" />
          <button onClick={() => setFlipped(!flipped)} className="card flex min-h-[260px] w-full flex-col items-center justify-center p-8 text-center transition hover:shadow-md" aria-label={flipped ? 'Show term' : 'Reveal definition'}>
            <div className="label mb-3">{shortLectureLabel(card.lecture)} · card {i + 1} of {deck.length}{data.flashcards[card.id] ? ` · box ${data.flashcards[card.id].box}` : ' · new'}</div>
            {!flipped ? (
              <><div className="font-serif text-3xl font-semibold">{card.term}</div><div className="mt-4 text-sm text-ink-400">Click to reveal the definition</div></>
            ) : (
              <div className="prose-econ max-w-xl animate-fade-up text-left"><div className="mb-2 font-semibold">{card.term}</div><Rich text={card.definition} />{card.note && <p className="mt-3 text-sm text-ink-500"><Rich text={card.note} /></p>}</div>
            )}
          </button>
          <div className="mt-4 flex justify-center gap-3">
            {flipped ? (
              <>
                <button className="btn-secondary border-rose-300 text-rose-700" onClick={() => answer(false)}>✗ Didn’t know</button>
                <button className="btn-primary" onClick={() => answer(true)}>✓ Knew it</button>
              </>
            ) : <button className="btn-secondary" onClick={() => setFlipped(true)}>Reveal</button>}
          </div>
        </>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl">🎉</div>
          <div className="mt-2 font-semibold">{deck.length ? 'Deck finished!' : 'No cards due right now.'}</div>
          <button className="btn-secondary mt-4" onClick={() => { setOnlyDue(false); setI(0); setSession(session + 1); }}>Review all cards anyway</button>
        </div>
      )}
    </div>
  );
}
