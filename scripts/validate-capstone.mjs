import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "CAPSTONE/source/bus311-capstone.json");
const sourceBytes = await fs.readFile(sourcePath);
const source = JSON.parse(sourceBytes.toString("utf8"));
const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const term = JSON.parse(await fs.readFile(path.join(root, "terms/fall-2026.json"), "utf8"));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sum = (items) => items.reduce((total, item) => total + item.points, 0);

const expectedMilestones = [
  ["M01", 5, "2026-09-09T12:30:00-04:00"],
  ["M02", 8, "2026-09-30T12:30:00-04:00"],
  ["M03", 8, "2026-11-18T12:30:00-05:00"],
  ["M04", 4, "2026-11-22T12:30:00-05:00"],
];
const expectedCriteria = [
  ["Company exploration and potential CFO decision", 5, "S01_SCOPE"],
  ["Revenue engine and initial hypothesis", 8, "S02_REVENUE"],
  ["Valuation model and scenarios", 8, "S03_VALUE"],
  ["AI red team and revision", 4, "S04_RED_TEAM"],
  ["PowerPoint company-analysis project submission", 50, "S05_BOARD"],
  ["Oral Presentation", 25, "S05_BOARD"],
];
const expectedComponents = [
  ["Stages 1-4: milestones, Excel model, and revision", 25],
  ["PowerPoint company-analysis project submission", 50],
  ["Oral Presentation", 25],
];
const expectedDeliverables = [
  ["PowerPoint company-analysis project submission", 50, "PPTX upload"],
  ["Oral Presentation", 25, "Live in class"],
];
const oldPatterns = [
  /executive[ -]summary/i,
  /\bq\s*&\s*a\b/i,
  /\b40\s+points?\b/i,
  /\b15\s+points?\b/i,
  /two\s+final\s+files/i,
  /one-page\s+pdf/i,
  /individual\s+q\s*&\s*a/i,
];
const assertNoOld = (label, text) => {
  for (const pattern of oldPatterns) assert(!pattern.test(text), `${label} contains obsolete Stage 5 language: ${pattern}`);
};
const staleOralPatterns = [
  /oral Board presentation/i,
  /\boral-presentation\b/,
  /\boral presentation\b/,
  /\blive presentation\b/,
  /\bclass presentation\b/,
  /\boral criterion\b/,
];
const assertOralPresentationTitle = (label, text) => {
  for (const pattern of staleOralPatterns) assert(!pattern.test(text), `${label} contains a nonstandard Oral Presentation reference: ${pattern}`);
};

assert(source.meta.status === "approved", "source status must be approved");
assert(source.meta.sourceVersion === "1.5.0", "source version must be 1.5.0");
assert(source.project.ownership === "Individual", "project must remain individual");
assert(source.project.projectPoints === 100 && source.project.courseWeightPercent === 25, "project must remain 100 points and 25% of BUS311");
assert(JSON.stringify(source.milestones.map((item) => [item.milestoneId, item.points, item.due])) === JSON.stringify(expectedMilestones), "Stages 1-4 points or dates changed");
assert(sum(source.milestones) === 25, "Stages 1-4 must total 25 points");
assert(JSON.stringify(source.deliverables.map((item) => [item.title, item.points, item.format])) === JSON.stringify(expectedDeliverables), "Stage 5 must contain exactly the approved two deliverables");
assert(sum(source.deliverables) === 75, "Stage 5 deliverables must total 75 points");
assert(source.finalSubmission.communicationFileCount === 1 && source.finalSubmission.assessedComponentCount === 2, "Stage 5 must have one uploaded file and two assessed components");
assert(JSON.stringify(source.finalSubmission.files) === JSON.stringify(["BUS311_[LastName]_[Ticker]_CompanyAnalysis.pptx"]), "final filename contract mismatch");
assert(source.finalSubmission.deadline === "2026-11-30T12:30:00-05:00", "final PowerPoint deadline changed");
assert(source.presentationSchedule.presentationMinutes === 7 && source.presentationSchedule.questionMinutes === 3, "Oral Presentation timing must remain 7 + 3 minutes");
assert(JSON.stringify(source.presentationSchedule.dates) === JSON.stringify(["2026-11-30", "2026-12-02", "2026-12-07", "2026-12-09"]), "presentation dates changed");
assert(JSON.stringify(source.presentationSchedule.plannedDistribution) === JSON.stringify([5, 5, 5, 4]), "presentation distribution changed");
assert(term.capstone?.finalFileDeadline === source.finalSubmission.deadline, "term final-file deadline mismatch");
assert(JSON.stringify((term.capstone?.milestones || []).map((item) => [item.milestoneId, item.due])) === JSON.stringify(expectedMilestones.map(([id, , due]) => [id, due])), "term milestone dates changed");

