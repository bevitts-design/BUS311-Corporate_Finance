"""Check the M03 assessment contract and saved blank student workbook."""
import json,zipfile,xml.etree.ElementTree as ET,re,hashlib
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'CAPSTONE';d=json.loads((P/'source/bus311-capstone.json').read_text());m=d['milestone3']
assert d['meta']['sourceVersion']=='2.2.0' and m['status']=='Ready'
assert sum(c['points'] for c in m['rubric'])==m['points']==12
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
  if spec['name']=='Company ratios':blank=[f'{c}{r}' for c in 'BCD' for r in list(range(10,21))+[23,27,28,29,30,31]]
  if spec['name']=='Peer comparison':blank=[f'{c}{r}' for c in 'CD' for r in [8]+list(range(10,21))+[23,27,28,29,30,31]]+[f'E{r}' for r in range(27,32)]
  if spec['name']=='P-E check':blank=[f'{c}{r}' for c in 'BCD' for r in [11,12,13,15,20,21,22]]
  for address in blank:assert cells.get(address,('',None))[0] in ('',None) and cells.get(address,('',None))[1] is None,(spec['name'],address)
 xml=''.join(z.read(n).decode() for n in z.namelist() if n.endswith('.xml'))
 assert not any(x in xml for x in ['Coastline Foods','Maple Grove Brands','Harbor Pantry','Instructor notes','Source ID'])
 charts=[n for n in z.namelist() if re.fullmatch(r'xl/(?:drawings/)?charts/chart\d+\.xml',n)];assert len(charts)==1
 chart=ET.fromstring(z.read(charts[0]));refs=[x.text for x in chart.findall('.//{*}f')]
 assert any('A57:A59' in x.replace('$','') for x in refs) and any('B57:B59' in x.replace('$','') for x in refs),refs
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.text=[]
 def handle_starttag(self,t,a):
  if t=='a':self.links.append(dict(a).get('href',''))
 def handle_data(self,t):self.text.append(t)
for name in ['bus311-capstone-m03-peer-comparison.html','index.html','bus311-capstone-canvas.html']:
 page=Page();page.feed((P/name).read_text());text=' '.join(page.text)
 for c in m['rubric']:assert c['title'] in text and c['detail'] in text
 assert 'bus311-capstone-m03-peer-comparison.xlsx' in (P/name).read_text()
 for link in page.links:
  if link.startswith('./'):assert (P/link[2:]).is_file(),link
assert m['submission']==d['hub']['stages'][2]['submit']
print('PASS: M03 12-point contract, four blank student sheets, no solutions, formula-response cells, editable chart bindings, current instructions and local links.')
