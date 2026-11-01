"""Check the simplified M03 contract, blank response cells and student release links."""
import json,zipfile,xml.etree.ElementTree as ET,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'CAPSTONE';d=json.loads((P/'source/bus311-capstone.json').read_text());m=d['milestone3']
assert d['meta']['sourceVersion']=='2.3.0' and m['status']=='Ready'
assert [s['name'] for s in m['sheets']]==['Peer comparison','P-E check','AI challenge']
assert sum(c['points'] for c in m['rubric'])==m['points']==12
assert [c['points'] for c in m['rubric']]==[3,3,2,4]
assert sum(c['points'] for c in d['rubric']['criteria'])==100
assert [s['points'] for s in d['hub']['stages']]==[5,8,12,75]
assert len(m['ratios'])==5 and d['scope']['peers']==2
with zipfile.ZipFile(P/'bus311-capstone-m03-peer-comparison.xlsx') as z:
 strings=[]
 if 'xl/sharedStrings.xml' in z.namelist():strings=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
 tabs=ET.fromstring(z.read('xl/workbook.xml')).findall('.//{*}sheet')
 assert [x.get('name') for x in tabs]==[s['name'] for s in m['sheets']]
 assert all(x.get('state','visible')=='visible' for x in tabs)
 assert not any('externalLinks/' in n or 'vbaProject' in n for n in z.namelist())
 for i,spec in enumerate(m['sheets'],1):
  s=ET.fromstring(z.read(f'xl/worksheets/sheet{i}.xml'));cells={}
  for c in s.findall('.//{*}sheetData/{*}row/{*}c'):
   assert c.get('t')!='e',(spec['name'],c.get('r'))
   v=c.find('{*}v');ins=c.find('{*}is');value=v.text if v is not None else ''.join(ins.itertext()) if ins is not None else ''
   if c.get('t')=='s' and value:value=strings[int(value)]
   cells[c.get('r')]=(value,c.find('{*}f'))
  for f in spec['fields']:
   assert cells[f'A{f["row"]}'][0]==f['label']
   assert cells.get(f'B{f["row"]}',('',None))[0] in ('',None)
  blank=[]
  if spec['name']=='Peer comparison':blank=[f'{c}{r}' for c in 'BCD' for r in [8,9,10,12,13,14,15,16]]+[f'E{r}' for r in range(12,17)]+['F16','B41','B42','B43','B44']
  if spec['name']=='P-E check':blank=[f'{c}{r}' for c in 'BCD' for r in [11,12,13,15]]+['B20','B21','B22']
  for address in blank:assert cells.get(address,('',None))[0] in ('',None) and cells.get(address,('',None))[1] is None,(spec['name'],address)
 xml=''.join(z.read(n).decode() for n in z.namelist() if n.endswith('.xml'))
 assert not any(x in xml for x in ['Coastline Foods','Maple Grove Brands','Harbor Pantry','Instructor notes'])
 assert 'Act as a skeptical CFO' in xml and 'Strongest AI objection' in xml
 assert not any(re.fullmatch(r'xl/(?:drawings/)?charts/chart\d+\.xml',n) for n in z.namelist())
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.text=[]
 def handle_starttag(self,t,a):
  if t=='a':self.links.append(dict(a).get('href',''))
 def handle_data(self,t):self.text.append(t)
for name in ['bus311-capstone-m03-peer-comparison.html','index.html','bus311-capstone-canvas.html']:
 page=Page();raw=(P/name).read_text();page.feed(raw);text=' '.join(page.text)
 for c in m['rubric']:assert c['title'] in text and c['detail'] in text
 assert 'bus311-capstone-m03-peer-comparison.xlsx' in raw
 for link in page.links:
  if link.startswith('./'):assert (P/link[2:]).is_file(),link
assert m['submission']==d['hub']['stages'][2]['submit']
assert 'AI challenge' in m['submission'] and 'optional' in ' '.join(m['peGuidance'])
print('PASS: simplified 12-point M03, three blank student tabs, one annual snapshot, five ratios, one P/E estimate, AI challenge, no solutions and valid local links.')
