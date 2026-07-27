# BUS311 M06 review log

## July 27, 2026 rebuild requirements

| Classification | Request | Disposition |
|---|---|---|
| Global standard | Use the approved BUS311 runtime, 1920×1080 canvas, 24px text floor, hashes, navigation, fullscreen, notes, and accessibility conventions | Applied through the shared inlined runtime and M06 stylesheet |
| Global standard | Remove ornamental numeric labels and keep production commentary out of slides and notes | Enforced in content and the lesson validator |
| Pattern-level | Use setup → attempt → reveal for surprising conclusions | Applied to discount pricing, duration sensitivity, and the CFO recommendation |
| Pattern-level | Activities must state what, how, time, and deliverable | Applied to every student interaction, with visible check/reset behavior where answers are checked |
| Pattern-level | Introduce Excel early and keep cell references consistent | `PV` appears on slide 8; B3:B14 persist through pricing, sensitivity, and `RATE` |
| Pattern-level | Preserve every material cash flow and state value date, units, and implication | The complete period 0–20 schedule and all displayed results include units and decision meaning |
| Deck-specific | Preserve the source 5% coupon / 6% YTM / $925.61 example | Rebuilt as editable worksheet, component PV, sensitivity, and reverse-yield sequence |
| Deck-specific | Connect the lecture to the Meridian workbook | Added a clearly labeled application using 5.5% coupon, 5.8% YTM, 200,000 bonds, proceeds, ratios, and use-of-proceeds scenarios |
| Correction | Replace the raster worksheet and generic cards | Rebuilt as editable worksheets, timelines, curves, causal flows, duration scale, spread stack, and ratio table |

## Verification record

### Automated checks

- Lesson builder: PASS; generated 35 slides from the maintained content module.
- Lesson validator: PASS; confirmed 35 slides, 35 substantive teaching notes, source-slide coverage 1–28, five interactive systems with reset behavior, accessible HTML/SVG visuals, early Excel `PV`, and independently verified bond and ratio calculations.
- Public site validator (`--site-only`): PASS; 11 lessons and six outcomes.
- Full public repository validator: M06 contract PASS. The command remains red because the pre-existing M03 and M07 decks do not yet satisfy several repository-wide contracts; those failures are unrelated to this rebuild.
- `git diff --check`: PASS.
- Local asset and internal-reference audit: PASS; the deck has no raster assets, and all lesson CSS/JavaScript references resolve locally.

### Quantitative checks

- Teaching bond price: `$925.6126257`, displayed as `$925.61`.
- Meridian price per bond: `$977.476058`, displayed as `$977.48`.
- Meridian proceeds: `$195.4952116M`, displayed as `$195.50M`.
- Meridian annual coupon cash outflow: `$11.00M`.
- Yield sensitivity and all four Meridian ratio scenarios were recomputed independently and match the displayed values after rounding.

### Browser QA status

The local preview server responds at the documented URL. Automated browser inspection at 1920×1080 and 1366×768, console inspection, and live interaction testing could not be completed in this run because the selected Chrome profile does not have the Codex browser extension installed, and the in-app browser connection was unavailable. These checks remain the only open QA item; they must not be represented as passed until a browser connection is available.
