"""Repair the exporter’s missing chart caches while preserving live cell references.

Only chart cache metadata is written here. Artifact Tool owns all worksheet data,
formulas, layout, calculation, and native chart creation.
"""
import json,sys,zipfile,xml.etree.ElementTree as ET,re
from pathlib import Path
file=Path(sys.argv[1]);rows=json.loads(Path(sys.argv[2]).read_text());ns='http://schemas.openxmlformats.org/drawingml/2006/chart'
ET.register_namespace('c',ns);tag=lambda n:f'{{{ns}}}{n}'
with zipfile.ZipFile(file) as z:items=[(info,z.read(info.filename)) for info in z.infolist()]
patched=[]
for info,data in items:
 if re.fullmatch(r'xl/(?:drawings/)?charts/chart\d+\.xml',info.filename):
  root=ET.fromstring(data)
  for ref in root.findall('.//'+tag('strRef')):
   formula=ref.find(tag('f'))
   if formula is None or 'A57:$A$59' not in (formula.text or '').replace('$A$57','A57'):continue
   old=ref.find(tag('strCache'))
   if old is not None:ref.remove(old)
   cache=ET.SubElement(ref,tag('strCache'));ET.SubElement(cache,tag('ptCount'),{'val':str(len(rows))})
   for i,row in enumerate(rows):
    if row[0] not in ('',None):ET.SubElement(ET.SubElement(cache,tag('pt'),{'idx':str(i)}),tag('v')).text=str(row[0])
  for ref in root.findall('.//'+tag('numRef')):
   formula=ref.find(tag('f'))
   if formula is None or 'B57:$B$59' not in (formula.text or '').replace('$B$57','B57'):continue
   old=ref.find(tag('numCache'))
   if old is not None:ref.remove(old)
   cache=ET.SubElement(ref,tag('numCache'));ET.SubElement(cache,tag('formatCode')).text='0.00"x"';ET.SubElement(cache,tag('ptCount'),{'val':str(len(rows))})
   for i,row in enumerate(rows):
    if isinstance(row[1],(int,float)):ET.SubElement(ET.SubElement(cache,tag('pt'),{'idx':str(i)}),tag('v')).text=str(row[1])
  data=ET.tostring(root,encoding='utf-8',xml_declaration=True)
 patched.append((info,data))
temp=file.with_suffix('.cache-tmp.xlsx')
with zipfile.ZipFile(temp,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for info,data in patched:z.writestr(info,data)
temp.replace(file)
