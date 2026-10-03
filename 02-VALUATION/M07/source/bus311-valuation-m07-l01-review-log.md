# BUS311 M07 review log

## August 6, 2026 — comprehensive standards rebuild

- Rebuilt the legacy 65-slide valuation output as a dedicated 21-slide, 75-minute Presenter lesson.
- Added substantive speaker notes to every slide, with formative answers, rationale, likely misconceptions, and debrief guidance.
- Added a `FACTSET WORKFLOW MOCKUP` that records an auditable public-evidence chain without reproducing proprietary FactSet material.
- Preserved and improved editable one-period, Gordon-growth, sensitivity, multi-stage, and relative-valuation calculations.
- Added an explicit sensitivity setup–attempt–reveal sequence with individual calculation, peer check, matrix reveal, and interactive controls.
- Added the exact `Decision standard` and an evidence → calculation → assumption → recommendation deliverable.
- Replaced unsupported or speculative company claims with official Coca-Cola and SEC evidence or clearly labeled course assumptions.
- Replaced repeated concept cards and ornamental numeric labels with purposeful diagrams, visible Excel cells, process flows, and decision activities.
- Added a dedicated builder and validator while leaving M03 and unrelated files unchanged.

## Verification record

- Focused M07 validator: PASS (21 slides, 75 minutes, 21 substantive notes, prior slides 1–64 represented, verified valuation calculations, public evidence workflow, sensitivity sequence, IPO exercise, and auditable decision standard).
- Public structural validator: M07 has no findings. The repository-wide run still reports the pre-existing M03 findings; M03 was not changed.
- Full-slide browser inspection: PASS for all 21 slides at 1920×1080 and 1366×768; no slide overflow, child clipping, document scrolling, or console warning/error remained.
- Browser behavior: PASS for direct slide hashes, keyboard and button navigation, substantive note toggle, one-period and decision checks, Gordon-growth sensitivity sliders, and exit-response controls.
- Focused visual inspection: PASS for the public-evidence console, sensitivity attempt, multi-stage Excel model, and decision-standard exercise at the laptop viewport.
- Scope check: M03 and unrelated files remain unchanged; no workbook, commit, push, publication, or Canvas change was made.


## October 2, 2026 — local review candidate: requested improvements 1–6

Status: local draft for visual review; teaching vehicle has not been selected. Canva remains a read-only reference.

- Use the reconciled maintained Apex starter as the authoritative case. Both public workbook downloads now share that layout; the former IPO activity layout is a compatibility output.
- Apex Scenario C: starting book equity $245M, debt $300M, 50M shares; issue 20M shares at $20, repay $200M debt, deploy $200M capex, fees $0.
- Explicit claim/rate pairing: DDM and FCFE at cost of equity; FCFF at WACC followed by debt/cash/share bridge.
- Construct Year 3 terminal price from Year 4 dividend: $3.64 / (12% − 4%) = $45.50. Present value of all cash flows = $40.14, with about 81% from terminal value.
- Replace automatic $47–$67 endpoints with model reconciliation, labeled downside/base/upside assumptions, and permission to conclude insufficient evidence.
- Add ownership and EPS dilution, $229.95M earnings hurdle, unchanged post-deployment cash, and capex NPV challenge.
- Restore return-on-reinvestment versus hurdle comparison and PVGO: lower, equal, or higher value at 8%, 12%, or 20% returns under a 12% required return.
- Revised to 28 slides with 66 teaching minutes and 9 minutes for transitions and troubleshooting. The extra slides split numerical setup/reveal sequences; the workbook remains follow-through work.
- Updated matched instructor guidance and the student's recommendation prompt without moving shared rows, columns, inputs, answers, or merges.

Verification: focused numerical/source validator passed; all 28 slides were inspected in browser at 1920×1080 and 1366×768; activities and navigation verified. Shared workbook names, labels, locations, and merges verified; 21 scenario controls passed. Recalculation tested in Artifact Tool, including a changed share-count input. Native Excel was not tested. Repository-wide results are retained in the local review evidence. No commit, push, publication, Canvas update, or Canva edit.
