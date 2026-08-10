#!/usr/bin/env python3
import argparse
import json
import re
from html import unescape
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN = re.compile(
    r"solution|answer|key|completed|instructor|exam(?:\b|[-_ ])|grading|student[-_ ]?data|gradebook|progress[-_ ]?plan|student[-_ ]?tracker",
    re.I,
)


def workbook_sheets(path):
    with ZipFile(path) as archive:
        root = ET.fromstring(archive.read("xl/workbook.xml"))
    return [(node.attrib.get("name", ""), node.attrib.get("state", "visible")) for node in root.iter() if node.tag.endswith("sheet")]


def workbook_checks(path, errors, require_lesson_contract=True):
    for sheet_name, state in workbook_sheets(path):
        if FORBIDDEN.search(sheet_name):
            errors.append(f"Forbidden workbook sheet '{sheet_name}' in {path.relative_to(ROOT)}")
        if state != "visible":
            errors.append(f"Public workbook sheet is hidden: {path.relative_to(ROOT)} / {sheet_name}")

    with ZipFile(path) as archive:
        names = archive.namelist()
        searchable = []
        for name in names:
            if name == "xl/sharedStrings.xml" or name.startswith("xl/worksheets/sheet"):
                searchable.append(archive.read(name).decode("utf-8", errors="ignore"))
        text = " ".join(searchable)
        lowered = text.lower()
        if require_lesson_contract:
            if "factset" not in lowered:
                errors.append(f"Workbook lacks identified FactSet inputs: {path.relative_to(ROOT)}")
            if not any(marker in lowered for marker in ("decision output", "recommendation", "decision, evidence")):
                errors.append(f"Workbook lacks a decision output: {path.relative_to(ROOT)}")
        for marker in ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?"):
            if marker in text:
                errors.append(f"Workbook contains formula error {marker}: {path.relative_to(ROOT)}")
        if any(name.startswith("xl/externalLinks/") for name in names):
            errors.append(f"Workbook contains an external workbook link: {path.relative_to(ROOT)}")


def markdown_checks(path, lesson_id, errors):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append(f"Missing Markdown frontmatter: {path.relative_to(ROOT)}")
    if f"lesson_id: {lesson_id}" not in text:
        errors.append(f"Markdown lesson_id mismatch: {path.relative_to(ROOT)}")
    if "status: draft" not in text:
        errors.append(f"Markdown status missing: {path.relative_to(ROOT)}")
    headings = [line for line in text.splitlines() if line.startswith("#")]
    if sum(line.startswith("# ") for line in headings) != 1:
        errors.append(f"Markdown must contain exactly one H1: {path.relative_to(ROOT)}")
    if any(line.startswith("### ") and not any(prev.startswith("## ") for prev in headings[:i]) for i, line in enumerate(headings)):
        errors.append(f"Markdown heading order invalid: {path.relative_to(ROOT)}")


