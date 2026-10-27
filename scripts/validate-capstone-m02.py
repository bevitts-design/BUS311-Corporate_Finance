"""Check the revised public contract, blank student workbook, and generated links."""
import hashlib,json,re,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'CAPSTONE';source=P/'source/bus311-capstone.json';d=json.loads(source.read_text());m=d['milestone2']
assert d['meta']['sourceVersion']=='2.2.0'
assert sum(c['points'] for c in m['rubric'])==m['points']==8
assert sum(c['points'] for c in d['rubric']['criteria'])==100
assert [s['points'] for s in d['hub']['stages']]==[5,8,12,75]
assert d['revisionPlan']['milestone3']['status']=='Ready'
assert d['scope']['peers']==2
term=json.loads((ROOT/'terms/fall-2026.json').read_text())
assert [(x['milestoneId'],x['due']) for x in d['milestones']]==[(x['milestoneId'],x['due']) for x in term['capstone']['milestones']]

def cell_values(z,sheet):
 strings=[]
 if 'xl/sharedStrings.xml' in z.namelist():
  strings=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
 cells={}
 for c in sheet.findall('.//{*}sheetData/{*}row/{*}c'):
  v=c.find('{*}v');s=c.find('{*}is')
  value=(v.text or '') if v is not None else ''.join(s.itertext()) if s is not None else ''
  if c.get('t')=='s' and value:value=strings[int(value)]
  cells[c.get('r')]=value
 return cells

with zipfile.ZipFile(P/'bus311-capstone-m02-follow-the-dollar.xlsx') as z:
 book=ET.fromstring(z.read('xl/workbook.xml'));tabs=book.findall('.//{*}sheet')
 assert [t.get('name') for t in tabs]==[s['name'] for s in m['sheets']]
 assert all(t.get('state','visible')=='visible' for t in tabs)
 assert not any('externalLinks/' in n or 'vbaProject' in n for n in z.namelist())
 for i,spec in enumerate(m['sheets'],1):
  sheet=ET.fromstring(z.read(f'xl/worksheets/sheet{i}.xml'));v=cell_values(z,sheet)
  assert not sheet.findall('.//{*}f'),'Student formula response cells must remain blank'
  assert not sheet.findall('.//{*}c[@t="e"]'),'Formula error in saved student file'
  for f in spec['fields']:
   assert v.get(f'A{f["row"]}')==f['label']
   assert v.get(f'B{f["row"]}','')==''
  if spec['name']=='Revenue history':
   for a in ['B9','C9','D9','B10','C10','D10','C12','D12']:assert v.get(a,'')==''
  if spec['name']=='Next dollar':
   for a in ['B29','B30','B31','B32']:assert v.get(a,'')==''
 xml=''.join(z.read(n).decode() for n in z.namelist() if n.endswith('.xml'))
 assert not any(word in xml for word in ['Coastline Foods','240000','Instructor notes','Source ID','source ID','Sources'])
 assert [s['name'] for s in m['sheets']]==['Follow the dollar','Revenue history','Next dollar']

class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.text=[]
 def handle_starttag(self,t,a):
  if t=='a':self.links.append(dict(a).get('href',''))
 def handle_data(self,t):self.text.append(t)
for name in ['index.html','bus311-capstone-m02-follow-the-dollar.html','bus311-capstone-canvas.html']:
 page=Page();raw=(P/name).read_text();page.feed(raw);text=' '.join(page.text)
 assert m['title'] in text
 for c in m['rubric']:assert c['title'] in text and c['detail'] in text
 for link in page.links:
  if link.startswith('./'):assert (P/link[2:]).is_file(),link
 assert 'bus311-capstone-project-workbook.xlsx' not in raw
 assert 'bus311-capstone-assignment.pdf' not in raw
 if 'canvas' in name:assert not re.search(r'<(?:script|style|html|body)\b',raw)
prov=json.loads((P/'output-provenance.json').read_text())
assert prov['sourceSha256']==hashlib.sha256(source.read_bytes()).hexdigest()
for a in prov['artifacts']:assert hashlib.sha256((ROOT/a['path']).read_bytes()).hexdigest()==a['sha256'],a['path']
print('PASS: eight-point M02 contract, blank student cells, visible public tabs, no solutions, matching source hashes, working generated links, unchanged milestone dates.')
