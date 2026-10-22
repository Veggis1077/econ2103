import type { ProblemSet } from '../../types/content';

const ps: ProblemSet = {
  id: 'ps-sp-ch08',
  title: 'Self-practice: Chapter 8',
  lectures: ['ch08'],
  problems: [
    { id: 'p2', title: 'P2 — Two statements about deadweight loss', source: 'ProblemSets/Self-Practice_Chapter 8.pdf', models: ['tax'], intro: 'Evaluate the two statements. Do you agree?',
      parts: [
        { label: 'a', prompt: '"A tax that has no deadweight loss cannot raise any revenue for the government."', solution: '**Disagree.** If supply or demand is perfectly inelastic, quantity does not change: the tax has **no DWL** yet raises revenue t × Q.' },
        { label: 'b', prompt: '"A tax that raises no revenue for the government cannot have any deadweight loss."', solution: '**Disagree.** A tax so large that nothing is traded raises **no revenue** but destroys **all** the surplus — the largest possible DWL.' },
      ] },
    { id: 'p4', title: 'P4 — A tax on heating oil', source: 'ProblemSets/Self-Practice_Chapter 8.pdf', models: ['tax'], intro: 'The government imposes a tax on heating oil.',
      parts: [
        { label: 'a', prompt: 'Is the DWL likely greater in the first year or the fifth year?', solution: '**Fifth year**: over time people insulate and switch systems, so demand (and supply) become more elastic and quantity falls more.' },
        { label: 'b', prompt: 'Is revenue likely greater in the first year or the fifth year?', solution: '**First year**: quantity is larger before buyers fully adjust, so t × Q is larger.' },
      ] },
    { id: 'p5', title: 'P5 — Taxing food', source: 'ProblemSets/Self-Practice_Chapter 8.pdf', intro: 'A friend suggests taxing food because demand for food is quite inelastic.',
      parts: [{ label: 'a', prompt: 'In what sense is this a "good" way to raise revenue, and in what sense not?', solution: '**Good (efficiency):** inelastic demand ⇒ small fall in quantity ⇒ **small deadweight loss** and stable revenue. **Not good (equity):** food takes a large share of poor households’ budgets and buyers bear most of the tax — it is **regressive**.' }] },
  ],
};
export default ps;
