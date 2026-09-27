# BUS311 M05 Time Value of Money rebuild brief

## Delivery

- Course: BUS311 Corporate Finance · Valuation M05 L01 · 75-minute class
- Student deck: `02-VALUATION/M05/bus311-valuation-m05-l01-slides.html` (38 pages)
- Deck source: `scripts/decks/bus311-valuation-m05-l01-content.mjs`; the first three visual components are drawn from `bus311-valuation-m05-l01-components.mjs`
- Workbook source: `scripts/build-bus311-valuation-m05-workbooks.mjs`
- Student workbook: `02-VALUATION/M05/bus311-valuation-m05-l01-starter.xlsx`
- Private key source and workbook remain in the separate instructor repository.

## Source and scope

The attached 47-slide Chapter 5 PowerPoint supplies the topic map. The current M05 starter supplies the classroom case, all numerical inputs, cell locations, and Excel tasks. The PowerPoint is reference material only; its slides and media are not copied into the public repository. The hypothetical Berkshire equipment and preferred-share terms are labeled as teaching assumptions.

The Chapter 5 block includes rate conventions, FV, PV, annuity due, an integrated equipment choice, RATE, NPER, real versus nominal rates, and a level preferred-stock perpetuity. Project cash-flow evaluation is reserved for Chapter 8.

## Teaching flow

| Pages | Topic | Repeated sequence | Starter evidence |
|---|---|---|---|
| 1–3 | Decision frame and one timeline check | Scenario → timeline | `1 Timeline-Diagnose!B18:H20` |
| 4–7 | Rate conventions | Definition → Excel function → corporate use → Excel example | `1 Timeline-Diagnose!F8:F10` |
| 8–11 | Future value | Same four steps | `2 Build-Compare!H9` |
| 12–15 | Present value | Same four steps | `2 Build-Compare!H13`, round-trip H10 |
| 16–19 | Annuity due | Same four steps | `2 Build-Compare!H12`, timing audit H16:H18 |
| 20–21 | Integrated decision | Common-date comparison → sensitivity and checks | H14, B22:B24; `3 Sensitivity`; `4 Checks-Decision` |
| 22–25 | RATE | Four steps | `5 Rate-Applications!B13:B16` |
| 26–29 | NPER | Four steps | `5 Rate-Applications!B23:B24` |
| 30–33 | Real versus nominal | Four steps | `5 Rate-Applications!B31:B33` |
| 34–37 | Preferred-stock perpetuity | Four steps | `6 Preferred-Stock!B12:B20` |
| 38 | Decision-ready close | Explain number, date, and assumption | Written recommendation |

Worked results on example pages are hidden until the instructor selects **Reveal result**. The editable student workbook keeps those result cells blank. The private key contains corresponding completed formulas at the same addresses.

## Quantitative guardrails

- The given 9.6% is the company **valuation discount rate**, nominal annually with monthly compounding. The fixed financing terms imply their own approximately 4.20% nominal APR. The rate scenario in the sensitivity grid does not reprice the loan.
- The 24 beginning-of-month installments occur in Months 0–23; the $8,000 balloon is in Month 24.
- Cash FV is $96,859.62 in Month 24. Today-dollar financing cost is $69,085.37 for installments plus $6,607.50 for the balloon, or $75,692.87. It is $4,307.13 below the $80,000 cash cost under the stated valuation assumption.
- The reserve target is reached in the first whole Month 29 under 0.8% monthly growth. The real annual rate uses the 10.03% effective annual rate and 3% annual inflation. Preferred-share value requires a next-quarter first dividend and level payments forever.

## Local verification targets

Build from the maintained sources, run the lesson validator and the public and private repository validators, inspect saved workbook formulas and alignment, render both workbook versions, and check all pages and reveals in Chrome at 1920 × 1080. No commit, push, Canvas update, or publication is in scope.
