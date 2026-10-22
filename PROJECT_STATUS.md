# Project status

_Last updated: 2026-10-22 (end of session 1). State: **feature-complete for all provided material.**_

## Completed
- **Source analysis**: all lecture slides (Ch1–8, 14), 11 problem-set PDFs and the 39-question PDF were transcribed into `docs/source-notes/`. Curriculum map and overlaps are in `docs/CURRICULUM.md`.
- **Stack**: Vite 8, React 19, TypeScript (strict), Tailwind 3, KaTeX, Vitest. HashRouter with a relative base path. GitHub Actions Pages workflow (`.github/workflows/deploy.yml`).
- **Economics models** (`src/economics/models`): linear market, surplus (continuous and discrete), tax incidence/DWL/Laffer/subsidy, price controls, elasticity, PPF/comparative advantage/trade/joint PPF, opportunity-cost choices, cost tables and cubic costs, competitive firm (short- and long-run), monopoly. All are unit-tested against course numbers.
- **Profiles & storage**: 4 local profiles, namespaced localStorage behind a `KeyValueStore` interface, JSON export/import/reset, and cross-tab sync.
- **UI**: profile selection, dashboard (overview, suggested lecture, mastery, weak areas, recent, quick model access), lecture pages (section progress, TOC, embedded models), Lab index and model pages, practice hub (filters, modes), learning/mistakes/adaptive sessions, single-question page, problem-set pages with numeric self-checks, graph challenges, exam simulator (timer, randomisation, review, weakness analysis, revision plan), library, flashcards (Leitner), progress page (stats, activity, exam history, backup), global search (⌘K), dark mode, responsive charts.
- **Content**:
  - 9 complete lecture modules.
  - 14 Lab models.
  - 39 source questions with 13 reconstructed figures and a separate verified answer key.
  - 42 authored questions.
  - 11 problem sets (53 problems) with worked solutions.
  - 10 graph challenges.
  - 96 concepts and 31 formulas.
- **Docs**: README (deployment), ADDING_LECTURES.md, ARCHITECTURE.md.

## Test results (latest)
- `npm test`: **118 passing**. This covers the models, storage, analytics, question-bank integrity, model-backed answer checks, content-reference integrity and challenge solvability.
- `npm run build`: succeeds. Chunks: app ≈ 239 kB (79 kB gzip), react ≈ 258 kB, katex ≈ 259 kB, plus lazily loaded pages and models.
- Headless-Chrome QA (puppeteer-core, scratch script, not in the repo):
  - 33 routes were crawled with 0 console errors.
  - The 18-step end-to-end flow passes: answering questions, mistakes, numeric input, section progress, flashcards, exam, profile isolation, graph challenge and search.
  - Light, dark and mobile layouts were checked visually.

## Known limitations / issues
- Lecture 15 slides have not been provided. Ch. 15 appears as "coming soon"; its problem set and the Competitive Firm model are available.
- Monopoly (Q36–39) is beyond the provided slides. It is tagged `beyond` and labelled "Beyond slides"; the Monopoly model is marked "Ahead of slides".
- The answer key ships in the static bundle, so it is hidden in the UI but not secret.
- Price-control surplus figures assume efficient rationing. This is noted in the UI and the lecture.
- Progress is per-device. Export/import is the only sync mechanism.
