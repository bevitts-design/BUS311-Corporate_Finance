# BUS311 Corporate Finance

This repository is the public, student-facing source for BUS311 course materials and the Fall 2026 course hub.

- `course-map.json` defines the reusable curriculum and public artifacts.
- `terms/*.json` supplies term-specific release and Canvas information.
- `scripts/build-index.mjs` regenerates the homepage and each module landing page.
- Lesson pre-readings are Markdown-only during the current conversion phase.
- Instructor teaching keys, activity keys, exams, and grading materials belong in the separate private `BUS311-instructor` repository.

The legacy OneDrive course folder remains the source archive until each item is reviewed and accepted into this repository. Live student trackers and gradebooks never belong in Git; reviewed student materials are linked from `course-map.json`, while instructor keys and grading artifacts stay private.

## Student course hub

The generated site is organized around the student learning sequence rather than the repository folder names:

1. **Start here** highlights the current Fall 2026 lesson.
2. **Prepare, practice, apply** gives every lesson a predictable workflow.
3. **Course pathway** groups M01–M04 as Understand the Business, M05–M08 as Value the Cash Flows, and M12–M14 as Recommend the Decision.
4. Each module folder contains a generated `index.html` with its briefing, expected output, public downloads, learning outcomes, and previous/next navigation.
5. Search and section filters help students find lessons by topic, company, skill, module, or learning outcome.

Rebuild and validate the site with:

```bash
node scripts/build-index.mjs --term fall-2026
python3 scripts/validate-public.py --site-only
```

The site-only validator checks term coverage, generated pages, public links, workbook safety, filename privacy rules, and whether every lesson-level artifact is represented in `course-map.json`. Run the full validator when a deck is rebuilt; it also enforces the current HTML-deck standard.

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

## Risk, Return, and CAPM chapter rebuild

The M12 Firm Decisions lesson is maintained as a source-audited, 32-slide presenter deck. It represents all 22 source PowerPoint slides through a 75-minute sequence from diversification and beta to CAPM, the Security Market Line, and project-specific hurdle rates. The public starter workbook remains unchanged and is used for the final formula activity.

- Rebuild brief: `audits/bus311-decisions-m01-l01-rebuild-brief.md`
- Maintained content: `scripts/decks/bus311-decisions-m01-l01-content.mjs`
- Lesson CSS: `03-FIRM-DECISIONS/M12/assets/deck.css`
- Activity script: `03-FIRM-DECISIONS/M12/assets/activities.js`
- Builder: `scripts/build-bus311-decisions-m01-l01.mjs`
- Output: `03-FIRM-DECISIONS/M12/bus311-decisions-m01-l01-slides.html`
- Source inventory: `audits/bus311-decisions-m01-l01-source-inventory.md`
- Review log: `audits/bus311-decisions-m01-l01-review-log.md`
- Validation: `scripts/validate-bus311-decisions-m01-l01.mjs`
