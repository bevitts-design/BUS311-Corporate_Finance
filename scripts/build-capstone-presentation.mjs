import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const runtimeModules=process.env.RUNTIME_NODE_MODULES || '/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const runtimeRequire=createRequire(path.join(runtimeModules,'__capstone__.cjs'));
const {Presentation,PresentationFile,FileBlob}=await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const skill=process.env.PRESENTATIONS_SKILL_DIR||'/Users/bethanyevittsair2/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const python=process.env.RUNTIME_PYTHON||'/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const {resolvePresentationFont,finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const font=resolvePresentationFont();
const qa=process.env.CAPSTONE_QA_DIR||path.join(root,'qa');await fs.mkdir(qa,{recursive:true});
const d=JSON.parse(await fs.readFile(path.join(root,'CAPSTONE/source/bus311-capstone.json')));
const p=Presentation.create({slideSize:{width:1280,height:720}});
function text(s,t,x,y,w,h,size,color='#152536',bold=false){const b=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});b.text=t;b.text.style={typeface:font,fontSize:size,bold,color,autoFit:'none'};return b;}
for(const [i,outline] of d.slideOutline.entries()){
 const s=p.slides.add();s.background.fill='#FAF8F3';
 text(s,'BUS311  •  COMPANY DECISION',70,35,1110,35,20,'#813D24',true);
 text(s,outline.title,70,90,1120,90,44,'#152536',true);
 text(s,outline.prompt,70,205,1090,100,29);
 text(s,'[Replace this space with your company-specific conclusion and evidence.]',70,345,1090,110,31,'#355773');
 text(s,'Evidence to include: '+outline.evidence,70,505,1090,90,23);
 text(s,'Source: [filing/report, period, units, source ID; model version and cell where applicable]',70,635,1090,40,17,'#4F5965');
 text(s,String(i+1),1170,655,40,30,18,'#4F5965');
 s.speakerNotes.textFrame.setText(outline.notes+' Replace all bracketed prompts with your own company analysis. Use editable text and readable charts. Identify company facts and assumptions separately. Use six core slides; append supporting source or calculation slides only if useful. If AI was used, add a brief disclosure in the source notes or appendix. The full presentation is seven minutes, followed by three minutes of live questions.');
 const png=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(qa,`slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));
}
const candidate=path.join(qa,'board-template-candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
// Verify the exact candidate in-process; the runtime importer leaves background handles open.
const imported=await PresentationFile.importPptx(await FileBlob.load(candidate));
if(imported.slides.items.length!==6)throw Error('Round-trip slide count mismatch');
const final=path.join(qa,'final/board-template-validated.pptx');await fs.mkdir(path.dirname(final),{recursive:true});await fs.rm(final,{force:true});
await finalizePresentation({workspaceDir:qa,candidatePath:candidate,finalPath:final,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:6,fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:false,receiptPath:path.join(qa,'presentation-validation.json')});
await fs.copyFile(final,path.join(root,'CAPSTONE/bus311-capstone-board-deck-template.pptx'));
console.log('Built six-slide editable presentation template.');

process.exit(0);
