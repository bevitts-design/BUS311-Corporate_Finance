#!/usr/bin/env python3
import json
import re
from html import unescape
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN = re.compile(r"solution|answer|key|completed|instructor|exam|grading|student[-_ ]?data", re.I)


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
    is_approved_financial_institutions = path.name == "bus311-foundations-m01-l02-slides.html"
    slide_count = len(re.findall(r'<section class="slide ', text))
    local_visual_media = len(re.findall(r'<img\b[^>]+src="assets/', text))
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
        ),
        "FactSet public mockup": (
            "FACTSET WORKFLOW MOCKUP" in text
            or (is_approved_intro and "FACTSET · COURSE SETUP" in text)
            or (
                is_approved_financial_institutions
                and "Data discipline is an ethical practice" in text
                and "units, and retrieval date" in text
            )
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
                and "=225 * 15.2" in text
                and "Build and audit a market-cap comparison" in text
            )
        ),
        "sensitivity slide": (
            "Sensitivity" in text
            or (is_approved_intro and "What could change value?" in text)
            or (
                is_approved_financial_institutions
                and "what the result excludes" in text
                and "What does the evidence not prove?" in text
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
                and "Where does the cash go?" in text
                and "Deliverable: one ranked table" in text
            )
        ),
        "practical file size": path.stat().st_size < 5_000_000,
    }
    for label, passed in checks.items():
        if not passed:
            errors.append(f"Deck check failed ({label}): {path.relative_to(ROOT)}")


def main():
    course_map = json.loads((ROOT / "course-map.json").read_text())
    errors = []
    outcome_ids = {item["id"] for item in course_map["learningOutcomes"]}
    track_ids = {item["id"] for item in course_map["tracks"]}

    if any(lesson["track"].lower() == "capstone" for lesson in course_map["lessons"]):
        errors.append("Capstone must not appear in course-map.json during planning.")

    used_outcomes = set()
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
                target = ROOT / material["path"]
                if not target.exists():
                    errors.append(f"Missing public material: {material['path']}")
                elif target.suffix.lower() == ".html" and material.get("type") == "Slides":
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

    if used_outcomes != outcome_ids:
        errors.append(f"Outcome coverage mismatch: expected {sorted(outcome_ids)}, found {sorted(used_outcomes)}")
    for outcome in outcome_ids:
        if not course_map.get("assessmentAlignment", {}).get(outcome):
            errors.append(f"Missing assessment alignment for {outcome}")

    ignored_roots = {".git", "node_modules", ".codex-tmp"}
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in ignored_roots for part in path.parts):
            continue
        if FORBIDDEN.search(path.name) and path.name not in {"validate-public.py"}:
            errors.append(f"Forbidden public filename: {path.relative_to(ROOT)}")

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