def deck_checks(path, errors):
    text = path.read_text(encoding="utf-8")
    is_approved_intro = path.name == "bus311-intro-m01-l01-slides.html"
    is_approved_financial_institutions = path.name == "bus311-intro-m02-l01-slides.html"
    is_approved_ratio_analysis = path.name == "bus311-intro-m04-l01-slides.html"
    is_approved_tvm = path.name == "bus311-valuation-m05-l01-slides.html"
    is_approved_bonds = path.name == "bus311-valuation-m06-l01-slides.html"
    is_approved_npv = path.name == "bus311-valuation-m08-l01-slides.html"
    is_approved_risk_return = path.name == "bus311-decisions-m12-l01-slides.html"
    is_approved_wacc = path.name == "bus311-decisions-m13-l01-slides.html"
    is_approved_corporate_financing = path.name == "bus311-decisions-m14-l01-slides.html"
    slide_count = len(re.findall(r'<section\b[^>]*class=["\'][^"\']*\bslide\b', text))
    local_visual_media = len(re.findall(r'<img\b[^>]+src=["\']assets/', text))
    notes_match = re.search(r'<script type="application/json" id="speaker-notes">(.*?)</script>', text, re.S)
    try:
        notes_count = len(json.loads(unescape(notes_match.group(1)))) if notes_match else 0
    except json.JSONDecodeError:
        notes_count = 0
    checks = {
        "slides present": slide_count > 0,
        "speaker-note parity": notes_count == slide_count,
        "deck-stage": '<deck-stage width="1920" height="1080" no-rail>' in text,
        "speaker notes": 'id="speaker-notes"' in text,
        "Instrument Serif": "Instrument+Serif" in text,
        "Geist": "Geist:wght" in text,
        "JetBrains Mono": "JetBrains+Mono" in text,
        "no Shadow DOM": "attachShadow" not in text and "::slotted" not in text,
        "no clamp": "clamp(" not in text,
        "pixel centering": (
            "(window.innerWidth-W*s)/2" in text
            or (
                "(window.innerWidth-W*scale)/2" in text
                and "(window.innerHeight-H*scale)/2" in text
            )
        ),
        "URL slide hashes": "#slide-" in text and "_indexFromHash" in text,
        "fullscreen control": "requestFullscreen" in text and "fullscreenchange" in text,
        "no external JavaScript": not re.search(r'<script[^>]+src=', text),
        "no visible image placeholders": "<image-slot" not in text,
        "embedded or local visual media": (
            text.count("data:image/") >= 3
            or local_visual_media >= 3
            or (
                is_approved_financial_institutions
                and all(marker in text for marker in (
                    'class="market-bridge"',
                    'class="function-wheel"',
                    'class="bear-bars"',
                    'class="financing-matrix"',
                ))
            )
            or (
                is_approved_tvm
                and text.count('role="img"') >= 18
                and all(marker in text for marker in (
                    'class="clock-orbit"',
                    'class="excel-sheet',
                    'class="sensitivity-chart"',
                    'class="pattern-tree"',
                ))
            )
            or (
                is_approved_ratio_analysis
                and text.count('role="img"') >= 14
                and all(marker in text for marker in (
                    'class="family-map"',
                    'class="excel-sheet"',
                    'class="peer-matrix"',
                    'class="dupont-lab"',
                ))
            )
            or (
                is_approved_bonds
                and text.count("role='img'") >= 18
                and all(marker in text for marker in (
                    "class='twenty-periods'",
                    "class='price-curve'",
                    "class='duration-scale'",
                    "class='ratio-table'",
                ))
            )
            or (
                is_approved_npv
                and local_visual_media >= 2
                and all(marker in text for marker in (
                    "class='cash-timeline'",
                    "class='npv-profile'",
                    "class='objective-orbit'",
                ))
            )
            or (
                is_approved_risk_return
                and text.count("<svg") >= 5
                and all(marker in text for marker in (
                    "class='risk-river'",
                    "class='scatterplot'",
                    "class='sml-chart'",
                    "class='beta-workflow'",
                ))
            )
            or (
                is_approved_wacc
                and text.count('role="img"') >= 16
                and all(marker in text for marker in (
                    'class="capital-stack"',
                    'class="wacc-flow"',
                    'class="value-composition"',
                ))
            )
            or (
                is_approved_corporate_financing
                and text.count('role="img"') >= 16
                and all(marker in text for marker in (
                    'class="claim-stack',
                    'class="class-architecture"',
                    'class="risk-transfer-map"',
                ))
            )
        ),
        "FactSet public mockup": (
            "FACTSET WORKFLOW MOCKUP" in text
            or (is_approved_intro and "FACTSET · COURSE SETUP" in text)
            or (
                is_approved_financial_institutions
                and "FactSet Excel add-in" in text
                and "record units, data period, and retrieval date" in text
            )
            or (
                is_approved_tvm
                and 'class="evidence-pipeline"' in text
                and "Record the field, definition, period, units, currency, supplier, and retrieval date." in text
            )
            or (
                is_approved_ratio_analysis
                and 'class="audit-console"' in text
                and "Filed value and retrieval date?" in text
                and "GAAP or adjusted?" in text
            )
            or (
                is_approved_bonds
                and "class='evidence-pipeline'" in text
                and "Record the field, definition, period, units, currency, supplier, and retrieval date." in text
            )
            or (
                is_approved_npv
                and "Corporate red team · Walmart context" in text
                and "Company announcements provide the context" in text
            )
            # M12 teaches beta estimation and CAPM from an instructor-authored
            # workbook; no FactSet capture or mockup belongs in this lesson.
            or is_approved_risk_return
            # M13 uses stable classroom assumptions and an instructor-authored
            # workbook; no proprietary platform capture belongs in the deck.
            or is_approved_wacc
            # M14 uses licensed FactSet for a live student investigation while
            # keeping proprietary captures and exports out of the public deck.
            or is_approved_corporate_financing
        ) and "PRIVATE CAPTURE" not in text,
        "Excel model slide": (
            "BUS311 LECTURE MODEL" in text
            or (
                is_approved_intro
                and "Excel still follows PEMDAS" in text
                and "Microsoft Excel" in text
            )
            or (
                is_approved_financial_institutions
                and "Apple_Market_Cap_Teaching.xlsx" in text
                and "=B5*B6/1000" in text
                and "$4.55T" in text
                and "Build and audit a market-cap comparison" in text
            )
            or (
                is_approved_tvm
                and "=FV(B5,B6,B7,B4,B8)" in text
                and 'class="excel-sheet"' in text
                and "$14,693.28" in text
            )
            or (
                is_approved_ratio_analysis
                and '=B4/AVERAGE(B5:B6)' in text
                and 'class="excel-sheet"' in text
                and '40.0%' in text
            )
            or (
                is_approved_bonds
                and "=-PV(B10,B9,B8,B3)" in text
                and "=RATE(B9,B8,-B12,B3)*B5" in text
                and "class='excel-window" in text
                and "$925.61" in text
            )
            or (
                is_approved_npv
                and "=NPV(B3,C6:G6)+B6" in text
                and "class='excel-sheet'" in text
                and "Excel keeps Year 0 outside the NPV function" in text
            )
            or (
                is_approved_risk_return
                and "=SLOPE(B3:B8,C3:C8)" in text
                and "=B4+B6*(B5-B4)" in text
                and "class='excel-window'" in text
            )
            or (
                is_approved_wacc
                and "=SUMPRODUCT(C5:C6,D5:D6,E5:E6)" in text
                and "=NPV($B$3,C8:F8)+F10/(1+$B$3)^4" in text
                and 'class="excel-window' in text
            )
            or (
                is_approved_corporate_financing
                and "=SUM(B5:B7)" in text
                and "=INT(B4/(B5+1))+1" in text
                and 'class="excel-window' in text
            )
        ),
        "sensitivity slide": (
            "Sensitivity" in text
            or (
                is_approved_intro
                and "The revenue hypothesis drives the valuation model" in text
                and "Challenge and revise" in text
            )
            or (
                is_approved_financial_institutions
                and "INPUT EFFECT" in text
                and "About 32.9% higher" in text
                and "TEACHING ESTIMATE" in text
            )
            or (
                is_approved_tvm
                and 'data-interactive="sensitivity"' in text
                and 'id="fv-rate"' in text
                and 'id="fv-output"' in text
            )
            or (
                is_approved_ratio_analysis
                and 'data-interactive="dupont"' in text
                and 'id="margin-slider"' in text
                and 'id="roe-output"' in text
            )
            or (
                is_approved_bonds
                and "id='yield-slider'" in text
                and "class='price-curve'" in text
                and "$796.15" in text
            )
            or (
                is_approved_npv
                and "id='rate-slider'" in text
                and "data-risk='utilization'" in text
            )
            or (
                is_approved_risk_return
                and "id='beta-slider'" in text
                and "id='required-return'" in text
            )
            or (
                is_approved_wacc
                and 'id="wacc-slider"' in text
                and 'id="growth-slider"' in text
                and 'id="enterprise-value"' in text
            )
            or (
                is_approved_corporate_financing
                and 'data-interactive="factset-prediction"' in text
                and 'class="factset-table"' in text
                and 'class="causality-classes"' in text
                and "% change = (After − Before) / Before" in text
            )
        ),
        "decision slide": (
            "Decision standard" in text
            or (
                is_approved_intro
                and 'class="decision-system"' in text
                and "You decide" in text
            )
            or (
                is_approved_financial_institutions
                and "MATCH THE MEASURE" in text
                and "Equity numerator ↔ equity metric" in text
                and "Enterprise numerator ↔ operating metric" in text
            )
            or (
                is_approved_tvm
                and 'data-interactive="exit"' in text
                and "Finish one sentence that a CFO could use" in text
                and "Apply TVM to coupon bonds and yield to maturity." in text
            )
            or (
                is_approved_ratio_analysis
                and 'data-interactive="exit"' in text
                and "Finish the recommendation—not the calculation" in text
                and "Value cash flows that arrive at different times." in text
            )
            or (
                is_approved_bonds
                and "data-choice-group='cfo-choice'" in text
                and "Resize first. Then stage a mixed-use plan." in text
                and "data-exit='resize'" in text
            )
            or (
                is_approved_npv
                and "data-interactive='exit'" in text
                and "Would you fund Harborside now?" in text
            )
            or (
                is_approved_risk_return
                and "class='decision-comparison'" in text
                and "Which beta belongs in the project model?" in text
            )
            or (
                is_approved_wacc
                and 'class="decision-comparison"' in text
                and "Two projects earn 9.1%—should Target accept both?" in text
            )
            or (
                is_approved_corporate_financing
                and 'class="memo-prompts"' in text
                and "Separate issuance mechanics from changes that merely happened at the same time" in text
                and "Favorable, unfavorable, or mixed" in text
            )
        ),
        "practical file size": path.stat().st_size < 5_000_000,
    }
    for label, passed in checks.items():
        if not passed:
            errors.append(f"Deck check failed ({label}): {path.relative_to(ROOT)}")


