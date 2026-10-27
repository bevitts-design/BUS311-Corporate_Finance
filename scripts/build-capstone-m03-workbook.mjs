import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const modules=process.env.RUNTIME_NODE_MODULES||'/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require=createRequire(path.join(modules,'__bus311_m03__.cjs'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
export async function buildM03(source,output,qa,answers=null){
 const m=source.milestone3,wb=Workbook.create(),sheets={};
 const navy='#17354A',blue='#1757A6',green='#22684F',yellow='#FFF2CD',pale='#E4F0E8';
 const value=(s,cell,v)=>s.getRange(cell).values=[[v]];
 const formula=(s,cell,v)=>s.getRange(cell).formulas=[[v]];
 const merge=(s,range,v)=>{s.getRange(range).merge();value(s,range.split(':')[0],v);if(range.startsWith('E'))s.getRange(range).setNumberFormat('  @');};
 const edit=(s,range,calc=false)=>{s.getRange(range).format.fill=calc?pale:yellow;s.getRange(range).format.font.color=calc?'#000000':blue;};
 const header=(s,r,labels)=>{s.getRangeByIndexes(r-1,0,1,labels.length).values=[labels];s.getRange(`A${r}:F${r}`).format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:44,wrapText:true};};
 const link=(s,address,ref)=>{formula(s,address,`=IF(ISNUMBER(${ref}),${ref},IF(${ref}="","",${ref}))`);s.getRange(address).format.font.color=green;};
 for(const spec of m.sheets){
  const s=wb.worksheets.add(spec.name);sheets[spec.name]=s;s.showGridLines=false;
  const last=spec.name==='Peer comparison'?70:48;
  s.getRange(`A1:F${last}`).format={font:{name:'Arial',size:11,color:navy},rowHeight:26,verticalAlignment:'top',wrapText:true};
  s.getRange('A:A').format.columnWidth=33;s.getRange('B:D').format.columnWidth=19;s.getRange('E:E').format.columnWidth=19;s.getRange('F:F').format.columnWidth=24;
  merge(s,'A2:F2',spec.title);s.getRange('A2:F2').format.font={name:'Arial',size:17,bold:true,color:navy};s.getRange('A2:F2').format.rowHeight=32;
  merge(s,'A3:F3',spec.intro);s.getRange('A3:F3').format.rowHeight=44;
  value(s,'A4','Question');merge(s,'B4:F4','Your response — yellow inputs; pale green formula cells');s.getRange('A4:F4').format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:28};
  for(const f of spec.fields){
   value(s,`A${f.row}`,f.label);s.getRange(`A${f.row}`).format.font.bold=true;
   merge(s,`B${f.row}:F${f.row}`,answers?.values?.[spec.name]?.[f.id]??'');edit(s,`B${f.row}:F${f.row}`);s.getRange(`A${f.row}:F${f.row}`).format.rowHeight=f.height;
   merge(s,`A${f.row+1}:F${f.row+1}`,f.prompt);s.getRange(`A${f.row+1}:F${f.row+1}`).format={rowHeight:38,font:{name:'Arial',size:10,italic:true,color:'#52646C'}};
  }
 }
 const company=sheets['Company ratios'],peer=sheets['Peer comparison'],pe=sheets['P-E check'];
 for(const sheet of [company,pe]){sheet.getRange('E:E').format.columnWidth=4;sheet.getRange('F:F').format.columnWidth=39;}
 function financialTable(s,peerMode=false){
  header(s,9,peerMode?['Financial input','Your company, latest year','Peer 1, latest year','Peer 2, latest year','Definition / help']:['Financial input','Oldest fiscal year','Middle fiscal year','Latest fiscal year','Definition / help']);s.getRange('E9:F9').merge();
  for(const [row,label,help]of m.inputs){value(s,`A${row}`,label);value(s,`F${row}`,help);s.getRange(`A${row}:F${row}`).format.rowHeight=38;edit(s,`${peerMode?'C':'B'}${row}:D${row}`);}
  s.getRange('B10:D10').setNumberFormat('0');s.getRange('B11:D11').setNumberFormat('mm/dd/yyyy');s.getRange('B12:D20').setNumberFormat('#,##0.00;(#,##0.00);"—"');
  value(s,'A23','Average total assets');edit(s,`${peerMode?'C':'B'}23:D23`,true);value(s,'F23','(Beginning + ending assets) / 2');s.getRange('A23:F23').format.rowHeight=38;s.getRange('B23:D23').setNumberFormat('#,##0.00;(#,##0.00);"—"');
  header(s,26,peerMode?['Ratio','Your company','Peer 1','Peer 2','Peer median','Unit']:['Ratio','Oldest fiscal year','Middle fiscal year','Latest fiscal year','Definition / help']);if(!peerMode)s.getRange('E26:F26').merge();
  for(const r of m.ratios){value(s,`A${r.row}`,r.label);edit(s,`${peerMode?'C':'B'}${r.row}:${peerMode?'E':'D'}${r.row}`,true);s.getRange(`B${r.row}:${peerMode?'E':'D'}${r.row}`).setNumberFormat(r.format);s.getRange(`A${r.row}:F${r.row}`).format.rowHeight=42;if(peerMode)value(s,`F${r.row}`,r.unit);else value(s,`F${r.row}`,r.definition);}
 }
 financialTable(company);
 financialTable(peer,true);
 // Peer names have their own header row so the financial-input row labels stay aligned.
 value(peer,'A8','Company name / ticker');edit(peer,'C8:D8');link(peer,'B8',"'Company ratios'!B5");peer.getRange('A8:F8').format.rowHeight=42;
 for(const [row]of m.inputs)link(peer,`B${row}`,`'Company ratios'!D${row}`);
 for(const row of [23,27,28,29,30,31])link(peer,`B${row}`,`'Company ratios'!D${row}`);
 edit(peer,'F31');value(peer,'F31','');peer.getRange('F27:F31').format.horizontalAlignment='center';
 // Native chart reads a small, visible helper table and students' own ratio formulas.
 header(peer,56,['Chart data','Current ratio (times)']);
 for(let i=0;i<3;i++){const c='BCD'[i];link(peer,`A${57+i}`,`${c}8`);link(peer,`B${57+i}`,`${c}29`);}
 peer.getRange('B57:B59').setNumberFormat('0.00"x"');peer.getRange('A57:A59').format.rowHeight=48;
 const chart=peer.charts.add('bar',peer.getRange('A56:B59'));chart.title='Current ratio comparison (times)';chart.setPosition('C56','G69');chart.hasLegend=false;chart.titleTextStyle.fontSize=14;chart.titleTextStyle.typeface='Arial';chart.xAxis={axisType:'textAxis',textStyle:{typeface:'Arial',fontSize:11}};chart.yAxis={numberFormatCode:'0.0"x"',numberFormatSourceLinked:false,textStyle:{typeface:'Arial',fontSize:11}};chart.series.items[0].fill=green;
 header(pe,9,['Market input / calculation','Your company','Peer 1','Peer 2','Definition / help']);pe.getRange('E9:F9').merge();
 for(const [row,label,help]of [[10,'Company name / ticker','Names link from Peer comparison'],[11,'Observed share price','Same observation date as B5'],[12,'Trailing diluted EPS','GAAP TTM EPS, unscaled per-share amount'],[13,'TTM earnings end date','Earnings available as of price date'],[15,'P/E multiple','Observed price / positive trailing EPS']]){
  value(pe,`A${row}`,label);value(pe,`F${row}`,help);pe.getRange(`A${row}:F${row}`).format.rowHeight=44;if(row!==10)edit(pe,`B${row}:D${row}`,row===15);
 }
 for(const c of 'BCD')link(pe,`${c}10`,`'Peer comparison'!${c}8`);
 pe.getRange('B11:D12').setNumberFormat('#,##0.00;(#,##0.00);"—"');pe.getRange('B13:D13').setNumberFormat('mm/dd/yyyy');pe.getRange('B15:D15').setNumberFormat('0.00"x"');
 header(pe,19,['Illustrative comparison','Low','Base','High','Interpretation']);pe.getRange('E19:F19').merge();
 for(const [row,label,help]of [[20,'Applied peer P/E','Peer minimum / median / maximum'],[21,'Implied company share price','Applied P/E × company trailing EPS'],[22,'Difference from observed price','Implied price / company price − 1']]){
  value(pe,`A${row}`,label);edit(pe,`B${row}:D${row}`,true);value(pe,`F${row}`,help);pe.getRange(`A${row}:F${row}`).format.rowHeight=44;
 }
 pe.getRange('B20:D20').setNumberFormat('0.00"x"');pe.getRange('B21:D21').setNumberFormat('#,##0.00;(#,##0.00);"—"');pe.getRange('B22:D22').setNumberFormat('0.0%;(0.0%);"—"');
 merge(pe,'A24:F24','Use both positive peer P/Es. n.m. = not meaningful; unavailable inputs stay unavailable. The range is illustrative, not a forecast or proof of mispricing.');pe.getRange('A24:F24').format.rowHeight=44;
 sheets.Recommendation.getRange('B20').dataValidation={rule:{type:'list',values:['Pursue','Pilot','Strengthen first']}};
 if(answers){
  for(const [name,cells]of Object.entries(answers.cells))for(const [address,v]of Object.entries(cells))value(sheets[name],address,v);
  for(const [name,cells]of Object.entries(answers.formulas))for(const [address,v]of Object.entries(cells))formula(sheets[name],address,v);
  const t=wb.worksheets.add('Instructor notes');t.showGridLines=false;t.getRange('A1:B12').format={font:{name:'Arial',size:11,color:navy},wrapText:true,rowHeight:76};t.getRange('A:A').format.columnWidth=32;t.getRange('B:B').format.columnWidth=110;
  value(t,'A1','Fictional teaching example');value(t,'B1',answers.notice);value(t,'A2','Worked answers');value(t,'B2','Shared sheets match the student layout. Formulas are in the corresponding student calculation cells; cross-sheet links and chart data remain live.');
  m.rubric.forEach((c,i)=>{value(t,`A${4+i}`,`${c.title} (${c.points})`);value(t,`B${4+i}`,c.detail);});value(t,'A9','Teaching focus');value(t,'B9',answers.teachingFocus);value(t,'A10','Scope');value(t,'B10','The P/E check supplies market context. It does not value the new initiative or establish funding capacity. Accept equivalent valid formulas and evidence-based alternatives.');
 }
 wb.recalculate();
 await fs.mkdir(qa,{recursive:true});
 if(answers){
  const assertClose=(s,c,v)=>{const actual=s.getRange(c).values[0][0];if(typeof actual!=='number'||Math.abs(actual-v)>1e-8)throw Error(`${s.name}!${c}: ${actual}, expected ${v}`);};
  for(const [s,c,v]of answers.expected)assertClose(sheets[s],c,v);
  // Check live dependencies and invalid-input behavior, then restore every edit.
  const old=pe.getRange('C11').values[0][0];value(pe,'C11',60);assertClose(pe,'C15',20);assertClose(pe,'C20',21);assertClose(pe,'C21',42);value(pe,'C11',old);
  const eps=pe.getRange('B12').values[0][0];value(pe,'B12',0);if(pe.getRange('B15').values[0][0]!=='n.m.'||pe.getRange('C21').values[0][0]!=='n.m.')throw Error('Zero EPS boundary failed');value(pe,'B12',-2);if(pe.getRange('C21').values[0][0]!=='n.m.')throw Error('Negative EPS boundary failed');value(pe,'B12',eps);
  const peerEPS=pe.getRange('C12').values[0][0];value(pe,'C12',-1);if(pe.getRange('C20').values[0][0]!=='n.a.')throw Error('Invalid peer range failed');value(pe,'C12',null);if(pe.getRange('C20').values[0][0]!=='n.a.')throw Error('Missing peer input failed');value(pe,'C12',peerEPS);
  const debt=company.getRange('D18').values[0][0];value(company,'D18',0);assertClose(company,'D30',0);assertClose(peer,'B30',0);value(company,'D18',debt);
  const liabilities=company.getRange('D15').values[0][0];value(company,'D15',14.52);assertClose(peer,'B29',2);assertClose(peer,'B57',2);value(company,'D15',0);if(peer.getRange('B29').values[0][0]!=='n.a.'||peer.getRange('B57').values[0][0]!=='n.a.')throw Error('Zero denominator must not become a zero ratio');value(company,'D15',liabilities);
  const assets=company.getRange('D16').values[0][0];value(company,'D16',null);if(company.getRange('D23').values[0][0]!==''||peer.getRange('B28').values[0][0]!=='')throw Error('Missing average balance failed');value(company,'D16',assets);
  wb.recalculate();for(const [s,c,v]of answers.expected)assertClose(sheets[s],c,v);
 }
 const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:40},maxChars:2200});await fs.writeFile(path.join(qa,answers?'key-errors.txt':'student-errors.txt'),errors.ndjson);
 const ranges={'Recommendation':['A1:F21','A23:F43'],'Company ratios':['A1:F24','A26:F45'],'Peer comparison':['A1:F24','A26:F42','A43:F54','A56:G69'],'P-E check':['A1:F24','A26:F37'],'Instructor notes':['A1:B10']};
 for(const s of wb.worksheets.items)for(const [i,range]of ranges[s.name].entries()){const blob=await wb.render({sheetName:s.name,range,scale:1.25,format:'png'});await fs.writeFile(path.join(qa,`${answers?'key':'student'}-${s.name.replaceAll(' ','-')}-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));}
 await fs.mkdir(path.dirname(output),{recursive:true});await(await SpreadsheetFile.exportXlsx(wb)).save(output);
 const cachePath=path.join(qa,answers?'key-chart-cache.json':'student-chart-cache.json');await fs.writeFile(cachePath,JSON.stringify(peer.getRange('A57:B59').values));
 execFileSync(process.env.RUNTIME_PYTHON||'/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',[fileURLToPath(new URL('./cache-capstone-m03-chart.py',import.meta.url)),output,cachePath]);
 console.log(`Built ${path.basename(output)} with live links and an editable comparison chart.`);
}
