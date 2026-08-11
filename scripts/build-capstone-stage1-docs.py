from __future__ import annotations

import hashlib
import json
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent.parent
CAPSTONE = ROOT / "CAPSTONE"
SOURCE = CAPSTONE / "source" / "bus311-capstone.json"

NAVY = "152536"
TERRA = "9C4A2B"
GOLD = "C18A42"
STEEL = "355773"
SAGE = "4A7C5E"
CREAM = "FAF8F3"
PALE_TERRA = "F7EEE9"
PALE_GOLD = "FFF4DF"
PALE_BLUE = "EDF3F7"
BORDER = "D8D3C8"
GRAY = "5B6472"
WHITE = "FFFFFF"
CONTENT_WIDTH_DXA = 9360


def set_run_font(run, *, size=10.5, color="1A1F2C", bold=False, italic=False, name="Aptos") -> None:
    run.font.name = name
    r_pr = run._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn("w:ascii"), name)
    r_fonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold
    run.italic = italic


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, *, top=100, start=120, bottom=100, end=120) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.find(qn("w:tcMar"))
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{side}"))
        if node is None:
            node = OxmlElement(f"w:{side}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def mark_header_row(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    tr_pr.append(header)


def prevent_row_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    if tr_pr.find(qn("w:cantSplit")) is None:
        tr_pr.append(OxmlElement("w:cantSplit"))


def set_table_geometry(table, widths: list[int]) -> None:
    if sum(widths) != CONTENT_WIDTH_DXA:
        raise ValueError(f"table widths must total {CONTENT_WIDTH_DXA}: {widths}")
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(CONTENT_WIDTH_DXA))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "120")
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(width))
        grid.append(grid_col)

    for row in table.rows:
        prevent_row_split(row)
        for index, cell in enumerate(row.cells):
            width = widths[min(index, len(widths) - 1)]
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(width))
            tc_w.set(qn("w:type"), "dxa")
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def add_page_field(paragraph) -> None:
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instruction = OxmlElement("w:instrText")
    instruction.set(qn("xml:space"), "preserve")
    instruction.text = " PAGE "
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    display = OxmlElement("w:t")
    display.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run = paragraph.add_run()
    run._r.extend([begin, instruction, separate, display, end])
    set_run_font(run, size=8.5, color=GRAY)


def clear_paragraph(paragraph) -> None:
    for child in list(paragraph._p):
        if child.tag != qn("w:pPr"):
            paragraph._p.remove(child)


def configure_document(doc: Document, *, title: str, source_version: str, source_hash: str) -> None:
    section = doc.sections[0]
    section.start_type = WD_SECTION_START.NEW_PAGE
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.78)
    section.bottom_margin = Inches(0.72)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.35)
    section.footer_distance = Inches(0.35)

    normal = doc.styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
    normal.font.size = Pt(10.5)
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.08

    for style_name, size, color, before, after in (
        ("Heading 1", 16, NAVY, 13, 6),
        ("Heading 2", 13, STEEL, 10, 5),
        ("Heading 3", 11.5, NAVY, 8, 4),
    ):
        style = doc.styles[style_name]
        style.font.name = "Aptos Display"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(color)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    for style_name in ("List Bullet", "List Number"):
        style = doc.styles[style_name]
        style.font.name = "Aptos"
        style.font.size = Pt(10.5)
        style.paragraph_format.left_indent = Inches(0.38)
        style.paragraph_format.first_line_indent = Inches(-0.2)
        style.paragraph_format.space_after = Pt(5)

    header = section.header.paragraphs[0]
    clear_paragraph(header)
    header.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = header.add_run("BUS311 Corporate Finance  |  Individual Company Capstone")
    set_run_font(run, size=8.5, color=GRAY, bold=True)

    footer = section.footer.paragraphs[0]
    clear_paragraph(footer)
    footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = footer.add_run("Approved student release  |  Page ")
    set_run_font(run, size=8.5, color=GRAY)
    add_page_field(footer)

    doc.core_properties.title = title
    doc.core_properties.subject = "BUS311 Capstone Stage 1"
    doc.core_properties.author = "Professor Bethany Evitts"
    doc.core_properties.comments = (
        f"Derived from CAPSTONE/source/bus311-capstone.json v{source_version}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = source_version


def add_masthead(doc: Document, *, kicker: str, title: str, source_version: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(kicker.upper())
    set_run_font(run, size=9.5, color=TERRA, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(title)
    set_run_font(run, size=22, color=NAVY, bold=True, name="Aptos Display")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    run = p.add_run(f"5 points  |  Fall 2026  |  Approved student release  |  Source v{source_version}")
    set_run_font(run, size=9.25, color=GRAY)

    p = doc.add_paragraph()
    p_pr = p._p.get_or_add_pPr()
    border = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "14")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), GOLD)
    border.append(bottom)
    p_pr.append(border)
    p.paragraph_format.space_after = Pt(8)


