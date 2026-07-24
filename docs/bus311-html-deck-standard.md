# BUS311 editable HTML deck standard

**Status:** Approved
**Pilot approved:** July 19, 2026
**Approved reference deck:** `01-INTRO/M01/bus311-intro-m01-l01-slides.html`
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
- Make that message explicit in the headline and visual. A student should not need production context or a long verbal rescue to understand what the slide is trying to teach.
- Prefer one or two strong visual chunks; use three only when the relationship requires it.
- Replace long card rows and bullet collections with a meaningful visual system.
- Vary slide silhouettes across the deck. Repeated three-card grids read as dull even when the content is correct; alternate among image-led scenes, worksheets, diagrams, timelines, decision comparisons, scaled values, and sparse statement slides.
- Use editable orbits for connected concepts.
- Use ordered paths, timelines, or distinct shapes for sequences.
- Use arrows when direction, dependency, movement, or cash flow matters.
- Use buckets or columns for classification exercises and answer reveals.
- Use a hub-and-spoke, wheel, hierarchy, or branch only when it clarifies a real relationship.
- Use process infographics for course maps and multi-stage analytical workflows.
- Avoid decorative question marks, unexplained production labels, or shapes that do not carry meaning.
- Enlarge pills, circles, hubs, and panels when the wording needs more room.
- Ensure every graphical element has sufficient contrast and an accessible text alternative or ARIA label.

### Preferred classroom experience

- Build toward insight rather than displaying conclusions in isolation. Use a setup, prediction, calculation, or sorting prompt before a reveal when the answer is meant to surprise students.
- Give students enough information to reason independently. A reveal slide should feel earned and should explicitly debrief the preceding task.
- Treat source material as content evidence, not a layout mandate. When a source slide is unclear, determine the correct teaching message from the surrounding chapter content and rebuild the slide around that message.
- Use real companies, recognizable situations, and purposeful visuals. Add rights-safe local company logos when they improve recognition and visual appeal; do not use logos as filler.
- Prefer visual explanation over ornamental decoration. Arrows, axes, scale, position, cell highlighting, and sequencing should carry meaning.
- Keep the tone professional and energetic: bold hierarchy, strong contrast, generous scale, and useful color. Avoid both corporate-template blandness and excessive decorative effects.

### Numeric-label discipline

- Do not use ornamental numeric labels such as `01`, `02`, or `03` as card headers, agenda markers, takeaway labels, or section tags.
- Use descriptive labels that communicate the concept, stage, action, or decision.
- Keep numbers when they are meaningful instructional or financial content, dates or years, formulas, slide navigation, or course/module identity.
- Numbering may appear in a true instructional sequence only when the order itself is part of the lesson; it must not function as decoration.

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
- Introduce the relevant Excel function early so a complex equation feels manageable rather than intimidating.
- Prefer an editable Excel-style worksheet with the formula bar, visible row and column headings, real cell references, highlighted input and result cells, and the correct answer.
- Reuse the same worksheet inputs and cell locations across related NPV, IRR, sensitivity, or comparison slides so students see one model evolving.
- Keep Year 0, timing, signs, and range selection visually explicit. Show the exact formula students should enter.
- Do not require a manual calculation beside every Excel example. Include manual arithmetic only when it clarifies the finance concept, exposes a common error, or helps students interpret the function.

### Classroom participation

- Place explicit partner or group instructions on the exercise slide.
- Tell students exactly what they are deciding, sorting, calculating, or defending.
- State how to interact with the slide, how long students have, and what evidence they must produce before checking or revealing the answer.
- Give the activity before the answer slide.
- Use setup → attempt → reveal as the default arc for counterintuitive comparisons, metric conflicts, and worked decisions.
- For formative in-deck activities, put the correct classification, calculation, or decision and its teaching rationale in speaker notes. This is facilitator guidance, not permission to expose private assessment, workbook-solution, or grading keys.
- When the activity checks answers interactively, make selection state and the correct answer visually unmistakable after checking.
- When an outcome belongs to more than one category, show a distinct `Both` category after the primary categories.

### Instructor and orientation content

- Use `Professor Bethany Evitts` on the instructor profile slide.
- Keep the full teaching-philosophy quotation on its own image-led slide.
- Prefer `What you will learn` over construction-oriented language such as `What you will build` when describing course learning.
- Show grade weights with percentage signs and a visible 100% total.
- Do not carry deck-specific orientation slides into later chapters unless they serve that lesson.

## Source notes, citations, and projected content

- Projected slides should not show internal production notes, licensing explanations, or comments such as `editable SVG`.
- Speaker notes are the instructor's teaching script. Do not use them to document source-slide mapping, original-deck or PPTX provenance, carryover decisions, rebuild choices, rights decisions, or production commentary.
- Speaker notes for activities should include the exact answer, why it is correct, likely misconceptions, timing, and the question used to debrief. Useful teaching keys belong here; production history does not.
- Keep source caveats, rights decisions, source mapping, original-deck provenance, and undated-claim warnings in the source inventory, audit, or review log.
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
11. Confirm projected slide content contains no ornamental numeric labels.
12. Confirm speaker notes contain teaching guidance only and no original-deck sourcing, carryover, or rebuild documentation.
13. Confirm every activity states the action, timing, and expected deliverable, with its formative answer and rationale in speaker notes.
14. Confirm every surprising reveal has a preceding setup or student task and explicitly debriefs it.
15. Confirm financial calculation sequences use consistent inputs and show the actual Excel function and cell references before relying on manual arithmetic.
16. Inspect the deck as a sequence for visual variety; repeated card grids must be replaced where a worksheet, diagram, image, timeline, or scaled comparison teaches better.

After instructor approval:

1. Generate the normal course-map filename `bus311-<track>-m##-l##-slides.html`.
2. Retain any temporary pilot filename only as a synchronized compatibility alias.
3. Confirm `course-map.json` points to the approved filename.
4. Rebuild `index.html` with `scripts/build-index.mjs`.
5. Rerun deck and public validation.
6. Do not commit, push, or publish without explicit instructor authorization.

## Pilot approval record

The course introduction and Chapter 1 pilot was approved on July 19, 2026. Its maintained source, builder, output, audit, and review log are listed in the repository `README.md`. Future BUS311 chapter conversions inherit this standard unless a later approved decision explicitly changes it.
