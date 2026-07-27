# BUS311 M06 bond valuation rebuild brief

## Delivery

- Course: BUS311 Corporate Finance
- Display module: M06
- Lesson: L01
- Class length: 75 minutes
- Mode: Presenter mode with substantive teaching notes
- Maintained output: `02-VALUATION/M06/bus311-valuation-m06-l01-slides.html`
- Maintained content: `scripts/decks/bus311-valuation-m06-l01-content.mjs`
- Maintained styles and behavior: `02-VALUATION/M06/assets/deck.css` and `activities.js`
- Builder: `scripts/build-bus311-valuation-m06-l01.mjs`
- Validator: `scripts/validate-bus311-valuation-m06-l01.mjs`

## Source decision

The supplied `M06/index.html` is a generated lesson landing page rather than a slide deck. The adjacent 28-slide HTML presentation linked by `course-map.json` is the complete source for content and sequence. It is used as evidence only; the approved BUS311 standard controls design, runtime, teaching patterns, notes, and verification.

## Teaching architecture

| Segment | Minutes | Teaching move | Student evidence |
|---|---:|---|---|
| Opening prediction and contract | 10 | Predict premium/par/discount; map issuer and investor signs | Coupon-versus-YTM rule |
| Cash-flow map and Excel PV | 15 | Show every payment; build persistent B3:B12 worksheet | Audited price model |
| Price, yield, and sensitivity | 20 | Attempt → reveal; vary YTM; reverse with RATE | Price class and YTM explanation |
| Duration and credit spread | 12 | Compare cash-flow timing; apply a downgrade shock | Rate-risk and credit-risk distinction |
| Meridian CFO decision | 13 | Compare proceeds, ratios, and uses of proceeds | Conditional recommendation with triggers |
| Exit ticket | 5 | Write an executive-ready sentence | Action + two numbers + risk trigger |

Total: 75 minutes.

## Quantitative model

The teaching bond keeps the same cells across price, sensitivity, and reverse-yield slides:

- `B3`: face value, `$1,000`
- `B4`: annual coupon rate, `5.00%`
- `B5`: payments per year, `2`
- `B6`: years to maturity, `10`
- `B7`: annual YTM, `6.00%`
- `B8`: coupon per period, `=B3*B4/B5` = `$25.00`
- `B9`: total periods, `=B6*B5` = `20`
- `B10`: yield per period, `=B7/B5` = `3.00%`
- `B12`: price today, `=-PV(B10,B9,B8,B3)` = `$925.61`
- `B14`: quoted YTM, `=RATE(B9,B8,-B12,B3)*B5` = `6.00%`

The Meridian application uses the student workbook assumptions: `$1,000` par, `5.50%` coupon, `5.80%` market YTM, ten years, semiannual payments, and 200,000 bonds. The independently checked price is `$977.48`, total proceeds are `$195.50M`, and annual coupons are `$11.00M`.

## Public/private boundary

- The public deck contains original explanatory HTML/CSS/SVG only.
- No proprietary FactSet capture, publisher source material, workbook solution, assessment key, student data, or instructor grading artifact is included.
- Formative in-deck answers support live teaching; they do not expose graded workbook solutions.

## First-pass review targets

- Complete 20-period cash-flow timeline at `#slide-7`.
- Full worksheet density at `#slide-9` and RATE result at `#slide-20`.
- Yield sensitivity interaction and curve at `#slide-15` and `#slide-16`.
- Meridian ratio comparison and conditional recommendation at `#slide-30` through `#slide-32`.
- Notes overlay and interactive reset behavior at the smaller review viewport.
