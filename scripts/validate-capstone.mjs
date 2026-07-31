import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "CAPSTONE/source/bus311-capstone.json");
const bytes = await fs.readFile(sourcePath);
const source = JSON.parse(bytes.toString("utf8"));
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
assert(JSON.stringify(source.presentationSchedule.dates) === JSON.stringify(["2026-11-30", "2026-12-02", "2026-12-07", "2026-12-09"]), "presentation dates mismatch");
assert(JSON.stringify(source.presentationSchedule.plannedDistribution) === JSON.stringify([5, 5, 5, 4]), "presentation distribution mismatch");
assert(source.requirements.some((item) => item.requirementId === "R05_REVENUE_FIRST"), "revenue-first requirement missing");
assert(source.requirements.some((item) => item.requirementId === "R12_NO_INVESTOR_RATING"), "Buy/Hold/Sell prohibition missing");
assert(source.hub.stages.length === 5, "student hub must contain five stages");
assert(source.hub.stages.reduce((sum, item) => sum + item.points, 0) === 100, "hub stage points must total 100");
assert(source.hub.decisionMenu.length === 10, "student hub must contain ten CFO decision directions");
assert(source.hub.faqs.length >= 8, "student hub FAQ is incomplete");
assert(source.hub.progressChecklist.length >= 12, "student progress checklist is incomplete");
assert(source.hub.canvasProjectPageUrl.endsWith("/courses/58525/pages/company-capstone"), "Canvas project page URL mismatch");

const criterionIds = new Set(source.rubric.criteria.map((item) => item.criterionId));
assert(criterionIds.size === source.rubric.criteria.length, "criterion IDs must be unique");
for (const item of source.materials) assert(await fs.stat(path.join(root, item.path)).then((s) => s.isFile()).catch(() => false), `missing public material: ${item.path}`);

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
