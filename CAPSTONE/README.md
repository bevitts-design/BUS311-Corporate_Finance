# BUS311 Company Capstone

The student entry point is `index.html`. Version 2 uses one continuing workbook for Stages 1–3 and one six-slide PowerPoint for Stage 4. The PDF and Word brief are optional copies of the instructions. The example is inside the workbook.

`source/bus311-capstone.json` owns the assessment contract, scope, paths, deadlines, points, slide outline, and fictional example. `terms/fall-2026.json` mirrors the three milestone dates for the course homepage. Orientation slides read the same capstone source.

Run `scripts/build-capstone-package.py` from the repository to regenerate the workbook, presentation, documents, web/Canvas fragments, homepage, and orientation deck. It uses the bundled runtime and writes QA artifacts outside the repository. Runtime and skill locations can be overridden through the environment variables documented in the builder. Inspect those renders before release.

Run `scripts/validate-capstone-v2.py`, the M01 deck validator, and `scripts/validate-public.py`. The instructor repository owns the Canvas rubric CSV and private scoring guide; its `scripts/build-capstone-v2.py` accepts this public repository path.

Older standalone guides, checklists, and stage workbooks remain as unlisted historical files. They are recorded in `unlistedLegacyMaterials` and are not part of the current pathway. Do not relink them. The v2 builders do not use their content.

Rebuilding changes local files only. Publishing and updating Canvas are separate actions requiring authorization.
