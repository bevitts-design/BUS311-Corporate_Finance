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
  ["oral Board presentation to the class", 25, "S05_BOARD"],
];
const expectedComponents = [
  ["Stages 1-4: milestones, Excel model, and revision", 25],
  ["PowerPoint company-analysis project submission", 50],
  ["oral Board presentation to the class", 25],
];
const expectedDeliverables = [
  ["PowerPoint company-analysis project submission", 50, "PPTX upload"],
  ["oral Board presentation to the class", 25, "Live in class"],
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

assert(source.meta.status === "approved", "source status must be approved");
assert(source.meta.sourceVersion === "1.4.0", "source version must be 1.4.0");
assert(source.project.ownership === "Individual", "project must remain individual");
assert(source.project.projectPoints === 100 && source.project.courseWeightPercent === 25, "project must remain 100 points and 25% of BUS311");
assert(JSON.stringify(source.milestones.map((item) => [item.milestoneId, item.points, item.due])) === JSON.stringify(expectedMilestones), "Stages 1-4 points or dates changed");
assert(sum(source.milestones) === 25, "Stages 1-4 must total 25 points");
assert(JSON.stringify(source.deliverables.map((item) => [item.title, item.points, item.format])) === JSON.stringify(expectedDeliverables), "Stage 5 must contain exactly the approved two deliverables");
assert(sum(source.deliverables) === 75, "Stage 5 deliverables must total 75 points");
assert(source.finalSubmission.communicationFileCount === 1 && source.finalSubmission.assessedComponentCount === 2, "Stage 5 must have one uploaded file and two assessed components");
assert(JSON.stringify(source.finalSubmission.files) === JSON.stringify(["BUS311_[LastName]_[Ticker]_CompanyAnalysis.pptx"]), "final filename contract mismatch");
assert(source.finalSubmission.deadline === "2026-11-30T12:30:00-05:00", "final PowerPoint deadline changed");
assert(source.presentationSchedule.presentationMinutes === 7 && source.presentationSchedule.questionMinutes === 3, "oral-presentation timing must remain 7 + 3 minutes");
assert(JSON.stringify(source.presentationSchedule.dates) === JSON.stringify(["2026-11-30", "2026-12-02", "2026-12-07", "2026-12-09"]), "presentation dates changed");
assert(JSON.stringify(source.presentationSchedule.plannedDistribution) === JSON.stringify([5, 5, 5, 4]), "presentation distribution changed");
assert(term.capstone?.finalFileDeadline === source.finalSubmission.deadline, "term final-file deadline mismatch");
assert(JSON.stringify((term.capstone?.milestones || []).map((item) => [item.milestoneId, item.due])) === JSON.stringify(expectedMilestones.map(([id, , due]) => [id, due])), "term milestone dates changed");

const stageFive = source.hub.stages.find((item) => item.stageId === "S05_BOARD");
assert(source.hub.stages.length === 5 && sum(source.hub.stages) === 100, "hub must retain five stages totaling 100 points");
assert(source.hub.stages.slice(0, 4).map((item) => item.points).join(",") === "5,8,8,4", "hub Stages 1-4 points changed");
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

const decodeXml = (text) => String(text)
  .replace(/<[^>]+>/g, " ")
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"')
  .replace(/\s+/g, " ")
  .trim();
const unzipText = (relative, patterns) => decodeXml(execFileSync("unzip", ["-p", path.join(root, relative), ...patterns], { encoding: "utf8", maxBuffer: 80 * 1024 * 1024 }));
const assignmentDocx = unzipText("CAPSTONE/bus311-capstone-assignment.docx", ["word/*.xml"]);
const rubricDocx = unzipText("CAPSTONE/bus311-capstone-student-rubric.docx", ["word/*.xml"]);
const aiGuideDocx = unzipText("CAPSTONE/bus311-capstone-ai-student-guide.docx", ["word/*.xml"]);
const capajDocx = unzipText("CAPSTONE/bus311-capstone-capaj-prompts.docx", ["word/*.xml"]);
const pptxText = unzipText("CAPSTONE/bus311-capstone-board-deck-template.pptx", ["ppt/slides/*.xml", "ppt/notesSlides/*.xml"]);
const redTeamText = unzipText("CAPSTONE/bus311-capstone-red-team-record.xlsx", ["xl/sharedStrings.xml", "xl/worksheets/*.xml"]);
const valuationText = unzipText("CAPSTONE/bus311-capstone-valuation-model.xlsx", ["xl/sharedStrings.xml", "xl/worksheets/*.xml"]);
const pdftotext = process.env.PDFTOTEXT || "/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/bin/pdftotext";
const assignmentPdf = execFileSync(pdftotext, [path.join(root, "CAPSTONE/bus311-capstone-assignment.pdf"), "-"], { encoding: "utf8", maxBuffer: 40 * 1024 * 1024 }).replace(/\s+/g, " ").trim();

for (const [label, text] of [["assignment DOCX", assignmentDocx], ["assignment PDF", assignmentPdf]]) {
  assertNoOld(label, text);
  for (const marker of ["PowerPoint company-analysis project submission", "oral Board presentation to the class", "50 points", "25 points", "exactly one editable", "up to seven minutes", "up to three", "100 points"]) assert(text.toLowerCase().includes(marker.toLowerCase()), `${label} is missing: ${marker}`);
  for (const marker of ["Sept. 9", "Sept. 30", "Nov. 18", "Nov. 22"]) assert(text.includes(marker), `${label} is missing unchanged date: ${marker}`);
}
assertNoOld("student rubric DOCX", rubricDocx);
for (const [title, points] of expectedCriteria) assert(rubricDocx.includes(title) && rubricDocx.includes(`${points} points`), `student rubric is missing ${title} (${points})`);
for (const rating of ["Complete", "Developing", "Not demonstrated"]) assert(rubricDocx.includes(rating), `student rubric is missing ${rating}`);
assertNoOld("AI student guide", aiGuideDocx);
assertNoOld("C-A-P-A-J prompt guide", capajDocx);
assert(aiGuideDocx.includes("Oral Board presentation rehearsal") && capajDocx.includes("Rehearse the oral Board presentation"), "supporting AI documents are missing the oral-presentation rehearsal language");
assertNoOld("Board PowerPoint template", pptxText);
for (const marker of ["QUESTION READY", "REVENUE QUESTION SUPPORT", "MODEL QUESTION SUPPORT", "SENSITIVITY QUESTION SUPPORT", "SOURCE QUESTION SUPPORT", "LIVE QUESTIONS ONLY"]) assert(pptxText.includes(marker), `Board PowerPoint template is missing: ${marker}`);
assertNoOld("red-team workbook", redTeamText);
assert(redTeamText.includes("ORAL BOARD PRESENTATION REVISION") && redTeamText.includes("PowerPoint company analysis"), "red-team workbook Stage 5 language is stale");
assertNoOld("valuation workbook", valuationText);
assert(valuationText.includes("oral-presentation readiness") && valuationText.includes("live-question support"), "valuation workbook Stage 5 language is stale");

const publicHub = await fs.readFile(path.join(root, "CAPSTONE/index.html"), "utf8");
const canvasFragment = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-canvas.html"), "utf8");
const assignmentMarkdown = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-assignment.md"), "utf8");
const courseHub = await fs.readFile(path.join(root, "index.html"), "utf8");
const m01Deck = await fs.readFile(path.join(root, "01-INTRO/M01/bus311-intro-m01-l01-slides.html"), "utf8");
for (const [label, text] of [["public capstone hub", publicHub], ["Canvas fragment", canvasFragment], ["assignment Markdown", assignmentMarkdown], ["M01 orientation deck", m01Deck]]) assertNoOld(label, text);
for (const text of [publicHub, canvasFragment, assignmentMarkdown]) {
  assert(text.includes("PowerPoint company-analysis project submission") && text.includes("oral Board presentation to the class"), "a generated Stage 5 output is missing the two exact component names");
  assert(text.includes("50 points") && text.includes("25 points"), "a generated Stage 5 output is missing the 50/25 scoring");
  assert(text.includes("one") && text.toLowerCase().includes("live"), "a generated Stage 5 output is missing upload/live detail");
}
for (const legacy of source.unlistedLegacyMaterials || []) {
  const name = path.basename(legacy.path);
  assert(!publicHub.includes(name) && !canvasFragment.includes(name) && !assignmentMarkdown.includes(name), `obsolete file is exposed: ${name}`);
}
assert(publicHub.includes(`Open the complete file library (${source.materials.length} files)`) && canvasFragment.includes(`Open the complete file library (${source.materials.length} files)`), "file-library count is stale");
assert((publicHub.match(/class="stage-card"/g) || []).length === 5, "public hub must show five stage cards");
assert(publicHub.includes("stage-five-components") && publicHub.includes("@media(max-width:700px)"), "public hub is missing responsive Stage 5 layout");
assert(!/<(?:html|head|body|style|script)\b/i.test(canvasFragment), "Canvas fragment contains prohibited document, style, or script markup");
assert((canvasFragment.match(/<h1\b/gi) || []).length === 1, "Canvas fragment must contain exactly one H1");
assert(courseHub.includes("PowerPoint submission and oral Board presentation") && courseHub.includes(stageFive.title), "course homepage capstone snapshot is stale");
assert(m01Deck.includes("uploaded PowerPoint company analysis (50 points)") && m01Deck.includes("live oral Board presentation to the class (25 points)"), "M01 orientation deck scoring is stale");

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
