# BUS311 editable HTML deck standard

**Status:** Approved
**Pilot approved:** July 19, 2026
**Approved reference deck:** `INTRO/M01/bus311-intro-m01-l01-slides.html`
**Visual reference:** BUS209 FactSet decks
**Default mode:** Presenter

This document is the maintained BUS311 standard for rebuilding Canva, PowerPoint, PDF, and legacy lecture materials as editable student-facing HTML. It records the reusable decisions approved through the course introduction and Chapter 1 pilot. Chapter-specific exceptions belong in that lesson's source inventory or review log, not in this standard.

## Source-of-truth hierarchy

1. `course-map.json` controls lesson identity, sequence, outcomes, and public material links.
2. `terms/*.json` controls term-specific ordering, release state, Canvas URL, and current lesson.
3. This document controls the approved BUS311 deck design and teaching patterns.
4. Each lesson content module controls slide content and speaker notes.
5. Each lesson source inventory records how source slides map to rebuilt slides.
6. Each lesson review log records instructor feedback and whether it is global or deck-specific.
7. Generated HTML is a deliverable, not the maintained authoring source.

The original Canva design, PPTX, or PDF is always a read-only source reference. Never modify it during the HTML rebuild.

## Design identity

- Use the BUS209 FactSet look and feel approved in the pilot.
- Lead with navy `#0A2540` and steel blue `#2D7DD2`.
- Use teal `#1B998B` for connected systems, positive movement, and analytical emphasis.
- Use gold `#E6A817` for key values, decisions, or balanced contrast.
- Reserve terra `#9C4A2B` for risk, warning, or negative-value cues.
- Use white or very light blue content surfaces and dark navy section slides.
- Use Geist for presentation text, JetBrains Mono for formulas and labels, and Instrument Serif only for limited numeric or quotation emphasis.
- Author at 1920×1080 with a 24px absolute text floor.
- Do not shrink important text to force a layout to fit. Enlarge the container, shorten the wording without changing the concept, or split the slide.

## Presenter-mode runtime

Every deck must use the maintained inlined no-Shadow-DOM `<deck-stage>` runtime and provide:

- `#slide-N` URL hashes and direct-link initialization.
- Previous and next controls.
- A consistent slide counter.
- Fullscreen control and the `F` shortcut.
- Speaker notes and the `N` shortcut.
- Keyboard and click-zone navigation.
- Pixel-offset viewport scaling without `translate(-50%, -50%)`.
- No external JavaScript, React, Babel, Canva SDK, Tailwind, or global site CSS dependency.

## Graphical delivery

The approved deck is image-supported, graphic-led, and speaker-driven.

- Give each slide one primary teaching message.
- Prefer one or two strong visual chunks; use three only when the relationship requires it.
- Replace long card rows and bullet collections with a meaningful visual system.
- Use editable orbits for connected concepts.
- Use ordered paths, timelines, or distinct shapes for sequences.
- Use arrows when direction, dependency, movement, or cash flow matters.
- Use buckets or columns for classification exercises and answer reveals.
- Use a hub-and-spoke, wheel, hierarchy, or branch only when it clarifies a real relationship.
- Use process infographics for course maps and multi-stage analytical workflows.
- Avoid decorative question marks, unexplained production labels, or shapes that do not carry meaning.
- Enlarge pills, circles, hubs, and panels when the wording needs more room.
- Ensure every graphical element has sufficient contrast and an accessible text alternative or ARIA label.

## Images and editable elements

Keep as local images only when rights, purpose, and resolution are confirmed:

- Original or commissioned editorial photography.
- Approved school/course branding.
- Readable application screenshots that may legally appear in the public deck.
- Simple public-domain or clearly licensed logos stored locally with attribution retained in the audit.

Rebuild as editable HTML, CSS, or SVG:

- Titles, captions, quotations, and instructional text.
- Charts, tables, grade breakdowns, and calculations.
- Timelines, decision maps, organization charts, and process diagrams.
- Formula walkthroughs and spreadsheet examples.
- Any screenshot whose important labels, numbers, or axes are too small for projection.

Do not copy into the public repository:

- Personal or family photographs unless explicitly approved for public use.
- Student names, student work, grades, or private information.
- Answer keys, exams, teaching keys, or instructor-only notes.
- Publisher solution banks or licensed publisher source decks.
- Proprietary FactSet screens.
- Unverified QR codes, low-resolution text screenshots, or third-party logo collages without clear reuse rights.

