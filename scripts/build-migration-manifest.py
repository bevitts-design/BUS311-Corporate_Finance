#!/usr/bin/env python3
import csv
import os
import re
from collections import Counter
from pathlib import Path

SOURCE_ROOT = Path(os.environ.get("BUS311_SOURCE_ROOT", "")).expanduser()
OUTPUT = Path(__file__).resolve().parents[1] / "audits" / "migration-manifest.csv"

PUBLISHER = re.compile(r"brealey_fundamentals|ross_fcf|ppt_accessible|chapter\d+_(?:sm|im)|minicase|item bank|connect homework", re.I)
PRIVATE = re.compile(r"solution|answer|key|exam|grade tracker|grading|instructor|score card|rubric", re.I)
STUDENT = re.compile(r"student|classroom assignment|activity|exercise|template", re.I)


def lesson_for(path):
    text = str(path).lower()
    rules = [
        (r"chapter 1|intro and chapter 1", "intro-m01-l01", "01-INTRO/M01"),
        (r"chapter 2|market cap|financial markets", "foundations-m01-l02", "01-INTRO/M02"),
        (r"chapter 3|accounting and finance|lemonade|cat - class", "foundations-m02-l01", "01-INTRO/M03"),
        (r"chapter 4|ratio activity|measuring corporate", "foundations-m02-l02", "01-INTRO/M04"),
        (r"chapter 5|time value|valuation of cashflows", "valuation-m01-l01", "02-VALUATION/M05"),
        (r"chapter 6|valuing bonds|bond assignment", "valuation-m02-l01", "02-VALUATION/M06"),
        (r"chapter 7|valuing stocks|ipo|equity valuation", "valuation-m03-l01", "02-VALUATION/M07"),
        (r"chapter 8|net present value|npv assignment", "valuation-m04-l01", "02-VALUATION/M08"),
        (r"chapter 11|chapter 12|risk.return|calculating_beta", "decisions-m01-l01", "03-FIRM-DECISIONS/M12"),
        (r"chapter 13|wacc", "decisions-m02-l01", "03-FIRM-DECISIONS/M13"),
        (r"chapter 14|chapter 15|chapter 16|chapter 17|corporate decision|debt to equity|equityaccounts", "decisions-m03-l01", "03-FIRM-DECISIONS/M14"),
        (r"semester long project|revised project design|red team", "CAPSTONE-PLANNING", "CAPSTONE/planning"),
    ]
    for pattern, lesson_id, target in rules:
        if re.search(pattern, text):
            return lesson_id, target
    return "UNMAPPED", ""


def version_for(path):
    text = str(path).lower()
    if "sp26" in text or "spring 2026" in text or "2026" in text:
        return "Spring 2026"
    if "fa25" in text or "fall 2025" in text or "fall25" in text:
        return "Fall 2025"
    return "Legacy/undated"


def classify(path, duplicate_count):
    rel = path.relative_to(SOURCE_ROOT)
    text = str(rel)
    lesson_id, target = lesson_for(rel)
    publisher = bool(PUBLISHER.search(text))
    private = bool(PRIVATE.search(path.name))
    student = bool(STUDENT.search(path.name))
    ext = path.suffix.lower()

    if path.name == ".DS_Store" or path.name.startswith("~$"):
        action, audience, license_class, owner = "retire", "none", "system/temp", "n/a"
    elif publisher:
        action, audience, license_class, owner = "reference-only", "instructor-reference", "publisher-licensed", "publisher"
    elif lesson_id == "CAPSTONE-PLANNING":
        action, audience, license_class, owner = "private", "instructor-planning", "course-authored-or-reference", "Bethany Evitts / source owner"
    elif private:
        action, audience, license_class, owner = "private", "instructor-only", "course-authored-or-reference", "Bethany Evitts / source owner"
    elif "company valuation exercise -student.xlsx" in path.name.lower():
        action, audience, license_class, owner = "rebuild", "student", "course-authored", "Bethany Evitts"
    elif ext in {".pptx", ".pdf", ".docx"}:
        action, audience, license_class, owner = "rebuild", "student-candidate", "course-authored-review-required", "Bethany Evitts / source owner"
    elif ext == ".xlsx" and student:
        action, audience, license_class, owner = "reuse", "student-candidate", "course-authored-review-required", "Bethany Evitts / source owner"
    else:
        action, audience, license_class, owner = "review", "unclassified", "review-required", "unknown"

    version = version_for(rel)
    if duplicate_count > 1:
        canonical = "duplicate-candidate"
    elif version == "Spring 2026":
        canonical = "current-candidate"
    elif version == "Fall 2025":
        canonical = "recent-legacy"
    else:
        canonical = "legacy-or-undated"

    return {
        "sourcePath": str(rel),
        "contentOwner": owner,
        "licenseClass": license_class,
        "audience": audience,
        "versionTerm": version,
        "canonicalStatus": canonical,
        "outcomeAlignment": "To verify" if lesson_id in {"UNMAPPED", "CAPSTONE-PLANNING"} else lesson_id,
        "targetLessonId": lesson_id,
        "action": action,
        "targetPath": target,
        "status": "Inventoried"
    }


def main():
    if not os.environ.get("BUS311_SOURCE_ROOT"):
        raise SystemExit("Set BUS311_SOURCE_ROOT to the private BUS311 source archive before running this script.")
    if not SOURCE_ROOT.is_dir():
        raise SystemExit(f"BUS311_SOURCE_ROOT is not a directory: {SOURCE_ROOT}")
    files = sorted(path for path in SOURCE_ROOT.rglob("*") if path.is_file())
    names = Counter(path.name.lower() for path in files)
    rows = [classify(path, names[path.name.lower()]) for path in files]
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} inventory records to {OUTPUT.relative_to(OUTPUT.parents[1])}.")


if __name__ == "__main__":
    main()