const stageFive = source.hub.stages.find((item) => item.stageId === "S05_BOARD");
const stageTwo = source.hub.stages.find((item) => item.stageId === "S02_REVENUE");
const stageTwoHelp = source.hub.stageTwoHelp;
assert(source.hub.stages.length === 5 && sum(source.hub.stages) === 100, "hub must retain five stages totaling 100 points");
assert(source.hub.stages.slice(0, 4).map((item) => item.points).join(",") === "5,8,8,4", "hub Stages 1-4 points changed");
assert(stageTwo?.requiredSubmission === "One completed Revenue Analysis Workbook (.xlsx), including the Hypothesis & Scenarios sheet", "Stage 2 must require exactly one completed .xlsx workbook");
assert(JSON.stringify(stageTwo?.materialIds) === JSON.stringify(["REVENUE_GUIDE", "REVENUE_WORKBOOK", "HYPOTHESIS_CHECKLIST", "M02_RUBRIC"]), "Stage 2 must expose the guide, workbook, checklist, and rubric in sequence");
assert(stageTwoHelp?.steps?.length === 5, "Stage 2 help must contain five sequenced start-here steps");
assert(stageTwoHelp?.edgeCases?.length >= 5, "Stage 2 help must address the approved edge cases");
assert(stageTwoHelp?.submission?.includes("Upload one required file") && stageTwoHelp.submission.includes(".xlsx") && stageTwoHelp.submission.includes("Do not create or upload a separate PDF or DOCX"), "Stage 2 help must distinguish the required workbook from a conditional readable export");
assert(stageTwoHelp?.passMeaning?.includes("structural checks") && stageTwoHelp.passMeaning.includes("does not guarantee full credit"), "Stage 2 help must explain that PASS is structural only");
assert(stageTwoHelp?.factSet?.instruction?.includes("FactSet activation and Excel setup page"), "Stage 2 help must route students to FactSet setup");
assert(stageFive?.points === 75 && stageFive?.components?.length === 2, "hub Stage 5 must expose exactly two components totaling 75 points");
assert(JSON.stringify(stageFive?.components?.map((item) => [item.title, item.points])) === JSON.stringify(expectedDeliverables.map(([title, points]) => [title, points])), "hub Stage 5 component names or points mismatch");
assert(stageFive?.requiredSubmission.includes("one editable .pptx") && stageFive.requiredSubmission.includes("present live"), "hub Stage 5 upload/live boundary is incomplete");
assert(stageFive?.components?.[0].format.includes("8-10 core slides") && stageFive.components[1].timing.includes("up to 7 minutes") && stageFive.components[1].timing.includes("up to 3 minutes"), "hub Stage 5 format or timing detail is incomplete");

assert(JSON.stringify(source.rubric.performanceScale.map((item) => item.label)) === JSON.stringify(["Complete", "Developing", "Not demonstrated"]), "rubric must use Complete, Developing, and Not demonstrated");
assert(JSON.stringify(source.rubric.components.map((item) => [item.title, item.points])) === JSON.stringify(expectedComponents), "rubric components must be 25, 50, and 25");
assert(JSON.stringify(source.rubric.criteria.map((item) => [item.title, item.points, item.stageId])) === JSON.stringify(expectedCriteria), "rubric must contain the approved six criteria");
assert(sum(source.rubric.criteria) === 100, "rubric criteria must total 100 points");
assert(source.rubric.criteria.filter((item) => item.stageId === "S05_BOARD").length === 2, "rubric must contain exactly two Stage 5 criteria");
for (const criterion of source.rubric.criteria) {
  assert(criterion.evidenceRules?.length >= 4, `${criterion.title} needs concrete evidence rules`);
  assert(JSON.stringify(Object.keys(criterion.performanceLevels)) === JSON.stringify(["COMPLETE", "DEVELOPING", "NOT_DEMONSTRATED"]), `${criterion.title} rating keys mismatch`);
  for (const rating of Object.values(criterion.performanceLevels)) assert(typeof rating.points === "number" && rating.description?.length > 40, `${criterion.title} has an incomplete rating descriptor`);
}
assert(source.rubric.validationContract.criterionCount === 6, "rubric validation contract criterion count mismatch");
assert(JSON.stringify(source.validation.componentPoints) === JSON.stringify([25, 50, 25]), "source validation component points mismatch");
assert(JSON.stringify(source.validation.milestonePoints) === JSON.stringify([5, 8, 8, 4]), "source validation milestone points mismatch");
assert(source.validation.communicationFiles === 1 && source.validation.stageFiveAssessedComponents === 2, "source validation upload/component counts mismatch");

