# BUS311 Project Guidance

## Source boundaries

- This repository is public and student-facing. Never add solutions, teaching keys, exams, live gradebooks, student data, publisher manuals, publisher solution banks, or licensed source decks.
- Newly authored BUS311 slides, readings, starter workbooks, and activities may be public.
- Original publisher materials remain in OneDrive or Canvas and may be referenced during reauthoring, but not copied here.
- The separate private `BUS311-instructor` repository mirrors lesson IDs and owns teaching keys, workbook keys, assessments, and grading support.

## Maintained sources

- Treat `course-map.json` as the source of truth for tracks, lessons, outcome coverage, and public material links.
- Treat `terms/*.json` as the source of truth for term-specific ordering, release state, Canvas URL, and current lesson.
- Treat `docs/bus311-html-deck-standard.md` as the approved design, teaching-pattern, and verification standard for BUS311 Canva/PPTX-to-HTML deck rebuilds.
- Build HTML decks as visually varied, graphic-led classroom experiences rather than repeated text-card layouts. Each slide needs one explicit teaching message that is understandable from its title and visual.
- Structure discoveries as setup or prediction → student work → answer reveal. Do not present a surprising conclusion without first giving students enough context to reason toward it.
- Give interactive slides precise on-slide directions, timing, and a visible deliverable. Put the formative answer and teaching rationale in speaker notes; keep private assessment and workbook solutions out of the public repository.
- For financial calculations, introduce the relevant Excel function early and prefer an editable worksheet-style visual with a formula bar, real cell references, and consistent inputs across related slides. Show manual arithmetic only when it materially improves conceptual understanding.
- Use real corporate examples with purposeful, rights-safe local images or public company logos when they improve recognition and visual appeal. Do not use generic company placeholders or decorative logo collages.
- BUS311 projected slide content must not use ornamental numeric labels such as `01`, `02`, or `03`. Keep numbers only when they carry instructional or financial meaning, identify dates/years, appear in formulas, support slide navigation, or identify the course/module.
- BUS311 speaker notes are teaching guidance only. Keep source-slide mapping, original-deck provenance, carryover/rebuild decisions, rights notes, and production commentary in source inventories, audits, review logs, or `data-source-slides` metadata.
- Regenerate `index.html` with `scripts/build-index.mjs`; do not hand-edit the generated page.
- Pre-readings are Markdown-only. Store them in the module `source/` folder and do not generate PDFs until explicitly requested.

## Naming

Use `bus311-[track]-m##-l##-[artifact].ext`, such as:

- `bus311-valuation-m02-l01-slides.html`
- `bus311-valuation-m02-l01-starter.xlsx`
- `source/bus311-valuation-m02-l01-prereading.md`

## Required verification

- Run `python3 scripts/validate-public.py` after public-material changes.
- Run the private repository coverage validator after teaching-key or workbook-key changes.
- Public workbooks must not contain hidden solution, answer, key, completed, instructor, exam, or grading sheets.
- Preserve unrelated work and do not commit, push, or publish unless explicitly requested.

## GitHub publishing

- When Bethany explicitly requests a direct GitHub publication, verify the exact diff, stage only the intended files, run the required validation, commit, and push with ordinary Git credentials from the macOS Keychain.
- Do not require a valid `gh auth` session for normal `git fetch`, `git pull`, or `git push` operations. The GitHub CLI login is required only for workflows that actually use `gh`, such as creating or managing pull requests, issues, or releases.
- Treat GitHub Desktop as a fallback and status check, not as the required publishing path. If the expected files are confirmed and Git credentials work, use the terminal commit/push workflow instead of waiting for the Desktop app.
- In a mixed or stale checkout, never stage the whole worktree. Use explicit paths or a clean temporary worktree based on current `origin/main` so unrelated files cannot enter the commit.
- Push directly to `main` only when Bethany explicitly requests that target. Otherwise preserve the existing approval boundary and do not publish; if a branch or pull request is requested, use that workflow instead.
