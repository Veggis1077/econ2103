# Adding lectures, questions, graphs and problem sets

Everything is data-driven. Navigation, the dashboard, search, progress tracking, flashcards and the exam simulator all pick up new content automatically.

## 1. Add Lecture 15 (or any lecture)

1. Extract the slide text so you can work from it. From the project root:
   ```bash
   python3 -I - "../Presentasjoner/ECON2103 Ch15 Fall26.pptx" > docs/source-notes/slides-ch15.txt <<'EOF'
   import sys, zipfile, re
   z = zipfile.ZipFile(sys.argv[1])
   for n in sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)], key=lambda n: int(re.findall(r'\d+', n)[0])):
       x = z.read(n).decode('utf8')
       print(f'--- {n} ---')
       for p in re.findall(r'<a:p>(.*?)</a:p>', x, re.S):
           t = ''.join(re.findall(r'<a:t>(.*?)</a:t>', p, re.S))
           if t.strip(): print(t)
   EOF
   ```
2. Copy an existing lecture as a template, for example `src/content/lectures/ch14.ts` → `src/content/lectures/ch15.ts`. Then set:
   ```ts
   const ch15: Lecture = {
     id: 'ch15',            // keep 'ch15' — practice questions and the problem set already use it
     number: 15,
     title: 'Firms in Competitive Markets',   // use the title on the slides
     subtitle: '…', estMinutes: 60, color: '#0369a1',
     objectives: ['…'], keywords: ['…'],
     models: ['competitive-firm', 'cost-curves'],
     problemSets: ['ps-ch15'],             // already exists
     prerequisites: ['ch14'],
     sections: [ /* see block types below */ ],
     recap: ['…'],
   };
   export default ch15;
   ```
   Any file named `chNN.ts` that default-exports a `Lecture` is registered by `src/content/lectures/index.ts` through `import.meta.glob`.
3. In `src/content/lectures/index.ts`, delete the `ch15` entry from `ANNOUNCED`. (Strictly optional: the "coming soon" card hides itself automatically once a lecture with number 15 exists.)
4. If the new chapter covers monopoly, retag questions `pq36`–`pq39` in `sourceQuestions.ts`: change `lectures: ['beyond']` to the new lecture id. Then update `lectures` in the monopoly entry of `src/lab/registry.ts`, and set `enrichment: false` for models the lecture now covers.
5. Run `npm test`. `src/content/content.test.ts` checks that every referenced model, question, problem set and link exists. Note that it currently expects lecture numbers `[1,2,3,4,5,6,7,8,14]`, so add `15` to that list.

### Section kinds
Use the following order: `intro`, `definitions`, `math`, `interactive`, `example`, `interpretation` / `application`, `mistakes`, `check`, `practice`. The recap is rendered automatically from `recap`.

### Block types (`src/types/content.ts`)
| Block | Example |
|---|---|
| Paragraph | `{ type: 'p', text: 'Rich text with **bold**, *italic*, $P = MC$ and [links](#/lab/tax).' }` |
| Heading | `{ type: 'h', text: 'Shutdown rule' }` |
| List | `{ type: 'list', ordered: true, items: ['…', '…'] }` |
| Definition (bookmarkable; becomes a flashcard if `conceptId` exists in `library.ts`) | `{ type: 'definition', term: 'Price taker', conceptId: 'price-taker', text: '…' }` |
| Display maths (KaTeX) | `{ type: 'math', tex: 'P = MR = MC', caption: '…' }` |
| Callout | `{ type: 'callout', tone: 'intuition' \| 'warning' \| 'exam' \| 'note' \| 'example' \| 'key', title?: '…', text: '…' \| ['…'] }` |
| Table | `{ type: 'table', table: { caption, headers: [...], rows: [[...]] } }` |
| Live Lab model | `{ type: 'model', model: 'competitive-firm', props: { preset: 1 } }` |
| Step-by-step worked example | `{ type: 'example', title, problem, steps: ['…'], answer }` |
| Common mistakes | `{ type: 'mistakes', items: [{ wrong: '…', right: '…' }] }` |
| Concept check (inline answer) | `{ type: 'check', question: { prompt, options: [...], answer: 0, explanation } }` |
| Links to bank questions | `{ type: 'questions', ids: ['pq32', 'ax41'] }` |
| Comparison | `{ type: 'compare', left: { title, items }, right: { title, items } }` |
| Static figure | `{ type: 'figure', figure: FigureSpec, caption }` (see §3) |

