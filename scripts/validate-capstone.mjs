import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "CAPSTONE/source/bus311-capstone.json");
const bytes = await fs.readFile(sourcePath);
const source = JSON.parse(bytes.toString("utf8"));
const term = JSON.parse(await fs.readFile(path.join(root, "terms/fall-2026.json"), "utf8"));
const sourceHash = crypto.createHash("sha256").update(bytes).digest("hex");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(source.meta.status === "approved", "source status must be approved");
assert(source.project.ownership === "Individual", "project must be individual");
assert(source.project.audience.includes("CFO and Board"), "audience must be CFO and Board");
assert(source.project.projectPoints === 100 && source.project.courseWeightPercent === 25, "100 points must equal 25% of course");
assert(source.rubric.components.reduce((sum, item) => sum + item.points, 0) === 100, "rubric components must total 100");
assert(source.rubric.criteria.reduce((sum, item) => sum + item.points, 0) === 100, "rubric criteria must total 100");
assert(source.milestones.reduce((sum, item) => sum + item.points, 0) === 25, "milestones must total 25");
assert(source.aiCheckpoints.length === 4, "exactly four AI checkpoints required");
assert(source.finalSubmission.communicationFileCount === 2, "exactly two final communication files required");
assert(source.finalSubmission.deadline === "2026-11-30T12:30:00-05:00", "approved final deadline mismatch");
const approvedMilestoneDeadlines = {
  M01: "2026-09-09T12:30:00-04:00",
  M02: "2026-09-30T12:30:00-04:00",
  M03: "2026-11-18T12:30:00-05:00",
  M04: "2026-11-22T12:30:00-05:00",
};
for (const milestone of source.milestones) {
  assert(milestone.due === approvedMilestoneDeadlines[milestone.milestoneId], `${milestone.milestoneId} approved 12:30 p.m. deadline mismatch`);
  assert(milestone.dueLabel?.includes("12:30 p.m. ET") && milestone.dueLabel.includes("class-start time"), `${milestone.milestoneId} deadline label is incomplete`);
}
for (const milestone of term.capstone?.milestones || []) {
  assert(milestone.due === approvedMilestoneDeadlines[milestone.milestoneId], `term ${milestone.milestoneId} deadline mismatch`);
  assert(milestone.dateLabel?.includes("12:30 p.m. ET"), `term ${milestone.milestoneId} date label is missing the time`);
}
assert(term.capstone?.finalFileDeadline === source.finalSubmission.deadline, "term final-file deadline mismatch");
assert(JSON.stringify(source.presentationSchedule.dates) === JSON.stringify(["2026-11-30", "2026-12-02", "2026-12-07", "2026-12-09"]), "presentation dates mismatch");
assert(JSON.stringify(source.presentationSchedule.plannedDistribution) === JSON.stringify([5, 5, 5, 4]), "presentation distribution mismatch");
assert(source.requirements.some((item) => item.requirementId === "R05_REVENUE_FIRST"), "revenue-first requirement missing");
assert(source.requirements.some((item) => item.requirementId === "R12_NO_INVESTOR_RATING"), "Buy/Hold/Sell prohibition missing");
assert(source.hub.stages.length === 5, "student hub must contain five stages");
assert(source.hub.stages.reduce((sum, item) => sum + item.points, 0) === 100, "hub stage points must total 100");
assert(source.hub.stages.every((item) => item.outcome && item.requiredSubmission && item.guideMaterialId), "each hub stage needs a concise outcome, one submission, and a detail guide");
assert(source.hub.stages.slice(0, 4).every((item) => item.dateLabel.includes("12:30 p.m. ET")), "Stages 1-4 hub labels must show the 12:30 p.m. ET deadline");
assert(source.hub.stages[4].dateLabel === "Final files November 30 at 12:30 p.m. ET; presentations November 30-December 9", "Stage 5 label or presentation window changed");
const stageOne = source.hub.stages.find((item) => item.stageId === "S01_SCOPE");
const milestoneOne = source.milestones.find((item) => item.milestoneId === "M01");
const stageOneRubric = source.rubric.criteria.find((item) => item.criterionId === "M01_CFO_DECISION");
const stageOneBoundary = `${stageOne?.summary || ""} ${(stageOne?.notRequiredYet || []).join(" ")}`.toLowerCase();
assert(stageOne?.objective?.includes("AI and/or ordinary web search") && stageOne.objective.includes("required FactSet"), "Stage 1 objective must allow AI/web research and require FactSet");
assert(stageOne?.outcome?.includes("one concrete FactSet learning") && stageOne.outcome.includes("one potential CFO decision"), "Stage 1 outcome must include the FactSet learning and potential CFO decision");
assert(stageOne?.requiredSubmission === "Stage 1 company exploration brief", "Stage 1 submission label mismatch");
assert(stageOne?.factSetLearning?.includes("screen, report, or feature") && stageOne.factSetLearning.includes("Formal citation and validation are not required"), "Stage 1 FactSet learning boundary is incomplete");
for (const marker of ["verify", "hypothesis", "alternatives", "evidence register", "formal citations", "formal approval gate"]) {
  assert(stageOneBoundary.includes(marker), `Stage 1 not-required-yet boundary is missing: ${marker}`);
}
assert(milestoneOne?.requirementIds.includes("R13_STAGE1_EXPLORATION"), "Milestone 1 must reference the exploratory Stage 1 requirement");
assert(!milestoneOne?.requirementIds.includes("R06_EVIDENCE") && !milestoneOne?.requirementIds.includes("R07_AI"), "Milestone 1 must not require later evidence or AI-verification gates");
assert(stageOneRubric?.evidenceRules.some((item) => item.includes("screen, report, or feature")), "Stage 1 rubric must assess the concrete FactSet learning");
assert(!/evidence register|independently verified|genuine alternatives|approved CFO decision/i.test(JSON.stringify(stageOneRubric)), "Stage 1 rubric still contains later-stage rigor");
assert(source.hub.decisionFamilies.length >= 4 && source.hub.decisionFamilies.length <= 5, "student hub must group decisions into four or five families");
assert(source.hub.decisionMenu.length === 10, "student hub must contain ten CFO decision directions");
assert(source.hub.aiStageChecklist.length === 4, "Stages 3-4 AI checklist must contain four concise controls");
assert(source.hub.faqs.length >= 8, "student hub FAQ is incomplete");
assert(source.hub.progressChecklist.length >= 12, "student progress checklist is incomplete");
assert(source.hub.canvasProjectPageUrl.endsWith("/courses/58525/pages/company-capstone"), "Canvas project page URL mismatch");

