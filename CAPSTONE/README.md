# Current company-project materials

The maintained source is `source/bus311-capstone.json` version 2.2.0. Milestone 2 is Follow the Dollar—Find the Next Dollar, eight points. Milestone 3 is ready: two-peer ratios, a brief P/E range, and a revised recommendation. Its student workbook has Recommendation, Company ratios, Peer comparison, and P-E check tabs.

Build current student materials with `node scripts/build-capstone.mjs` from the repository root, using the bundled workspace runtime. This generates the M02 HTML guide and blank workbook, project hub, local Canvas fragment, Markdown overview, provenance, and dependent homepage. Check with `python3 scripts/validate-capstone-m02.py`, then the required public validator.

Use the generated project hub for current directions. Earlier assignment DOCX/PDF files, continuing-workbook Revenue/Model/Example tabs, and board template remain preserved as legacy references and are no longer linked as current downloads. Keep previously submitted Milestone 1 work. The optional final template is a separate follow-up.

Existing milestone dates are unchanged schedule references. Canvas remains authoritative for applicable submission deadlines. The build never publishes or updates Canvas.

Milestone 2 uses three shared sheets. There is no Sources tab or source-ID entry. The revenue table labels oldest, middle, and latest fiscal-year columns; written-response and revenue-estimate columns also have explicit headings.

## Milestone 3

Use the current M03 peer-comparison workbook and HTML guide. The worked key and instructor guide stay private. Public build: `node scripts/build-capstone.mjs`. Private build: `BUS311_PUBLIC_ROOT=/absolute/public/repo node scripts/build-capstone-instructor.mjs`. Validate both milestones through `scripts/validate-capstone-v2.py` (supply public repository path for the private check). The M03 CSV prepares a local twelve-point Canvas rubric; no Canvas update is performed.
