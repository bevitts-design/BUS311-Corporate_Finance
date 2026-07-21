# BUS311 Corporate Finance

This repository is the public, student-facing source for BUS311 course materials.

- `course-map.json` defines the reusable curriculum and public artifacts.
- `terms/*.json` supplies term-specific release and Canvas information.
- `scripts/build-index.mjs` regenerates the student course hub.
- Lesson pre-readings are Markdown-only during the current conversion phase.
- Instructor teaching keys, activity keys, exams, and grading materials belong in the separate private `BUS311-instructor` repository.

The legacy OneDrive course folder remains the source archive until each item is reviewed and accepted into this repository.

## Approved Canva/PPTX-to-HTML deck standard

The Fall 2026 course introduction and Chapter 1 pilot was approved on July 19, 2026. Its visual system uses the BUS209 FactSet decks as the course reference: navy and steel blue lead the palette, teal and gold support data emphasis, and terra is reserved for risk or negative-value cues. Future BUS311 chapter rebuilds inherit the approved standard unless an instructor-approved decision explicitly changes it.

- Approved standard: `docs/bus311-html-deck-standard.md`
- Chapter brief template: `docs/templates/bus311-chapter-rebuild-brief.md`
- Maintained content: `scripts/decks/bus311-intro-m01-l01-content.mjs`
- Builder: `scripts/build-bus311-intro-m01-l01.mjs`
- Output: `01-INTRO/M01/bus311-intro-m01-l01-slides.html`
- Legacy review alias: `01-INTRO/M01/bus311-intro-m01-l01-canva-pilot-slides.html`
- Source audit: `audits/canva-intro-ch1-pilot-inventory.md`
- Review log: `audits/intro-m01-l01-review-log.md`
- Validation: `scripts/validate-bus311-intro-m01-l01.mjs`

The approved deck uses the normal filename already referenced by `course-map.json`. Rebuild it with the bundled or system Node.js runtime, then run the lesson validator and `python3 scripts/validate-public.py`. The former `build-canva-pilot.mjs`, `validate-canva-pilot.mjs`, and `canva-pilot-content.mjs` paths remain as compatibility wrappers.

## Financial Institutions chapter rebuild

The Fall 2026 Financial Institutions chapter is maintained as a source-audited, 40-slide presenter deck. It represents all 33 source PPTX slides, adds current BlackRock and Coinbase examples from official company sources, and rebuilds the crisis evidence from SEC, Federal Reserve, and FDIC sources. The extracted PPTX media remains outside the public repository.

- Rebuild brief: `audits/bus311-intro-m02-l01-rebuild-brief.md`
- Maintained content: `scripts/decks/bus311-intro-m02-l01-content.mjs`
- Builder: `scripts/build-bus311-intro-m02-l01.mjs`
- Output: `01-INTRO/M02/bus311-intro-m02-l01-slides.html`
- Source inventory: `audits/bus311-intro-m02-l01-source-inventory.md`
- Review log: `audits/bus311-intro-m02-l01-review-log.md`
- Validation: `scripts/validate-bus311-intro-m02-l01.mjs`
