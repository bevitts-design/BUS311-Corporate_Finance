# BUS311 M05 Time Value of Money rebuild brief

## Delivery

- Course: BUS311 Corporate Finance
- Display module: M05
- Lesson: L01
- Class length: 75 minutes
- Mode: Presenter mode with substantive teaching notes
- Maintained output: `02-VALUATION/M05/bus311-valuation-m05-l01-slides.html`
- Maintained content: `scripts/decks/bus311-valuation-m05-l01-content.mjs`
- Maintained styles and behavior: `02-VALUATION/M05/assets/deck.css` and `activities.js`

## Source decision

The supplied 27-slide public HTML deck is the available presentation source. No PPTX is stored in the repository or the local course folders. The deck is used as content and sequence evidence; the approved BUS311 standard and existing M06–M08 deck system control the rebuilt design and runtime.

## Teaching architecture

| Segment | Minutes | Teaching move | Student evidence |
|---|---:|---|---|
| Opening prediction | 5 | Compare cash today with a larger future payment | Conditional decision rule |
| Timeline and direction | 18 | Map dates, compounding, discounting, and signs | Timeline and sign diagnosis |
| Excel and rate alignment | 15 | Introduce `FV`, then match rate and period units | Audited function arguments |
| Worked model and sensitivity | 12 | Build one consistent worksheet and stress-test it | Formula plus threshold explanation |
| Cash-flow patterns | 20 | Distinguish lump sums, annuities, and perpetuities | Three classifications with timing rationale |
| Exit ticket | 5 | State amount, value date, rate, and assumption | Decision-ready valuation sentence |

Total: 75 minutes.

## Quantitative model

The primary worksheet keeps the same cells throughout:

- `B4`: present value, `−$10,000`
- `B5`: annual rate, `8%`
- `B6`: periods, `5`
- `B7`: recurring payment, `0`
- `B8`: type, `0`
- `B10`: future value, `=FV(B5,B6,B7,B4,B8)` = `$14,693.28`

Sensitivity slides vary only `B5` and `B6`. Other independently checked examples cover a five-year present value, nominal APR to monthly rate and EAR, ordinary annuity versus annuity due, and a level perpetuity.

## Public/private boundary

- No publisher slide assets, proprietary FactSet screens, assessment keys, workbook solutions, student data, or instructor-only grading material are included.
- All instructional diagrams, tables, worksheet views, formulas, and interactions are editable HTML, CSS, or SVG.
- The company and security references are contextual teaching examples; no third-party logo assets are required.

## First-pass review targets

- Check the density of the full worksheet at `#slide-12` on the classroom projector.
- Confirm the five-percent-to-twelve-percent sensitivity chart remains legible at the smaller review viewport.
- Test every interactive at its direct URL hash and verify that keyboard navigation does not steal input-range interaction.
- Inspect notes for formative answers, misconceptions, timing, and debrief questions without production commentary.
