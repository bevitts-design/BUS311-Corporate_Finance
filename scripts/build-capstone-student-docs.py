from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt


ROOT = Path(__file__).resolve().parent.parent
CAPSTONE = ROOT / "CAPSTONE"
SOURCE = CAPSTONE / "source" / "bus311-capstone.json"

helper_spec = importlib.util.spec_from_file_location(
    "capstone_doc_helpers", ROOT / "scripts" / "build-capstone-stage1-docs.py"
)
helpers = importlib.util.module_from_spec(helper_spec)
assert helper_spec.loader is not None
helper_spec.loader.exec_module(helpers)


def add_title(doc: Document, kicker: str, title: str, meta: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    helpers.set_run_font(p.add_run(kicker.upper()), size=9.5, color=helpers.TERRA, bold=True)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.keep_with_next = True
    helpers.set_run_font(p.add_run(title), size=24, color=helpers.NAVY, bold=True, name="Aptos Display")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    helpers.set_run_font(p.add_run(meta), size=9.25, color=helpers.GRAY)
    p = doc.add_paragraph()
    p_pr = p._p.get_or_add_pPr()
    border = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "14")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), helpers.GOLD)
    border.append(bottom)
    p_pr.append(border)
    p.paragraph_format.space_after = Pt(8)


def add_heading(doc: Document, text: str, level: int = 1) -> None:
    paragraph = doc.add_heading(text, level=level)
    paragraph.paragraph_format.keep_with_next = True


def add_bullets(doc: Document, items: list[str], *, checkbox: bool = False) -> None:
    for item in items:
        helpers.add_bullet(doc, item, checkbox=checkbox)


