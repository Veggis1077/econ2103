# ECON2103 Micro Lab

An interactive learning platform for **ECON2103 Microeconomics (HKUST)**, built as the main revision resource for four students. It is a static site that runs on GitHub Pages and has no backend.

## What's inside

| Area | Content |
|---|---|
| **Profiles** | Vegard, Martin, Henrick and Mc Conel each get separate progress, mistakes, flashcards, exams, bookmarks and history. Progress is stored in `localStorage` and can be exported/imported as JSON. |
| **Learn** | 9 lecture modules (Ch. 1–8, 14), matching the slide numbering. Each module has intuition, definitions, maths, embedded interactive models, step-by-step worked examples, common mistakes, concept checks, practice links and a recap. Ch. 15 is announced but waiting for its slides. |
| **Economics Lab** | 14 interactive models: supply & demand (with price controls), shift analyzer, market demand, taxation & DWL (incidence, subsidies, Laffer curve), elasticity, PPF, comparative advantage & trade, consumer/producer surplus (including the social planner), opportunity cost, production, cost curves, competitive firm, and monopoly. Every number on screen is computed from the model equations. |
| **Practice** | All 39 source MCQs with reconstructed graphs, plus 42 platform exercises (MCQ and numeric), 11 problem sets with worked solutions, and 10 graph challenges. Modes: learning, mistakes, adaptive and graph challenge. |
| **Exam simulator** | Timed and randomised (both question order and answer order), with no feedback until you submit. Afterwards you get a topic breakdown, a revision plan and a retry of the questions you got wrong. |
| **Library & flashcards** | 96 concepts and 31 formulas, searchable and linked to their lectures and models. Flashcards use the Leitner spaced-repetition system. |
| **Search** | Press ⌘K / Ctrl+K (or `/`) to search across lectures, sections, concepts, formulas, models, questions and problems. |

## Answer key policy
- `src/content/questionBank/sourceQuestions.ts` holds the questions exactly as they appear in the PDF, with **no answers**.
- `src/content/questionBank/answerKey.ts` holds answers that were **derived independently**. Markings in the PDF were not used. The key is read only after the student submits.
- Notes on source issues are shown after answering:
  - Q3: the graph and the text disagree slightly.
  - Q7: the setup has only three pies.
  - Q23: the question mixes up "masks" and "tickets".
- None of these changes the answer.
- Because this is a static site, the key ships in the JS bundle. Hiding it is a UX guarantee, not a security one.

## Develop
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 118 unit/integrity tests (economics models, storage, content, challenges)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```
Requires Node ≥ 20.19.

## Deploy to GitHub Pages
The app uses a **HashRouter** and a **relative base path** (`base: './'`). The same build therefore works at `https://veggis1077.github.io/<any-repo-name>/` with no configuration.

1. Create a repository on GitHub (for example `econ2103`) and push this folder to its `main` branch:
   ```bash
   git remote add origin https://github.com/veggis1077/econ2103.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
3. Each push to `main` runs `.github/workflows/deploy.yml`: install, then test, then build, then deploy `dist/`. The site will appear at `https://veggis1077.github.io/econ2103/`.

Optional: if you want absolute asset URLs, build with `VITE_BASE=/econ2103/ npm run build`.

## Progress and devices
Progress lives in the browser on that device and does not sync. To move it to another device:
1. Use **My Progress → Export** to download a backup.
2. Use **Import** on the other device.

All persistence goes through `src/storage/store.ts` (the `KeyValueStore` interface), so cloud sync can be added later by swapping that implementation.

## Adding material
See **[ADDING_LECTURES.md](ADDING_LECTURES.md)**. Adding Lecture 15 means adding one data file; no UI changes are needed.

## Project docs
- `ARCHITECTURE.md`: stack, key decisions and directory map
- `PROJECT_STATUS.md` / `NEXT_STEPS.md`: checkpoint files for continuing work
- `docs/CURRICULUM.md`: syllabus map and overlaps
- `docs/source-notes/`: text extracted from the slides, the problem sets and the question PDF
