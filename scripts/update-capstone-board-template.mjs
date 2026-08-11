import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const root = path.resolve(import.meta.dirname, "..");
const inputPath = path.join(root, "CAPSTONE/bus311-capstone-board-deck-template.pptx");
const qaRoot = process.env.BUS311_DECK_QA || "/private/tmp/bus311-capstone-stage5-deck-qa";
await fs.mkdir(qaRoot, { recursive: true });

const replacements = [
  ["Q&A READY", "QUESTION READY"],
  ["Q&A prompts:", "Live-question prompts:"],
  ["REVENUE Q&A", "REVENUE QUESTION SUPPORT"],
  ["MODEL Q&A", "MODEL QUESTION SUPPORT"],
  ["SENSITIVITY Q&A", "SENSITIVITY QUESTION SUPPORT"],
  ["SOURCE Q&A", "SOURCE QUESTION SUPPORT"],
  ["TIMING TARGET: Q&A ONLY", "TIMING TARGET: LIVE QUESTIONS ONLY"],
  ["Use the same recommendation language as the executive summary and earlier core slides.", "Use the same recommendation language throughout the submitted PowerPoint and earlier core slides."],
  ["instructor-review draft, July 28, 2026", "approved student release v1.4.0, Aug. 11, 2026"],
  ["executive summary", "PowerPoint company analysis"],
  ["Q&A", "live questions"],
];
const rewrite = (text) => replacements.reduce((value, [oldText, newText]) => value.replaceAll(oldText, newText), String(text));

const presentation = await PresentationFile.importPptx(await FileBlob.load(inputPath));
const records = [];
for (const term of ["Q&A", "executive summary", "July 28, 2026"]) {
  const result = await presentation.inspect({ kind: "textbox,shape,notes", search: term, maxChars: 60000 });
  for (const line of result.ndjson.split(/\r?\n/).filter(Boolean)) {
    const record = JSON.parse(line);
    if (record.id && ["textbox", "shape", "notes"].includes(record.kind)) records.push(record);
  }
}

const seen = new Set();
for (const record of records) {
  if (seen.has(record.id)) continue;
  seen.add(record.id);
  const target = presentation.resolve(record.id);
  const original = record.text || "";
  const updated = rewrite(original);
  if (updated === original) continue;
  if (record.kind === "notes") target.setText(updated);
  else for (const [oldText, newText] of replacements) target.text.replace(oldText, newText);
}

for (const term of ["Q&A", "executive summary", "July 28, 2026"]) {
  const result = await presentation.inspect({ kind: "textbox,shape,notes", search: term, maxChars: 20000 });
  const found = result.ndjson.trim();
  if (found && !found.includes("matched 0 entries")) throw new Error(`Obsolete template text remains for ${term}: ${result.ndjson}`);
}
for (const required of ["QUESTION READY", "REVENUE QUESTION SUPPORT", "LIVE QUESTIONS ONLY"]) {
  const result = await presentation.inspect({ kind: "textbox,shape,notes", search: required, maxChars: 20000 });
  if (!result.ndjson.trim() || result.ndjson.includes("matched 0 entries")) throw new Error(`Required template text missing: ${required}`);
}

for (const [index, slide] of presentation.slides.items.entries()) {
  const image = await slide.export({ format: "png", scale: 1.5 });
  await fs.writeFile(path.join(qaRoot, `slide-${String(index + 1).padStart(2, "0")}.png`), new Uint8Array(await image.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(qaRoot, `slide-${String(index + 1).padStart(2, "0")}.layout.json`), await layout.text());
}
const montage = await presentation.export({ format: "png", montage: true, scale: 1 });
await fs.writeFile(path.join(qaRoot, "montage.png"), new Uint8Array(await montage.arrayBuffer()));

const output = await PresentationFile.exportPptx(presentation);
await output.save(inputPath);
console.log(path.relative(root, inputPath));
console.log(`Deck QA: ${qaRoot}`);