def set_properties(doc: Document, capstone: dict, source_hash: str, *, title: str) -> None:
    doc.core_properties.title = title
    doc.core_properties.subject = "BUS311 Individual Company Capstone"
    doc.core_properties.author = "Professor Bethany Evitts"
    doc.core_properties.comments = (
        f"Derived from CAPSTONE/source/bus311-capstone.json v{capstone['meta']['sourceVersion']}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = capstone["meta"]["sourceVersion"]
    helpers.set_page_number_footer(doc)


def build_assignment(capstone: dict, source_hash: str) -> Path:
    doc = Document()
    helpers.configure_document(
        doc,
        title="BUS311 Individual Company Capstone Assignment",
        source_version=capstone["meta"]["sourceVersion"],
        source_hash=source_hash,
    )
    add_title(
        doc,
        "BUS311 Corporate Finance · Approved student assignment",
        capstone["project"]["title"],
        f"100 points  |  25% of BUS311  |  Individual project  |  Fall 2026  |  Source v{capstone['meta']['sourceVersion']}",
    )
    helpers.add_callout(doc, "Board assignment", capstone["hub"]["purpose"], fill=helpers.PALE_GOLD, accent=helpers.TERRA)

    add_heading(doc, "At a glance", 1)
    helpers.add_table(
        doc,
        [
            ["Item", "Approved requirement"],
            ["Audience", capstone["project"]["audience"]],
            ["Company", capstone["project"]["companyEligibility"]],
            ["Decision", capstone["project"]["decision"]],
            ["Stages 1-4", "5 + 8 + 8 + 4 = 25 points; dates and requirements are unchanged"],
            ["Stage 5 component 1", "PowerPoint company-analysis project submission — 50 points"],
            ["Stage 5 component 2", "Oral Presentation — 25 points"],
            ["Stage 5 upload", f"Exactly one editable .pptx due {capstone['finalSubmission']['deadlineLabel']}"],
            ["Oral Presentation", "On the assigned class date; up to 7 minutes presenting plus up to 3 minutes responding to live questions, scored together"],
            ["Project total", "100 points = 25% of the BUS311 course grade"],
        ],
        [2500, 6860],
        font_size=9.25,
    )

    add_heading(doc, "The decision you will build", 1)
    helpers.add_body(doc, capstone["hub"]["centralQuestion"])
    add_bullets(doc, [
        "Lead with one material, company-specific action the CFO could recommend to the Board.",
        "Diagnose the revenue engine before selecting forecast and valuation assumptions.",
        "Use traceable SEC, permitted FactSet, Excel, and other credible evidence beginning in Stage 2.",
        "Compare credible alternatives and specify two or three supporting actions, owners, timing, resources, metrics, triggers, and risks.",
        "Complete the work individually and be prepared to explain every submitted figure, source choice, formula, assumption, and recommendation.",
    ])

    add_heading(doc, "Semester schedule and points", 1)
    milestone_rows = [["Stage", "Deliverable", "Due", "Points"]]
    for milestone, stage in zip(capstone["milestones"], capstone["hub"]["stages"][:4]):
        milestone_rows.append([stage["label"], milestone["title"], milestone["dueLabel"], str(milestone["points"])])
    milestone_rows.extend([
        ["Stage 5 upload", "PowerPoint company-analysis project submission", capstone["finalSubmission"]["deadlineLabel"], "50"],
        ["Stage 5 live", "Oral Presentation", "Assigned date: Nov. 30, Dec. 2, Dec. 7, or Dec. 9", "25"],
        ["", "Project total", "", "100"],
    ])
    helpers.add_table(doc, milestone_rows, [1250, 3330, 3480, 1300], font_size=8.7)

    add_heading(doc, "Stage 1 — Explore the company and a CFO decision (5 points)", 1)
    stage = capstone["hub"]["stages"][0]
    helpers.add_callout(doc, "Outcome", stage["outcome"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_body(doc, f"Due: {capstone['milestones'][0]['dueLabel']}", bold_lead="Due: ")
    helpers.add_body(doc, "Submit: Stage 1 company exploration brief.", bold_lead="Submit: ")
    add_bullets(doc, [
        "Identify the approved company, ticker, exchange, and your individual ownership of the work.",
        "Use AI and/or ordinary web search for a beginner-friendly company snapshot; treat these notes as exploratory rather than verified evidence.",
        stage["factSetLearning"],
        "Propose one potential company-specific CFO decision in your own words and explain why it seems worth investigating.",
        "List two questions to investigate in Stage 2.",
    ])
    helpers.add_callout(doc, "Not required yet", "; ".join(stage["notRequiredYet"]) + ".", fill=helpers.PALE_GOLD, accent=helpers.TERRA)

    add_heading(doc, "Stage 2 — Explain the revenue engine (8 points)", 1)
    stage = capstone["hub"]["stages"][1]
    stage_two_help = capstone["hub"]["stageTwoHelp"]
    helpers.add_callout(doc, "Outcome", stage["outcome"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_body(doc, f"Due: {capstone['milestones'][1]['dueLabel']}", bold_lead="Due: ")
    helpers.add_callout(doc, "Submit one required file", stage_two_help["submission"], fill=helpers.PALE_GOLD, accent=helpers.TERRA)
    add_heading(doc, "Stage 2 start here", 2)
    for step in stage_two_help["steps"]:
        material = next(item for item in capstone["materials"] if item["materialId"] == step["materialId"])
        helpers.add_step(doc, f"{step['title']}: {step['instruction']} File: {material['label']}.")
    helpers.add_callout(
        doc,
        stage_two_help["factSet"]["title"],
        f"{stage_two_help['factSet']['instruction']} {capstone['hub']['factSetSetupUrl']}",
        fill=helpers.PALE_BLUE,
        accent=helpers.STEEL,
    )
    add_bullets(doc, [
        "Map relevant products or services, segments, geographies, customers, channels, pricing, and recurring or transactional revenue.",
        "Analyze three to five comparable fiscal years and reconcile changes in periods, units, definitions, and segment reporting.",
        "Separate company-relevant drivers such as price, volume, mix, currency, acquisitions, capacity, retention, utilization, or backlog from temporary effects.",
        "Use SEC and permitted FactSet evidence with source, period, units, definition, exact location, and limitations.",
        "State a testable revenue hypothesis naming the driver, expected effect, period, and falsification evidence.",
        "Verify the strongest retained AI challenge and record an accept, modify, or reject judgment.",
    ])
    add_heading(doc, "Common Stage 2 edge cases", 2)
    add_bullets(doc, [f"{item['title']}: {item['instruction']}" for item in stage_two_help["edgeCases"]])
    helpers.add_callout(doc, "What PASS means", stage_two_help["passMeaning"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)

    add_heading(doc, "Stage 3 — Model value and scenarios (8 points)", 1)
    stage = capstone["hub"]["stages"][2]
    helpers.add_callout(doc, "Outcome", stage["outcome"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_body(doc, f"Due: {capstone['milestones'][2]['dueLabel']}", bold_lead="Due: ")
    helpers.add_body(doc, f"Submit: {stage['requiredSubmission']}.", bold_lead="Submit: ")
    add_bullets(doc, [
        "Separate inputs, sources, calculations, outputs, checks, scenarios, and sensitivities.",
        "Link base, upside, and downside cases explicitly to revenue drivers and the developing CFO decision.",
        "Use applicable tax, NOPAT, depreciation, capital expenditure, working-capital, discount-rate, terminal-value, and enterprise-to-equity logic.",
        "Resolve formula and sign errors; show scenario consistency, valuation bridges, terminal-value reasonableness, and sensitivity links.",
        "Label every material SEC and FactSet assumption with the item or report name, as-of date, units, and limitations.",
    ])

    add_heading(doc, "Stage 4 — Challenge and revise (4 points)", 1)
    stage = capstone["hub"]["stages"][3]
    helpers.add_callout(doc, "Outcome", stage["outcome"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_body(doc, f"Due: {capstone['milestones'][3]['dueLabel']}", bold_lead="Due: ")
    helpers.add_body(doc, f"Submit: {stage['requiredSubmission']}.", bold_lead="Submit: ")
    add_bullets(doc, [
        "Document context, assumptions, prompt purpose, strongest challenge, and the output retained.",
        "Check the challenge using an exact SEC filing, FactSet item, Excel calculation, or course concept.",
        "Record the finding, uncertainty, accept/modify/reject judgment, and the resulting revision or defense.",
        "Prepare the final verified AI-use disclosure and rehearse the Oral Presentation, including live questions.",
        "Never provide raw licensed FactSet files or screenshots, private information, instructor-only material, or nonpublic information to a public AI tool.",
    ])

    doc.add_page_break()
    add_heading(doc, "Stage 5 — Submit the company analysis and present to the Board (75 points)", 1)
    helpers.add_callout(doc, "Exactly two assessed components", "PowerPoint company-analysis project submission — 50 points; Oral Presentation — 25 points. There is one uploaded file and one live performance.", fill=helpers.PALE_GOLD, accent=helpers.TERRA)
    helpers.add_table(
        doc,
        [
            ["Expectation", "PowerPoint upload", "Oral Presentation"],
            ["What you do", "Upload one editable company-analysis .pptx", "Present the submitted deck individually to the class"],
            ["When", capstone["finalSubmission"]["deadlineLabel"], "Assigned date between Nov. 30 and Dec. 9"],
            ["Length", "8-10 core slides plus optional analytical appendix", "Up to 7 minutes presenting plus up to 3 minutes responding to live questions"],
            ["Points", "50", "25"],
            ["Canvas", "One file is uploaded", "No second Stage 5 file is uploaded"],
        ],
        [1900, 3730, 3730],
        font_size=8.75,
    )

    add_heading(doc, "Component 1 — PowerPoint company-analysis project submission (50 points)", 2)
    helpers.add_body(doc, f"Required filename: {capstone['finalSubmission']['files'][0]}", bold_lead="Required filename: ")
    add_bullets(doc, [
        "Submit exactly one editable PowerPoint (.pptx) by the final file lock. PDF-only, image-only, link-only, or noneditable substitutes do not meet the format requirement.",
        "Use 8-10 core slides. Optional analytical appendix slides may support deeper evidence and live questions; they do not replace a concise core decision narrative.",
        "Lead with the requested Board decision and one company-specific CFO recommendation.",
        "Show the revenue engine, three-to-five-year evidence, company-specific drivers, testable hypothesis, and verified red-team revision before valuation.",
        "Reconcile valuation or capital-budgeting outputs, base/upside/downside scenarios, and decision-changing sensitivities to the assessed Excel model.",
        "Compare credible alternatives and specify two or three actions with owners, timing, resources, dependencies, indicators, triggers, risks, and mitigations.",
        "Use readable, accessible, editable or traceable visuals with units, periods, definitions, compact SEC/FactSet/model source notes, limitations, and the verified AI-use disclosure.",
    ])

    doc.add_page_break()
    add_heading(doc, "Component 2 — Oral Presentation (25 points)", 2)
    helpers.add_callout(doc, "Live requirement", "Present the submitted PowerPoint individually on your assigned date. The live performance is not a second upload. Delivery and responses to questions are assessed together in this single 25-point criterion.", fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    add_bullets(doc, [
        "Use up to seven minutes for the decision briefing. Lead with the recommendation, explain revenue before valuation, and use the deck as evidence rather than as a script.",
        "Use a clear professional voice, controlled pacing, purposeful transitions, accurate terminology, and communication appropriate for a CFO-and-Board audience in the classroom.",
        "For up to three additional minutes, respond to live questions about sources, revenue drivers, assumptions, calculations, scenarios, alternatives, implementation, risks, and conditions that would change the decision.",
        "Trace answers to SEC, FactSet, Excel, or course evidence. Reconcile differing definitions when challenged.",
        "If uncertain, state the limitation and identify the next evidence or calculation needed rather than inventing an answer.",
        "Demonstrate individual ownership of the research, model, recommendation, submitted deck, and live responses.",
    ])
    helpers.add_table(
        doc,
        [
            ["Class date", "Planned presenters", "Individual time target"],
            ["Nov. 30", "5", "Up to 7 minutes presenting + up to 3 minutes for live questions + transition"],
            ["Dec. 2", "5", "Same"],
            ["Dec. 7", "5", "Same"],
            ["Dec. 9", "4", "Same"],
        ],
        [2100, 2100, 5160],
        font_size=9,
    )

    add_heading(doc, "Scoring overview", 1)
    helpers.add_table(doc, [["Criterion", "Points"]] + [[item["title"], str(item["points"])] for item in capstone["rubric"]["criteria"]] + [["Project total", "100"]], [7960, 1400], font_size=9.1)
    helpers.add_body(doc, "Stages 1-4 remain 5, 8, 8, and 4 points. Stage 5 contains exactly two criteria worth 50 and 25 points.")

    doc.add_page_break()
    add_heading(doc, "Policies and final readiness", 1)
    for label, key in [
        ("Individual work", "individualWork"),
        ("Sources and FactSet", "factSetAndSources"),
        ("Verified AI judgment", "verifiedAIJudgment"),
        ("Late milestones", "lateWork"),
        ("Revision", "revision"),
        ("PowerPoint file lock", "finalFileLock"),
        ("Submission location", "submissionLocation"),
        ("Absence", "absence"),
    ]:
        helpers.add_body(doc, f"{label}: {capstone['policies'][key]}", bold_lead=f"{label}: ")
    add_heading(doc, "Final readiness checklist", 2)
    add_bullets(doc, [
        "My one editable PowerPoint uses the required filename and is uploaded before the file lock.",
        "My 8-10 core slides make the decision, revenue logic, model-linked valuation, alternatives, implementation, risks, limitations, sources, and AI disclosure easy to trace.",
        "I have rehearsed the decision briefing to fit within seven minutes without reading the slides.",
        "I can respond for up to three minutes to live questions about my sources, model, assumptions, scenarios, alternatives, implementation, and risks.",
        "I understand the 25-point Oral Presentation criterion includes both delivery and responses to live questions.",
        "I know my assigned Oral Presentation date and will use the same PowerPoint submitted by the file lock.",
    ], checkbox=True)

    set_properties(doc, capstone, source_hash, title="BUS311 Individual Company Capstone Assignment")
    output = CAPSTONE / "bus311-capstone-assignment.docx"
    doc.save(output)
    return output


def stage_two_scoring_criteria() -> list[dict[str, str]]:
    return [
        {
            "title": "Revenue-engine map",
            "points": "1.00",
            "complete": "All eight required dimensions are company-specific, material, sourced, and connected to revenue mechanisms and management levers.",
            "developing": "One or two dimensions are generic, incomplete, weakly sourced, or not connected to how sales are generated.",
            "missing": "Major dimensions are missing; the map is primarily a company description or unsupported assertion.",
        },
        {
            "title": "Revenue history and comparability",
            "points": "1.25",
            "complete": "Three to five fiscal years of total and material segment or business-line revenue use clear currency, units, definitions, periods, sources, growth, and reconciliation; reporting changes are explained.",
            "developing": "History is present, but a period, segment, definition, growth calculation, reconciliation, or comparability explanation is incomplete.",
            "missing": "Fewer than three usable years are provided; total or segment evidence is absent or unsupported; or figures cannot be traced.",
        },
        {
            "title": "Driver decomposition",
            "points": "1.25",
            "complete": "Three to six company-relevant drivers explain what changed; quantified and directional evidence are distinguished; and durable, temporary, acquisition, accounting, and macro effects are separated where relevant.",
            "developing": "Drivers are plausible but generic, incompletely evidenced, over-reliant on narrative, or weakly connected to forecast implications.",
            "missing": "There is no meaningful decomposition; invented bridge amounts or an unexplained total-growth assumption substitute for operating drivers.",
        },
        {
            "title": "Industry, competitors, peers, and market share",
            "points": "1.00",
            "complete": "Demand conditions, competitors, a defensible peer group, comparable peer growth, and supportable market-share context distinguish company-specific from industry effects; limitations are explicit.",
            "developing": "Context is present, but peers, periods, definitions, comparability, or market-share limitations are weak.",
            "missing": "Context is missing, the peer group is unexplained, or unsupported market-share claims are used.",
        },
        {
            "title": "Leading indicators and revenue risks",
            "points": "1.00",
            "complete": "Four to six indicators and three to five principal risks address concentrations, seasonality, capacity constraints, and triggers; each connects to evidence and a forecast or decision use.",
            "developing": "Some indicators or risks are generic, missing a source or trigger, or disconnected from the forecast and CFO decision.",
            "missing": "Indicators or risks are absent, copied from generic risk language, or not usable for monitoring.",
        },
        {
            "title": "Testable revenue hypothesis",
            "points": "1.25",
            "complete": "One specific claim names a mechanism, directional effect, period, supporting evidence, falsification evidence, and an alternative explanation, without unsupported precision.",
            "developing": "The claim is relevant but broad, weakly causal, incompletely testable, or missing a period, falsifier, or alternative explanation.",
            "missing": "The claim only predicts growth or decline, cannot be disproved, relies on valuation as the revenue cause, or uses invented facts.",
        },
        {
            "title": "Forecast, valuation, CFO, evidence, and challenge linkage",
            "points": "1.25",
            "complete": "Base, upside, and downside driver paths flow to later forecast and valuation channels and the CFO decision; the evidence register is traceable; and the skeptical-CFO challenge is independently checked and judged by the student.",
            "developing": "Linkage or a challenge record is present, but assumptions, decision triggers, source labels, verification, or student judgment are incomplete.",
            "missing": "Scenarios are disconnected from the hypothesis; the evidence register is unusable; AI output is treated as a source; or the challenge and judgment are missing.",
        },
    ]


def build_revenue_guide(capstone: dict, source_hash: str) -> Path:
    stage = next(item for item in capstone["hub"]["stages"] if item["stageId"] == "S02_REVENUE")
    stage_two_help = capstone["hub"]["stageTwoHelp"]
    doc = Document()
    helpers.configure_document(doc, title="BUS311 Stage 2 Revenue Engine Student Guide", source_version=capstone["meta"]["sourceVersion"], source_hash=source_hash)
    add_title(
        doc,
        "BUS311 Capstone Stage 2",
        "Revenue Engine and Initial Hypothesis Student Guide",
        f"8 points  |  Due {stage['dateLabel']}  |  Approved student release  |  Source v{capstone['meta']['sourceVersion']}",
    )
    helpers.add_callout(
        doc,
        "Why Stage 2 matters",
        "Before building a valuation, show how the company earns revenue, what changed over three to five comparable fiscal years, which operating drivers matter, and what evidence could support or disprove one revenue hypothesis.",
        fill=helpers.PALE_GOLD,
        accent=helpers.TERRA,
    )

    add_heading(doc, "What you submit", 1)
    helpers.add_callout(doc, "One required file", stage_two_help["submission"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_body(doc, "The workbook is the primary Stage 2 artifact. Do not submit raw FactSet exports or screenshots as public files. Keep licensed evidence inside approved course-restricted systems and label it inside the analysis.")

    add_heading(doc, "Stage 2 start here", 1)
    for step in stage_two_help["steps"]:
        item = next(material for material in capstone["materials"] if material["materialId"] == step["materialId"])
        helpers.add_step(doc, f"{step['title']}: {step['instruction']} File: {item['label']}.")
    helpers.add_callout(
        doc,
        stage_two_help["factSet"]["title"],
        f"{stage_two_help['factSet']['instruction']} {capstone['hub']['factSetSetupUrl']}",
        fill=helpers.PALE_BLUE,
        accent=helpers.STEEL,
    )

    add_heading(doc, "Scope that is manageable for one student", 1)
    add_bullets(doc, [
        "Use three to five completed fiscal years; use five when comparable history is available.",
        "Analyze total revenue plus no more than five material reported segments or business lines.",
        "Use three defensible peers when available. If fewer than three are defensible, explain why.",
        "Analyze three to six material revenue drivers supported by company disclosure or credible evidence.",
        "Use four to six leading indicators and three to five principal revenue risks.",
        "Write one specific revenue hypothesis and three directional forecast cases. Do not build the full valuation in this milestone.",
        "Maintain one Evidence Register and add evidence as you work rather than creating a second source list.",
        stage_two_help["timeExpectation"],
    ])

    doc.add_page_break()
    add_heading(doc, "Required workflow", 1)
    workflows = [
        (
            "1. Map the revenue engine",
            "Complete all eight dimensions in Revenue Map. Name material categories rather than every minor product, and identify the revenue mechanism, management lever, evidence ID, and limitation for each.",
            [
                "Products and services; reported segments or business lines; geographies or end markets; and customer types.",
                "Sales and distribution channels; pricing or monetization model; and recurring versus transactional revenue.",
                "Where value is created and which levers management can influence.",
            ],
        ),
        (
            "2. Build three to five years of revenue history",
            "Use consistent fiscal periods, currency, units, and definitions. Enter reported total revenue, material segment or business-line revenue, segment definitions, evidence IDs, and every reporting change that affects comparability.",
            [
                "The workbook calculates growth, segment sums, and reconciliation differences.",
                "A difference is not automatically an error: corporate or elimination items and definition changes may explain it. Label the cause rather than hiding it.",
            ],
        ),
        (
            "3. Decompose company-relevant drivers",
            "Explain what changed using only drivers the company discloses or credible evidence supports. Quantify a contribution when supportable; otherwise classify it as directional and state the limitation.",
            [
                "Consider price, volume, mix, currency, geography, acquisitions, divestitures, accounting changes, customers, contracts, locations, units, transactions, capacity, utilization, retention, churn, subscriptions, backlog, bookings, orders, or pipeline as company-relevant.",
                "Distinguish durable operating drivers from temporary, acquisition-related, accounting, and macro effects.",
                "Never invent a bridge amount to force reconciliation. State how each material driver could affect a later forecast assumption.",
            ],
        ),
        (
            "4. Add industry, competitor, and peer context",
            "Use Peers & Demand to distinguish company-specific drivers from industry-wide effects. This is not a stock-multiple exercise.",
            [
                "Describe relevant demand conditions and sources; identify direct competitors and the competitive variable that matters.",
                "Define why each peer is comparable and compare growth using consistent periods and definitions when possible.",
                "Address market share only when a credible source defines both the market and the company's measure. Otherwise state the limitation.",
            ],
        ),
        (
            "5. Identify leading indicators and principal revenue risks",
            "Record measures the CFO and Board should monitor, including demand or operating indicators, concentrations, seasonality, capacity or supply constraints, principal risks, and early-warning triggers.",
            ["Give every indicator or risk an evidence ID and connect it to a forecast assumption, scenario trigger, or CFO decision."],
        ),
        (
            "6. Write one testable revenue hypothesis",
            "A strong hypothesis names the operating driver, expected revenue or margin effect, period, supporting evidence, falsification evidence, and at least one plausible alternative explanation.",
            [
                "Template: Over [period], [company-specific driver or mechanism] will [directional revenue or margin effect] because [causal logic]. I would weaken or reject this claim if [observable falsification evidence] occurs.",
                "The hypothesis may later be modified or rejected. Its purpose is to make the operating logic testable, not to guarantee a preferred recommendation.",
            ],
        ),
        (
            "7. Connect the hypothesis to forecasts, valuation, and the CFO decision",
            "Create a directional bridge rather than a finished valuation. Explain which forecast assumptions and valuation channels will change in Stage 3.",
            [],
        ),
        (
            "8. Complete the skeptical-CFO challenge",
            "Use either a free text-based AI tool with only a sanitized student-written summary or the instructor-provided non-AI questions. Both paths must produce the same challenge record.",
            [
                "Record the original hypothesis, strongest challenge or alternative, evidence independently checked, finding and limitation, accept/modify/reject judgment, revised hypothesis, and tool-use or non-AI statement.",
                "AI output is never a source. Do not upload a workbook, raw FactSet export or screenshot, personal information, instructor-only material, or nonpublic company information.",
            ],
        ),
    ]
    for title, body, bullets in workflows:
        add_heading(doc, title, 2)
        helpers.add_body(doc, body)
        add_bullets(doc, bullets)
        if title.startswith("7."):
            helpers.add_table(
                doc,
                [
                    ["Case", "Revenue assumption", "What must be true", "Later valuation effect", "CFO implication"],
                    ["Base", "Most supportable driver path", "Evidence is consistent with the central hypothesis", "Main operating and cash-flow path", "Action supported under expected conditions"],
                    ["Upside", "Stronger favorable driver outcome", "Named indicators exceed the base path", "Higher or earlier revenue, margin, or cash flow", "Acceleration or added capacity may be justified"],
                    ["Downside", "Weaker or adverse driver outcome", "Falsification evidence or a risk trigger appears", "Lower or delayed revenue, margin, or cash flow", "Stage, pause, mitigate, or reject the action"],
                ],
                [900, 1850, 2100, 2250, 2260],
                font_size=8.0,
            )

    doc.add_page_break()
    add_heading(doc, "Evidence and FactSet standard", 1)
    helpers.add_body(doc, "Every material number, definition, comparison, chart, and assumption must be traceable through the Evidence Register.")
    add_bullets(doc, [
        "For FactSet: identify FactSet; the report, screen, chart, or metric; retrieval or data-through date; fiscal period; units and currency; definition or adjustment; peer group and rationale when applicable; use; and limitation.",
        "For SEC evidence: identify the form, filing date, fiscal period, exact item, page, table, or note, definition, and use. A generic investor-relations homepage is not sufficient.",
        "Use one evidence ID in the register and reference that ID in working sheets.",
        "Reconcile conflicting figures or explain why definitions differ. Distinguish reported facts, calculations, assumptions, and interpretations.",
        "State a limitation when evidence is unavailable. Do not use AI-generated figures or chart images as financial evidence.",
    ])
    add_heading(doc, "LO2-LO3 alignment", 1)
    helpers.add_body(doc, "LO2: Begin with income-statement revenue, then use the balance sheet, cash-flow statement, and filing notes when they clarify receivables, contract liabilities, inventory, capital intensity, acquisitions, cash conversion, segment definitions, or recognition timing.", bold_lead="LO2: ")
    helpers.add_body(doc, "LO3: Calculate and interpret company trends and relevant peer comparisons that illuminate revenue generation. Use ratios to distinguish drivers and alternatives, not as a mechanical list.", bold_lead="LO3: ")

    add_heading(doc, "Eight-point milestone rubric", 1)
    rubric_rows = [["Criterion", "Points", "Full-credit evidence"]]
    rubric_rows.extend([[item["title"], item["points"], item["complete"]] for item in stage_two_scoring_criteria()])
    rubric_rows.append(["Total", "8.00", "Part of the capstone's 25 milestone, model, and revision points."])
    helpers.add_table(doc, rubric_rows, [2600, 900, 5860], font_size=8.5)
    helpers.add_body(doc, "The detailed performance-level rubric is provided separately. Missing, invented, or unusable evidence may receive zero within the affected criterion.")

    add_heading(doc, "Before you submit", 1)
    add_bullets(doc, [
        "The approved company and CFO decision remain unchanged, or an approved revision is documented.",
        "All eight revenue-engine dimensions are complete and three to five comparable fiscal years are entered.",
        "Material segment or business-line revenue is entered, or the disclosure limitation is explained.",
        "Segment sums reconcile to reported revenue, or the difference is explained.",
        "Three to six material drivers distinguish quantified and directional evidence and durable and temporary effects.",
        "Industry demand, competitors, peer growth, market-share treatment, indicators, risks, concentrations, seasonality, and constraints are addressed.",
        "The hypothesis passes the quality checklist and drives base, upside, and downside assumptions without claiming a finished valuation.",
        "The CFO implication and pause, change, or reject trigger are stated.",
        "The Evidence Register includes sources, dates, periods, units, definitions, locations, uses, peer rationale, and limitations.",
        "The skeptical-CFO record shows independent verification and student accept, modify, or reject judgment.",
        "Checks & Submission shows PASS or an honest, instructor-reviewable limitation.",
    ], checkbox=True)
    helpers.add_callout(doc, "What PASS means", stage_two_help["passMeaning"], fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    set_properties(doc, capstone, source_hash, title="BUS311 Stage 2 Revenue Engine Student Guide")
    output = CAPSTONE / "bus311-capstone-revenue-engine-guide.docx"
    doc.save(output)
    return output


def build_hypothesis_checklist(capstone: dict, source_hash: str) -> Path:
    stage = next(item for item in capstone["hub"]["stages"] if item["stageId"] == "S02_REVENUE")
    doc = Document()
    helpers.configure_document(doc, title="BUS311 Stage 2 Revenue Hypothesis Quality Checklist", source_version=capstone["meta"]["sourceVersion"], source_hash=source_hash)
    add_title(
        doc,
        "BUS311 Capstone Stage 2",
        "Revenue Hypothesis Quality Checklist",
        f"Use before and after the skeptical-CFO challenge  |  Due {stage['dateLabel']}  |  Approved student release  |  Source v{capstone['meta']['sourceVersion']}",
    )
    helpers.add_callout(doc, "Use this twice", "Complete the checklist before the skeptical-CFO challenge and again after revising the hypothesis. A hypothesis is ready only when every required item can be answered with company-specific evidence.", fill=helpers.PALE_GOLD, accent=helpers.TERRA)
    helpers.add_body(doc, "A limitation such as 'not disclosed' must be managed openly. It is never permission to invent a number.")

    add_heading(doc, "A. One-sentence hypothesis", 1)
    helpers.add_callout(doc, "Template", "Over [period], [company-specific driver or mechanism] will [directional revenue or margin effect] because [causal logic]. I would weaken or reject this claim if [observable falsification evidence] occurs.", fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    helpers.add_response_line(doc, "Student draft")

    add_heading(doc, "B. Required quality checks", 1)
    checks = [
        ("Specific driver", "The claim names a company-relevant operating driver rather than the economy, management, or growth in general."),
        ("Causal mechanism", "The claim explains how the driver reaches revenue or margin."),
        ("Directional effect", "The expected effect is clear enough to translate into a forecast assumption."),
        ("Defined period", "The claim states a fiscal year, forecast window, or decision horizon."),
        ("Company evidence", "At least two independent pieces of SEC, FactSet, Excel, or other credible evidence support testing the claim."),
        ("Leading indicator", "At least one observable measure should move before or with the expected revenue effect."),
        ("Falsification evidence", "A reasonable observation could weaken or disprove the claim; the hypothesis cannot be true under every outcome."),
        ("Alternative explanation", "At least one other plausible cause is named and can be compared with the preferred explanation."),
        ("Comparability", "Definitions, units, fiscal periods, and segment changes are sufficiently consistent, or limitations are stated."),
        ("No unsupported precision", "Every threshold or magnitude is sourced, calculated, or clearly labeled as a later scenario assumption."),
        ("Scenario linkage", "Base, upside, and downside cases change the named driver or its effect, not an unrelated valuation output."),
        ("CFO decision linkage", "The evidence could change whether the CFO accelerates, stages, pauses, modifies, or rejects the action."),
    ]
    helpers.add_table(
        doc,
        [["Quality check", "Yes, revise, and evidence"]] + [[f"{label}: {description}", "[ ] Yes / revise\nEvidence ID or revision note: [Type here.]"] for label, description in checks],
        [6100, 3260],
        font_size=9.0,
    )

    doc.add_page_break()
    add_heading(doc, "C. Fast diagnostic", 1)
    helpers.add_body(doc, "Revise the hypothesis if any statement below is true:")
    add_bullets(doc, [
        "It predicts only that revenue will grow or decline.",
        "It relies on a stock-price target, valuation multiple, or analyst rating as the cause of revenue.",
        "It names several unrelated drivers so no single claim can be tested.",
        "It confuses correlation with causation and does not name an alternative explanation.",
        "It cannot be weakened by observable evidence.",
        "It uses a percentage, market share, peer average, or company figure without a traceable source or calculation.",
        "It describes past performance but does not affect a future assumption or the CFO decision.",
        "It requires nonpublic information or an undisclosed metric that cannot be reasonably proxied.",
    ])

    add_heading(doc, "D. Scenario and decision bridge", 1)
    for case in ("Base", "Upside", "Downside"):
        if case == "Downside":
            doc.add_page_break()
        add_heading(doc, case, 2)
        helpers.add_table(
            doc,
            [
                ["Field", "Response"],
                ["Driver assumption", "[Type here.]"],
                ["Observable indicator or trigger", "[Type here.]"],
                ["Forecast effect", "[Type here.]"],
                ["CFO response", "[Type here.]"],
            ],
            [3000, 6360],
            font_size=9.1,
        )

    add_heading(doc, "E. Skeptical-CFO judgment", 1)
    for label, prompt in [
        ("Strongest challenge or alternative explanation", "[Type here.]"),
        ("Evidence checked independently", "[List evidence IDs.]"),
        ("Judgment", "[Accept / Modify / Reject the challenge.]"),
        ("Why", "[Type here.]"),
        ("Revised hypothesis", "[Type here.]"),
    ]:
        helpers.add_response_line(doc, label, prompt)

    add_heading(doc, "F. Final student confirmation", 1)
    add_bullets(doc, [
        "I can identify the source, date, definition, period, and limitation for every material fact used.",
        "I did not upload a workbook, raw FactSet export, FactSet screenshot, personal information, instructor-only material, or nonpublic company information to a public AI tool.",
        "AI output, if used, challenged my reasoning but did not become a financial source.",
        "I, not AI, made the final hypothesis and accept, modify, or reject judgment.",
    ], checkbox=True)
    set_properties(doc, capstone, source_hash, title="BUS311 Stage 2 Revenue Hypothesis Quality Checklist")
    output = CAPSTONE / "bus311-capstone-hypothesis-checklist.docx"
    doc.save(output)
    return output


def build_revenue_milestone_rubric(capstone: dict, source_hash: str) -> Path:
    stage = next(item for item in capstone["hub"]["stages"] if item["stageId"] == "S02_REVENUE")
    doc = Document()
    helpers.configure_document(doc, title="BUS311 Stage 2 Revenue Engine Rubric", source_version=capstone["meta"]["sourceVersion"], source_hash=source_hash)
    add_title(
        doc,
        "BUS311 Capstone Stage 2",
        "Revenue Engine and Initial Hypothesis Rubric",
        f"8 points  |  Due {stage['dateLabel']}  |  Approved student scoring standard  |  Source v{capstone['meta']['sourceVersion']}",
    )
    helpers.add_callout(doc, "Scoring purpose", "This rubric scores the individual Stage 2 Revenue Analysis Workbook. It is part of the capstone's 25 milestone, model, and revision points.", fill=helpers.PALE_GOLD, accent=helpers.TERRA)
    helpers.add_body(doc, "Each criterion below shows concrete evidence for full credit, developing or partial evidence, and missing or unusable evidence. A stated and well-managed data limitation can earn credit; concealing or inventing evidence cannot.")

    for index, criterion in enumerate(stage_two_scoring_criteria(), start=1):
        if index > 1:
            doc.add_page_break()
        add_heading(doc, f"{index}. {criterion['title']} - {criterion['points']} points", 1)
        helpers.add_table(
            doc,
            [
                ["Performance level", "Evidence description"],
                ["Full credit", criterion["complete"]],
                ["Developing / partial", criterion["developing"]],
                ["Missing / unusable", criterion["missing"]],
            ],
            [1900, 7460],
            font_size=9.2,
        )

    doc.add_page_break()
    add_heading(doc, "Scoring rules", 1)
    add_bullets(doc, [
        "Award points for demonstrated evidence, not document length or confident wording.",
        "Score the work submitted. Approval or required revision is a separate instructional decision.",
        "Within each criterion, use proportional partial credit when evidence falls between the anchors.",
        "A fabricated figure, invented citation, or unsupported bridge amount earns no credit for the affected evidence and may require academic-integrity follow-up under course policy.",
        "FactSet evidence must identify source, report or screen or metric, date, period, units, definition, peer group, use, and limitation as applicable.",
        "AI output is not evidence. The student must independently verify retained challenges and make the final judgment.",
    ])
    add_heading(doc, "Score record", 1)
    score_rows = [["Criterion", "Score", "Instructor note"]]
    score_rows.extend([[item["title"], f"[ ] / {item['points']}", "[Type here.]"] for item in stage_two_scoring_criteria()])
    score_rows.append(["Milestone score", "[ ] / 8.00", ""])
    helpers.add_table(doc, score_rows, [5100, 1500, 2760], font_size=8.8)
    set_properties(doc, capstone, source_hash, title="BUS311 Stage 2 Revenue Engine and Initial Hypothesis Rubric")
    output = CAPSTONE / "bus311-capstone-revenue-milestone-rubric.docx"
    doc.save(output)
    return output


def build_rubric(capstone: dict, source_hash: str) -> Path:
    doc = Document()
    helpers.configure_document(doc, title="BUS311 Individual Company Capstone Student Rubric", source_version=capstone["meta"]["sourceVersion"], source_hash=source_hash)
    add_title(doc, "BUS311 Corporate Finance · Student rubric", "Individual Company Capstone Rubric", f"100 points  |  Complete · Developing · Not demonstrated  |  Source v{capstone['meta']['sourceVersion']}")
    helpers.add_callout(doc, "Point structure", "Stages 1-4 = 25 points (5 + 8 + 8 + 4). Stage 5 has exactly two criteria: PowerPoint company-analysis project submission = 50 points; Oral Presentation = 25 points. Project total = 100 points.", fill=helpers.PALE_GOLD, accent=helpers.TERRA)
    helpers.add_table(doc, [["Component", "Points"], ["Stages 1-4: milestones, Excel model, and revision", "25"], ["PowerPoint company-analysis project submission", "50"], ["Oral Presentation", "25"], ["Project total", "100"]], [7960, 1400], font_size=9.3)
    helpers.add_body(doc, "Use the evidence list under each criterion to prepare. The rating table shows the concrete evidence expected for Complete, Developing, and Not demonstrated performance.")

    for index, criterion in enumerate(capstone["rubric"]["criteria"]):
        doc.add_page_break()
        add_heading(doc, f"{index + 1}. {criterion['title']} — {criterion['points']} points", 1)
        helpers.add_body(doc, criterion["description"])
        add_heading(doc, "Required evidence", 2)
        add_bullets(doc, criterion["evidenceRules"])
        add_heading(doc, "Performance evidence", 2)
        rows = [["Rating", "Points", "Evidence description"]]
        for level_id in ("COMPLETE", "DEVELOPING", "NOT_DEMONSTRATED"):
            level = criterion["performanceLevels"][level_id]
            label = next(item["label"] for item in capstone["rubric"]["performanceScale"] if item["levelId"] == level_id)
            rows.append([label, str(level["points"]), level["description"]])
        helpers.add_table(doc, rows, [1600, 1100, 6660], font_size=8.7)

    doc.add_page_break()
    add_heading(doc, "Final point check", 1)
    helpers.add_table(doc, [["Criterion", "Maximum points"]] + [[item["title"], str(item["points"])] for item in capstone["rubric"]["criteria"]] + [["Total", "100"]], [7960, 1400], font_size=9)
    helpers.add_callout(doc, "Stage 5 scoring boundary", "There is no separate score for delivery or for responses to questions. Both are included in the single 25-point Oral Presentation criterion.", fill=helpers.PALE_BLUE, accent=helpers.STEEL)
    set_properties(doc, capstone, source_hash, title="BUS311 Individual Company Capstone Student Rubric")
    output = CAPSTONE / "bus311-capstone-student-rubric.docx"
    doc.save(output)
    return output


def patch_supporting_docs(capstone: dict, source_hash: str) -> list[Path]:
    changes = {
        "bus311-capstone-ai-student-guide.docx": [
            ("Checkpoint 4 - Board Q&A rehearsal", "Checkpoint 4 - Oral Presentation rehearsal"),
            ("Revise the deck, executive summary, recommendation logic, or speaking notes as appropriate.", "Revise the PowerPoint company analysis, recommendation logic, model support, or speaking notes as appropriate."),
            ("Board Q&A weakness and the revision made to the recommendation, implementation, risk response, deck, or speaking notes.", "Oral Presentation weakness and the revision made to the recommendation, implementation, risk response, PowerPoint, or speaking notes."),
            ("The Q&A rehearsal covers revenue, valuation, implementation, and risk.", "The Oral Presentation rehearsal covers delivery and live questions about revenue, valuation, implementation, and risk."),
            ("4. Board Q&A", "4. Oral Presentation"),
            ("Rehearse revenue, valuation, implementation, and risk questions.", "Rehearse the decision briefing and live questions about revenue, valuation, implementation, and risk."),
        ],
        "bus311-capstone-capaj-prompts.docx": [
            ("Checkpoint 4 - Rehearse Board Q&A", "Checkpoint 4 - Rehearse the Oral Presentation"),
            ("Recheck the evidence behind weak answers and identify any revision needed in the deck, executive summary, recommendation, model support, or speaking notes.", "Recheck the evidence behind weak answers and identify any revision needed in the PowerPoint company analysis, recommendation, model support, or speaking notes."),
        ],
    }
    outputs = []
    for name, replacements in changes.items():
        path = CAPSTONE / name
        doc = Document(path)
        for old, new in replacements:
            helpers.replace_text(doc, old, new, required=False)
        for old, new in [
            ("Oral Board presentation", "Oral Presentation"),
            ("oral Board presentation", "Oral Presentation"),
            ("oral-presentation", "Oral Presentation"),
            ("oral presentation", "Oral Presentation"),
        ]:
            helpers.replace_text(doc, old, new, required=False)
        all_text = " ".join(p.text for p in helpers.iter_paragraphs(doc)).lower()
        if "executive summary" in all_text or "q&a" in all_text:
            raise ValueError(f"obsolete Stage 5 language remains in {name}")
        set_properties(doc, capstone, source_hash, title=doc.core_properties.title or name)
        doc.save(path)
        outputs.append(path)
    return outputs


def main() -> int:
    source_bytes = SOURCE.read_bytes()
    capstone = json.loads(source_bytes)
    source_hash = hashlib.sha256(source_bytes).hexdigest()
    outputs = [
        build_assignment(capstone, source_hash),
        build_rubric(capstone, source_hash),
        build_revenue_guide(capstone, source_hash),
        build_hypothesis_checklist(capstone, source_hash),
        build_revenue_milestone_rubric(capstone, source_hash),
    ]
    outputs.extend(patch_supporting_docs(capstone, source_hash))
    for output in outputs:
        print(output.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
