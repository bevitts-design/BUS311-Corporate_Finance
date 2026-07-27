#!/usr/bin/env python3
"""Generate the BUS311 Lemonade Stand student guide PDF from Markdown."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

NAVY = colors.HexColor("#14213D")
TERRA = colors.HexColor("#9C4A2B")
GOLD = colors.HexColor("#D8A34B")
WARM = colors.HexColor("#F7F2EA")
BLUE = colors.HexColor("#DDEBF7")
TEXT = colors.HexColor("#202938")
MUTED = colors.HexColor("#667085")


def escape_inline(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", text)
    if text.startswith("http://") or text.startswith("https://"):
        return f"<link href='{text}' color='#0563C1'>{text}</link>"
    return text


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.34 * inch, width, 0.34 * inch, fill=1, stroke=0)
    canvas.setFillColor(TERRA)
    canvas.rect(0, 0, width, 0.16 * inch, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.55 * inch, 0.28 * inch, "BUS311 Corporate Finance | M04 Apply Activity")
    canvas.drawRightString(width - 0.55 * inch, 0.28 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "GuideTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=29,
            textColor=NAVY,
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "h2": ParagraphStyle(
            "GuideH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=18,
            textColor=TERRA,
            spaceBefore=8,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "GuideH3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=14,
            textColor=NAVY,
            backColor=BLUE,
            borderColor=GOLD,
            borderWidth=0.6,
            borderPadding=6,
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "GuideBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.6,
            leading=13.2,
            textColor=TEXT,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "GuideBullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=12.7,
            leftIndent=15,
            firstLineIndent=-8,
            bulletIndent=5,
            textColor=TEXT,
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "GuideSubtitle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=TERRA,
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "url": ParagraphStyle(
            "GuideURL",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.3,
            leading=11,
            textColor=colors.HexColor("#0563C1"),
            alignment=TA_CENTER,
            backColor=WARM,
            borderColor=GOLD,
            borderWidth=0.7,
            borderPadding=7,
            spaceAfter=10,
        ),
    }


def parse_markdown(source: Path, styles: dict[str, ParagraphStyle]):
    lines = source.read_text(encoding="utf-8").splitlines()
    story = []
    first_title = True
    paragraph = []

    def flush_paragraph():
        nonlocal paragraph
        if paragraph:
            text = " ".join(x.strip() for x in paragraph).strip()
            if text:
                style = styles["url"] if text.startswith("http") else styles["body"]
                story.append(Paragraph(escape_inline(text), style))
            paragraph = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush_paragraph()
            continue
        if stripped == "---":
            flush_paragraph()
            story.append(PageBreak())
            continue
        if stripped.startswith("# "):
            flush_paragraph()
            text = escape_inline(stripped[2:])
            story.append(Spacer(1, 0.08 * inch))
            story.append(Paragraph(text, styles["title"]))
            if first_title:
                story.append(Paragraph("Prepare - Model - Analyze - Decide", styles["subtitle"]))
                first_title = False
            continue
        if stripped.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(escape_inline(stripped[3:]), styles["h2"]))
            continue
        if stripped.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(escape_inline(stripped[4:]), styles["h3"]))
            continue
        if stripped.startswith("- "):
            flush_paragraph()
            story.append(Paragraph(f"<bullet>&bull;</bullet>{escape_inline(stripped[2:])}", styles["bullet"]))
            continue
        paragraph.append(stripped)

    flush_paragraph()
    return story


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(args.output),
        pagesize=letter,
        rightMargin=0.58 * inch,
        leftMargin=0.58 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.52 * inch,
        title="BUS311 Lemonade Stand Finance Model",
        author="Professor Bethany Evitts",
        subject="BUS311 M04 student activity guide",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="content")
    doc.addPageTemplates([PageTemplate(id="guide", frames=[frame], onPage=page_decor)])
    styles = build_styles()
    story = parse_markdown(args.source, styles)
    doc.build(story)
    print(args.output)


if __name__ == "__main__":
    main()
