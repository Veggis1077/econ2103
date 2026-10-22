# Next steps

The platform is complete for all material provided so far. These are the remaining and optional tasks, in priority order.

1. **When the Lecture 15 slides arrive:** follow `ADDING_LECTURES.md` §1.
   1. Create `src/content/lectures/ch15.ts`. Keep the id `ch15`; the problem set and questions already reference it.
   2. Update the expected lecture numbers in `src/content/content.test.ts`.
   3. Set `enrichment: false` on `competitive-firm` in `src/lab/registry.ts`.
2. **Deploy:** create the GitHub repo, push `main`, and set Pages → Source = GitHub Actions (see README). This needs the owner's authorisation; nothing has been pushed yet.
3. Optional improvements:
   - Add more platform questions per topic (each lecture currently has 3–6 authored questions).
   - Add more graph challenges for the elasticity, market-demand and production models.
   - Add optional cloud sync by implementing `KeyValueStore` against a backend.
   - Add a print-friendly formula sheet page.
