# M03 guided practice revision

## Scope and maintained sources

Authorized local implementation of the workbook review recommendations. Existing Coastal case inputs and the separate CAT workbook are preserved. No publication or Canvas change is part of this revision.

- Deck source: `scripts/decks/bus311-intro-m03-l01-content.json`.
- Deck build: `scripts/build-bus311-intro-m03-l01.mjs`.
- Workbook pair source: private `BUS311-instructor/scripts/build-bus311-m03-workbooks.mjs`.
- Reading: `01-INTRO/M03/source/bus311-intro-m03-l01-prereading.md`.
- Site descriptions: `course-map.json`; regenerate using `scripts/build-index.mjs`.

## Changes

Required work follows profit, operating NWC, CFO, FCFF, FCFE and cash on hand. Routine links and prior-year profit are supplied. There are 12 required cash-flow formulas and four payout formulas, plus written interpretation and one recommended dollar amount. Ten balance-sheet formulas are optional. Yellow consistently identifies student work, and frozen headers support navigation.

The memo distinguishes current-year cash generation, existing distributions and accumulated cash, asks for maximum and recommended payouts, and includes discount-rate matching. An inventory experiment requires prediction, recalculation, interpretation and restoration of the base input. Section checks activate independently.

All 68 pre-existing slide sections remain in order, including the CAT pair. Four new sections clarify definitions and guide the Coastal build, payout decision and inventory experiment. Targeted existing wording is updated. The existing local images are rendered as images rather than image-slot components. The M01 inlined runtime is reused for working notes, hash navigation and fullscreen controls, with block layout retained for M03 compositions. Speaker notes now match all 72 slides.

The generic public validator now checks the actual M03 guided practice, separate CAT retrieval directions, inventory experiment and payout task. Other lesson checks are unchanged. The obsolete M03 definition is removed from the legacy all-workbooks builder so it cannot overwrite the revised pair.

## Verification

- Shared student/key names, dimensions, labels and merged ranges match. Corresponding student task cells contain worked formulas or examples in the private key. No private or hidden solution sheets appear in the student workbook.
- Independent base-case arithmetic, progressive section feedback, wrong-answer detection and inventory input changes pass in the workbook engine.
- LibreOffice recalculates the completed key without cell errors and confirms the cash-flow, payout and balance-sheet results. This is not a Microsoft Excel interaction test.
- Workbook ranges are visually reviewed, including the required activity, memo and optional statement extension.
- Browser checks confirm 72 slides / 72 notes, keyboard/button/hash navigation, no page errors, no missing images and no detected slide-boundary overflow. Changed slides are visually inspected.

Publication status: local only.
