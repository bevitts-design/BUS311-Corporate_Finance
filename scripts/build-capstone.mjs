import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "CAPSTONE/source/bus311-capstone.json");
const sourceBytes = await fs.readFile(sourcePath);
const capstone = JSON.parse(sourceBytes.toString("utf8"));
const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const outputDir = path.join(root, "CAPSTONE");

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const requirements = capstone.requirements.map((item) => `<li>${esc(item.text)}</li>`).join("");
const milestones = capstone.milestones.map((item) => `<tr><th scope="row">${esc(item.title)}</th><td>${esc(item.due.slice(0, 10))}</td><td>${esc(item.points)}</td></tr>`).join("");
const components = capstone.rubric.components.map((item) => `<tr><th scope="row">${esc(item.title)}</th><td>${esc(item.points)}</td></tr>`).join("");
const materials = capstone.materials.map((item) => `<li><a href="../${esc(item.path)}">${esc(item.label)}</a></li>`).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="bus311-capstone-source-version" content="${esc(capstone.meta.sourceVersion)}"><meta name="bus311-capstone-source-sha256" content="${sourceHash}"><title>${esc(capstone.project.title)}</title><style>
:root{--navy:#0a2540;--blue:#175fa9;--ink:#162331;--muted:#596775;--pale:#eef5fb;--line:#cad5df;--white:#fff}*{box-sizing:border-box}body{margin:0;font:1rem/1.55 Arial,sans-serif;color:var(--ink);background:#f7f9fb}a{color:#0b579f}.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;background:#fff;padding:.75rem;z-index:2}header{background:var(--navy);color:#fff;padding:3.5rem max(1.25rem,calc((100vw - 72rem)/2))}header p{max-width:58rem;font-size:1.15rem}main{max-width:72rem;margin:auto;padding:2rem 1.25rem 4rem}section{background:#fff;border:1px solid var(--line);border-radius:.75rem;padding:1.5rem;margin:1.25rem 0}h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.08;margin:.25rem 0 1rem}h2{color:var(--navy);margin-top:0}h3{color:var(--blue)}.meta{display:flex;gap:.75rem;flex-wrap:wrap}.meta span{background:var(--pale);color:var(--navy);padding:.35rem .7rem;border-radius:999px;font-weight:700}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid var(--line);padding:.7rem;text-align:left}th{color:var(--navy)}.deadline{border-left:.35rem solid var(--blue);background:var(--pale)}a:focus-visible{outline:3px solid #f5b942;outline-offset:3px}@media(max-width:42rem){header{padding-top:2.5rem}section{padding:1rem}table{font-size:.92rem}}
</style></head><body><a class="skip" href="#content">Skip to capstone content</a><header><p>BUS311 Corporate Finance · Fall 2026</p><h1>${esc(capstone.project.title)}</h1><p>${esc(capstone.project.subtitle)} for ${esc(capstone.project.audience)}. This is an ${esc(capstone.project.ownership).toLowerCase()} project built around one company-specific decision.</p></header><main id="content"><div class="meta"><span>${esc(capstone.project.projectPoints)} points</span><span>${esc(capstone.project.courseWeightPercent)}% of course grade</span><span>7-minute briefing + 3-minute Q&amp;A</span></div><section class="deadline"><h2>Final-file deadline</h2><p><strong>${esc(capstone.finalSubmission.deadlineLabel)}</strong></p><p>Submit exactly two communication files: the PPTX Board brief and one-page executive summary PDF. The Excel model is assessed earlier at Milestone 3.</p></section><section><h2>Project requirements</h2><ul>${requirements}</ul></section><section><h2>Milestones</h2><table><thead><tr><th scope="col">Milestone</th><th scope="col">Due</th><th scope="col">Points</th></tr></thead><tbody>${milestones}</tbody></table></section><section><h2>Evidence and bounded AI</h2><p>${esc(capstone.policies.factSetPermission)}</p><p>${esc(capstone.policies.sourceLabels)}</p><p>${esc(capstone.policies.verifiedAIJudgment)}</p></section><section><h2>Assessment</h2><table><thead><tr><th scope="col">Component</th><th scope="col">Points</th></tr></thead><tbody>${components}</tbody></table></section><section><h2>Student files</h2><ul>${materials}</ul></section><section><h2>Submission and presentation</h2><p>${esc(capstone.policies.submissionLocation)}</p><p>${esc(capstone.policies.finalFileLock)}</p><p>Presentation dates: ${capstone.presentationSchedule.dates.map((item) => esc(item)).join(", ")}. The approved distribution is ${capstone.presentationSchedule.plannedDistribution.join("/")}.</p></section></main></body></html>`;

const assignmentMarkdown = `# ${capstone.project.title}\n\n**Status:** Approved student release | **Source:** ${capstone.meta.maintainedSource} | **Version:** ${capstone.meta.sourceVersion} | **SHA-256:** ${sourceHash}\n\n## Final-file deadline\n\n${capstone.finalSubmission.deadlineLabel}.\n\n## Requirements\n\n${capstone.requirements.map((item) => `- ${item.text}`).join("\n")}\n\n## Milestones\n\n${capstone.milestones.map((item) => `- **${item.title} (${item.points} points):** ${item.due.slice(0, 10)}`).join("\n")}\n\n## Policies\n\n- ${capstone.policies.factSetPermission}\n- ${capstone.policies.sourceLabels}\n- ${capstone.policies.verifiedAIJudgment}\n- ${capstone.policies.lateWork}\n- ${capstone.policies.revision}\n- ${capstone.policies.finalFileLock}\n`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "index.html"), html);
await fs.writeFile(path.join(outputDir, "bus311-capstone-assignment.md"), assignmentMarkdown);

const artifactPaths = capstone.materials.map((item) => item.path).filter((item) => item !== "CAPSTONE/bus311-capstone-assignment.pdf");
const artifacts = [];
for (const relative of artifactPaths) {
  const file = path.join(root, relative);
  const bytes = await fs.readFile(file);
  artifacts.push({ path: relative, sha256: crypto.createHash("sha256").update(bytes).digest("hex") });
}
artifacts.push({ path: "CAPSTONE/index.html", sha256: crypto.createHash("sha256").update(html).digest("hex") });
artifacts.push({ path: "CAPSTONE/bus311-capstone-assignment.md", sha256: crypto.createHash("sha256").update(assignmentMarkdown).digest("hex") });
await fs.writeFile(path.join(outputDir, "output-provenance.json"), JSON.stringify({ sourceVersion: capstone.meta.sourceVersion, sourceSha256: sourceHash, generatedAt: "2026-07-30", artifacts }, null, 2) + "\n");

await import("./build-index.mjs");
console.log(`Built BUS311 capstone ${capstone.meta.sourceVersion} (${sourceHash.slice(0, 12)})`);