const criterionIds = new Set(source.rubric.criteria.map((item) => item.criterionId));
assert(criterionIds.size === source.rubric.criteria.length, "criterion IDs must be unique");
for (const item of source.materials) assert(await fs.stat(path.join(root, item.path)).then((s) => s.isFile()).catch(() => false), `missing public material: ${item.path}`);

const docxText = (materialId) => {
  const item = source.materials.find((candidate) => candidate.materialId === materialId);
  if (!item) return "";
  return execFileSync("unzip", ["-p", path.join(root, item.path), "word/document.xml"], { encoding: "utf8" })
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
};
const stageOneMenuText = docxText("M01_MENU").toLowerCase();
const stageOneBriefText = docxText("M01_EXPLORATION").toLowerCase();
const assignmentText = docxText("ASSIGNMENT_DOCX").toLowerCase();
const rubricText = docxText("STUDENT_RUBRIC").toLowerCase();
const aiGuideText = docxText("AI_GUIDE").toLowerCase();
const capajText = docxText("CAPAJ").toLowerCase();
assert(stageOneMenuText.includes("stage 1 is a guided first look") && stageOneMenuText.includes("factset is required"), "Stage 1 decision starter is stale");
assert(stageOneBriefText.includes("one specific thing i learned from factset") && stageOneBriefText.includes("screen, report, or feature"), "Stage 1 exploration brief is missing the FactSet learning field");
assert(stageOneBriefText.includes("not required in stage 1") && stageOneBriefText.includes("formal approval gate"), "Stage 1 exploration brief is missing the exploratory boundary");
assert(assignmentText.includes("company research and potential cfo decision") && assignmentText.includes("one concrete thing learned from factset"), "assignment DOCX Stage 1 requirements are stale");
assert(!assignmentText.includes("11:59") && !assignmentText.includes("23:59"), "assignment DOCX still contains the old milestone deadline");
for (const marker of ["sept. 9 at 12:30 p.m. et", "sept. 30 at 12:30 p.m. et", "nov. 18 at 12:30 p.m. et", "nov. 22 at 12:30 p.m. et"]) {
  assert(assignmentText.includes(marker), `assignment DOCX is missing deadline: ${marker}`);
}
assert(rubricText.includes("company exploration and potential cfo decision") && !rubricText.includes("company and approved cfo decision"), "student rubric Stage 1 criterion is stale");
assert(aiGuideText.includes("begin after stage 1") && capajText.includes("after the stage 1 exploration brief"), "AI guidance does not preserve the later-stage verification boundary");

