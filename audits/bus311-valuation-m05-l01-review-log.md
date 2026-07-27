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
