# BUS311 chapter rebuild brief — Corporate Financing, Equity Accounts, and Control

## Lesson identity

- **Lesson ID:** `decisions-m03-l01`
- **Track / display module / lesson:** Firm Decisions / M14 / L01
- **Chapter or topic:** Chapter 14 — Corporate Financing
- **Course-map title:** Capital Structure and Financing Decisions
- **Course outcomes:** LO5, LO6
- **Class period:** 75 minutes
- **Mode:** Presenter
- **Speaker notes:** Yes

## Source material

- **Source file:** `BUS311 -Chp14 Corp Finance All Together.pptx`
- **Source slide count:** 20
- **Slide range:** All slides inspected
- **Original source remains read-only:** Yes
- **Public-source boundary:** The PowerPoint, rendered references, template media, and proprietary FactSet screenshots remain outside the repository

## Target

- **Maintained content module:** `scripts/decks/bus311-decisions-m03-l01-content.mjs`
- **Lesson CSS:** `03-FIRM-DECISIONS/M14/assets/deck.css`
- **Activity script:** `03-FIRM-DECISIONS/M14/assets/activities.js`
- **Builder:** `scripts/build-bus311-decisions-m03-l01.mjs`
- **Output:** `03-FIRM-DECISIONS/M14/bus311-decisions-m03-l01-slides.html`
- **Source inventory:** `audits/bus311-decisions-m03-l01-source-inventory.md`
- **Review log:** `audits/bus311-decisions-m03-l01-review-log.md`
- **Validator:** `scripts/validate-bus311-decisions-m03-l01.mjs`

## Content requirements

- **Concept sequence preserved:** internal and external funding; pecking order; shareholders’ equity accounts; authorized, issued, treasury, and outstanding shares; majority and cumulative voting; dual-class governance; common, preferred, and debt claims; debt-feature effects on yield
- **Examples preserved or corrected:** Apple FY2024 equity is rebuilt from Apple’s filed balance sheet; Alphabet’s voting structure is rebuilt from the 2025 proxy; Alphabet’s June 2026 financing becomes a licensed FactSet investigation; Delta provides the opening financing-decision frame; Bank of America preferred issuance informs the real-security context
- **Dense content split:** source slides 5–6, 8–13, 15–16, and 18–19 become setup, attempt, calculation, reveal, and interpretation sequences
- **Corrections:** Apple does not receive a fabricated separate treasury-stock line; APIC is not stated as a standalone Apple balance; negative accumulated deficit is separated from current profitability; the preferred dividends-received deduction is stated with eligibility limits; Apple is not described as a preferred-stock issuer
- **Term-specific content removed:** no Spring 2026 label enters the reusable deck
- **Substantive speaker notes:** every slide includes teaching guidance or timing; each activity includes answer, rationale, misconception, and debrief

## Graphical plan

- **Graphic-led slides:** capital stack, Delta financing runway, lesson river, outcome orbit, pecking path, signal tension, equity-account map, distribution balance, share funnel, voting seats, Alphabet class architecture, FactSet workflow, causality board, yield arrow, hybrid bridge, risk-transfer map, and final answer dashboard
- **Excel-style visuals:** Apple equity reconciliation with `=SUM(B5:B7)`; cumulative-voting threshold with `=INT(B4/(B5+1))+1`; preferred-versus-debt after-tax comparison with cell references
- **Interactive activities:** pecking-order choice, equity-issuance signal challenge, buyback directions, cumulative-voting calculator, Alphabet issuance prediction, FactSet transaction reconstruction, matched-period comparison, analyst verdict, debt-feature classification, and workbook lab
- **Raster assets:** None; all public instructional visuals are editable HTML and CSS
- **Accessibility:** meaningful diagrams use `role="img"` and descriptive `aria-label`; controls use native buttons, inputs, outputs, and visible instructions

## Numerical teaching thread

- **Apple FY2024 filed values:** common stock and APIC $83.276B; accumulated deficit $(19.154)B; accumulated other comprehensive loss $(7.172)B; total shareholders’ equity $56.950B
- **Apple FY2024 distribution comparison:** dividends $15.234B plus common-stock repurchases $94.949B = $110.183B versus net income of $93.736B
- **Cumulative-voting threshold:** `INT(1,000 / (3 + 1)) + 1 = 251` shares, or 25.1%, to guarantee one of three seats
- **Preferred after-tax yield:** 6.00% × `[1 − 21% × (1 − 50%)]` = 5.37% for the simplified eligible corporate-investor case
- **Bond after-tax yield:** 5.50% × `(1 − 21%)` = 4.345%, displayed as 4.35%
- **Alphabet completed net equity proceeds:** $30.499B common plus $19.063B mandatory convertible preferred = $49.562B; no sales under the $40B ATM program by June 30
- **Alphabet Q2 common-share effect:** 12.116B to 12.230B common shares, with 114M shares issued during Q2; common stock and APIC rose from $96.902B to $131.371B
- **Alphabet contemporaneous changes:** total equity $478.746B to $640.480B from March 31 to June 30; cash and marketable securities $126.843B to $242.474B and long-term debt $46.547B to $98.165B from December 31 to June 30
- **Alphabet event window:** GOOGL unadjusted close $380.34 on May 29 to $368.53 on June 5 = −3.1%
- **Delta opening evidence:** expected 2026 capital spending about $5.5B frames the initial financing question without prescribing the answer

## Classroom activity

- **Partner work:** pecking-order prediction, buyback-direction check, cumulative-voting calculation, and security-feature classification
- **Workbook task:** use the existing public `BUS311_Ch14_EquityAccounts_Student.xlsx`; do not alter or expose a completed workbook or grading key
- **Licensed FactSet task:** reconstruct Alphabet’s completed financing, compare matched periods, classify causality, and submit a three-sentence analyst verdict supported by two values
- **Answer placement:** the correct formative answers appear only on the final slide, after the student verdict
- **Private-only content:** no private assessment, completed workbook, grading key, publisher solution material, or proprietary platform capture is added

## Rights and privacy review

- **Personal or student information:** None found in the source deck
- **Publisher or licensed material:** Original PowerPoint and source template art remain outside the public repository
- **Proprietary platform captures:** FactSet screens on source slides 9, 10, and 12 are documented but excluded; the new activity uses original HTML/CSS instructions and students’ licensed sessions rather than a repository capture
- **Company marks:** No copied logos are required
- **Public assets:** Newly authored HTML, CSS, and JavaScript only

## Approval gates

- [x] Every source slide inspected and inventoried
- [x] Maintained content, CSS, interactions, builder, and validator completed
- [x] Numerical examples independently verified
- [x] Source and rights boundary reviewed
- [x] Lesson validator passes in the canonical repository
- [x] Public validator result recorded
- [x] Browser navigation, notes, interaction, overflow, and console QA passes
- [ ] Instructor approval recorded