**Rich-text rules:**
- Inline maths is `$…$`. It must start with a non-digit, non-space character, so `$5 and $10` stays as currency.
- In TypeScript strings, write `\\frac`, `\\Delta`, … with two backslashes.
- Inside template literals, avoid the sequence `${`.

## 2. Add practice questions

- **Source/exam questions** (verbatim) go in `src/content/questionBank/sourceQuestions.ts`. Their answers go in `answerKey.ts`; keep the two files separate.
  - Each answer has `answer` (an index into the original option order), `explanation`, `status: 'verified' | 'review'` and an optional `reviewNote`.
  - Use `status: 'review'` when an answer cannot be verified reliably. The UI then flags it.
  - Set `fixedOrder: true` if the option order must be preserved (for example ordered numbers, or "all of the above").
- **Platform exercises** go in `src/content/questionBank/authored.ts`. In that file the answer key sits next to each item and is split out at load time. Numeric questions use `kind: 'numeric'`, `unit` and `key.tolerance` (relative tolerance).
- Tag each question with `lectures`, `topics` (see `TOPIC_LABELS` in `questionBank/index.ts`; add new labels there) and `difficulty` (1–3).
- If possible, add a test in `questionBank.test.ts` that recomputes numeric answers with `src/economics`.

## 3. Reconstruct a graph (FigureSpec)
Figures are drawn live from data, never from images:
```ts
figures: [{ spec: {
  xDomain: [0, 60], yDomain: [0, 50], xLabel: 'QUANTITY', yLabel: 'PRICE',
  xTicks: [5, 10, 15], yTicks: [{ v: 30, label: 'P₁' }],      // numbers or custom labels
  curves: [{ kind: 'line', from: [0, 44], to: [55, 0], label: 'Demand', labelAt: [50, 5], color: 'var(--c-demand)' },
           { kind: 'fn', fn: { type: 'atc', fixed: 450, c: 0, e: 1 }, xFrom: 14, xTo: 120, label: 'ATC' }],
  points: [{ x: 15, y: 32, label: 'A' }], guides: [{ x: 15, y: 32 }],          // dashed lines to the axes
  regions: [{ points: [[0, 44], [15, 32], [0, 32]], fill: 'var(--c-cs)', label: 'CS' }],
  labels: [{ x: 4, y: 20, text: 'B' }],
} }]
```
Chart colour tokens: `--c-demand`, `--c-supply`, `--c-cs`, `--c-ps`, `--c-dwl`, `--c-rev`, `--c-mc`, `--c-atc`, `--c-avc`, `--c-mr`.

## 4. Add a problem set
Create `src/content/problems/ps-<name>.ts`, which default-exports a `ProblemSet`. It is auto-registered. Each part has `prompt` and `solution`, plus an optional numeric self-check:
`check: { answer, tolerance?, unit? }`. Set `officialSolution: true` when the solution comes from the course's own solution sheet.

## 5. Add a Lab model or a graph challenge
- **Model:**
  1. Create `src/lab/models/MyModel.tsx`. It should export a default component taking `ModelProps<State>` (`initial`, `onChange`, `preset`) and render inside `ModelShell`.
  2. Put the economics in pure functions in `src/economics/models/` and test them.
  3. Register the model in `src/lab/registry.ts`.
  4. Add its id to `MODEL_IDS` in `src/content/content.test.ts`.
- **Challenge:** add an entry to `src/content/challenges.ts`. Its `check(state)` receives the model's live state and returns `[solved, statusText]`. Add a solvable/unsolvable state pair to `challenges.test.ts`.

## 6. Add concepts / formulas / flashcards
Add entries to `src/content/library.ts`. Each `Concept` automatically becomes a flashcard, a search entry and a library card.