def site_hub_checks(course_map, term, errors):
    lesson_ids = {lesson["id"] for lesson in course_map["lessons"]}
    scheduled_ids = [item.get("lessonId") for item in term.get("schedule", [])]
    if set(scheduled_ids) != lesson_ids or len(scheduled_ids) != len(lesson_ids):
        errors.append("Term schedule must include every lesson exactly once.")
    current_lesson_id = term.get("currentLessonId")
    if current_lesson_id not in lesson_ids:
        errors.append("Term currentLessonId does not match a course-map lesson.")
    if not term.get("meetingPattern") or not term.get("location"):
        errors.append("Term meeting pattern and location are required.")
    syllabus = ROOT / term.get("syllabusPath", "")
    if not syllabus.is_file():
        errors.append(f"Missing term syllabus: {term.get('syllabusPath', '')}")
    for item in term.get("schedule", []):
        if item.get("releaseState") not in {"Available", "Locked"}:
            errors.append(f"Invalid releaseState for {item.get('lessonId')}: {item.get('releaseState')}")
        if not item.get("week") or not item.get("dateLabel"):
            errors.append(f"Incomplete term schedule row: {item.get('lessonId')}")
    current_schedule = next((item for item in term.get("schedule", []) if item.get("lessonId") == current_lesson_id), None)
    if current_schedule and current_schedule.get("releaseState") != "Available":
        errors.append("Term current lesson must be Available.")

    index_path = ROOT / "index.html"
    index_text = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
    required_home_markers = (
        "Start here",
        "Prepare, practice, then apply",
        "Course pathway",
        "Find a lesson",
        "Resources and key dates",
        "Capstone snapshot",
        "Open capstone hub",
        "bus311-finance-judgment-hero.jpg",
        'aria-live="polite"',
        'class="skip-link"',
        'data-lesson-view="this-week"',
        'data-lesson-view="all"',
        'id="course-guide"',
    )
    for marker in required_home_markers:
        if marker not in index_text:
            errors.append(f"Generated index missing student-hub marker: {marker}")
    lesson_directory_position = index_text.find('id="find-a-lesson"')
    course_guide_position = index_text.find('id="course-guide"')
    if lesson_directory_position < 0 or course_guide_position < 0 or lesson_directory_position > course_guide_position:
        errors.append("Generated homepage must place the lesson directory before the course guide.")
    if index_text.count('data-current="true"') != 1:
        errors.append("Generated homepage must mark exactly one current lesson card.")
    if "Course learning outcomes" in index_text:
        errors.append("Generated homepage must not include the removed Course learning outcomes section.")
    if not (ROOT / "assets" / "bus311-finance-judgment-hero.jpg").is_file():
        errors.append("Generated homepage hero illustration is missing.")

    for lesson in course_map["lessons"]:
        required_fields = ("summary", "caseStudy", "prepare", "practice", "apply", "deliverable", "readingPath")
        for field in required_fields:
            if not lesson.get(field):
                errors.append(f"Lesson missing {field}: {lesson['id']}")
        reading = ROOT / lesson.get("readingPath", "")
        if not reading.is_file():
            errors.append(f"Missing lesson reading: {lesson.get('readingPath', '')}")
        else:
            markdown_checks(reading, lesson["id"], errors)

        slide = next((material for material in lesson["materials"] if material.get("type") == "Slides"), None)
        if not slide or not slide.get("path"):
            errors.append(f"Lesson missing slide path: {lesson['id']}")
            continue
        lesson_page = ROOT / Path(slide["path"]).parent / "index.html"
        lesson_text = lesson_page.read_text(encoding="utf-8") if lesson_page.exists() else ""
        if not lesson_page.exists():
            errors.append(f"Missing generated lesson page: {lesson_page.relative_to(ROOT)}")
            continue
        for marker in (lesson["title"], lesson["deliverable"], "Pre-class briefing"):
            if marker not in lesson_text:
                errors.append(f"Lesson page missing '{marker}': {lesson_page.relative_to(ROOT)}")
        has_learning_plan = 'class="learning-plan"' in lesson_text and 'id="learning-plan-title">What to do' in lesson_text
        if lesson.get("module") == "M01":
            if not has_learning_plan:
                errors.append(f"M01 lesson page is missing the Learning Plan / What to Do section: {lesson_page.relative_to(ROOT)}")
            for marker in ("Prepare", "Practice", "Apply"):
                if marker not in lesson_text:
                    errors.append(f"M01 lesson page missing '{marker}': {lesson_page.relative_to(ROOT)}")
        elif has_learning_plan:
            errors.append(f"Post-M01 lesson page retains the redundant Learning Plan / What to Do section: {lesson_page.relative_to(ROOT)}")


