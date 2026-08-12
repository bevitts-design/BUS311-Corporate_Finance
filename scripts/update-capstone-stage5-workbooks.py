#!/usr/bin/env python3
"""Apply the approved Capstone wording without rebuilding the XLSX packages.

The workbooks contain formulas, charts, validation rules, conditional formatting,
and merged cells. This updater changes only the shared-string references for the
specified cells so those workbook features remain byte-for-byte present.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parent.parent
SHEET_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

WORKBOOKS = (
    (
        ROOT / "CAPSTONE/bus311-capstone-red-team-record.xlsx",
        (
            ("xl/worksheets/sheet1.xml", "A33", "7 | ORAL PRESENTATION REVISION"),
            (
                "xl/worksheets/sheet1.xml",
                "A34",
                "INSTRUCTION - REPLACE: Identify the weakest revenue, valuation, implementation, or risk response; the evidence rechecked; and the revision made to your PowerPoint company analysis, recommendation, model support, or speaking notes.",
            ),
            (
                "xl/worksheets/sheet2.xml",
                "B8",
                "Oral Presentation: decision briefing plus live questions about revenue, valuation, implementation, and risk",
            ),
        ),
    ),
    (
        ROOT / "CAPSTONE/bus311-capstone-valuation-model.xlsx",
        (
            (
                "xl/worksheets/sheet1.xml",
                "D29",
                "Useful CFO/Board evidence and Oral Presentation readiness",
            ),
            (
                "xl/worksheets/sheet8.xml",
                "A2",
                "Model-linked outputs and visuals designed for the PowerPoint appendix and live-question support during the Oral Presentation.",
            ),
        ),
    ),
)


def _shared_string_text(item: ET.Element) -> str:
    return "".join(node.text or "" for node in item.iter(f"{{{SHEET_NS}}}t"))


def _cell_block(xml: str, address: str) -> re.Match[str]:
    pattern = re.compile(
        rf'<c\b(?=[^>]*\br="{re.escape(address)}")[^>]*>.*?</c>',
        flags=re.DOTALL,
    )
    matches = list(pattern.finditer(xml))
    if len(matches) != 1:
        raise RuntimeError(f"Expected one cell {address}; found {len(matches)}")
    return matches[0]


def _current_shared_string_index(xml: str, address: str) -> int:
    block = _cell_block(xml, address).group(0)
    if not re.search(r'\bt="s"', block):
        raise RuntimeError(f"Cell {address} is not a shared-string cell")
    value = re.search(r"<v>(\d+)</v>", block)
    if not value:
        raise RuntimeError(f"Cell {address} has no shared-string index")
    return int(value.group(1))


def _replace_shared_strings(xml: str, replacements: dict[int, str]) -> str:
    if not replacements:
        return xml
    items = list(re.finditer(r"<si\b[^>]*>.*?</si>", xml, flags=re.DOTALL))
    for index, value in sorted(replacements.items(), reverse=True):
        if index >= len(items):
            raise RuntimeError(f"Shared-string index {index} is out of range")
        item = items[index]
        xml = xml[: item.start()] + f"<si><t>{escape(value)}</t></si>" + xml[item.end() :]
    return xml


def update_workbook(path: Path, updates: tuple[tuple[str, str, str], ...]) -> bool:
    with ZipFile(path, "r") as archive:
        infos = archive.infolist()
        payloads = {info.filename: archive.read(info.filename) for info in infos}

    shared_name = "xl/sharedStrings.xml"
    shared_xml = payloads[shared_name].decode("utf-8")
    shared_root = ET.fromstring(shared_xml)
    shared_values = [_shared_string_text(item) for item in shared_root.findall(f"{{{SHEET_NS}}}si")]
    sheet_xml = {
        sheet_name: payloads[sheet_name].decode("utf-8")
        for sheet_name, _, _ in updates
    }
    replacements: dict[int, str] = {}

    for sheet_name, address, desired in updates:
        current_index = _current_shared_string_index(sheet_xml[sheet_name], address)
        if shared_values[current_index] == desired:
            continue
        prior = replacements.get(current_index)
        if prior is not None and prior != desired:
            raise RuntimeError(f"Conflicting replacements for shared-string index {current_index}")
        replacements[current_index] = desired

    if not replacements:
        print(f"unchanged: {path.relative_to(ROOT)}")
        return False

    payloads[shared_name] = _replace_shared_strings(shared_xml, replacements).encode("utf-8")

    temporary = path.with_suffix(path.suffix + ".tmp")
    with ZipFile(temporary, "w") as archive:
        for info in infos:
            archive.writestr(info, payloads[info.filename])
    os.replace(temporary, path)
    print(f"updated: {path.relative_to(ROOT)}")
    return True


def main() -> None:
    for path, updates in WORKBOOKS:
        update_workbook(path, updates)


if __name__ == "__main__":
    main()
