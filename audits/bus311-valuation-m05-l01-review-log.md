# BUS311 M05 review log

## July 27, 2026 rebuild requirements

| Classification | Request | Disposition |
|---|---|---|
| Global standard | Use the approved BUS311 runtime, branding, 1920×1080 canvas, 24px text floor, hashes, navigation, fullscreen, notes, and accessibility conventions | Applied through the shared inlined runtime and M05 stylesheet |
| Global standard | Avoid ornamental numeric labels and production commentary in projected content or speaker notes | Enforced in content and the lesson validator |
| Pattern-level | Use setup/prediction → student attempt → reveal for counterintuitive concepts | Applied to the opening cash-choice threshold and annuity-timing comparison |
| Pattern-level | State activity directions, timing, interaction, and deliverable | Applied to sign, rate-period, FV build, sensitivity, annuity, pattern, and exit activities |
| Pattern-level | Introduce the relevant Excel function early and use a consistent editable worksheet | `FV` appears on slide 12; cells B4:B10 persist through build, reveal, and sensitivity |
| Pattern-level | Put formative answers, rationales, misconceptions, timing, and debrief guidance in notes | Included in substantive notes for all 35 slides |
| Deck-specific | Preserve substantive Time Value of Money content from the supplied 27-slide deck | All source slides mapped in the source inventory and `data-source-slides` metadata |
| Deck-specific | Use real companies and securities rather than generic placeholders | Berkshire Hathaway and an Apple note context are used as labeled teaching examples |
| Correction | Replace screenshot-based calculations and generic concept cards with editable instructional visuals | Rebuilt as worksheet views, timelines, a sensitivity chart, cash-flow patterns, and decision graphics |
| Correction | Preserve native keyboard control of sliders and other form inputs | Shared deck runtime now ignores navigation keys when an interactive control has focus |

## Verification record

- Lesson build: PASS, 35 slides generated from the maintained content module.
- Lesson validator: PASS, 35/35 substantive notes, all 27 source slides represented, five interactive systems present, accessibility markers present, and all financial calculations independently checked.
- Repository public validator: the M05 deck passes every applicable check after adding its editable-deck contract. The validator still reports unrelated existing failures in the M03 FactSet deck and M07 equity-valuation deck.
- Browser QA at 1920×1080: all 35 slides passed the boundary and scroll sweep. The first pass exposed a clipped worksheet result row and an off-chart seven-year sensitivity curve; both were corrected and rechecked.
- Browser QA at 1366×768: the 1920×1080 stage scaled to the smaller viewport without body overflow. The worksheet, notes overlay, and pattern activity remained readable and usable.
- Interactions: sign diagnosis, rate-period matching, sensitivity threshold, three-scenario pattern classification, and exit-ticket selection produced the expected feedback. The shared runtime was corrected so focused form controls retain native navigation keys.
- Presenter/runtime: direct hashes, previous/next controls, slide counter, notes toggle, and fullscreen-label state were checked. Browser console warnings and errors: none.

## September 27, 2026 starter-workbook alignment

| Classification | Request | Disposition |
|---|---|---|
| Deck-specific | Make the HTML lesson prepare students for the actual M05 starter | Added the equipment financing decision, real tab and cell map, rate and formula diagnosis, split-stream PV, common-date comparison, copied sensitivity grid, and check-to-decision sequence |
| Deck-specific | Assume basic TVM and review timelines once | Consolidated the stand-alone timeline, compounding, and discounting review into one starter-timing checkpoint; later visuals refer back to it |
| Deck-specific | Maintain Excel formulas and examples | Retained the existing FV, PV, APR/EAR, annuity, perpetuity, and FV-sensitivity examples and their Excel function syntax |
| Public/private boundary | Help students complete the starter without publishing its filled answer key | New slides show cell locations, function patterns, and audit questions; completed starter outputs stay out of the deck |

The revised lesson is paced to 75 minutes across 40 slides. The starter workbook itself is unchanged.

### Verification

- Rebuilt the generated HTML from the maintained content, stylesheet, activity script, and shared runtime: 40 slides and 40 teaching notes.
- M05 lesson validator: PASS; original financial examples and all 27 source-slide references retained.
- Public repository validator: PASS (11 lessons, 6 outcomes).
- Chrome review: all 40 direct slide hashes opened at 1920 × 1080 with no slide scroll overflow or page errors; selected new slides also checked at 1366 × 768. The revised exit interaction returned the workbook decision prompt.
- The student starter workbook was not edited. This revision is local to the checkout; no commit, push, Canvas change, or publication was performed.

