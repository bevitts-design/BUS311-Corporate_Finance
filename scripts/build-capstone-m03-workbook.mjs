import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const modules=process.env.RUNTIME_NODE_MODULES||'/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require=createRequire(path.join(modules,'__bus311_m03__.cjs'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);

// A single source and layout serve both the blank student file and private worked key.
export async function buildM03(source,output,qa,answers=null){
 const m=source.milestone3,wb=Workbook.create(),sheets={};
 const navy='#17354A',blue='#1757A6',green='#22684F',yellow='#FFF2CD',pale='#E4F0E8';
 const value=(s,a,v)=>s.getRange(a).values=[[v]],formula=(s,a,v)=>s.getRange(a).formulas=[[v]];
 const merge=(s,a,v)=>{s.getRange(a).merge();value(s,a.split(':')[0],v);};
 const edit=(s,a,calc=false)=>{s.getRange(a).format.fill=calc?pale:yellow;s.getRange(a).format.font.color=calc?'#000000':blue;};
 const head=(s,r,labels)=>{s.getRangeByIndexes(r-1,0,1,labels.length).values=[labels];s.getRange(`A${r}:F${r}`).format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:42,wrapText:true};};
 const link=(s,a,ref)=>{formula(s,a,`=IF(${ref}="","",${ref})`);s.getRange(a).format.font.color=green;};
 for(const spec of m.sheets){
  const s=wb.worksheets.add(spec.name);sheets[spec.name]=s;s.showGridLines=false;
  s.getRange('A1:F48').format={font:{name:'Arial',size:11,color:navy},rowHeight:25,verticalAlignment:'top',wrapText:true};
  s.getRange('A:A').format.columnWidth=34;s.getRange('B:D').format.columnWidth=21;s.getRange('E:E').format.columnWidth=20;s.getRange('F:F').format.columnWidth=25;
  merge(s,'A2:F2',spec.title);s.getRange('A2:F2').format={rowHeight:32,font:{name:'Arial',size:17,bold:true,color:navy}};
  merge(s,'A3:F3',spec.intro);s.getRange('A3:F3').format.rowHeight=46;
  head(s,4,['Question','Your response']);s.getRange('B4:F4').merge();value(s,'B4','Yellow: enter data/write responses. Pale green: enter Excel formulas.');
  for(const f of spec.fields){
   value(s,`A${f.row}`,f.label);s.getRange(`A${f.row}`).format.font.bold=true;
   merge(s,`B${f.row}:F${f.row}`,answers?.values?.[spec.name]?.[f.id]??'');edit(s,`B${f.row}:F${f.row}`);s.getRange(`A${f.row}:F${f.row}`).format.rowHeight=f.height;
   merge(s,`A${f.row+1}:F${f.row+1}`,f.prompt);s.getRange(`A${f.row+1}:F${f.row+1}`).format={rowHeight:44,font:{name:'Arial',size:10,italic:true,color:'#52646C'}};
  }
 }
 const peer=sheets['Peer comparison'],pe=sheets['P-E check'],ai=sheets['AI challenge'];
 head(peer,8,['Company / ticker','Your company','Peer 1','Peer 2','Peer median','Unit']);edit(peer,'B8:D8');for(const c of 'BCD')value(peer,`${c}8`,'');
 value(peer,'A9','Annual fiscal year-end date');edit(peer,'B9:D9');peer.getRange('B9:D9').setNumberFormat('mm/dd/yyyy');peer.getRange('A9:F9').format.rowHeight=42;
 value(peer,'A10','Statement currency / scale');edit(peer,'B10:D10');peer.getRange('A10:F10').format.rowHeight=42;
 head(peer,11,['Annual ratio','Your company','Peer 1','Peer 2','Selected-peer median','Unit']);
 for(const r of m.ratios){
  value(peer,`A${r.row}`,r.label);edit(peer,`B${r.row}:D${r.row}`);edit(peer,`E${r.row}`,true);peer.getRange(`B${r.row}:E${r.row}`).setNumberFormat(r.format);value(peer,`F${r.row}`,r.row===16?'':r.unit);peer.getRange(`A${r.row}:F${r.row}`).format.rowHeight=46;
 }
 edit(peer,'F16');merge(peer,'A17:F17','Retrieve consistently defined annual ratios from FactSet or credible reports. Convert percentages to Excel percentages (e.g., 12%); enter times as numbers (e.g., 2.00).');peer.getRange('A17:F17').format.rowHeight=44;
 head(peer,40,['Verify one company ratio','Your inputs / formula']);peer.getRange('B40:F40').merge();
 for(const [r,label,help]of [[41,'Numerator','Use the correct amount for the selected annual ratio'],[42,'Denominator','Use an average balance if the definition requires one'],[43,'Your calculated ratio','Numerator / denominator; apply the ratio unit'],[44,'Reported company ratio','Copy the matching company ratio from B12:B16']]){
  value(peer,`A${r}`,label);edit(peer,`B${r}`,r===43);merge(peer,`C${r}:F${r}`,help);peer.getRange(`A${r}:F${r}`).format.rowHeight=42;peer.getRange(`B${r}`).setNumberFormat('0.00');
 }
 head(pe,9,['Market input / calculation','Your company','Peer 1','Peer 2','Definition / help']);pe.getRange('E9:F9').merge();
 for(const [r,label,help]of [[10,'Company / ticker','Names link from Peer comparison'],[11,'Observed share price','One common observation date in B5'],[12,'Trailing diluted EPS','Reported/GAAP diluted TTM or LTM EPS'],[13,'TTM earnings end date','Earnings available on the price date'],[15,'P/E multiple','Price / positive trailing diluted EPS']]){
  value(pe,`A${r}`,label);merge(pe,`E${r}:F${r}`,help);pe.getRange(`A${r}:F${r}`).format.rowHeight=44;
  if(r===10)for(const c of 'BCD')link(pe,`${c}10`,`'Peer comparison'!${c}8`);else edit(pe,`B${r}:D${r}`,r===15);
 }
 pe.getRange('B11:D12').setNumberFormat('#,##0.00;(#,##0.00);"0.00"');pe.getRange('B13:D13').setNumberFormat('mm/dd/yyyy');pe.getRange('B15:D15').setNumberFormat('0.00"x"');
 head(pe,19,['One illustrative estimate','Your calculation','Meaning']);pe.getRange('C19:F19').merge();
 for(const [r,label,help]of [[20,'Selected-peer median P/E','MEDIAN of the two positive peer P/Es in C15:D15'],[21,'Implied company share price','Peer median P/E × your company EPS in B12'],[22,'Difference from observed price','Implied price / your company price in B11 - 1']]){
  value(pe,`A${r}`,label);edit(pe,`B${r}`,true);merge(pe,`C${r}:F${r}`,help);pe.getRange(`A${r}:F${r}`).format.rowHeight=46;
 }
 pe.getRange('B20').setNumberFormat('0.00"x"');pe.getRange('B21').setNumberFormat('#,##0.00');pe.getRange('B22').setNumberFormat('0.0%;(0.0%);"0.0%"');
 merge(pe,'A24:F24','Required: one median-based estimate. Optional: apply the smaller/larger peer multiple for low/high estimates on your own; no extra credit or required chart.');pe.getRange('A24:F24').format.rowHeight=42;
 ai.getRange('B20').dataValidation={rule:{type:'list',values:['Pursue','Pilot','Strengthen first']}};
 merge(ai,'A33:F33','Suggested AI prompt - add your own short company/idea summary');ai.getRange('A33:F33').format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:30};
 merge(ai,'A34:F36',m.aiPrompt);ai.getRange('A34:F36').format.fill='#F0F5F3';ai.getRange('A34:F36').format.rowHeight=42;
 merge(ai,'A38:F39','Use only a short summary you wrote from public information. Do not upload this workbook, raw FactSet exports/screenshots, personal information or nonpublic material. Check one objection independently.');ai.getRange('A38:F39').format.rowHeight=32;
 if(answers){
  for(const [name,cells]of Object.entries(answers.cells))for(const [a,v]of Object.entries(cells))value(sheets[name],a,v);
  for(const [name,cells]of Object.entries(answers.formulas))for(const [a,v]of Object.entries(cells))formula(sheets[name],a,v);
  const s=wb.worksheets.add('Instructor notes');s.showGridLines=false;s.getRange('A1:B12').format={font:{name:'Arial',size:11,color:navy},wrapText:true,rowHeight:95};s.getRange('A:A').format.columnWidth=34;s.getRange('B:B').format.columnWidth=115;
  value(s,'A1','Fictional teaching example');value(s,'B1',answers.notice);value(s,'A2','Aligned layout');value(s,'B2','Shared sheets exactly match the blank student file. Worked formulas occupy the student formula cells. Reported ratios are supplied case data; independently verify one. The model AI critique is illustrative, not a claimed live AI interaction.');
  for(const [i,c]of m.rubric.entries()){value(s,`A${4+i}`,`${c.title} (${c.points})`);value(s,`B${4+i}`,c.detail);}
  value(s,'A9','Teaching focus');value(s,'B9',answers.teachingFocus);value(s,'A10','Limits');value(s,'B10','Do not require a three-year ratio schedule, a chart or low/high P/E estimates. Verify definitions: provider debt-to-assets may use total liabilities, or provider turnover may use ending rather than average assets. P/E is not project value.');
 }
 wb.recalculate();
 if(answers){
  const check=()=>{for(const [n,a,v]of answers.expected){const got=sheets[n].getRange(a).values[0][0];if(typeof got!=='number'||Math.abs(got-v)>1e-9)throw Error(`${n}!${a}: ${got} expected ${v}`);}};
  const expect=(s,a,v)=>{if(s.getRange(a).values[0][0]!==v)throw Error(`Boundary failed ${s.name}!${a}`);};
  check();const eps=pe.getRange('B12').values[0][0];value(pe,'B12',0);wb.recalculate();expect(pe,'B15','n.m.');expect(pe,'B21','n.m.');value(pe,'B12',-2);wb.recalculate();expect(pe,'B21','n.m.');value(pe,'B12',eps);
  const p=pe.getRange('C12').values[0][0];value(pe,'C12',-1);wb.recalculate();expect(pe,'B20','n.a.');value(pe,'C12',null);wb.recalculate();expect(pe,'B20','n.a.');value(pe,'C12',p);
  const ratio=peer.getRange('C12').values[0][0];value(peer,'C12',null);wb.recalculate();expect(peer,'E12','n.a.');value(peer,'C12',ratio);
  const den=peer.getRange('B42').values[0][0];value(peer,'B42',0);wb.recalculate();expect(peer,'B43','n.a.');value(peer,'B42',den);wb.recalculate();check();
 }
 await fs.mkdir(qa,{recursive:true});
 const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:40},maxChars:2200});await fs.writeFile(path.join(qa,answers?'key-errors.txt':'student-errors.txt'),errors.ndjson);
 const ranges={'Peer comparison':['A1:F26','A28:F46'],'P-E check':['A1:F22','A24:F32'],'AI challenge':['A1:F18','A20:F30','A33:F39'],'Instructor notes':['A1:B10']};
 for(const s of wb.worksheets.items)for(const [i,range]of ranges[s.name].entries()){const blob=await wb.render({sheetName:s.name,range,scale:1.1,format:'png'});await fs.writeFile(path.join(qa,`${answers?'key':'student'}-${s.name.replaceAll(' ','-')}-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));}
 await fs.mkdir(path.dirname(output),{recursive:true});await(await SpreadsheetFile.exportXlsx(wb)).save(output);
 console.log(`Built ${path.basename(output)}: three aligned shared sheets, one annual snapshot, one P/E estimate and an AI challenge.`);
}
