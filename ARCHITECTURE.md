# Architecture

Static single-page app: **React 19 + TypeScript (strict) + Vite + Tailwind CSS 3 + KaTeX**, custom SVG chart
library, Vitest for tests. Hosted on GitHub Pages; no backend.

## Key decisions
| Decision | Why |
|---|---|
| `HashRouter` + Vite `base: './'` | Works under any `https://<user>.github.io/<repo>/` path with no 404.html hacks or repo-name config. |
| Custom SVG chart primitives (`src/components/charts`) instead of D3/Recharts | Precise data→pixel control, draggable points/curves/lines, shaded polygons, hover readouts, tiny bundle. Every drawn quantity is computed from model functions. |
| Pure economics functions (`src/economics/models`) | Rendering never computes economics; models are unit-tested (`models.test.ts`) against course numbers. |
| Content as typed data (`src/types/content.ts`) | Lectures/questions/problems are data files; UI renders block types. |
| Lecture auto-registration via `import.meta.glob('./ch*.ts')` | Adding Lecture 15 = adding `src/content/lectures/ch15.ts`. No nav/UI edits. |
| Answer key separate from questions | `sourceQuestions.ts` has no answers; `answerKey.ts` is only read after submission. (Static site ⇒ the key is in the JS bundle; this is a UX guarantee, not security.) |
| `KeyValueStore` interface over localStorage | Profiles namespaced `econ2103:v1:profile:<id>`; swap in a cloud store later without UI changes. Export/import JSON backups. |
| Profiles are local, not accounts | Four fixed profiles (`src/profiles/profiles.ts`), clearly labelled as device-local. |

## Directory map
```
src/
  economics/models/   linear, surplus, tax, priceControls, elasticity, ppf, opportunityCost, costs, firm, monopoly (+ tests)
  components/charts/  Plot (scales, axes, hover readout), primitives (Curve, Area, Guide, Dot, Handle, DragCurve, DragHLine…)
  components/ui/      Card, Slider, Stat, Progress, Segmented, Toggle, Tex (KaTeX), Rich (inline markup), Avatar
  components/layout/  AppLayout (sidebar/topbar/profile switcher), SearchDialog, Breadcrumbs
  components/learning BlockRenderer for lecture content blocks, FigureView for question figures
  components/quiz/    QuestionCard (MCQ/numeric, feedback), shared quiz logic
  lab/                ModelShell + models/*.tsx (each accepts initial/onChange/preset) + registry.ts
  content/lectures/   chNN.ts lecture data + index.ts registry (+ UPCOMING list for Lecture 15)
  content/questionBank sourceQuestions.ts (39 PDF questions), answerKey.ts, authored.ts, index.ts
  content/problems/   problem sets with worked solutions
  content/library.ts  concepts + formulas (search, flashcards, library page)
  storage/            store.ts (KeyValueStore), progress.ts (ProfileData + pure updaters, export/import)
  profiles/           profiles.ts, ProfileContext.tsx
  pages/              route components
docs/                 CURRICULUM.md, source-notes/ (text extracted from slides/PDFs)
```

## Testing
- `src/economics/models/models.test.ts`: numerical models against course and problem-set numbers.
- `src/storage/progress.test.ts`, `src/stats/analytics.test.ts`: persistence and adaptive selection.
- `src/content/questionBank/questionBank.test.ts`: answer-key integrity, and numeric answers recomputed with the models.
- `src/content/content.test.ts`: every lecture reference (models, questions, problem sets, links) resolves.
- `src/content/challenges.test.ts`: every graph challenge is solvable and rejects a wrong state.

## Performance
Pages, Lab models and the search dialog are lazy-loaded. KaTeX and React are split into vendor chunks (`vite.config.ts`). `Plot` shrinks its coordinate system on narrow containers so labels stay readable on phones.

## Conventions
- Inverse curve form everywhere: demand `P = a − bQ`, supply `P = c + dQ`.
- Rich text in content: `**bold**`, `*italic*`, `$tex$`, `$$display$$`, `[label](#/route)`.
- Lab model props: `{ initial?, onChange?, preset?, compact? }` so models embed in lectures and graph challenges.