## September 27, 2026 opening scenario clarification

Slide 2 now briefs the hypothetical equipment purchase, both payment paths, the quoted financing rate, and the decision students will build in the start activity. It gives no workbook cell references. The maintained content and stylesheet were rebuilt into the student-facing HTML; the starter workbook and worked Excel examples were unchanged.

### Verification

- M05 lesson validator: PASS, including a focused check that slide 2 has the case terms and no worksheet cell references.
- Public repository validator: PASS (11 lessons, 6 outcomes) after making its unmodeled-file scan consistently ignore Excel temporary lock files. The open starter workbook was not changed.
- Chrome inspection: slide 2 rendered at 1920 × 1080 and 1366 × 768 with no slide overflow or page errors; both screenshots were reviewed.
- Git whitespace check: PASS. This revision remains local to the canonical checkout; no commit, push, Canvas change, or publication was performed.

## September 27, 2026 slide removal and starter calculation alignment

The former deck slides 3–7 were removed from the maintained content. The timeline checkpoint is now slide 3, followed by the Excel build. The seven removed minutes were assigned to workbook work launched from slide 2, keeping the teaching plan at 75 minutes across 35 slides.

The unrelated five-year FV/PV, annual lease, and perpetuity dollar examples were replaced by the starter’s monthly rate, cash-option FV/PV check, beginning-payment PV, balloon PV, and financing sensitivity structure. The APR and EAR, FV and PV, annuity-due, and perpetuity function teaching remains. The sensitivity chart and slider use a separate $3,400 practice payment, outside the starter grid. The starter workbook and its answer cells were not edited.

### Verification

- Rebuilt the generated HTML from the maintained content, stylesheet, activity script, and shared runtime: 35 slides and 35 substantive teaching notes.
- M05 lesson validator: PASS; retained source IDs 1–2 and 5–27, five interactive controls, starter-aligned formulas, and independent financial checks verified.
- Public repository validator: PASS (11 lessons, 6 outcomes). Its M05 contract now checks the revised starter evidence and Excel examples.
- Chrome review: all 35 direct slide hashes opened at 1920 × 1080 with no slide overflow or page errors. Selected slides were visually reviewed at 1366 × 768. Sign, rate, financing-PV slider, pattern, and exit interactions returned the expected feedback.
- The practice slider displayed $79,250.32 at 12% nominal APR; the corrected chart labels align the $80,000 benchmark with the $80k axis tick.
- Read-only workbook inspection confirmed the given assumptions, function rows, and sensitivity headers used in the slides. The student starter was not edited; Git reports no workbook diff. Git whitespace check: PASS.
- This revision is local to the canonical checkout; no commit, push, Canvas change, or publication was performed.

## September 27, 2026 full teaching-block and workbook update

The M05 lesson now has 38 slides. After the equipment scenario and one timeline check, eight topics each use the same order: definition, Excel function or formula, corporate use, and an example tied to the saved M05 starter. The topics are rate conventions, FV, PV, annuity due, RATE, NPER, real versus nominal rates, and a preferred-stock perpetuity. The integrated equipment choice and sensitivity checks remain between the base TVM blocks and later applications. Project cash-flow evaluation is reserved for Chapter 8.

The starter gained `5 Rate-Applications` and `6 Preferred-Stock`. The private workbook has worked formulas in the corresponding cells, and its builder writes identical copies under the M05 display filename and the internal course-map lesson-ID filename. The instructor teaching key was updated to the current public paths, exercise, formulas, and 75-minute run of show. The 9.6% rate is now labeled as the company's valuation discount-rate assumption; the fixed financing terms imply a separate approximately 4.20% nominal APR.

### Verification

- Maintained deck build and M05 lesson validator: PASS, 38 slides, eight ordered teaching blocks, eight result reveals, 38 substantive notes, independent financial checks.
- Chrome at 1920 × 1080: all 38 pages fit without overflow or page errors. All eight result reveals opened, stayed within the canvas, and updated the button's accessibility state.
- Artifact-tool workbook renders: student and instructor new tabs and the starter overview were visually inspected. Saved-workbook inspection found matching shared sheet names, dimensions, labels, merged cells, and formula/response addresses across all seven sheets. Student answer cells remain blank; private key formulas have calculated results; neither saved workbook contains Excel formula errors. The two private key filenames are byte-identical.
- Public repository validator: PASS (11 lessons, 6 outcomes). Private coverage validator: PASS (11 teaching keys). `git diff --check`: PASS in both checkouts.
- All changes remain local. No commit, push, Canvas update, OneDrive change, or publication was performed.