assert(source.materials.length === 14, "current student file library must contain 14 materials");
assert(source.materials.every((item) => typeof item.description === "string" && item.description.length >= 40), "every current student material needs a useful description");
assert(source.unlistedLegacyMaterials?.length === 3, "three obsolete written-summary files must be deliberately unlisted");
const currentPaths = new Set(source.materials.map((item) => item.path));
for (const item of source.materials) assert(await fs.stat(path.join(root, item.path)).then((s) => s.isFile()).catch(() => false), `missing current material: ${item.path}`);
for (const item of source.unlistedLegacyMaterials || []) {
  assert(item.status === "obsolete-unlisted", `legacy material is not marked obsolete-unlisted: ${item.path}`);
  assert(!currentPaths.has(item.path), `legacy material remains in current materials: ${item.path}`);
  assert(await fs.stat(path.join(root, item.path)).then((s) => s.isFile()).catch(() => false), `deliberately retained legacy file is missing: ${item.path}`);
}
const exposedSource = structuredClone(source);
delete exposedSource.unlistedLegacyMaterials;
assertNoOld("maintained exposed source", JSON.stringify(exposedSource));
assertOralPresentationTitle("maintained exposed source", JSON.stringify(exposedSource));

const decodeXml = (text) => String(text)
  .replace(/<[^>]+>/g, " ")
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"')
  .replace(/\s+/g, " ")
  .trim();
