# BUS311 M12 review log

**Deck:** Risk, Return, and Capital Budgeting  
**Source:** `BUS311_Ch12_RiskReturn Capital Budgeting.pptx`, 22 source slides  
**Output:** `03-FIRM-DECISIONS/M12/bus311-decisions-m12-l01-slides.html`
**Review status:** Implementation and QA complete; instructor approval pending

| Topic | Decision | Classification | Disposition |
|---|---|---|---|
| Entire deck | Use the PowerPoint for content and sequence, and approved BUS311 HTML materials for design/runtime | Global standard | Implemented through the maintained deck-stage runtime and M12 sources |
| Projected labels | Remove ornamental numeric labels | Global standard | No decorative agenda, card, section, or takeaway numbers appear |
| Speaker notes | Keep notes teaching-only | Global standard | Notes contain timing, rationale, misconceptions, answers, and debrief prompts; production history stays in audits |
| Narrative | Make the lesson cumulative | Deck-specific | Rebuilt as diversification → beta → CAPM → project hurdle rate |
| Counterintuitive concepts | Require prediction before reveal | Pattern-level | Risk pricing, beta response, SML placement, and project beta all use setup/attempt/reveal sequences |
| Activities | State action, interaction, time, and deliverable | Global standard | Five explicit interactive activity slides meet the four-part instruction rule |
| Quantitative thread | Introduce the Excel function early | Pattern-level | `=SLOPE(B3:B8,C3:C8)` appears before covariance arithmetic; CAPM uses public starter-workbook cells |
| Excel consistency | Reuse inputs and cell locations | Pattern-level | B4/B5/B6/B7 and A11:B15 remain consistent across calculation, sensitivity, and activity slides |
| Numerical accuracy | Verify every result independently | Correction | Validator recomputes beta, CAPM sensitivity, portfolio beta, SML values, and project decision flip |
| Real-company context | Use recognizable companies without unstable claims | Deck-specific | Boeing, Duke Energy, Apple, and Johnson & Johnson are used with explicitly illustrative inputs |
| Company versus project beta | Make the decision consequence visible | Deck-specific | Boeing scenario shows how 8.8% versus 13.0% hurdles reverse an 11.0% IRR decision |
| Source charts | Avoid unreadable raster data | Correction | SML and market-risk-premium visuals rebuilt as editable SVG/HTML |
| Rights and privacy | Keep source PPTX and extracted media out of the public repository | Global boundary | No source media, proprietary screens, student data, answer keys, or private grading artifacts added |
| Term language | Remove Spring 2026 from reusable lesson | Term correction | No term-specific date remains in projected content |

## Verification record

- Builder generates 32 presenter slides with one substantive teaching note per slide.
- Lesson validator checks 22/22 source coverage, 24px type floor, activity completeness, notes discipline, runtime features, accessible diagrams, and all financial calculations.
- Public validation checks the repository boundary and course-map material paths.
- Browser QA inspected all 32 slide hashes at 1920×1080 and 1366×768 with no viewport overflow; representative layouts, speaker notes, next/previous navigation, and all interactive patterns were exercised.
- The browser console reported zero warnings or errors after the interaction pass.
- Repository-wide public validation reports no M12 deck failure. Remaining failures belong to legacy M03/M07 decks and pre-existing instructor/solution files physically present elsewhere in the checkout.
- Instructor feedback and approval remain pending; future comments should be classified as global, pattern-level, deck-specific, or correction.
