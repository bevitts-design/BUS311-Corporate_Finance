# BUS311 chapter rebuild brief — Risk, Return, and Capital Budgeting

## Lesson identity

- **Lesson ID:** `decisions-m01-l01`
- **Track / display module / lesson:** Firm Decisions / M12 / L01
- **Chapter or topic:** Chapter 12 — Risk, Return, Beta, CAPM, and Project Hurdle Rates
- **Course-map title:** Risk, Return, and CAPM
- **Course outcome:** LO5
- **Class period:** 75 minutes
- **Mode:** Presenter
- **Speaker notes:** Yes

## Source material

- **Source file:** `BUS311_Ch12_RiskReturn Capital Budgeting.pptx`
- **Source slide count:** 22
- **Slide range:** All
- **Original source remains read-only:** Yes
- **Public-source boundary:** The PPTX and extracted media remain outside the repository

## Target

- **Maintained content module:** `scripts/decks/bus311-decisions-m01-l01-content.mjs`
- **Lesson CSS:** `03-FIRM-DECISIONS/M12/assets/deck.css`
- **Activity script:** `03-FIRM-DECISIONS/M12/assets/activities.js`
- **Builder:** `scripts/build-bus311-decisions-m01-l01.mjs`
- **Output:** `03-FIRM-DECISIONS/M12/bus311-decisions-m12-l01-slides.html`
- **Source inventory:** `audits/bus311-decisions-m01-l01-source-inventory.md`
- **Review log:** `audits/bus311-decisions-m01-l01-review-log.md`
- **Validator:** `scripts/validate-bus311-decisions-m01-l01.mjs`

## Content requirements

- **Concept sequence preserved:** Diversification limit; systematic and unsystematic risk; beta; portfolio beta; CAPM; Security Market Line; company versus project beta; comparable-company workflow; Excel application; WACC transition
- **Examples preserved or clarified:** Real-company context uses Boeing, Duke Energy, Apple, and Johnson & Johnson; all numeric betas and returns are explicitly classroom assumptions rather than current market claims
- **Dense content split:** Source slides 5–12 and 14–21 are distributed across setup, attempt, reveal, worksheet, interpretation, and decision slides
- **Corrections:** Beta is described as market co-movement rather than total volatility; the SML uses beta rather than standard deviation; above-line pricing language is conditional on the CAPM framework; fixed market inputs are identified as course assumptions
- **Term-specific content removed:** Spring 2026 label
- **Substantive speaker notes:** Every slide includes timing or teaching guidance; activities include answer, rationale, likely misconception, and debrief question

## Graphical plan

- **Graphic-led slides:** Editable risk flow, market-response comparison, regression scatterplot, beta continuum, CAPM layers, SML, project-beta decision comparison, and comparable-company workflow
- **Excel-style visuals:** Returns sheet with `SLOPE`, portfolio beta worksheet, CAPM Lab with real cell references, and formula-fill activity
- **Interactive activities:** Risk classification, beta sensitivity slider, SML placement, project-beta selection, and exit ticket
- **Raster assets:** None; source charts and template images were rebuilt as editable HTML/CSS/SVG
- **Accessibility:** Meaningful diagrams use `role="img"` and descriptive `aria-label` text; controls have visible instructions and keyboard-operable native elements

## Numerical teaching thread

- **Illustrative return observations:** Market returns of −8%, −4%, 0%, 4%, 8%, and 10%; Boeing returns of −11%, −5%, 1%, 7%, 13%, and 16%
- **Beta:** `=SLOPE(B3:B8,C3:C8)` = 1.50
- **Starter-workbook inputs:** Risk-free rate 4.0%, expected market return 10.0%, beta 1.25
- **CAPM:** `=B4+B6*(B5-B4)` = 11.5%
- **Sensitivity results:** β 0.80 → 8.8%; β 1.00 → 10.0%; β 1.25 → 11.5%; β 1.50 → 13.0%; β 1.80 → 14.8%
- **Portfolio beta:** 50% × 1.20 + 50% × 0.60 = 0.90
- **Project decision:** 11.0% illustrative IRR clears an 8.8% project-beta hurdle but not a 13.0% company-beta hurdle

## Classroom activity

- **Short checks:** Risk sort, market-response prediction, SML placement, and project-beta choice
- **Workbook task:** Complete CAPM cell B7 and scenario cells B11:B15 in the existing public starter workbook
- **Required deliverable:** Completed formulas, one formula audit, and a two-sentence recommendation
- **Private-only content:** No grading key, assessment key, or instructor-only workbook solution is added to the public repository

## Rights and privacy review

- **Personal or student information:** None
- **Publisher or licensed material:** Original PPTX remains outside the public repository
- **Proprietary platform captures:** None
- **Company marks:** Company names appear as editable text; no copied logos are included
- **Public assets:** Newly authored HTML, CSS, SVG, and JavaScript only

## Approval gates

- [x] Every source slide inspected and inventoried
- [x] Maintained content, CSS, interactions, builder, and validator completed
- [x] Numerical examples independently verified
- [x] Source and rights boundary reviewed
- [x] Lesson validator passes
- [x] Public validator passes
- [x] Browser navigation, notes, interaction, overflow, and console QA passes
- [ ] Instructor approval recorded
