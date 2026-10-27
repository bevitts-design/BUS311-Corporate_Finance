import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const modules=process.env.RUNTIME_NODE_MODULES||'/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require=createRequire(path.join(modules,'__bus311__.cjs'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);

export async function buildWorkbook(source,output,qa,answers=null){
 const m=source.milestone2, wb=Workbook.create();
 const navy='#17354A',green='#22684F',blue='#1757A6';
 const sheets={};
 const set=(s,a,v)=>s.getRange(a).values=[[v]];
 const merge=(s,a,v)=>{s.getRange(a).merge();set(s,a.split(':')[0],v);};
 const editable=(s,a,formula=false)=>{s.getRange(a).format.fill=formula?'#E4F0E8':'#FFF2CD';s.getRange(a).format.font.color=formula?'#000000':blue;};
 function band(s,row,text){merge(s,`A${row}:F${row}`,text);s.getRange(`A${row}:F${row}`).format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:27};}
 for(const spec of m.sheets){
  const s=wb.worksheets.add(spec.name);sheets[spec.name]=s;s.showGridLines=false;
  const last=spec.name==='Next dollar'?64:35;
  const all=s.getRange(`A1:F${last}`);all.format.font={name:'Arial',size:11,color:navy};all.format.rowHeight=24;all.format.verticalAlignment='top';all.format.wrapText=true;
  s.getRange('A:A').format.columnWidth=31;s.getRange('B:D').format.columnWidth=19;s.getRange('E:F').format.columnWidth=16;
  merge(s,'A2:F2',spec.title);s.getRange('A2:F2').format.font={name:'Arial',size:17,bold:true,color:navy};s.getRange('A2:F2').format.rowHeight=32;
  merge(s,'A3:F3',spec.intro);s.getRange('A3:F3').format.rowHeight=40;
  set(s,'A4','Question');merge(s,'B4:F4','Your response — type in the yellow cells');s.getRange('A4:F4').format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:28};
  for(const f of spec.fields){
   set(s,`A${f.row}`,f.label);s.getRange(`A${f.row}`).format.font.bold=true;
   merge(s,`B${f.row}:F${f.row}`,answers?.values?.[spec.name]?.[f.id]??'');editable(s,`B${f.row}:F${f.row}`);
   s.getRange(`A${f.row}:F${f.row}`).format.rowHeight=f.height;
   merge(s,`A${f.row+1}:F${f.row+1}`,f.prompt);s.getRange(`A${f.row+1}:F${f.row+1}`).format.rowHeight=36;
   s.getRange(`A${f.row+1}`).format.font={name:'Arial',size:10,color:'#52646C',italic:true};
  }
 }
 const r=sheets['Revenue history'];
 r.getRange('A8:D8').values=[['Financial measure','Oldest fiscal year','Middle fiscal year','Latest fiscal year']];merge(r,'E8:F8','Calculation guidance');r.getRange('A8:F8').format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:46,wrapText:true};
 for(const [row,label] of [[9,'Fiscal year — enter year'],[10,'Total revenue — same units'],[12,'Revenue growth (%)']])set(r,`A${row}`,label);
 editable(r,'B9:D10');editable(r,'C12:D12',true);
 r.getRange('B9:D9').setNumberFormat('0');r.getRange('B10:D10').setNumberFormat('#,##0.0;(#,##0.0);"—"');r.getRange('C12:D12').setNumberFormat('0.0%;(0.0%);"—"');
 set(r,'B12','n.a.');merge(r,'E9:F12','Growth = current year / prior year − 1. Enter your formulas in C12 and D12. Use n.a. with an explanation if the prior year is zero or unavailable.');r.getRange('A9:F12').format.rowHeight=34;
 const n=sheets['Next dollar'];set(n,'A28','Revenue estimate');set(n,'B28','Your amount / formula');merge(n,'C28:F28','Units and calculation guidance');n.getRange('A28:F28').format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:46,wrapText:true};
 for(const [row,label] of [[29,'Additional revenue units'],[30,'Revenue per unit for period'],[31,'Existing revenue displaced'],[32,'Net additional revenue']])set(n,`A${row}`,label);
 editable(n,'B29:B31');editable(n,'B32',true);n.getRange('B29').setNumberFormat('#,##0.0;(#,##0.0);"—"');n.getRange('B30:B32').setNumberFormat('#,##0.00;(#,##0.00);"—"');
 merge(n,'C29:F32','Use unscaled currency, such as USD. B29 and B30 must refer to the same period. Net additional revenue = units × revenue per unit − displaced revenue. Enter your formula in B32.');n.getRange('A29:F32').format.rowHeight=34;
 if(answers){
  for(const [sheet,cells] of Object.entries(answers.cells||{}))for(const [address,value] of Object.entries(cells))set(sheets[sheet],address,value);
  for(const [sheet,cells] of Object.entries(answers.formulas||{}))for(const [address,value] of Object.entries(cells)){sheets[sheet].getRange(address).formulas=[[value]];sheets[sheet].getRange(address).format.font.color='#000000';}
  const t=wb.worksheets.add('Instructor notes');t.showGridLines=false;t.getRange('A1:B14').format.font={name:'Arial',size:11,color:navy};t.getRange('A:A').format.columnWidth=31;t.getRange('B:B').format.columnWidth=100;t.getRange('A1:B14').format.wrapText=true;t.getRange('A1:B14').format.rowHeight=65;
  set(t,'A1','Instructor example');set(t,'B1',answers.notice);set(t,'A2','Calculation results');set(t,'B2','See Revenue history C12:D12 and Next dollar B32. Formulas use the same input and output addresses as the student workbook.');
  m.rubric.forEach((c,i)=>{set(t,`A${4+i}`,`${c.title} (${c.points})`);set(t,`B${4+i}`,c.detail);});
  set(t,'A9','Teaching focus');set(t,'B9',answers.teachingFocus);set(t,'A10','Accept alternatives');set(t,'B10','Equivalent valid formulas and well-supported company-specific proposals are acceptable. The example is illustrative, not the required company or conclusion.');
 }
 wb.recalculate();
 const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:50},summary:'M02 final formula errors',maxChars:2000});
 await fs.mkdir(qa,{recursive:true});await fs.writeFile(path.join(qa,answers?'key-inspect.txt':'student-inspect.txt'),errors.ndjson);
 if(answers){
  const values=[r.getRange('C12').values[0][0],r.getRange('D12').values[0][0],n.getRange('B32').values[0][0]];
  for(let i=0;i<values.length;i++)if(Math.abs(values[i]-answers.expected[i])>1e-9)throw Error(`Calculation mismatch ${i}: ${values[i]}`);
  const prior=r.getRange('B10').values[0][0];set(r,'B10',0);if(r.getRange('C12').values[0][0]!=='n.a.')throw Error('Zero prior-year revenue guard failed');set(r,'B10',null);if(r.getRange('C12').values[0][0]!=='n.a.')throw Error('Missing prior-year revenue guard failed');set(r,'B10',prior);
  const units=n.getRange('B29').values[0][0];set(n,'B29',null);if(n.getRange('B32').values[0][0]!=='')throw Error('Missing forecast input guard failed');set(n,'B29',units);
  const original=n.getRange('B31').values[0][0];set(n,'B31',0);if(n.getRange('B32').values[0][0]!==300000)throw Error('Zero displaced sales test failed');set(n,'B31',400000);if(n.getRange('B32').values[0][0]!==-100000)throw Error('Negative revenue test failed');set(n,'B31',original);wb.recalculate();
 }
 for(const [name,s] of Object.entries(sheets)){
  const ranges=name==='Next dollar'?['A1:F24','A26:F43','A45:F62']:name==='Follow the dollar'?['A1:F20','A22:F33']:name==='Revenue history'?['A1:F26']:['A1:F9'];
  for(let i=0;i<ranges.length;i++){const blob=await wb.render({sheetName:name,range:ranges[i],scale:1.4,format:'png'});await fs.writeFile(path.join(qa,`${answers?'key':'student'}-${name.replaceAll(' ','-')}-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));}
 }
 if(answers){const b=await wb.render({sheetName:'Instructor notes',range:'A1:B10',scale:1.3,format:'png'});await fs.writeFile(path.join(qa,'key-Instructor-notes.png'),new Uint8Array(await b.arrayBuffer()));}
 await fs.mkdir(path.dirname(output),{recursive:true});await(await SpreadsheetFile.exportXlsx(wb)).save(output);
 console.log(`Built ${path.basename(output)}; formula checks complete.`);
}
