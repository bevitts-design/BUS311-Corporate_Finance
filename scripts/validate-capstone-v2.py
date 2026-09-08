"""Validate the simplified assessment contract and its exported artifacts."""
import hashlib,json,re,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1];p=root/'CAPSTONE';source=p/'source/bus311-capstone.json';d=json.loads(source.read_text());term=json.loads((root/'terms/fall-2026.json').read_text())
assert d['meta']['sourceVersion']=='2.0.0'
assert [s['points'] for s in d['hub']['stages']]==[5,8,12,75]
assert [m['due'] for m in d['milestones']]==['2026-09-09T12:30:00-04:00','2026-09-30T12:30:00-04:00','2026-11-04T12:30:00-05:00']
assert [(m['milestoneId'],m['due']) for m in term['capstone']['milestones']]==[(m['milestoneId'],m['due']) for m in d['milestones']]
assert sum(c['points'] for c in d['rubric']['criteria'])==100
assert [c['points'] for c in d['rubric']['criteria'] if c['criterionId'].startswith('PPT_')]==[10,20,10,10]
assert len(d['rubric']['criteria'])==9 and d['scope']['challengeCount']==1
assert d['scope']['historyYears']==3 and d['scope']['drivers']==2 and d['scope']['peers']==1 and d['scope']['risks']==2
assert len(d['materials'])==4 and len(d['decisionPaths'])==2
assert d['scope']['workbookSheets']==['Start','Revenue','Model','Sources','Revision','Example']
assert d['finalSubmission']['deadline']==term['capstone']['finalFileDeadline']=='2026-11-30T12:30:00-05:00'
assert d['presentationSchedule']['presentationMinutes']==7 and d['presentationSchedule']['questionMinutes']==3
texts=[]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.text=[]
 def handle_starttag(self,t,a):
  if t=='a':self.links.append(dict(a).get('href',''))
 def handle_data(self,t):self.text.append(t)
for f in ['index.html','bus311-capstone-canvas.html']:
 raw=(p/f).read_text();page=Page();page.feed(raw);text=' '.join(page.text);texts.append(text)
 for s in d['hub']['stages']:assert s['title'] in text and s['dateLabel'] in text
 for c in d['rubric']['criteria']:assert c['title'] in text and c['description'] in text
 for link in page.links:
  if link.startswith('./'):assert (p/link[2:]).exists(),link
 if 'canvas' in f:assert not re.search(r'<(?:script|style|html|body)\b',raw)
for m in d['materials']:assert (root/m['path']).is_file(),m['path']
with zipfile.ZipFile(p/'bus311-capstone-project-workbook.xlsx') as z:
 names=z.namelist();book=ET.fromstring(z.read('xl/workbook.xml'));sheets=book.findall('.//{*}sheet')
 assert [s.get('name') for s in sheets]==d['scope']['workbookSheets']
 assert all(s.get('state','visible')=='visible' for s in sheets)
 assert not any(n.startswith('xl/externalLinks/') or 'vbaProject' in n for n in names)
 xml=''.join(z.read(n).decode() for n in names if n.endswith('.xml'))
 assert not re.search(r'#REF!|#DIV/0!|#VALUE!|#NAME\?|#NUM!',xml)
 assert 'Working-capital improvement' in xml and 'Net present value' in xml
 assert 'fictional' in xml and '2.65' in xml
 texts.append(xml)
with zipfile.ZipFile(p/'bus311-capstone-board-deck-template.pptx') as z:
 slides=sorted([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',n)])
 assert len(slides)==6
 for i,n in enumerate(slides):
  r=ET.fromstring(z.read(n));text=' '.join(x.text or '' for x in r.findall('.//{*}t'));assert d['slideOutline'][i]['title'] in text;texts.append(text)
  assert r.findall('.//{*}txBody'),'Slides must retain editable text'
 for n in z.namelist():
  if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',n):texts.append(z.read(n).decode())
with zipfile.ZipFile(p/'bus311-capstone-assignment.docx') as z:
 r=ET.fromstring(z.read('word/document.xml'));text=' '.join(x.text or '' for x in r.findall('.//{*}t'));texts.append(text)
 for s in d['hub']['stages']:assert s['title'] in text
for text in texts:
 assert not re.search(r'C-A-P-A-J|eight-step|nine visible|four required|four checkpoints|8-10|November 22|Nov\. 22|Stage 5|three to five years',text,re.I),'Obsolete active requirement'
prov=json.loads((p/'output-provenance.json').read_text());assert prov['sourceSha256']==hashlib.sha256(source.read_bytes()).hexdigest()
assert len(prov['artifacts'])==7
for a in prov['artifacts']:assert hashlib.sha256((root/a['path']).read_bytes()).hexdigest()==a['sha256'],a['path']
print('Capstone v2 PASS: four stages, six workbook tabs, two decision paths, nine criteria, 100 points, six slides, current links and matching artifact hashes.')
