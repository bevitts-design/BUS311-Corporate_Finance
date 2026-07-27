# BUS311 M13 review log

**Deck:** Cost of Capital, WACC, and Company Valuation  
**Source:** `BUS311 Chapter 13.pptx`, 26 source slides  
**Output:** `03-FIRM-DECISIONS/M13/bus311-decisions-m13-l01-slides.html`
**Review status:** Implementation and QA complete; instructor approval pending

| Topic | Decision | Classification | Disposition |
|---|---|---|---|
| Entire deck | Use the PowerPoint for content and sequence, and approved BUS311 HTML materials for design/runtime | Global standard | Implemented through maintained content, CSS, activity, builder, and runtime sources |
| Projected labels | Remove ornamental numeric labels | Global standard | Agenda, steps, cards, takeaways, and section tags use descriptive labels |
| Speaker notes | Keep notes teaching-only | Global standard | Notes contain timing, rationale, misconceptions, answers, and debrief prompts; production history stays in audits |
| Source privacy | Keep student names out of the public repository | Global boundary | Source slide 2 roster is documented and excluded |
| QR code | Do not publish an unverified destination | Correction | Source slide 3 is documented and excluded |
| Narrative | Make the lesson cumulative | Deck-specific | Rebuilt as capital providers → component returns → WACC → risk match → company valuation |
| Counterintuitive concepts | Require prediction before reveal | Pattern-level | Positive-return decision, tax shield, project-risk fit, and horizon sensitivity use setup/attempt/reveal arcs |
| Activities | State action, interaction, time, and deliverable | Global standard | Nine activity slides meet the four-part instruction rule |
| Quantitative thread | Introduce the relevant Excel function early | Pattern-level | `=SUMPRODUCT(C5:C6,D5:D6,E5:E6)` appears before the full formula sequence |
| Excel consistency | Reuse inputs and cell locations | Pattern-level | WACC input cells B4:B10 and DCF cells B3/B4/C8:F8 remain consistent across calculation and sensitivity slides |
| Numerical accuracy | Verify every result independently | Correction | Validator recomputes CAPM, after-tax debt, WACC, tax shield, horizon value, enterprise value, share price, composition, and sensitivity endpoints |
| Real-company context | Use recognizable businesses without unstable claims | Deck-specific | Target provides the business context; all numeric inputs are explicitly classroom assumptions |
| Company versus project risk | Make the decision consequence visible | Deck-specific | A 9.1% same-risk retail project can use 8.66% WACC; a lending venture requires a different hurdle |
| Free cash flow | Keep numerator and discount rate consistent | Correction | Unlevered FCF includes ΔNWC and excludes interest before discounting at WACC |
| Source DCF arithmetic | Correct rounded/inconsistent totals | Correction | Recomputed enterprise value is $1,242.69M and implied price is $20.85 under the stated assumptions |
| Rights and privacy | Keep source PowerPoint and extracted media out of the public repository | Global boundary | No source media, student data, copied logos, proprietary screens, or workbook solutions are added |

## Verification record

- Builder generates 37 presenter slides with one substantive teaching note per slide.
- Lesson validator passes source coverage, 24px type floor, activity completeness, notes discipline, runtime features, accessible diagrams, privacy exclusions, and all financial calculations.
- Repository-wide validation recognizes M13 and reports no M13 deck failure. Remaining failures belong to legacy M03/M07 decks and pre-existing workbook filename/privacy warnings elsewhere in the checkout.
- Browser QA inspected all 37 hashes at 1920×1080 and 1366×768 with no boundary or material content overflow.
- Browser interaction checks passed for the project-risk choice, both DCF sensitivity endpoints, the four-part audit activity, speaker-note toggle, bidirectional keyboard navigation, fullscreen control label transitions, and URL hashes.
- Browser console review reported zero warnings or errors after the interaction pass. Font loading was allowed to settle before visual judgments.
- The standalone Playwright CLI wrapper could not run because `npx` is not installed; equivalent checks were completed with the supported in-app browser-control API.
- The existing public starter workbook is intentionally preserved unchanged.
- Instructor feedback and approval remain pending; future comments should be classified as global, pattern-level, deck-specific, or correction.