const provenance = JSON.parse(await fs.readFile(path.join(root, "CAPSTONE/output-provenance.json"), "utf8"));
assert(provenance.sourceVersion === source.meta.sourceVersion, "provenance version mismatch");
assert(provenance.sourceSha256 === sourceHash, "provenance source hash mismatch");
for (const item of provenance.artifacts) {
  const file = path.join(root, item.path);
  const artifactBytes = await fs.readFile(file).catch(() => null);
  assert(Boolean(artifactBytes), `missing provenance artifact: ${item.path}`);
  if (artifactBytes) assert(crypto.createHash("sha256").update(artifactBytes).digest("hex") === item.sha256, `stale provenance artifact: ${item.path}`);
}

const publicHub = await fs.readFile(path.join(root, "CAPSTONE/index.html"), "utf8");
const canvasFragment = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-canvas.html"), "utf8");
const assignmentMarkdown = await fs.readFile(path.join(root, "CAPSTONE/bus311-capstone-assignment.md"), "utf8");
const courseHub = await fs.readFile(path.join(root, "index.html"), "utf8");
for (const [label, contents] of [["public hub", publicHub], ["Canvas fragment", canvasFragment], ["assignment Markdown", assignmentMarkdown], ["course hub", courseHub]]) {
  assert(!contents.includes("11:59") && !contents.includes("T23:59"), `${label} still contains the old milestone deadline`);
}
for (const marker of ["September 9 at 12:30 p.m. ET", "September 30 at 12:30 p.m. ET", "November 18 at 12:30 p.m. ET", "November 22 at 12:30 p.m. ET"]) {
  assert(publicHub.includes(marker) && canvasFragment.includes(marker), `hub output is missing deadline: ${marker}`);
}
const headingLevels = (html) => [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
const hasHeadingJump = (levels) => levels.some((level, index) => index > 0 && level > levels[index - 1] + 1);
assert((publicHub.match(/<h1\b/gi) || []).length === 1, "public hub must contain exactly one H1");
assert((canvasFragment.match(/<h1\b/gi) || []).length === 1, "Canvas fragment must contain exactly one H1");
assert(!hasHeadingJump(headingLevels(publicHub)), "public hub heading order contains a skipped level");
assert(!hasHeadingJump(headingLevels(canvasFragment)), "Canvas fragment heading order contains a skipped level");
assert(!/<(?:html|head|body|style|script)\b/i.test(canvasFragment), "Canvas fragment contains prohibited document, style, or script markup");
assert(!/(javascript:|on(?:click|focus|mouseover)=)/i.test(canvasFragment), "Canvas fragment contains unsafe interactive markup");
assert(canvasFragment.includes("Open Canvas assignments"), "Canvas submission link missing");
assert(canvasFragment.includes("Open the public project hub"), "Canvas public-hub link missing");
assert(publicHub.includes("Student progress checklist") && canvasFragment.includes("Student progress checklist"), "student checklist missing from a hub output");
assert(publicHub.includes("Frequently asked questions") && canvasFragment.includes("Frequently asked questions"), "FAQ missing from a hub output");
for (const marker of ["What am I doing?", "What is due next?", "What do I open now?", "1. Browse potential CFO decisions", "2. Complete the Stage 1 exploration brief"]) {
  assert(publicHub.includes(marker) && canvasFragment.includes(marker), `first-visit action marker missing: ${marker}`);
}
assert(publicHub.includes(`href="./${path.basename(source.materials.find((item) => item.materialId === "M01_MENU").path)}"`), "public hub Stage 1 decision-menu action is missing");
assert(publicHub.includes(`href="./${path.basename(source.materials.find((item) => item.materialId === "M01_EXPLORATION").path)}"`), "public hub Stage 1 exploration-brief action is missing");
assert(publicHub.includes("one concrete FactSet learning") && canvasFragment.includes("one concrete FactSet learning"), "Stage 1 FactSet learning is missing from a hub output");
assert(publicHub.includes("Stage 1 boundary:") && canvasFragment.includes("Stage 1 boundary:"), "Stage 1 exploratory boundary is missing from a hub output");
assert(!publicHub.includes("<strong>Approval gate:</strong>") && !canvasFragment.includes("<strong style=\"color:#f1c98f;\">Approval gate:</strong>"), "a formal Stage 1 approval gate remains in a hub output");
assert((publicHub.match(/class="stage-card"/g) || []).length === 5, "public hub must show five streamlined stage cards");
assert((publicHub.match(/<dt>Outcome<\/dt>/g) || []).length === 5 && (publicHub.match(/<dt>Submit<\/dt>/g) || []).length === 5, "public stage cards must show one outcome and submission each");
assert(publicHub.includes("See all 10 decision options") && canvasFragment.includes("See all 10 decision options"), "complete decision menu disclosure is missing");
for (const family of source.hub.decisionFamilies) {
  assert(publicHub.includes(family.family) && canvasFragment.includes(family.family), `decision family missing from a hub output: ${family.family}`);
}
for (const option of source.hub.decisionMenu) {
  assert(publicHub.includes(option.area) && canvasFragment.includes(option.area), `full decision option missing from a hub output: ${option.area}`);
}
assert(publicHub.includes("After Stage 1") && canvasFragment.includes("After Stage 1: bounded AI checklist"), "later-stage AI boundary is missing");
assert(publicHub.includes("Open bounded AI guide") && canvasFragment.includes("Open bounded AI guide"), "bounded AI guide link is missing");
assert(publicHub.includes("Current stage files") && canvasFragment.includes("Current stage files"), "current-stage file view is missing");
assert(publicHub.includes(`Open the complete file library (${source.materials.length} files)`) && canvasFragment.includes(`Open the complete file library (${source.materials.length} files)`), "complete file library disclosure is missing");

for (const match of publicHub.matchAll(/href="\.\/([^"#?]+)"/g)) {
  assert(await fs.stat(path.join(root, "CAPSTONE", decodeURIComponent(match[1]))).then((s) => s.isFile()).catch(() => false), `broken public hub file link: ${match[1]}`);
}

const publicNames = (await fs.readdir(path.join(root, "CAPSTONE"), { recursive: true })).map(String);
for (const name of publicNames) assert(!/(instructor|solution|answer[-_ ]?key|gradebook|student[-_ ]?data|private[-_ ]?key)/i.test(name), `forbidden public filename: ${name}`);

const scan = execFileSync("python3", [path.join(root, "scripts/validate-public.py"), "--site-only"], { encoding: "utf8" });
assert(scan.includes("PASS"), "existing public site validator failed");

if (failures.length) {
  console.error("BUS311 capstone validation: FAIL");
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`BUS311 capstone validation: PASS (${source.rubric.criteria.length} criteria, ${source.materials.length} public materials)`);