## Teaching patterns approved through the pilot

### Numerical examples

- Introduce a concrete scenario before presenting formulas.
- Preserve the same numbers across the prompt, calculation, comparison, and interpretation slides.
- Show the formula and the actual calculated outcomes.
- Explain the behavioral or managerial meaning of the numbers, not only the arithmetic.
- Where useful, end with a decision question or trade-off rather than a single isolated result.

### Classroom participation

- Place explicit partner or group instructions on the exercise slide.
- Tell students exactly what they are deciding, sorting, calculating, or defending.
- Give the activity before the answer slide.
- Keep answer reveals student-facing but do not embed private teaching keys.
- When an outcome belongs to more than one category, show a distinct `Both` category after the primary categories.

### Instructor and orientation content

- Use `Professor Bethany Evitts` on the instructor profile slide.
- Keep the full teaching-philosophy quotation on its own image-led slide.
- Prefer `What you will learn` over construction-oriented language such as `What you will build` when describing course learning.
- Show grade weights with percentage signs and a visible 100% total.
- Do not carry deck-specific orientation slides into later chapters unless they serve that lesson.

## Source notes, citations, and projected content

- Projected slides should not show internal production notes, licensing explanations, or comments such as `editable SVG`.
- Keep source caveats, rights decisions, and undated-claim warnings in speaker notes, the source inventory, or review log.
- Keep concise student-useful citations on the slide when the source itself supports learning, such as an official SEC or PCAOB link.
- Verify time-sensitive statistics, laws, schedules, product instructions, and external links before reusing them.
- If a source claim cannot be dated or verified, preserve it only when instructionally necessary and mark it clearly in the audit for review.

## Term-specific content

- Reusable chapter concepts belong in lesson content modules.
- Term ordering, release state, Canvas URL, and current lesson belong in `terms/*.json`.
- Exact exam, project, and assignment dates must come from the governing syllabus, registrar calendar, or Canvas.
- Never silently carry `Spring 2026` into a Fall 2026 deck.
- If current course-specific dates are unavailable, use week ranges and tell students that Canvas governs exact dates.

## Required lesson documentation

Each rebuilt chapter needs:

- A completed chapter rebuild brief.
- A source inventory with every source slide inspected.
- A decision for each source slide: preserve, rebuild, split, combine, omit with approval, or retain as an image.
- An asset record with local filename, source/rights basis, purpose, and alt text.
- A review log recording instructor comments and their disposition.
- `data-source-slides` provenance on every generated slide.
- Speaker-note parity in Presenter mode.

## Review classification

Classify every instructor comment before documenting it:

- **Global standard:** applies to future BUS311 decks and should update this file.
- **Pattern-level:** applies whenever the same slide type recurs, such as calculation sequences or classification exercises.
- **Deck-specific:** applies only to the current chapter.
- **Correction:** fixes a typo, overlap, ordering problem, missing label, or other defect without changing the standard.

## Build and verification gates

Before approval:

1. Rebuild from the maintained lesson content module.
2. Run the lesson-specific deck validator.
3. Run `python3 scripts/validate-public.py`.
4. Confirm every local image and SVG loads.
5. Inspect every slide for overflow, clipping, overlap, and type below 24px.
6. Confirm the expected hash and counter on every slide.
7. Test previous, next, keyboard, fullscreen, and speaker-note controls.
8. Check the browser console for warnings and errors.
9. Verify numerical accuracy and source-slide coverage.
10. Confirm no private, instructor-only, proprietary, or licensed source material entered the public deck.

After instructor approval:

1. Generate the normal course-map filename `bus311-<track>-m##-l##-slides.html`.
2. Retain any temporary pilot filename only as a synchronized compatibility alias.
3. Confirm `course-map.json` points to the approved filename.
4. Rebuild `index.html` with `scripts/build-index.mjs`.
5. Rerun deck and public validation.
6. Do not commit, push, or publish without explicit instructor authorization.

## Pilot approval record

The course introduction and Chapter 1 pilot was approved on July 19, 2026. Its maintained source, builder, output, audit, and review log are listed in the repository `README.md`. Future BUS311 chapter conversions inherit this standard unless a later approved decision explicitly changes it.
