import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const runtimeModules=process.env.RUNTIME_NODE_MODULES || '/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const runtimeRequire=createRequire(path.join(runtimeModules,'__capstone__.cjs'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const d=JSON.parse(await fs.readFile(path.join(root,'CAPSTONE/source/bus311-capstone.json')));
const qa=process.env.CAPSTONE_QA_DIR||path.join(root,'qa');await fs.mkdir(qa,{recursive:true});
const wb=Workbook.create();for(const n of d.scope.workbookSheets)wb.worksheets.add(n);
const sheets=Object.fromEntries(d.scope.workbookSheets.map(n=>[n,wb.worksheets.getItem(n)]));
const ink='#152536',blue='#1757A6';
function base(s,last=30){s.showGridLines=false;s.getRange(`A1:G${last}`).format.font={name:'Arial',size:11,color:ink};s.getRange(`A1:G${last}`).format.rowHeight=26;s.getRange(`A1:G${last}`).format.verticalAlignment='top';s.getRange(`A1:G${last}`).format.wrapText=true;s.getRange('A:A').format.columnWidth=34;s.getRange('B:D').format.columnWidth=18;s.getRange('E:E').format.columnWidth=40;s.getRange('F:G').format.columnWidth=18;}
function val(s,cell,t){s.getRange(cell).values=[[t]];}
function formula(s,cell,t){s.getRange(cell).formulas=[[t]];}
function title(s,t){val(s,'A1',t);s.getRange('A1:G1').merge();s.getRange('A1').format.font={name:'Arial',size:19,bold:true,color:ink};s.getRange('A1:G1').format.rowHeight=32;}
function note(s,r,t,height=44){s.getRange(`A${r}:G${r}`).merge();val(s,`A${r}`,t);s.getRange(`A${r}:G${r}`).format.rowHeight=height;}
function head(s,r,labels){s.getRangeByIndexes(r-1,0,1,labels.length).values=[labels];s.getRangeByIndexes(r-1,0,1,labels.length).format={fill:ink,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:34,wrapText:true};}
function input(s,range){s.getRange(range).format.fill='#FFF3D5';s.getRange(range).format.font.color=blue;}
function entry(s,r,label,help=''){val(s,`A${r}`,label);s.getRange(`B${r}:G${r}`).merge();input(s,`B${r}:G${r}`);s.getRange(`A${r}:G${r}`).format.rowHeight=52;if(help)note(s,r+1,help,34);}
const start=sheets.Start;base(start,43);title(start,'BUS311 Company Capstone');
note(start,2,'Choose one U.S.-listed public company. Use this workbook at Stages 1–3. Yellow cells are inputs; blue text identifies your entries. Formulas are black. Read Example before Model.');
entry(start,4,'Student name');entry(start,6,'Company, ticker, exchange');entry(start,8,'Company snapshot','In 2–3 sentences: what it sells, who buys, and why the business interests you.');
entry(start,10,'Decision path');start.getRange('B10').dataValidation={rule:{type:'list',values:d.decisionPaths.map(x=>x.title)}};
entry(start,12,'Tentative decision','Should [company] make [specific change]? Why might it help? Compare with doing nothing.');
entry(start,14,'One FactSet learning','Name the specific learning and the screen/report/feature used. Stage 1 does not require formal citation.');
entry(start,16,'Workbook version/date','Update before each submission. Use this version in presentation source notes.');
head(start,19,['Stage','Due','Points','Tabs']);
d.hub.stages.slice(0,3).forEach((s,i)=>{const r=20+i;start.getRange(`A${r}:D${r}`).values=[[s.label,s.dateLabel,s.points,s.tabs.join(', ')]];start.getRange(`A${r}:G${r}`).format.rowHeight=68;});
note(start,24,'Final: one editable PowerPoint due November 30 at 12:30 p.m. ET. Six core slides plus optional appendix; 50 points. Live Oral Presentation: 7 minutes plus 3 minutes of questions; 25 points.',58);
note(start,26,'Stage 1 grading: '+d.hub.stages[0].grade,40);
note(start,28,'Project page: '+d.hub.publicUrl,35);
note(start,30,d.policies.stageOne,62);
note(start,32,d.policies.factSetPermission,60);
note(start,34,d.policies.aiPrivacy,70);
note(start,36,'Model feedback target: '+d.feedback.target+'. '+d.feedback.revision,74);
note(start,38,'Preparation: the Example tab explains cash flow and discounting before the model deadline. A model workshop should take place before November 4.',54);
const rev=sheets.Revenue;base(rev,42);title(rev,'How does the company make money?');
note(rev,2,'Three comparable years, two drivers, one peer comparison, two risks, and one forecast claim. Enter source IDs from Sources beside the evidence.');
head(rev,5,['History','Source ID','Oldest year','Middle year','Latest year']);
val(rev,'A6','Fiscal year');val(rev,'A7','Total revenue');val(rev,'A8','Year-over-year growth');input(rev,'B7:E7');input(rev,'C6:E6');
for(const c of ['D','E']){const prev=c==='D'?'C':'D';formula(rev,`${c}8`,`=IF(OR(COUNT(${prev}7:${c}7)<2,${prev}7<=0),"",${c}7/${prev}7-1)`);rev.getRange(`${c}8`).setNumberFormat('0.0%');}
rev.getRange('C7:E7').setNumberFormat('#,##0.00;(#,##0.00);"—"');
entry(rev,10,'Currency and units','Use the same period, currency, and units across the history and peer comparison.');
entry(rev,12,'Comparability or limitations','Explain restatements, acquisitions, changed definitions, or missing figures. No segment analysis is required unless it helps your decision.');
entry(rev,14,'Driver 1 and evidence ID','What changed sales? State evidence and its effect on the proposed decision.');
entry(rev,16,'Driver 2 and evidence ID','Separate reported facts from your interpretation.');
entry(rev,18,'One peer comparison','Name the peer, why it is comparable, the same-period metric, and source ID. If no defensible peer exists, explain why.');
entry(rev,20,'Risk 1','Name a revenue or service risk and an observable warning sign.');
entry(rev,22,'Risk 2','Name a second risk and what you would monitor.');
entry(rev,24,'One forecast claim','Over [period], [driver] should affect [sales/cost/cash] because [evidence]. I would change my view if [observable result].');
entry(rev,26,'Link to the model','Identify the Model input this claim informs. Explain how the driver changes that assumption.');
note(rev,28,'Grading: '+d.hub.stages[1].grade,45);
const model=sheets.Model;base(model,61);title(model,'Does the change create value?');
note(model,2,'Five-year incremental cash flow versus doing nothing. Complete every numeric input, using 0 when not applicable. Amounts share the Revenue currency/unit. Source IDs and rationale belong beside inputs.',54);
head(model,5,['Input','Base','Upside','Downside','Source ID and rationale']);
const labels={7:'Equipment/setup cash cost',8:'Initial working capital change',9:'Annual added sales or savings',10:'Annual added operating costs',11:'Depreciable asset basis',12:'Tax rate',13:'Discount rate',14:'Year 5 after-tax asset proceeds',15:'Year 5 working capital recovery'};
for(const [r,label] of Object.entries(labels)){val(model,`A${r}`,label);input(model,`B${r}:E${r}`);model.getRange(`A${r}:G${r}`).format.rowHeight=42;}
model.getRange('B7:D15').setNumberFormat('#,##0.00;(#,##0.00);"—"');model.getRange('B12:D13').setNumberFormat('0.0%');
note(model,17,'Signs: enter costs as positive. Initial working-capital increases are positive; releases are negative. Year 5 recovery is positive; restoration of released working capital is negative. Do not count a release as annual revenue.',54);
head(model,19,['Calculated result','Base','Upside','Downside','Meaning']);
const calcLabels={20:'Annual depreciation',21:'Annual taxable profit',22:'Annual cash taxes',23:'Annual operating cash flow',24:'Initial cash flow',25:'Net present value (NPV)',26:'Inputs to review'};
for(const [r,label] of Object.entries(calcLabels))val(model,`A${r}`,label);
const valid={};
for(const c of ['B','C','D']){
 valid[c]=`AND(COUNT(${c}7:${c}15)=9,${c}7>=0,${c}9>=0,${c}10>=0,${c}11>=0,${c}11<=${c}7,${c}12>=0,${c}12<=1,${c}13>=0)`;
 const guard=x=>`=IF(${valid[c]},${x},"")`;
 formula(model,`${c}20`,guard(`${c}11/5`));formula(model,`${c}21`,guard(`${c}9-${c}10-${c}20`));
 formula(model,`${c}22`,guard(`MAX(0,${c}21)*${c}12`));formula(model,`${c}23`,guard(`${c}9-${c}10-${c}22`));formula(model,`${c}24`,guard(`-${c}7-${c}8`));
 const pv=[1,2,3,4,5].map(t=>`${c}23/(1+${c}13)^${t}`).join('+');formula(model,`${c}25`,guard(`${c}24+${pv}+(${c}14+${c}15)/(1+${c}13)^5`));
 formula(model,`${c}26`,`=IF(COUNT(${c}7:${c}15)<9,"Enter all 9 inputs",IF(${valid[c]},"Explain assumptions and results","Review inputs"))`);
}
val(model,'E20','Straight-line over five years; no midyear convention.');val(model,'E22','No immediate tax benefit for losses is assumed.');val(model,'E25','NPV > 0 supports the change financially; also consider risk.');model.getRange('A20:G26').format.rowHeight=40;model.getRange('B20:D25').setNumberFormat('#,##0.00;(#,##0.00);"—"');
head(model,28,['Base cash flow','Year 0','Year 1','Year 2','Year 3','Year 4','Year 5']);val(model,'A29','Incremental cash flow');val(model,'A30','Present value');
formula(model,'B29',`=IF(${valid.B},B24,"")`);for(let i=0;i<5;i++){const c=String.fromCharCode(67+i);formula(model,`${c}29`,`=IF(${valid.B},$B$23${i===4?'+$B$14+$B$15':''},"")`);}for(let i=0;i<6;i++){const c=String.fromCharCode(66+i);formula(model,`${c}30`,`=IF(${valid.B},${c}29/(1+$B$13)^${i},"")`);}model.getRange('B29:G30').setNumberFormat('#,##0.00;(#,##0.00);"—"');
note(model,32,'NPV adds the initial cash flow and the present value of Years 1–5. Discounting reduces the value of later cash flows. The status quo has zero incremental NPV.',44);
head(model,34,['Sensitivity','Low test','Base','High test','What this isolates']);
val(model,'A35','Key assumption multiplier');model.getRange('B35:D35').values=[[0.8,1,1.2]];input(model,'B35:D35');model.getRange('B35:D35').setNumberFormat('0%');val(model,'E35','Investment: annual benefits. Working capital: days reduced, scaling release and restoration.');model.getRange('A35:G35').format.rowHeight=60;val(model,'A36','NPV at changed assumption');
for(const c of ['B','C','D']){const cf=`($B$9*${c}35-$B$10-MAX(0,$B$9*${c}35-$B$10-$B$20)*$B$12)`;const investment=`$B$24+${[1,2,3,4,5].map(t=>`${cf}/(1+$B$13)^${t}`).join('+')}+($B$14+$B$15)/(1+$B$13)^5`;const workingCapital=`-$B$7-$B$8*${c}35+${[1,2,3,4,5].map(t=>`$B$23/(1+$B$13)^${t}`).join('+')}+($B$14+$B$15*${c}35)/(1+$B$13)^5`;formula(model,`${c}36`,`=IF(AND(${valid.B},ISNUMBER(${c}35),${c}35>=0),IF(Start!$B$10="Working-capital improvement",${workingCapital},${investment}),"")`);}model.getRange('B36:D36').setNumberFormat('#,##0.00;(#,##0.00);"—"');
entry(model,38,'Interpretation','Which case changes your decision? Explain the sensitivity and a result that would make you pause.');
head(model,40,['Working-capital helper','Base','Upside','Downside','Use only for this path']);
val(model,'A41','Annual sales or cost of sales');input(model,'B41:D42');val(model,'A42','Days reduced');val(model,'A43','One-time cash released');
for(const c of ['B','C','D'])formula(model,`${c}43`,`=IF(AND(COUNT(${c}41:${c}42)=2,${c}41>=0,${c}42>=0),${c}41/365*${c}42,"")`);
val(model,'E41','Receivables: latest annual sales. Inventory: annual cost of goods sold.');val(model,'E42','Estimate from current days and a defensible target.');val(model,'E43','Link row 8 to the negative of this result.');model.getRange('A41:G43').format.rowHeight=54;model.getRange('B43:D43').setNumberFormat('#,##0.00;(#,##0.00);"—"');
note(model,45,'Working capital: enter only recurring service costs/savings in rows 9–10. Count the cash release once in row 8. If the improvement ends in Year 5, enter negative restoration in row 15. If permanent, explain why row 15 is zero.',58);
note(model,47,'Investment: source an equipment/setup estimate and annual incremental sales or savings. Row 11 cannot exceed row 7. Use row 14 for after-tax salvage. Row 8 captures additional working capital and row 15 its release.',54);
note(model,49,'Use an instructor-provided discount rate or a sourced company/risk estimate; justify it. The five-year model assumes constant annual cash flows, straight-line depreciation, and no immediate loss tax benefit. Label these simplifications.',58);
note(model,51,'Grading: '+d.hub.stages[2].grade,45);
const sources=sheets.Sources;base(sources,25);title(sources,'Sources and assumptions');note(sources,2,d.policies.sources,66);
head(sources,5,['Source ID','Source type','Exact filing/report','URL or locator','Period, date and units','Fact or assumption used','Limitation']);sources.getRange('A:A').format.columnWidth=14;sources.getRange('B:D').format.columnWidth=27;sources.getRange('E:G').format.columnWidth=30;
input(sources,'A6:G20');sources.getRange('A6:G20').format.rowHeight=64;note(sources,22,'Add rows if needed. Cite the same source ID wherever you reuse a fact. Explain your own estimates and their public benchmark; do not label assumptions as reported facts.',50);
const revision=sheets.Revision;base(revision,27);title(revision,'Challenge and judgment');note(revision,2,'Complete one challenge for Stage 3. Use AI, a peer, or the self-review questions below. You own the analysis and the verification.');
entry(revision,4,'Strongest challenge','What assumption could most easily make the decision unattractive?');entry(revision,6,'Evidence checked','Identify the source ID or Model cell, what you checked, and the finding.');entry(revision,8,'What changed and why','Describe the change, or explain why the evidence supports keeping the original assumption or recommendation.');entry(revision,10,'Method and disclosure','Name the AI tool/purpose, peer discussion, or self-review. Disclose any AI output retained and your verification.');
entry(revision,12,'Optional feedback revision','If revising after instructor feedback, record the date, changed cells, and reason. Replace the workbook in the original Stage 3 assignment.');
note(revision,15,'Grading: specific challenge 1; independent evidence or calculation 2; justified judgment 1. No separate upload.',44);
note(revision,17,d.policies.aiPrivacy,68);
note(revision,19,d.feedback.finalModel,55);
const ex=sheets.Example;base(ex,43);title(ex,d.example.company);note(ex,2,d.example.source,44);
note(ex,4,d.example.decision,35);head(ex,6,['Year',2023,2024,2025,'All amounts in $ millions']);val(ex,'A7','Revenue');ex.getRange('B7:D7').values=[d.example.history];val(ex,'A8','Growth');formula(ex,'C8','=C7/B7-1');formula(ex,'D8','=D7/C7-1');ex.getRange('C8:D8').setNumberFormat('0.0%');
note(ex,10,d.example.drivers.join(' '),46);note(ex,12,d.example.peer,45);note(ex,14,d.example.claim,70);
head(ex,16,['Input or result','Base','Upside','Downside','Why this is enough']);
const e=d.example;ex.getRange('A17:D22').values=[['Initial equipment cost',e.cost,e.cost,e.cost],['Annual gross savings',e.annualBenefit,e.upsideBenefit,e.downsideBenefit],['Annual depreciation',e.depreciation,e.depreciation,e.depreciation],['Tax rate',e.taxRate,e.taxRate,e.taxRate],['Discount rate',e.discountRate,e.discountRate,e.discountRate],['Years',5,5,5]];
for(const c of ['B','C','D']){formula(ex,`${c}24`,`=${c}18-MAX(0,${c}18-${c}19)*${c}20`);formula(ex,`${c}25`,`=-${c}17+${[1,2,3,4,5].map(t=>`${c}24/(1+${c}21)^${t}`).join('+')}`);}
val(ex,'A24','Annual after-tax cash flow');val(ex,'A25','NPV');ex.getRange('B20:D21').setNumberFormat('0%');ex.getRange('B24:D25').setNumberFormat('0.00;(0.00);"—"');val(ex,'E17','Estimate; require a vendor/public benchmark in your own work.');val(ex,'E24','Savings minus cash taxes; depreciation is not a cash payment.');ex.getRange('A17:G25').format.rowHeight=40;
val(ex,'A27','Break-even annual savings');formula(ex,'B27',`=($B$17/(${[1,2,3,4,5].map(t=>`1/(1+$B$21)^${t}`).join('+')})-$B$19*$B$20)/(1-$B$20)`);ex.getRange('B27').setNumberFormat('0.00');note(ex,28,'Break-even assumes positive taxable profit. It solves for the annual savings at which NPV is zero. The Model sensitivity tests the same benefit while other assumptions remain fixed.',50);
note(ex,30,'Challenge: '+e.challenge+' Check: '+e.verification,62);note(ex,32,e.judgment,62);note(ex,34,'Two risks: savings may disappoint; installation may disrupt service. Monitor pilot savings and order-error rates. Start with an operations-led pilot, review after 60 days, and require acceptable service results before expansion.',66);
note(ex,36,'Why this meets expectations: '+e.annotations.join(' '),110);
// Check meaningful finance fixtures using the actual student model before clearing inputs.
const fixtures=[
 {name:'investment',inputs:[8,0,3,0,8,.25,.10,0,0],expected:-8+Array.from({length:5},(_,i)=>2.65/1.1**(i+1)).reduce((a,b)=>a+b,0)},
 {name:'working capital restored',inputs:[.5,-2,0,.1,0,.25,.10,0,-2],expected:1.5+Array.from({length:5},(_,i)=>-.1/1.1**(i+1)).reduce((a,b)=>a+b,0)-2/1.1**5},
 {name:'zero discount',inputs:[8,0,3,0,8,.25,0,0,0],expected:5*2.65-8}
];
const report=[];
for(const f of fixtures){val(start,'B10',f.name.startsWith('working')?'Working-capital improvement':'Growth or efficiency investment');for(const c of ['B','C','D'])model.getRange(`${c}7:${c}15`).values=f.inputs.map(x=>[x]);const actual=Number(model.getRange('B25').values[0][0]);if(Math.abs(actual-f.expected)>1e-8)throw Error(`${f.name}: ${actual} != ${f.expected}`);if(Math.abs(Number(model.getRange('C36').values[0][0])-actual)>1e-8)throw Error('Sensitivity base must match base NPV');report.push({name:f.name,actual,expected:f.expected});}
val(start,'B10','Working-capital improvement');model.getRange('B7:B15').values=fixtures[1].inputs.map(x=>[x]);const lowWC=-.5+2*.8+Array.from({length:5},(_,i)=>-.1/1.1**(i+1)).reduce((a,b)=>a+b,0)-2*.8/1.1**5;if(Math.abs(Number(model.getRange('B36').values[0][0])-lowWC)>1e-8)throw Error('Working capital sensitivity failed');report.push({name:'working-capital sensitivity',expected:lowWC,actual:Number(model.getRange('B36').values[0][0])});
val(model,'B13',-1);if(model.getRange('B25').values[0][0]!=='')throw Error('Invalid discount rate must leave NPV blank');
val(start,'B10','');
model.getRange('B7:D15').clear({applyTo:'contents'});
if(model.getRange('B25').values[0][0]!==''&&model.getRange('B25').values[0][0]!==null)throw Error('Missing inputs must leave NPV blank');
await fs.writeFile(path.join(qa,'model-tests.json'),JSON.stringify(report,null,2));
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!',options:{useRegex:true,maxResults:30},maxChars:2500});await fs.writeFile(path.join(qa,'workbook-errors.ndjson'),errors.ndjson);
for(const [name,range] of [['Start','A1:G38'],['Revenue','A1:G28'],['Model','A1:G26'],['Model','A28:G51'],['Sources','A1:G8'],['Revision','A1:G19'],['Example','A1:G36']]){const image=await wb.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(path.join(qa,`${name}-${range.replace(':','-')}.png`),new Uint8Array(await image.arrayBuffer()));}
const output=await SpreadsheetFile.exportXlsx(wb);await output.save(path.join(root,'CAPSTONE/bus311-capstone-project-workbook.xlsx'));
console.log('Built six-tab continuing workbook; investment, working-capital and zero-rate fixtures passed.');
