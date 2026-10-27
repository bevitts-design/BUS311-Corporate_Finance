"""Render the maintained M02 HTML instructions as a student PDF (no workbook changes)."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[1]

class Node:
    def __init__(self, tag='', attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []

class Document(HTMLParser):
    def __init__(self):
        super().__init__(); self.root=Node(); self.stack=[self.root]
    def handle_starttag(self, tag, attrs):
        n=Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in ('br','meta','link','img','hr','input'): self.stack.append(n)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack=self.stack[:i];break
    def handle_data(self, s): self.stack[-1].children.append(s)

def clean(s):
    for a,b in [('→',' -> '),('–','-'),('—','-'),('‑','-'),('“','"'),('”','"'),('’',"'"),('‘',"'"),('\u00a0',' ')]:s=s.replace(a,b)
    return escape(s)

def inline(n):
    if isinstance(n,str):return clean(n)
    inside=''.join(inline(c) for c in n.children)
    if n.tag in ('strong','b'):return '<b>'+inside+'</b>'
    if n.tag in ('em','i'):return '<i>'+inside+'</i>'
    if n.tag=='br':return '<br/>'
    return inside

styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Body311',fontName='Helvetica',fontSize=10.5,leading=14.2,spaceAfter=8,textColor=colors.HexColor('#17354a')))
styles.add(ParagraphStyle(name='Title311',fontName='Times-Bold',fontSize=25,leading=28,spaceAfter=14,textColor=colors.HexColor('#17354a')))
styles.add(ParagraphStyle(name='Head311',fontName='Times-Bold',fontSize=16,leading=19,spaceBefore=15,spaceAfter=7,keepWithNext=True,textColor=colors.HexColor('#22684f')))
styles.add(ParagraphStyle(name='Kicker311',fontName='Helvetica-Bold',fontSize=9,leading=12,spaceAfter=10,textColor=colors.HexColor('#22684f')))
styles.add(ParagraphStyle(name='Cell311',parent=styles['Body311'],fontSize=9,leading=12,spaceAfter=0))
styles.add(ParagraphStyle(name='CellHead311',parent=styles['Cell311'],fontName='Helvetica-Bold',textColor=colors.white))
styles.add(ParagraphStyle(name='List311',parent=styles['Body311'],leftIndent=13,firstLineIndent=-10))
story=[]

def descendants(n,tag):
    if isinstance(n,str):return []
    return ([n] if n.tag==tag else [])+sum((descendants(c,tag) for c in n.children),[])

def render(n):
    if isinstance(n,str):return
    if n.tag in ('nav','footer','style','script'):return
    if n.tag=='h1':story.append(Paragraph(inline(n),styles['Title311']))
    elif n.tag in ('h2','h3'):story.append(Paragraph(inline(n),styles['Head311']))
    elif n.tag in ('p','blockquote'):
        story.append(Paragraph(inline(n),styles['Kicker311'] if n.attrs.get('class')=='course' else styles['Body311']))
    elif n.tag in ('ul','ol'):
        items=[c for c in n.children if isinstance(c,Node) and c.tag=='li']
        for i,c in enumerate(items,1):
            story.append(Paragraph((str(i)+'. ' if n.tag=='ol' else '- ')+inline(c),styles['List311']))
    elif n.tag=='table':
        rows=descendants(n,'tr');data=[]
        for r in rows:
            data.append([Paragraph(inline(c),styles['CellHead311'] if c.tag=='th' else styles['Cell311']) for c in r.children if isinstance(c,Node) and c.tag in ('td','th')])
        widths=[115,405] if len(data[0])==2 else [120,45,355]
        t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#17354a')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#f3f7f5'),colors.white]),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#d8e3df'))]))
        story.extend([t,Spacer(1,9)])
    else:
        for c in n.children:render(c)

parser=Document();parser.feed((ROOT/'CAPSTONE/bus311-capstone-m02-follow-the-dollar.html').read_text())
main=descendants(parser.root,'main')[0];render(main)
out=ROOT/'CAPSTONE/bus311-capstone-m02-follow-the-dollar.pdf'
def footer(canvas,doc):
    canvas.saveState();canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#4d6269'))
    canvas.drawString(46,27,'BUS311 | Milestone 2 | Follow the Dollar | Canvas supplies the applicable deadline')
    canvas.drawRightString(566,27,str(doc.page));canvas.restoreState()
doc=SimpleDocTemplate(str(out),pagesize=(612,792),leftMargin=46,rightMargin=46,topMargin=40,bottomMargin=47,title='BUS311 Milestone 2 - Follow the Dollar',author='Professor Evitts',pageCompression=1,invariant=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print('Built',out)
