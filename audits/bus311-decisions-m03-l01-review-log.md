# BUS311 M14 review log

**Deck:** Corporate Financing, Equity Accounts, and Control  
**Source:** `BUS311 -Chp14 Corp Finance All Together.pptx`, 20 source slides  
**Output:** `03-FIRM-DECISIONS/M14/bus311-decisions-m14-l01-slides.html`
**Review status:** Implementation and automated QA complete; instructor approval pending

| Topic | Decision | Classification | Disposition |
|---|---|---|---|
| Entire deck | Use the PowerPoint for content and sequence, and approved BUS311 HTML materials for design/runtime | Global standard | Implemented through maintained content, CSS, activity, builder, and runtime sources |
| Projected labels | Remove ornamental numeric labels | Global standard | Agenda, outcomes, takeaways, and section tags use descriptive labels |
| Speaker notes | Keep notes teaching-only | Global standard | Notes contain timing, rationale, misconceptions, answers, and debrief prompts; production history stays in audits |
| Source screenshots | Keep proprietary FactSet captures out of the public repository | Global boundary | Source slides 9, 10, and 12 are rebuilt with public filings and editable visuals |
| Lesson narrative | Make financing rights cumulative | Deck-specific | Rebuilt as Delta decision → funding order → accounting history → control → priced contract terms → Delta recommendation |
| Counterintuitive concepts | Require prediction before reveal | Pattern-level | Equity-issuance signal, negative retained earnings, buyback effects, cumulative voting, Alphabet’s June financing, and yield-feature directions use attempt or calculation before debrief |
| Activities | State action, interaction, time, and deliverable | Global standard | Ten activity slides meet the four-part instruction rule |
| Excel function | Introduce a relevant function early | Pattern-level | `=SUM(B5:B7)` appears before the full equity-account sequence |
| Excel consistency | Use visible cell references and signed inputs | Pattern-level | Apple reconciliation, voting threshold, and preferred-tax comparison use formula bars, row/column headings, highlighted inputs, and verified results |
| Apple example | Correct the FY2024 equity presentation | Correction | Uses filed common stock/APIC, accumulated deficit, AOCI, and total equity; removes the inconsistent treasury line |
| Accumulated deficit | Separate cumulative distributions from current profitability | Correction | Pairs FY2024 net income with dividends and repurchases and avoids saying current operations were unprofitable |
| Share counts | Allow for treasury or retirement presentation | Correction | The funnel teaches the generic relation and tells students to follow the issuer’s terminology |
| Share-count labels and imagery | Make each stock status more pronounced and add a representative image | Deck-specific | Browser comment 1 implemented with larger full names and editable charter, certificate, repurchase, and investor-voting SVG symbols |
| Workbook filename overlap | Keep the full student-workbook filename inside its activity card | Correction | Browser comment 2 implemented with semantic filename break points and reusable long-heading wrapping |
| Voting-threshold worksheet | Show the data inside the Excel cells referenced by the formula | Pattern-level | Browser comment 3 implemented with synchronized B4 total shares, B5 directors, B6 result, formula bar, row and column headings, and highlighted inputs/results |
| Dual class | Verify voting rights and control claims | Correction | Alphabet class rights and 2025 proxy control figures replace the source’s unlabeled table |
| Alphabet FactSet exercise | Add a licensed-platform investigation of the June 2026 equity financing | Deck-specific | Replaces the governance debate and Delta capstone with prediction, transaction reconstruction, matched-period comparison, and analyst-verdict slides |
| Alphabet transaction premise | Reconcile the claimed $107B common issuance to filed financing amounts | Correction | Students distinguish the $84.75B announced package from $49.562B completed net equity proceeds and the unused $40B ATM capacity |
| Alphabet answer placement | Show the correct answers on the very last slide | Deck-specific | The final slide reveals every required amount, period change, classification, and the no-ATM result after the student memo |
| Final FactSet answer headline | Remove the $107B comparison from the projected title | Correction | The final slide now states the verified $49.562B net-proceeds result directly |
| ATM terminology | Define ATM when students first encounter it and on the final answer slide | Clarification | Both slides now identify an at-the-market program as shares sold gradually at market prices |
| FactSet licensing | Let students use licensed FactSet without publishing proprietary screens | Global boundary | Public slides use original HTML/CSS workflow visuals; exact field names are recorded by students and no FactSet capture or export enters the repository |
| Lesson timing | Preserve the 75-minute class after adding the FactSet sequence | Correction | The 14.5-minute sequence replaces the 4-minute governance debate, 9.5-minute Delta capstone, and 1-minute exit ticket |
| Preferred tax | State the deduction and its limits accurately | Correction | Uses the eligible less-than-20% ownership case and labels the worksheet as illustrative |
| Preferred issuers | Remove Apple from the issuer list | Correction | Bank of America provides the real preferred-security context; no unsupported Apple preferred claim remains |
| Preferred yield | Avoid an absolute “strong firms yield less” rule | Correction | Rebuilds the lesson as an after-tax investor comparison and emphasizes the full contract and issuer risk |
| Debt features | Explain directions as risk transfer | Pattern-level | Interactive sorting precedes the reveal; every arrow is tied to optionality, priority, protection, or liquidity |
| Real-company context | Use current filed evidence without pretending it dictates one answer | Deck-specific | Delta’s 2025 cash flow, debt, liquidity, and expected 2026 capital spending anchor the capstone |
| Rights and privacy | Keep licensed and proprietary materials out of public output | Global boundary | No source media, company-logo files, private data, completed workbook, or grading key is added |

## Verification record

- The builder regenerated a 31-slide HTML deck from the maintained content, CSS, activity, and runtime sources.
- The lesson-specific validator passes: 31 slides, 31 substantive notes, exactly 75 minutes, all 20 source slides represented, 10 explicit activities, the Alphabet answer reveal on slide 31, 16 or more accessible editable diagrams, no proprietary screenshots, and all checked calculations correct.
- Browser QA passes at 1920 × 1080 and 1078 × 891 with no elements outside the slide bounds, no clipped FactSet workflow or answer text, and no projected text below 24px.
- Slide 14’s revised share-count labels and four editable SVG symbols pass targeted browser inspection at classroom and review viewports.
- Slide 15’s full workbook filename remains inside the Open card at 1078 × 891 and 1920 × 1080, with no overlap into the Calculate card and a 30px projected type size.
- Slide 18’s Excel-style voting model passes targeted browser QA at 1078 × 891 and 1920 × 1080; B4, B5, B6, and the result strip synchronize with changed calculator inputs, all worksheet text remains at least 24px, and the console is clean.
- Keyboard and button navigation, URL hashes, notes toggle, fullscreen-state toggle, funding prediction, buyback directions, cumulative-voting calculator, Alphabet prediction states, and debt-feature sorter all pass.
- The Alphabet prediction button cycles through increase, decrease, and not determined; slides 20–23 expose complete directions, timing, interaction, and deliverables; the final answer slide remains legible at both checked viewports.
- The browser console reports no errors or warnings.
- The repository-wide public validator recognizes the new M14 sensitivity and decision patterns. It still reports unrelated pre-existing failures in M03 and M07 plus forbidden workbook filenames in M05, M07, M08, and M13; M14 does not appear in the failure list.
- `git diff --check` passes for the M14 implementation scope.
- The existing public student workbooks are preserved unchanged.
- Instructor approval remains pending. Future feedback should be classified as global, pattern-level, deck-specific, or correction.