def main():
    parser = argparse.ArgumentParser(description="Validate the BUS311 public repository.")
    parser.add_argument("--site-only", action="store_true", help="Validate the course hub and public files without legacy deck-standard checks.")
    args = parser.parse_args()
    course_map = json.loads((ROOT / "course-map.json").read_text())
    term = json.loads((ROOT / "terms" / "fall-2026.json").read_text())
    errors = []
    outcome_ids = {item["id"] for item in course_map["learningOutcomes"]}
    track_ids = {item["id"] for item in course_map["tracks"]}

    if any(lesson["track"].lower() == "capstone" for lesson in course_map["lessons"]):
        errors.append("Capstone must not appear in course-map.json during planning.")

    used_outcomes = set()
    modeled_paths = {term.get("syllabusPath", "")}
    for lesson in course_map["lessons"]:
        lesson_id = lesson["id"]
        if lesson["track"] not in track_ids:
            errors.append(f"Unknown track on {lesson_id}: {lesson['track']}")
        for outcome in lesson["outcomes"]:
            used_outcomes.add(outcome)
            if outcome not in outcome_ids:
                errors.append(f"Unknown outcome on {lesson_id}: {outcome}")

        for material in lesson["materials"]:
            has_path = bool(material.get("path"))
            has_url = bool(material.get("url"))
            if has_path == has_url:
                errors.append(f"Material must define exactly one path or url: {lesson_id} / {material.get('type')}")
                continue
            if has_path:
                modeled_paths.add(material["path"])
                target = ROOT / material["path"]
                if not target.exists():
                    errors.append(f"Missing public material: {material['path']}")
                elif target.suffix.lower() == ".html" and material.get("type") == "Slides" and not args.site_only:
                    deck_checks(target, errors)
                elif target.suffix.lower() == ".xlsx":
                    workbook_checks(target, errors, material.get("type") == "Starter Workbook")
            else:
                marker = "/blob/main/"
                if marker not in material["url"] or not material["url"].endswith(".md"):
                    errors.append(f"Reading URL must be a rendered GitHub Markdown URL: {lesson_id}")
                else:
                    local = ROOT / material["url"].split(marker, 1)[1]
                    if not local.exists():
                        errors.append(f"Missing Markdown reading source: {local.relative_to(ROOT)}")
                    else:
                        markdown_checks(local, lesson_id, errors)

        stages = {material.get("stage") for material in lesson["materials"]}
        if "Learn" not in stages:
            errors.append(f"Lesson lacks a Learn resource: {lesson_id}")
        if any(stage not in {"Prepare", "Learn", "Practice", "Apply"} for stage in stages):
            errors.append(f"Lesson has an invalid resource stage: {lesson_id}")

    site_hub_checks(course_map, term, errors)

    if used_outcomes != outcome_ids:
        errors.append(f"Outcome coverage mismatch: expected {sorted(outcome_ids)}, found {sorted(used_outcomes)}")
    for outcome in outcome_ids:
        if not course_map.get("assessmentAlignment", {}).get(outcome):
            errors.append(f"Missing assessment alignment for {outcome}")

    ignored_roots = {".git", "node_modules", ".codex-tmp"}
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.name.startswith("~$") or any(part in ignored_roots for part in path.parts):
            continue
        if FORBIDDEN.search(path.name) and path.name not in {"validate-public.py"}:
            errors.append(f"Forbidden public filename: {path.relative_to(ROOT)}")

    for track_root in (ROOT / "01-INTRO", ROOT / "02-VALUATION", ROOT / "03-FIRM-DECISIONS"):
        for module_dir in track_root.glob("M??"):
            for path in module_dir.iterdir():
                if not path.is_file() or path.name == "index.html" or path.suffix.lower() not in {".html", ".xlsx", ".docx", ".pdf"}:
                    continue
                relative = path.relative_to(ROOT).as_posix()
                if relative not in modeled_paths:
                    errors.append(f"Unmodeled lesson artifact: {relative}")

    index_text = (ROOT / "index.html").read_text(encoding="utf-8") if (ROOT / "index.html").exists() else ""
    for lesson in course_map["lessons"]:
        if lesson["title"] not in index_text:
            errors.append(f"Generated index missing lesson title: {lesson['title']}")

    if errors:
        print("BUS311 public validation: FAIL")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print(f"BUS311 public validation: PASS ({len(course_map['lessons'])} lessons, {len(outcome_ids)} outcomes)")


if __name__ == "__main__":
    main()