const compactText = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "");
const includesLoose = (text, marker) => compactText(text).includes(compactText(marker));
const unzipText = (relative, patterns) => decodeXml(execFileSync("unzip", ["-p", path.join(root, relative), ...patterns], { encoding: "utf8", maxBuffer: 80 * 1024 * 1024 }));
const zipEntries = (relative, pattern) => execFileSync("unzip", ["-Z1", path.join(root, relative)], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter((entry) => pattern.test(entry));
const zipEntryText = (relative, entry) => execFileSync("unzip", ["-p", path.join(root, relative), entry], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
const xmlEntities = (text) => String(text)
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"');
const validatePageNumberOnlyFooters = (relative, label) => {
  const entries = zipEntries(relative, /^word\/footer\d+\.xml$/);
  assert(entries.length > 0, `${label} has no footer XML`);
  for (const entry of entries) {
    const xml = zipEntryText(relative, entry);
    const visible = [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((match) => xmlEntities(match[1])).join("").trim();
    const instructions = [...xml.matchAll(/<w:instrText(?:\s[^>]*)?>([\s\S]*?)<\/w:instrText>/g)].map((match) => xmlEntities(match[1]).trim());
    assert(/^\d+$/.test(visible), `${label} ${entry} must display only a numeric page number; found: ${JSON.stringify(visible)}`);
    assert(instructions.some((item) => item === "PAGE"), `${label} ${entry} is missing the PAGE field`);
  }
};
const assignmentDocx = unzipText("CAPSTONE/bus311-capstone-assignment.docx", ["word/*.xml"]);
const rubricDocx = unzipText("CAPSTONE/bus311-capstone-student-rubric.docx", ["word/*.xml"]);
const revenueGuideDocx = unzipText("CAPSTONE/bus311-capstone-revenue-engine-guide.docx", ["word/*.xml"]);
const hypothesisChecklistDocx = unzipText("CAPSTONE/bus311-capstone-hypothesis-checklist.docx", ["word/*.xml"]);
const revenueRubricDocx = unzipText("CAPSTONE/bus311-capstone-revenue-milestone-rubric.docx", ["word/*.xml"]);
const aiGuideDocx = unzipText("CAPSTONE/bus311-capstone-ai-student-guide.docx", ["word/*.xml"]);
const capajDocx = unzipText("CAPSTONE/bus311-capstone-capaj-prompts.docx", ["word/*.xml"]);
const pptxText = unzipText("CAPSTONE/bus311-capstone-board-deck-template.pptx", ["ppt/slides/*.xml", "ppt/notesSlides/*.xml"]);
const redTeamText = unzipText("CAPSTONE/bus311-capstone-red-team-record.xlsx", ["xl/sharedStrings.xml", "xl/worksheets/*.xml"]);
const valuationText = unzipText("CAPSTONE/bus311-capstone-valuation-model.xlsx", ["xl/sharedStrings.xml", "xl/worksheets/*.xml"]);
const revenueWorkbookText = unzipText("CAPSTONE/bus311-capstone-revenue-analysis.xlsx", ["xl/sharedStrings.xml", "xl/worksheets/*.xml"]);
const pdftotext = process.env.PDFTOTEXT || "/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/bin/pdftotext";
const assignmentPdf = execFileSync(pdftotext, [path.join(root, "CAPSTONE/bus311-capstone-assignment.pdf"), "-"], { encoding: "utf8", maxBuffer: 40 * 1024 * 1024 }).replace(/\s+/g, " ").trim();

for (const [label, text] of [["assignment DOCX", assignmentDocx], ["assignment PDF", assignmentPdf]]) {
  assertNoOld(label, text);
  assertOralPresentationTitle(label, text);
  for (const marker of ["PowerPoint company-analysis project submission", "Oral Presentation", "50 points", "25 points", "exactly one editable", "up to seven minutes", "up to three", "100 points"]) assert(text.toLowerCase().includes(marker.toLowerCase()), `${label} is missing: ${marker}`);
  for (const marker of ["Sept. 9", "Sept. 30", "Nov. 18", "Nov. 22"]) assert(text.includes(marker), `${label} is missing unchanged date: ${marker}`);
  for (const marker of ["Submit one required file", "Stage 2 start here", "FactSet access or the Excel add-in", "PASS", "structural checks are complete", "Fewer than three defensible peers"]) assert(includesLoose(text, marker), `${label} is missing Stage 2 help: ${marker}`);
}
assertNoOld("student rubric DOCX", rubricDocx);
assertOralPresentationTitle("student rubric DOCX", rubricDocx);
for (const [title, points] of expectedCriteria) assert(rubricDocx.includes(title) && rubricDocx.includes(`${points} points`), `student rubric is missing ${title} (${points})`);
for (const rating of ["Complete", "Developing", "Not demonstrated"]) assert(rubricDocx.includes(rating), `student rubric is missing ${rating}`);
validatePageNumberOnlyFooters("CAPSTONE/bus311-capstone-assignment.docx", "assignment DOCX");
validatePageNumberOnlyFooters("CAPSTONE/bus311-capstone-student-rubric.docx", "student rubric DOCX");
assertNoOld("AI student guide", aiGuideDocx);
assertNoOld("C-A-P-A-J prompt guide", capajDocx);
assertOralPresentationTitle("AI student guide", aiGuideDocx);
assertOralPresentationTitle("C-A-P-A-J prompt guide", capajDocx);
assert(aiGuideDocx.includes("Oral Presentation rehearsal") && capajDocx.includes("Rehearse the Oral Presentation"), "supporting AI documents are missing the Oral Presentation rehearsal language");
assertNoOld("Board PowerPoint template", pptxText);
assertOralPresentationTitle("Board PowerPoint template", pptxText);
for (const marker of ["QUESTION READY", "REVENUE QUESTION SUPPORT", "MODEL QUESTION SUPPORT", "SENSITIVITY QUESTION SUPPORT", "SOURCE QUESTION SUPPORT", "LIVE QUESTIONS ONLY"]) assert(pptxText.includes(marker), `Board PowerPoint template is missing: ${marker}`);
assertNoOld("red-team workbook", redTeamText);
assertOralPresentationTitle("red-team workbook", redTeamText);
assert(redTeamText.includes("ORAL PRESENTATION REVISION") && redTeamText.includes("PowerPoint company analysis"), "red-team workbook Stage 5 language is stale");
assertNoOld("valuation workbook", valuationText);
assertOralPresentationTitle("valuation workbook", valuationText);
assert(valuationText.includes("Oral Presentation readiness") && valuationText.includes("live-question support"), "valuation workbook Stage 5 language is stale");

for (const [label, text] of [["revenue guide", revenueGuideDocx], ["hypothesis checklist", hypothesisChecklistDocx], ["revenue milestone rubric", revenueRubricDocx]]) {
  assert(!/Instructor-review draft/i.test(text), `${label} still exposes an instructor-review draft label`);
  assert(!/Submit two files/i.test(text), `${label} still requires two Stage 2 files`);
}
for (const marker of ["Approved student release", "One required file", "eight-step workflow", "FactSet access or the Excel add-in", "structural checks are complete"]) assert(includesLoose(revenueGuideDocx, marker), `revenue guide is missing: ${marker}`);
for (const marker of ["Approved student release", "Base", "Upside", "Downside", "skeptical-CFO judgment"]) assert(includesLoose(hypothesisChecklistDocx, marker), `hypothesis checklist is missing: ${marker}`);
for (const marker of ["Approved student scoring standard", "8 points", "Revenue Engine and Initial Hypothesis", "challenge linkage", "AI output is not evidence"]) assert(includesLoose(revenueRubricDocx, marker), `revenue milestone rubric is missing: ${marker}`);
for (const marker of ["Complete all nine visible sheets", "Reported revenue change", "Quantified driver effects", "Directional remainder"]) assert(revenueWorkbookText.includes(marker), `revenue workbook is missing revised Stage 2 guidance: ${marker}`);

const publicHub = await fs.readFile(path.join(root, "CAPSTONE/index.html"), "utf8");
const canvasFragment = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-canvas.html"), "utf8");
const assignmentMarkdown = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-assignment.md"), "utf8");
const courseHub = await fs.readFile(path.join(root, "index.html"), "utf8");
const m01Deck = await fs.readFile(path.join(root, "01-INTRO/M01/bus311-intro-m01-l01-slides.html"), "utf8");
for (const [label, text] of [["public capstone hub", publicHub], ["Canvas fragment", canvasFragment], ["assignment Markdown", assignmentMarkdown], ["M01 orientation deck", m01Deck]]) {
  assertNoOld(label, text);
  assertOralPresentationTitle(label, text);
}
for (const text of [publicHub, canvasFragment, assignmentMarkdown]) {
  assert(text.includes("PowerPoint company-analysis project submission") && text.includes("Oral Presentation"), "a generated Stage 5 output is missing the two exact component names");
  assert(text.includes("50 points") && text.includes("25 points"), "a generated Stage 5 output is missing the 50/25 scoring");
  assert(text.includes("one") && text.toLowerCase().includes("live"), "a generated Stage 5 output is missing upload/live detail");
  for (const marker of ["Start here", "six to eight focused hours", "Upload one required file", "FactSet", "PASS", "structural", "Fewer than three defensible peers"]) assert(includesLoose(text, marker), `a generated Stage 2 output is missing: ${marker}`);
}
for (const legacy of source.unlistedLegacyMaterials || []) {
  const name = path.basename(legacy.path);
  assert(!publicHub.includes(name) && !canvasFragment.includes(name) && !assignmentMarkdown.includes(name), `obsolete file is exposed: ${name}`);
}
assert(publicHub.includes(`Open the complete file library (${source.materials.length} files)`) && canvasFragment.includes(`Open the complete file library (${source.materials.length} files)`), "file-library count is stale");
assert((publicHub.match(/class="stage-card"/g) || []).length === 5, "public hub must show five stage cards");
for (const step of stageTwoHelp.steps) assert(publicHub.includes(step.title), `public hub is missing Stage 2 step: ${step.title}`);
for (const materialId of stageTwo.materialIds) {
  const material = source.materials.find((item) => item.materialId === materialId);
  assert(material && publicHub.includes(path.basename(material.path)) && canvasFragment.includes(path.basename(material.path)), `Stage 2 help does not expose ${materialId}`);
}
assert(publicHub.includes("stage-five-components") && publicHub.includes("@media(max-width:700px)"), "public hub is missing responsive Stage 5 layout");
assert(publicHub.includes("stage-two-help") && publicHub.includes("@media(max-width:700px)"), "public hub is missing responsive Stage 2 help layout");
assert(!/<(?:html|head|body|style|script)\b/i.test(canvasFragment), "Canvas fragment contains prohibited document, style, or script markup");
assert((canvasFragment.match(/<h1\b/gi) || []).length === 1, "Canvas fragment must contain exactly one H1");
assert(courseHub.includes("PowerPoint submission and Oral Presentation") && courseHub.includes(stageFive.title), "course homepage capstone snapshot is stale");
assert(m01Deck.includes("uploaded PowerPoint company analysis (50 points)") && m01Deck.includes("live Oral Presentation (25 points)"), "M01 orientation deck scoring is stale");

const provenance = JSON.parse(await fs.readFile(path.join(root, "CAPSTONE/output-provenance.json"), "utf8"));
assert(provenance.sourceVersion === source.meta.sourceVersion && provenance.sourceSha256 === sourceHash, "provenance source identity mismatch");
for (const item of provenance.artifacts) {
  const bytes = await fs.readFile(path.join(root, item.path)).catch(() => null);
  assert(Boolean(bytes), `missing provenance artifact: ${item.path}`);
  if (bytes) assert(crypto.createHash("sha256").update(bytes).digest("hex") === item.sha256, `stale provenance artifact: ${item.path}`);
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
const csvPath = "/Users/bethanyevittsair2/Documents/Codex/2026-08-10/realtime-voice-chat-5/outputs/BUS311_Capstone_Canvas_Rubric.csv";
const csvText = await fs.readFile(csvPath, "utf8").catch(() => "");
assert(Boolean(csvText), "Canvas-import rubric CSV is missing");
assertNoOld("Canvas-import rubric CSV", csvText);
assertOralPresentationTitle("Canvas-import rubric CSV", csvText);
const csvRows = parseCsv(csvText);
assert(csvRows.length === 7 && csvRows.every((row) => row.length === 13), "Canvas-import CSV must have one header and six 13-column criteria rows");
const expectedCsvNames = expectedCriteria.map(([title, , stage], index) => stage === "S05_BOARD" ? title : `Stage ${index + 1}: ${title}`);
assert(JSON.stringify(csvRows.slice(1).map((row) => row[1])) === JSON.stringify(expectedCsvNames), "Canvas-import CSV criterion names mismatch");
assert(csvRows.slice(1).every((row) => row[4] === "Complete" && row[7] === "Developing" && row[10] === "Not demonstrated"), "Canvas-import CSV rating labels mismatch");
assert(csvRows.slice(1).every((row) => row[5].length > 40 && row[8].length > 40 && row[11].length > 40), "Canvas-import CSV rating evidence is incomplete");
const csvCompletePoints = csvRows.slice(1).map((row) => Number(row[6]));
assert(JSON.stringify(csvCompletePoints) === JSON.stringify([5, 8, 8, 4, 50, 25]), "Canvas-import CSV point sequence mismatch");
assert(csvCompletePoints.reduce((total, points) => total + points, 0) === 100, "Canvas-import CSV must total 100 points");
assert(csvRows.slice(1).every((row) => Number(row[12]) === 0), "Canvas-import CSV Not demonstrated ratings must be 0 points");

for (const match of publicHub.matchAll(/href="\.\/([^"#?]+)"/g)) {
  assert(await fs.stat(path.join(root, "CAPSTONE", decodeURIComponent(match[1]))).then((s) => s.isFile()).catch(() => false), `broken public hub file link: ${match[1]}`);
}
const siteScan = execFileSync("python3", [path.join(root, "scripts/validate-public.py"), "--site-only"], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
assert(siteScan.includes("PASS"), "existing public site validator failed");

if (failures.length) {
  console.error("BUS311 capstone validation: FAIL");
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`BUS311 capstone validation: PASS (${source.rubric.criteria.length} criteria, ${source.materials.length} current materials, Canvas CSV 100 points)`);
