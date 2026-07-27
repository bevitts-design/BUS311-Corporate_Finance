# BUS311 M06 source inventory

## Source decision

- Supplied path: `02-VALUATION/M06/index.html`
- Repository finding: that file is the generated lesson landing page; it links to the maintained presentation deliverable `02-VALUATION/M06/bus311-valuation-m06-l01-slides.html`.
- Presentation source inspected: the complete 28-slide public HTML deck.
- Source role: content, sequence, examples, formulas, and instructional evidence only.
- Rebuild authority: `docs/bus311-html-deck-standard.md`, approved BUS311 content-module builders, shared runtime, and lesson validators.
- Privacy decision: no publisher assets, proprietary platform captures, workbook solutions, private keys, student data, or grading material are used.

## Slide audit and mapping

| Source slide | Topic or teaching message | Content to preserve | Problems to correct | Visual treatment | Rebuilt destination |
|---:|---|---|---|---|---|
| 1 | Bond valuation title | Bond valuation, rates, YTM | Caterpillar conflicts with the course-map Meridian case; embedded image dominates | HTML/SVG-led | 1 |
| 2 | Decision path | Cash flows → price/yield → risk/corporate impact; 75 minutes | Ornamental labels and compressed timing | HTML/SVG-led | 3 |
| 3 | Objectives | Price bonds; interpret YTM; explain rate and credit risk | Ornamental labels; no decision outcome | HTML/SVG-led | 4 |
| 4 | TVM bridge | Bond as dated cash flows; three-part logic | Generic diagram; no student prediction | HTML/SVG-led | 2, 14 |
| 5 | Cash-flow section | Bond cash-flow focus | Ornamental part label | Sparse text | 5 |
| 6 | Coupons | Coupons on outstanding principal | Generic card; cash-flow timing absent | HTML/SVG-led | 6–7 |
| 7 | Principal | Principal plus final coupon | Generic card; maturity stack unclear | HTML/SVG-led | 6–7 |
| 8 | Present value | Discount coupons and principal at required yield | Relationship is asserted, not modeled | Data-led | 8, 10, 14 |
| 9 | Price/yield section | Inverse relationship | Ornamental part label | Sparse text | 13 |
| 10 | Premium bond | Coupon above yield → price above par; pull to par | Generic card; reveal arrives before attempt | HTML/SVG-led | 2, 11–12, 17 |
| 11 | Discount bond | Coupon below yield → price below par; pull to par | Generic card; reveal arrives before attempt | HTML/SVG-led | 2, 11–12, 17 |
| 12 | Evidence audit trail | Field, definition, period, units, supplier, retrieval date | Projected production disclaimer; limited workflow structure | HTML/SVG-led | 21 |
| 13 | Excel model | Excel function and visible assumptions | Raster worksheet with important numbers | Data-led | 9, 28 |
| 14 | Convert periods | Semiannual coupon and yield | Empty step slide; ornamental number | Data-led | 9–11 |
| 15 | Coupon annuity | PV of coupons | Empty step slide; no values | Data-led | 10–11 |
| 16 | Principal PV | PV of principal | Empty step slide; no values | Data-led | 10–11 |
| 17 | Add and interpret | Total price and discount interpretation | Empty step slide; no units or value date | Data-led | 10–12 |
| 18 | Formula | `=-PV(6%/2,10*2,1000*5%/2,1000)` and component logic | No cell references or reverse-yield workflow | Data-led | 8–10, 18–20 |
| 19 | Result | $925.61; YTM above coupon; decision context | Revealed without attempt; no amount below par or value date | Data-led | 2, 11–12, 20 |
| 20 | Risk section | Duration, credit spread, corporate impact | Ornamental part label | Sparse text | 22 |
| 21 | Duration | Longer, lower-coupon bonds react more | Generic card; no prediction/reveal | HTML/SVG-led | 23–25 |
| 22 | Credit spread | Yield above benchmark; wider spread lowers price | Generic card; no causal sequence | HTML/SVG-led | 26–27 |
| 23 | Debt ratios | Liquidity, leverage, coverage, flexibility | Generic card; no company numbers or use-of-proceeds comparison | Data-led | 28–32 |
| 24 | Sensitivity | Contract cash flows fixed while yield changes | Curve lacks price labels and interaction | Data-led | 15–16, 27–28 |
| 25 | Discussion | Price/yield cause; use-of-proceeds decision | Ornamental labels; no evidence standard | HTML/SVG-led | 29–33 |
| 26 | Takeaways | PV components; inverse relationship; debt-use risk | Repeated card layout and ornamental labels | HTML/SVG-led | 34 |
| 27 | Up next | Equity valuation with dividends, growth, multiples | Decorative image; no connection to student output | Sparse text | 35 |
| 28 | Questions | Model, judgment, exit ticket | Generic close; deliverable not visible | Interactive | 35 |

All 28 source slides are represented through `data-source-slides` metadata in the generated deck. No source slide is omitted.

## Batch problem classification

- Dense or unclear: the calculation sequence lacks enough content to teach from and is rebuilt as a complete timeline, worksheet, component PV, attempt, and reveal.
- Repeated cards: concept cards for coupon, principal, premium, discount, duration, spread, and ratios become flows, timelines, curves, scales, and tables.
- Screenshot calculations: the embedded worksheet is replaced with editable Excel-style HTML using persistent B3:B14 references.
- Missing activities: prediction, price classification, RATE selection, duration comparison, CFO decision, and exit ticket now have explicit instructions and formative feedback.
- Weak message: titles are rewritten so the headline plus visual communicates the teaching point without production context.

## Asset record

No raster assets are used. The source artwork and worksheet screenshot are not needed to carry the instruction; all diagrams, charts, tables, formulas, and worksheet views are editable HTML/CSS/SVG with ARIA descriptions.
