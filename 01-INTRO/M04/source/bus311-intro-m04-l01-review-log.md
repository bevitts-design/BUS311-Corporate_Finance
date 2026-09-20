# BUS311 M04 review log

## August 6, 2026 — comprehensive standards rebuild

- Replaced obsolete M02/L02 browser and title-slide identity with M04.
- Removed the slide-one `Original BUS311 course artwork` production note.
- Rebuilt the generic 27-slide output as a dedicated 22-slide, 75-minute Presenter lesson with speaker-note parity.
- Replaced ornamental numeric labels and repeated concept-card layouts with editable diagrams, an Excel worksheet, a DuPont model, a peer matrix, current-company evidence, and three setup/attempt/reveal activity arcs.
- Added current, official-source examples from recent IPOs and AI-linked companies without using live market-price claims.
- Kept the class exercise unnamed in the public HTML while using it to shape the calculation and recommendation sequence.
- Added a dedicated builder and validator; protected the approved public output from the generic bulk lesson generator.

## Verification record

- Focused M04 validator: PASS (22 slides, 75 minutes, 22 substantive notes, current-company evidence, four response systems, and independently verified ratio/DuPont calculations).
- Full-slide browser inspection: PASS at 1920×1080 and 1366×768 after correcting the peer-matrix grid placement on slide 15; no overflow or document scrolling remained.
- Browser behavior: PASS for keyboard/button navigation, speaker-note toggle, choice checks, DuPont sensitivity controls, exit response, browser title, and slide-one identity/content.
- Public validator: M04 has no remaining findings. The repository-wide run still reports pre-existing findings in M03 and M07; those files were not changed.
- Scope check: generated HTML contains no obsolete M02/L02 labels, no `original artwork` note, and no reference to the unnamed exercise inspiration.

## September 20, 2026 — focused instructor revisions

- Deck-specific: removed projected timing labels from slide 2; retained instructor pacing in notes.
- Deck-specific: removed the LO2 / LO3 header codes from slide 3.
- Deck-specific: added comparable FY2025 GAAP net margins on slide 6, company-specific drivers, and links to official annual results.
- Calculation evidence (USD millions): Figma -1,250.463 / 1,055.788 = -118.4%; Reddit 530 / 2,203 = 24.1%; CoreWeave -1,167 / 5,131 = -22.7%. Rounded to one decimal; all use net income, not income attributable to common stockholders.
- Official results verified September 20, 2026; sources are linked on slide 6. Net margin avoids treating differently classified infrastructure costs as comparable gross margins.

## September 20, 2026 — approved teaching-sequence revision

- Implemented the recommended order using prior slide numbers: 1, 2, 3, 4, 5, 7, 8, 9, 10, new gross/net bridge, 11, 18, 6, 14, 12, 13, 15, new coverage bridge, 19, 16, 17, 20, 21, 22.
- Kept the original classroom example together; added the missing equity inputs to its activity screen.
- Distinguished the route from success criteria, placed DuPont practice immediately after explanation, and grouped company examples from simpler profitability to accounting effects to financing complexity.
- Added gross/net-margin and coverage prerequisites, consistent margin rounding across company screens, and a precise 40.0% starting DuPont model with reset.
- Added a hypothetical equipment-rental business context; guided diagnosis asks for one priority and reason, independent practice returns to the original dashboard, and the individual exit check tests driver attribution.
- Kept student attempts before answer reveals and retained a total of 75 minutes across 24 slides.

### Sequence revision verification

- Focused validator: PASS, 24 slides and 24 notes, 75-minute pacing, gross/net reconciliation, coverage arithmetic, sequence prerequisites, and exact initial DuPont calculation.
- Browser: all 24 slides checked at 1920×1080 and 1366×768; no slide overflow, off-slide content, or JavaScript errors. Full-slide captures visually inspected.
- Interaction checks: navigation buttons and keyboard, speaker notes, native slider keyboard behavior, both guided choice checks, exit feedback, and DuPont reset passed. Starting ROE 40.0%; changing margin to 12% gives 48.0%; reset returns 40.0%.
- Full public validator: all deck checks pass; sole remaining finding is the temporary Excel owner file `01-INTRO/M04/~$bus311-intro-m04-l01-starter.xlsx`. Workbook and lock file were left untouched.
- `git diff --check`: PASS. Local changes only; no commit, push, publication, or Canvas change.

## September 20, 2026 — exercise alignment and deferred Lemonade

- Added Class Practice to the paired starter/key with the same inputs and cell references used by the slides. After-class work uses eight core ratios per retailer, including interest coverage; remaining ratios are optional.
- Clarified illustrative reference values, supplied data, expense assumptions, and recommendation requirements. Overall completion now includes both firms' DuPont checks and requires the core calculations, driver explanation, and recommendation.
- Reserved Lemonade for later without assigning a date. Corrected forecast labels, separated base-input readiness from later sensitivity, retained valid zero growth, and staged interpretation prompts before valuation. Updated both workbook pairs, lesson metadata/pages, pre-reading, guide/PDF, and private teaching notes.
- Saved-file verification: shared student/key sheets match labels, dimensions, merged cells, and answer addresses; private worked answers remain separate. Functional recalculation tests passed for required completion, optional blanks, Urban reconciliation failure, coverage, expense savings, base forecast balance, blank downside, zero growth, and equal-growth scenarios. No cached formula errors in student outputs.
- Browser check: 24 slides at 1920×1080 and 1366×768, no overflow or JavaScript errors; navigation, notes, sliders/reset, guided checks, and exit feedback passed. Guide PDF rendered and visually checked. Native Microsoft Excel execution was not tested.
- The shared-layout workbook update source is maintained in the private repository at scripts/update-bus311-m04-workbooks.mjs; generic workbook normalization excludes M04. Changes remain local and unpublished.

## September 20, 2026 — DuPont derivation

- Replaced the single DuPont introduction with slides 11–12: progressive factor calculations from Class Practice, then color-matched cancellation of revenue and average assets. Both anchor to E9 and reconcile to 40% ROE.
- Net margin is labeled profitability; the new equity multiplier is distinguished from previously calculated asset turnover. Slide 13 applies the identity through the sliders.
- Preserved 75 minutes across 25 slides by splitting the former five-minute explanation into three and two minutes. Updated instructor slide references.
- Focused deck validator passed. Browser checks covered all 25 slides at 1920×1080 and 1366×768, every reveal stage and reset, and existing interactive activities; no overflow or JavaScript errors. Fully revealed slides visually inspected. Full public validation is blocked only by the Excel temporary owner file for the starter workbook; it was preserved. Local only, unpublished.
