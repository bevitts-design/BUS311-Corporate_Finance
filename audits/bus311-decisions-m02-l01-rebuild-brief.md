# BUS311 chapter rebuild brief — Cost of Capital, WACC, and Company Valuation

## Lesson identity

- **Lesson ID:** `decisions-m02-l01`
- **Track / display module / lesson:** Firm Decisions / M13 / L01
- **Chapter or topic:** Chapter 13 — Cost of Capital, WACC, and Company Valuation
- **Course-map title:** Cost of Capital and WACC
- **Course outcomes:** LO5, LO6
- **Class period:** 75 minutes
- **Mode:** Presenter
- **Speaker notes:** Yes

## Source material

- **Source file:** `BUS311 Chapter 13.pptx`
- **Source slide count:** 26
- **Slide range:** All inspected; source slides 2 and 3 excluded from the public deck for privacy/link-verification reasons
- **Original source remains read-only:** Yes
- **Public-source boundary:** The PowerPoint, extracted media, roster, QR code, and rendered reference slides remain outside the repository

## Target

- **Maintained content module:** `scripts/decks/bus311-decisions-m02-l01-content.mjs`
- **Lesson CSS:** `03-FIRM-DECISIONS/M13/assets/deck.css`
- **Activity script:** `03-FIRM-DECISIONS/M13/assets/activities.js`
- **Builder:** `scripts/build-bus311-decisions-m02-l01.mjs`
- **Output:** `03-FIRM-DECISIONS/M13/bus311-decisions-m13-l01-slides.html`
- **Source inventory:** `audits/bus311-decisions-m02-l01-source-inventory.md`
- **Review log:** `audits/bus311-decisions-m02-l01-review-log.md`
- **Validator:** `scripts/validate-bus311-decisions-m02-l01.mjs`

## Content requirements

- **Concept sequence preserved:** opportunity cost; capital providers; debt, equity, and preferred component costs; tax shield; market-value weights; WACC; project-risk match; free cash flow; horizon value; enterprise-to-equity bridge
- **Examples preserved or clarified:** stable Target classroom assumptions replace unstable approximate Apple market claims; Coca-Cola appears only as a recognizable DDM-fit context
- **Dense content split:** source slides 7–23 are distributed across concept, setup, attempt, worksheet, reveal, interpretation, and sensitivity slides
- **Corrections:** unlevered FCF includes change in net working capital; the DCF outputs are recalculated precisely; company WACC is not treated as a universal project rate
- **Term-specific content removed:** no Spring 2026 or undated “current” market claims remain
- **Substantive speaker notes:** every slide includes timing or teaching guidance; activities include answer, rationale, likely misconception, and debrief question

## Graphical plan

- **Graphic-led slides:** capital rings, opportunity-cost lenses, capital balance, capital stack, WACC workflow, DDM decision fork, perpetuity stream, tax waterfall, contribution scale, market-value lenses, FCF waterfall, horizon timeline, enterprise-to-equity bridge, and value-composition bar
- **Excel-style visuals:** persistent Target WACC inputs in B4:B10, editable component table with formula bar, DCF worksheet with B3/B4 and C8:F8, and exact formula references
- **Interactive activities:** opening hurdle-rate prediction, tax-shield attempt, project-risk selection, horizon-value prediction, two-slider DCF sensitivity lab, public-workbook task, four-part audit selection, small-group defense, and exit ticket
- **Raster assets:** None; all instructional visuals are editable HTML/CSS/SVG
- **Accessibility:** meaningful diagrams use `role="img"` and descriptive `aria-label` text; controls use native buttons and range inputs with visible instructions

## Numerical teaching thread

- **Target classroom WACC assumptions:** equity value $7,000M; debt value $3,000M; beta 1.30; risk-free rate 4.0%; market-risk premium 5.0%; pretax debt YTM 5.8%; marginal tax rate 25%
- **Cost of equity:** `=B7+B6*B8` = 10.5%
- **After-tax debt cost:** 5.8% × (1 − 25%) = 4.35%
- **WACC:** `=SUMPRODUCT(C5:C6,D5:D6,E5:E6)` = 8.655%, displayed as 8.66%
- **Tax-shield example:** $90,000 × (1 − 21%) = $71,100; after-tax debt rate = 7.11%
- **DCF assumptions:** WACC 9.0%; horizon growth 3.0%; Year 1–4 FCF of $55.4M, $70.3M, $80.2M, and $83.2M
- **Horizon value:** $85.696M ÷ (9% − 3%) = $1,428.27M at Year 4
- **Enterprise value:** `=NPV($B$3,C8:F8)+F10/(1+$B$3)^4` = $1,242.69M
- **Equity bridge:** $1,242.69M − $200.00M debt = $1,042.69M equity value; ÷ 50M shares = $20.85 per share
- **Sensitivity endpoints:** $950.09M at 10% WACC / 2% growth; $1,826.40M at 8% WACC / 4% growth

## Classroom activity

- **Short checks:** missing-hurdle prediction, tax-shield calculation, same-risk project choice, horizon-value prediction, and model-audit selection
- **Interactive lab:** vary WACC and growth, then record the valuation range and assumption drivers
- **Workbook task:** use the existing public `bus311-decisions-m13-l01-starter.xlsx`; do not alter or expose a solution workbook
- **Required deliverables:** explicit calculations or selections, one formula/evidence audit, and a decision statement with risk or limitation
- **Private-only content:** no roster, private assessment, grading key, publisher solution workbook, or instructor-only answer file is added to the public repository

## Rights and privacy review

- **Personal or student information:** Source slide 2 omitted
- **Publisher or licensed material:** Original PowerPoint and extracted images remain outside the public repository
- **Proprietary platform captures:** None added
- **Company marks:** No copied logos are required
- **Public assets:** Newly authored HTML, CSS, SVG, and JavaScript only

## Approval gates

- [x] Every source slide inspected and inventoried
- [x] Maintained content, CSS, interactions, builder, and validator completed
- [x] Numerical examples independently verified
- [x] Source and rights boundary reviewed
- [x] Lesson validator passes in the canonical repository
- [x] Public validator result recorded; M13 checks pass and unrelated repository failures are documented in the review log
- [x] Browser navigation, notes, interaction, overflow, and console QA passes
- [ ] Instructor approval recorded