def add_body(doc: Document, text: str, *, bold_lead: str | None = None, italic=False) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    if bold_lead and text.startswith(bold_lead):
        run = p.add_run(bold_lead)
        set_run_font(run, bold=True)
        run = p.add_run(text[len(bold_lead):])
        set_run_font(run, italic=italic)
    else:
        run = p.add_run(text)
        set_run_font(run, italic=italic)


def add_bullet(doc: Document, text: str, *, checkbox=False) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.22)
    p.paragraph_format.first_line_indent = Inches(-0.22)
    run = p.add_run(("☐ " if checkbox else "• ") + text)
    set_run_font(run)


def remove_empty_page_break_before(doc: Document, heading: str) -> None:
    paragraphs = doc.paragraphs
    for index, paragraph in enumerate(paragraphs):
        if paragraph.text.strip() != heading or index == 0:
            continue
        previous = paragraphs[index - 1]
        breaks = previous._p.findall(
            ".//w:br",
            {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"},
        )
        if not previous.text.strip() and breaks:
            previous._p.getparent().remove(previous._p)
        return
    raise ValueError(f"Heading not found while checking page break: {heading}")


def add_step(doc: Document, text: str) -> None:
    p = doc.add_paragraph(style="List Number")
    run = p.add_run(text)
    set_run_font(run)


def add_callout(doc: Document, label: str, text: str, *, fill=PALE_GOLD, accent=TERRA) -> None:
    table = doc.add_table(rows=1, cols=1)
    table.style = "Table Grid"
    cell = table.cell(0, 0)
    set_cell_shading(cell, fill)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(f"{label.upper()}  ")
    set_run_font(run, size=9.5, color=accent, bold=True)
    run = p.add_run(text)
    set_run_font(run, size=10.5, color=NAVY)
    set_table_geometry(table, [CONTENT_WIDTH_DXA])
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


def add_table(doc: Document, rows: list[list[str]], widths: list[int], *, font_size=9.2) -> None:
    table = doc.add_table(rows=len(rows), cols=len(widths))
    table.style = "Table Grid"
    for row_index, values in enumerate(rows):
        for column_index, value in enumerate(values):
            cell = table.cell(row_index, column_index)
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.03
            run = p.add_run(value)
            set_run_font(
                run,
                size=font_size,
                color=NAVY if row_index == 0 else "1A1F2C",
                bold=row_index == 0,
            )
            if row_index == 0:
                set_cell_shading(cell, PALE_BLUE)
            elif row_index % 2 == 0:
                set_cell_shading(cell, CREAM)
    mark_header_row(table.rows[0])
    set_table_geometry(table, widths)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


def add_response_line(doc: Document, label: str, prompt="[Type here.]") -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(7)
    run = p.add_run(f"{label}: ")
    set_run_font(run, bold=True, color=NAVY)
    run = p.add_run(prompt)
    set_run_font(run, color=GRAY, italic=True)


def build_stage_one_menu(capstone: dict, source_hash: str) -> Path:
    stage = next(item for item in capstone["hub"]["stages"] if item["stageId"] == "S01_SCOPE")
    output = CAPSTONE / "bus311-capstone-cfo-decision-menu.docx"
    doc = Document()
    configure_document(
        doc,
        title="BUS311 Stage 1 - Company Research and Potential CFO Decision Starter",
        source_version=capstone["meta"]["sourceVersion"],
        source_hash=source_hash,
    )
    add_masthead(
        doc,
        kicker="BUS311 Capstone Stage 1",
        title="Company Research and Potential CFO Decision Starter",
        source_version=capstone["meta"]["sourceVersion"],
    )

    add_body(doc, stage["objective"])
    add_callout(
        doc,
        "Stage 1 is a guided first look",
        "You are choosing a company, noticing what may matter, and proposing one possible direction. FactSet is required. You do not need to prove the idea or make a final recommendation yet.",
    )

    doc.add_paragraph("What you submit", style="Heading 1")
    for item in (
        "The approved public company's name, ticker, and U.S. exchange.",
        "A short beginner-friendly company snapshot based on AI and/or ordinary web search.",
        "One concrete thing learned from FactSet, plus the screen, report, or feature used.",
        "One potential company-specific CFO decision and a short reason it seems worth investigating.",
        "Two questions you want to research in Stage 2.",
    ):
        add_bullet(doc, item)

    doc.add_paragraph("A five-step start", style="Heading 1")
    for item in (
        "Choose one approved public company and record its basic identifying information.",
        "Use ordinary web search, AI, or both to learn what the company sells, who it serves, and what issues or opportunities appear important.",
        "Open FactSet and explore at least one company screen, report, or feature.",
        "Write one specific FactSet learning in your own words and name where you found it.",
        "Choose one potential CFO decision from the menu below. Treat it as a starting idea that may change.",
    ):
        add_step(doc, item)

    doc.add_paragraph("FactSet is required", style="Heading 1")
    add_body(doc, stage["factSetLearning"])
    add_table(
        doc,
        [
            ["A beginner-appropriate FactSet discovery", "Example of what to record"],
            ["Company or segment metric", "A metric or segment result that helped you understand the business."],
            ["Ownership or market item", "An ownership, trading, capital-markets, or security detail that caught your attention."],
            ["Peer or comparison observation", "One way the company looked similar to or different from a relevant peer."],
            ["Estimate", "An analyst estimate or expectation that raised a useful question."],
            ["News or data discovery", "A relevant FactSet news item, event, chart, or data feature you did not know about before."],
        ],
        [2700, 6660],
    )
    add_callout(
        doc,
        "Keep it simple",
        "For Stage 1, name the FactSet screen, report, or feature and explain what you learned. You do not need a formal citation, definition audit, reconciliation, or independent validation yet.",
        fill=PALE_BLUE,
        accent=STEEL,
    )

    doc.add_paragraph("Potential CFO decision directions", style="Heading 1")
    add_body(
        doc,
        "Browse the ten directions and choose one that seems connected to your initial research. You are not comparing or defending alternatives in Stage 1.",
    )
    rows = [["Decision area", "Beginner starting question"]]
    rows.extend([[item["area"], item["prompt"]] for item in capstone["hub"]["decisionMenu"]])
    add_table(doc, rows, [2200, 7160], font_size=8.8)

    doc.add_paragraph("Write the potential decision in your own words", style="Heading 1")
    add_callout(
        doc,
        "Sentence starter",
        "One potential decision the CFO might need to consider is whether [company] should [possible action], because my initial research made me curious about [company-specific issue or opportunity].",
        fill=PALE_TERRA,
    )

    doc.add_paragraph("What comes later", style="Heading 1")
    add_table(
        doc,
        [
            ["Stage 1", "Later stages"],
            ["Explore the company and notice a potential CFO decision.", "Build a traceable evidence register and analyze the revenue engine."],
            ["Record one concrete FactSet learning and the feature used.", "Add full FactSet labels, dates, units, definitions, and limitations."],
            ["Keep the decision tentative.", "Test a hypothesis, compare alternatives, model scenarios, and defend the final recommendation."],
        ],
        [3300, 6060],
    )

    doc.add_paragraph("Before you submit", style="Heading 1")
    for item in (
        "Company name, ticker, and exchange are complete.",
        "Introductory company notes show AI and/or ordinary web research.",
        "The required FactSet learning is specific and names the screen, report, or feature used.",
        "One potential CFO decision is written in your own words.",
        "The brief treats the idea as exploratory rather than proven or final.",
    ):
        add_bullet(doc, item, checkbox=True)

    doc.save(output)
    return output


def build_stage_one_brief(capstone: dict, source_hash: str) -> Path:
    stage = next(item for item in capstone["hub"]["stages"] if item["stageId"] == "S01_SCOPE")
    output = CAPSTONE / "bus311-capstone-stage-1-exploration-brief.docx"
    doc = Document()
    configure_document(
        doc,
        title="BUS311 Stage 1 - Company Exploration Brief",
        source_version=capstone["meta"]["sourceVersion"],
        source_hash=source_hash,
    )
    add_masthead(
        doc,
        kicker="BUS311 Capstone Stage 1",
        title="Company Exploration Brief",
        source_version=capstone["meta"]["sourceVersion"],
    )
    add_body(doc, "Complete this brief in your own words. Keep answers concise and beginner-friendly.")
    add_callout(
        doc,
        "Exploratory, not final",
        "Choose an approved public company, learn the basics through AI and/or ordinary web search, use FactSet, and propose one potential CFO decision. Your idea may change as you learn more.",
    )

    doc.add_paragraph("A. Student and company", style="Heading 1")
    add_table(
        doc,
        [
            ["Field", "Student entry"],
            ["Student name", "[Type here.]"],
            ["Course section", "[Type here.]"],
            ["Date", "[Type here.]"],
            ["Company legal name", "[Type here.]"],
            ["Ticker and U.S. exchange", "[Type here.]"],
            ["Industry or sector", "[Type here.]"],
        ],
        [2700, 6660],
    )

    doc.add_paragraph("B. Introductory company research", style="Heading 1")
    add_body(doc, "Research path used:  ☐ AI  ☐ Ordinary web search  ☐ Both")
    add_body(
        doc,
        "In three to five short bullets, explain what the company sells, who its customers are, the segments or markets that seem important, and one current issue or opportunity you noticed.",
    )
    for _ in range(4):
        add_bullet(doc, "[Type one observation here.]")
    add_response_line(doc, "Websites, AI tool, or other places explored (names only; formal citations are not required yet)")
    add_callout(
        doc,
        "AI privacy reminder",
        "If you use AI, provide only a short student-written summary. Do not upload FactSet files or screenshots, a workbook, personal information, instructor-only material, or nonpublic information.",
        fill=PALE_BLUE,
        accent=STEEL,
    )

    doc.add_paragraph("C. Required FactSet discovery", style="Heading 1")
    add_callout(
        doc,
        "FactSet is required",
        "Explore one company screen, report, or feature. Record one specific thing you learned. A formal citation or validation is not required in Stage 1.",
        fill=PALE_GOLD,
        accent=TERRA,
    )
    add_table(
        doc,
        [
            ["Required field", "Student entry"],
            ["FactSet screen, report, or feature used", "[Type the name shown in FactSet.]"],
            ["One specific thing I learned from FactSet", "[State the metric, observation, estimate, comparison, ownership/market item, or news/data discovery in your own words.]"],
            ["Why it caught my attention", "[Explain briefly how it helped you understand the company or raised a useful question.]"],
        ],
        [3100, 6260],
    )
    add_body(
        doc,
        "Examples that work: a company or segment metric, an ownership or market item, a peer/comparison observation, an estimate, or a relevant news/data discovery.",
        italic=True,
    )

    doc.add_paragraph("D. One potential CFO decision", style="Heading 1")
    add_response_line(
        doc,
        "Decision area",
        "[Choose one: growth; capital allocation; financing; payout; acquisition/partnership/divestiture; operations/working capital; risk; other.]",
    )
    add_response_line(
        doc,
        "Potential decision",
        "One potential decision the CFO might need to consider is whether [company] should [possible action].",
    )
    add_response_line(
        doc,
        "Why this seems worth investigating",
        "[In 50-100 words, connect the possible decision to something you noticed in your introductory research. You are explaining curiosity, not proving a claim.]",
    )
    add_response_line(doc, "Question I want to investigate in Stage 2", "[Type here.]")
    add_response_line(doc, "A second question that could help me learn more", "[Type here.]")

    doc.add_paragraph("E. Stage 1 submission check", style="Heading 1")
    for item in (
        "I selected an approved public company and entered its ticker and exchange.",
        "I used AI and/or ordinary web search for introductory company research.",
        "I used FactSet, stated one concrete learning, and named the screen, report, or feature used.",
        "I proposed one potential CFO decision in my own words.",
        "I understand that this is a tentative starting point that may change.",
    ):
        add_bullet(doc, item, checkbox=True)
    add_callout(
        doc,
        "Not required in Stage 1",
        "Do not verify the recommendation, validate a hypothesis, compare or defend alternatives, build an evidence register, prove the claim, complete formal citations, or seek a formal approval gate yet. Those more rigorous activities belong in later stages.",
        fill=PALE_TERRA,
        accent=TERRA,
    )

    doc.save(output)
    return output


def iter_paragraphs(doc: Document):
    seen_cells: set[object] = set()
    for paragraph in doc.paragraphs:
        yield paragraph
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                marker = cell._tc
                if marker in seen_cells:
                    continue
                seen_cells.add(marker)
                for paragraph in cell.paragraphs:
                    yield paragraph
                for nested in cell.tables:
                    for nested_row in nested.rows:
                        for nested_cell in nested_row.cells:
                            for paragraph in nested_cell.paragraphs:
                                yield paragraph
    for section in doc.sections:
        for part in (section.header, section.footer, section.even_page_header, section.even_page_footer):
            for paragraph in part.paragraphs:
                yield paragraph


def set_paragraph_text(paragraph, text: str) -> None:
    if paragraph.runs:
        paragraph.runs[0].text = text
        for run in paragraph.runs[1:]:
            run.text = ""
    else:
        paragraph.add_run(text)


def replace_text(doc: Document, old: str, new: str, *, required=True) -> int:
    count = 0
    for paragraph in iter_paragraphs(doc):
        if old in paragraph.text:
            set_paragraph_text(paragraph, paragraph.text.replace(old, new))
            count += 1
    if required and count == 0:
        raise ValueError(f"required DOCX text not found: {old}")
    return count


def set_approved_footer(doc: Document, source_version: str, source_hash: str, *, rubric=False) -> None:
    for section in doc.sections:
        footer = section.footer
        paragraph = footer.paragraphs[0]
        clear_paragraph(paragraph)
        paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        label = f"Rubric v{source_version} · {source_hash[:12]}  |  Page " if rubric else "Approved student release  |  Page "
        run = paragraph.add_run(label)
        set_run_font(run, size=8.5, color=GRAY)
        add_page_field(paragraph)


def patch_assignment(capstone: dict, source_hash: str) -> Path:
    path = CAPSTONE / "bus311-capstone-assignment.docx"
    doc = Document(path)
    replacements = [
        ("Canonical source version 1.0.0 | Updated: July 30, 2026", "Canonical source version 1.3.0 | Updated: August 11, 2026"),
        ("propose one company-specific CFO decision for instructor approval", "propose one potential company-specific CFO decision during Stage 1"),
        ("One instructor-approved, publicly traded U.S. company", "One approved public company listed in the United States"),
        ("One material, company-specific CFO decision, with two or three supporting actions", "Stage 1 proposes one potential CFO decision; later stages develop one evidence-backed company-specific decision with two or three supporting actions"),
        ("SEC filings, FactSet, Excel analysis, and other credible named sources", "Stage 1 introductory research plus one concrete FactSet learning; later stages use traceable SEC, FactSet, Excel, and other credible named sources"),
        ("Exactly four bounded free-tier checkpoints; AI may challenge but may not replace your analysis", "Stage 1 may use AI and/or ordinary web search; four bounded checkpoints and verification begin after Stage 1"),
        ("appropriate to the approved CFO question", "appropriate to the developed CFO question"),
        ("Act as an internal corporate finance analyst advising the selected company's CFO and Board. Your job is to recommend one primary decision, not to summarize the company or issue an investor rating.", "Act as an internal corporate finance analyst advising the selected company's CFO and Board. Stage 1 begins with one potential decision; later stages turn that idea into an evidence-backed recommendation."),
        ("Your decision proposal must:", "By the final stages, your decision must:"),
        ("The instructor must approve both the company and the decision scope. Approval may require a narrower question, different evidence, or a different decision if the proposed scope is too broad, too descriptive, duplicative in a way that limits learning, investor-focused, or not supportable with available evidence.", "Stage 1 is exploratory. You do not need to verify the recommendation, validate a hypothesis, compare or defend alternatives, build an evidence register, prove the claim, or secure a formal approval gate. Those more rigorous activities begin in later stages."),
        ("Choose one direction that fits your company, then rewrite it as a company-specific decision question. You may propose another direction if it meets every approval standard.", "Choose one direction that seems connected to your company, then rewrite it as a potential company-specific decision. Treat it as a beginner starting point that may change."),
        ("An acceptable decision is specific enough to analyze and defend within one semester.", "In Stage 1, a potential decision only needs to be specific enough to guide future research. Later stages make it analytical and defensible."),
        ("into the approved CFO decision", "into the developing CFO decision"),
        ("appropriate to the approved decision", "appropriate to the developing decision"),
        ("Submit company name, ticker, exchange, and a concise company-fit rationale. This is the opening part of Milestone 1.", "Select an approved public company; record its name, ticker, and exchange; then begin introductory AI and/or web research plus required FactSet exploration."),
        ("Milestone 1 - Company and CFO decision: submit the decision approval packet and initial evidence register. Do not proceed with a final project thesis until approved.", "Stage 1 - Company research and potential CFO decision: submit the exploration brief with a company snapshot, one concrete FactSet learning and the screen/report/feature used, and one tentative CFO decision. No evidence register, verification, or approval gate is required yet."),
        ("Milestone 1 - Company and approved CFO decision (5 points)", "Milestone 1 - Company research and potential CFO decision (5 points)"),
        ("Submit one approval packet containing:", "Submit one Stage 1 company exploration brief containing:"),
        ("A concise rationale showing that the company is publicly traded in the United States and has sufficient SEC, FactSet, and operating evidence.", "A short beginner-friendly snapshot of what the company does, based on AI and/or ordinary web search."),
        ("One primary CFO decision written as an actionable question.", "A brief note identifying whether you used AI, ordinary web search, or both for the introductory research."),
        ("Two or three proposed supporting actions and at least two credible alternatives.", "One concrete thing learned from FactSet and the screen, report, or feature used."),
        ("Why the decision is material and appropriate for the CFO and Board.", "One potential company-specific CFO decision written in your own words."),
        ("The BUS311 concepts and expected quantitative analysis needed to answer it.", "A short explanation of why the potential decision seems worth investigating."),
        ("An initial evidence register containing at least one SEC filing, one FactSet item, and two additional credible research leads.", "Two questions you want to research in Stage 2."),
        ("The Checkpoint 1 question-generation record, completed with a free AI version or the instructor-provided equivalent challenge prompt.", "A confirmation that Stage 1 is exploratory and does not yet require proof, hypothesis validation, alternatives, an evidence register, formal citations, or a formal approval gate."),
        ("Required evidence register", "Beginning in Stage 2: required evidence register"),
        ("Maintain one evidence register throughout the semester.", "Beginning in Stage 2, maintain one evidence register throughout the rest of the semester."),
        ("Free-tier AI rules: four bounded checkpoints", "Later-stage free-tier AI rules: four bounded checkpoints"),
        ("Assess: Verify useful output independently with SEC, FactSet, Excel, or course concepts.", "Assess: Beginning after Stage 1, verify useful output independently with SEC, FactSet, Excel, or course concepts."),
        ("1. Question generation", "1. Research-direction review"),
        ("Generate possible CFO decisions and research directions after you have selected a company.", "After Stage 1, challenge the potential CFO direction and identify research questions for later verification."),
        ("Tool, prompt, possible directions considered, retained research leads, independent verification, and your final decision rationale", "Potential direction reviewed, strongest challenge, evidence checked after Stage 1, and the next research questions"),
        ("Every checkpoint is required, but each must work in a free AI version.", "The four checkpoints begin after the exploratory Stage 1 brief, and each must work in a free AI version."),
        ("Company and approved CFO decision", "Company exploration and potential CFO decision"),
        ("Company fit, material decision, alternatives, two or three supporting actions, evidence-register setup, and initial research questions", "Approved company, introductory AI and/or web research, one concrete FactSet learning with the feature named, and one potential CFO decision"),
        ("A late milestone delays instructor feedback and approval, and the student may not advance to a dependent project stage until the required work is complete.", "A late milestone delays instructor feedback and can make dependent project work harder; complete missing milestone work before relying on it in a later stage."),
        ("The company and CFO decision were approved.", "The company and final CFO decision are clearly identified and supported."),
    ]
    for old, new in replacements:
        replace_text(doc, old, new)

    doc.core_properties.comments = (
        f"Derived from CAPSTONE/source/bus311-capstone.json v{capstone['meta']['sourceVersion']}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = capstone["meta"]["sourceVersion"]
    set_approved_footer(doc, capstone["meta"]["sourceVersion"], source_hash)
    doc.save(path)
    return path


def patch_student_rubric(capstone: dict, source_hash: str) -> Path:
    path = CAPSTONE / "bus311-capstone-student-rubric.docx"
    doc = Document(path)
    criterion = next(item for item in capstone["rubric"]["criteria"] if item["criterionId"] == "M01_CFO_DECISION")
    replacements = [
        ("Schema v1.0.0", f"Schema v{capstone['meta']['sourceVersion']}"),
        ("d2a6d9101f1d60048c071272ce5db5d46910bac2e8a409339d506ac801c97cfd", source_hash),
        ("Company and approved CFO decision", criterion["title"]),
        ("Establishes a suitable U.S. public company, one material company-specific CFO decision, genuine alternatives, and an evidence plan that can support an individual semester-long analysis.", criterion["description"]),
        ("Approved company, ticker, exchange, and individual owner are identified.", criterion["evidenceRules"][0]),
        ("The decision is written as a CFO-and-Board action question with two or more genuine alternatives and a material finance consequence.", criterion["evidenceRules"][1]),
        ("The initial evidence register includes at least one SEC filing, one permitted FactSet item, and two additional credible research leads, each with period, units, and location details.", criterion["evidenceRules"][2]),
        ("Any AI-generated research lead is independently verified before it is retained; the student's final scope judgment is recorded.", criterion["evidenceRules"][3]),
        ("Scope is material, company-specific, feasible, and decision-ready; alternatives and finance consequences are explicit; the SEC/FactSet evidence register is complete and all retained research leads are verified.", criterion["performanceLevels"]["EXEMPLARY"]),
        ("Company and decision are suitable and approved; alternatives and evidence are credible, with only minor gaps in specificity, traceability, or scope rationale.", criterion["performanceLevels"]["PROFICIENT"]),
        ("The decision is broad, descriptive, or weakly linked to a finance consequence; alternatives are thin or the evidence register has material sourcing and verification gaps.", criterion["performanceLevels"]["DEVELOPING"]),
        ("Company or decision is unapproved, unsuitable, unsupported, or not framed for the CFO and Board; evidence is missing, fabricated, or not individually attributable.", criterion["performanceLevels"]["INSUFFICIENT"]),
        ("Generated from BUS311-capstone-rubric-schema.json, version 1.0.0, SHA-256", f"Generated from CAPSTONE/source/bus311-capstone.json, version {capstone['meta']['sourceVersion']}, SHA-256"),
    ]
    for old, new in replacements:
        replace_text(doc, old, new)
    remove_empty_page_break_before(doc, "2. One-page executive summary — 15 points")
    doc.core_properties.comments = (
        f"Derived from CAPSTONE/source/bus311-capstone.json v{capstone['meta']['sourceVersion']}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = capstone["meta"]["sourceVersion"]
    set_approved_footer(doc, capstone["meta"]["sourceVersion"], source_hash, rubric=True)
    doc.save(path)
    return path


def patch_ai_guide(capstone: dict, source_hash: str) -> Path:
    path = CAPSTONE / "bus311-capstone-ai-student-guide.docx"
    doc = Document(path)
    replacements = [
        ("AI is not a source. Every claim or calculation you retain must be verified with SEC filings, permitted FactSet evidence, your Excel model, or BUS311 course concepts.", "AI is not a source. The four required C-A-P-A-J checkpoints begin after Stage 1. Stage 1 ideas are exploratory; later retained claims or calculations must be verified with SEC, permitted FactSet evidence, Excel, or BUS311 course concepts."),
        ("Four short checkpoints", "Four later-stage checkpoints"),
        ("1. Questions", "1. Research direction"),
        ("Generate possible CFO questions and research directions.", "After Stage 1, challenge the potential CFO direction and identify later research questions."),
        ("Directions considered, research leads retained, checks completed, final direction rationale.", "Potential direction reviewed, strongest challenge, evidence checked after Stage 1, and next research questions."),
        ("Checkpoint 1 - CFO questions and research directions", "Checkpoint 1 - Research-direction review after Stage 1"),
        ("Complete after selecting the company and before locking the project direction. Ask for possible decision questions and research paths, not for a final recommendation.", "The checkpoints begin after Stage 1. Bring the potential CFO direction from your Stage 1 exploration brief and ask for challenges and research paths, not a final recommendation."),
        ("Paste a short public-company summary that you wrote yourself.", "Paste a short, student-written public-company summary from the Stage 1 exploration brief."),
        ("Request several decision questions, competing explanations, and evidence targets.", "Request challenges, missing questions, and evidence targets for the potential direction."),
        ("Check whether the suggested directions are material, company-specific, researchable, and tied to BUS311 concepts.", "Beginning after Stage 1, check whether the direction is company-specific, researchable, and tied to BUS311 concepts."),
        ("Retain only directions you can support with SEC, permitted FactSet evidence, Excel, or course concepts.", "Retain later-stage claims only after checking them with SEC, permitted FactSet evidence, Excel, or course concepts."),
    ]
    for old, new in replacements:
        replace_text(doc, old, new)
    doc.core_properties.comments = (
        f"Stage 1 boundary aligned to CAPSTONE/source/bus311-capstone.json v{capstone['meta']['sourceVersion']}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = capstone["meta"]["sourceVersion"]
    doc.save(path)
    return path


def patch_capaj_prompts(capstone: dict, source_hash: str) -> Path:
    path = CAPSTONE / "bus311-capstone-capaj-prompts.docx"
    doc = Document(path)
    replacements = [
        ("Checkpoint 1 - Generate CFO questions and research directions", "Checkpoint 1 - Review a potential CFO direction after Stage 1"),
        ("Context to prepare: company, public business model, preliminary revenue engine, and the decision areas you are considering. Assumptions to expose: what you currently believe matters and what you may be overlooking.", "Context to prepare: the company snapshot, required FactSet learning, and one potential CFO decision from the Stage 1 exploration brief. Assumptions to expose: what you currently believe matters and what you may be overlooking."),
        ("You are a skeptical corporate CFO helping me generate research questions, not giving me a final answer. Use only the sanitized context below. Do not browse, cite sources, invent company facts, calculate financial outputs, or recommend a final decision.", "You are a skeptical corporate CFO helping me review a potential research direction after Stage 1, not giving me a final answer. Use only the sanitized context below. Do not browse, cite sources, invent company facts, calculate financial outputs, or recommend a final decision."),
        ("Possible CFO decision areas: [list]", "Potential CFO decision from Stage 1: [one sentence]"),
        ("1. Propose 5 company-specific CFO decision questions.", "1. Identify the three most important questions I should investigate before treating this potential decision as a recommendation."),
        ("2. For each, name the key uncertainty, competing explanation, BUS311 concept, and public evidence I should independently seek.", "2. For each question, name the key uncertainty, a competing explanation, the BUS311 concept involved, and the public evidence I should independently seek."),
        ("3. Identify 2 directions that are too broad, weakly causal, or difficult to verify and explain why.", "3. Identify any part of the potential decision that is too broad, weakly causal, or difficult to verify and explain why."),
        ("4. End with a short list of research leads only. Do not choose for me.", "4. End with a short list of research leads only. Do not validate the Stage 1 idea or choose for me."),
        ("Can the direction be supported with specific SEC, permitted FactSet, Excel, and course evidence?", "This checkpoint occurs after the Stage 1 exploration brief. Can the direction now be tested with specific SEC, permitted FactSet, Excel, and course evidence?"),
        ("Is it material, company-specific, causal, and appropriate for the CFO and Board?", "Which parts remain tentative, and what evidence would be needed before calling the direction material, causal, or recommendation-ready?"),
        ("Record which directions you accepted, modified, or rejected and why. Your final project direction must be your decision and still requires instructor approval.", "Record what you accepted, modified, or rejected and why. Your final direction remains your decision. There is no formal Stage 1 approval gate; verification and judgment occur through the later checkpoints."),
    ]
    for old, new in replacements:
        replace_text(doc, old, new)
    remove_empty_page_break_before(doc, "Checkpoint 4 - Rehearse Board Q&A")
    doc.core_properties.comments = (
        f"Stage 1 boundary aligned to CAPSTONE/source/bus311-capstone.json v{capstone['meta']['sourceVersion']}; "
        f"SHA-256 {source_hash}"
    )
    doc.core_properties.version = capstone["meta"]["sourceVersion"]
    doc.save(path)
    return path


def main() -> int:
    source_bytes = SOURCE.read_bytes()
    capstone = json.loads(source_bytes)
    source_hash = hashlib.sha256(source_bytes).hexdigest()
    outputs = [
        build_stage_one_menu(capstone, source_hash),
        build_stage_one_brief(capstone, source_hash),
        patch_assignment(capstone, source_hash),
        patch_student_rubric(capstone, source_hash),
        patch_ai_guide(capstone, source_hash),
        patch_capaj_prompts(capstone, source_hash),
    ]
    for output in outputs:
        print(output.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
