import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = path.resolve(import.meta.dirname, "..");
const qaRoot = process.env.BUS311_WORKBOOK_QA || "/private/tmp/bus311-capstone-stage5-workbook-qa";

const workbooks = [
  {
    path: path.join(root, "CAPSTONE/bus311-capstone-red-team-record.xlsx"),
    updates: [
      ["Final Record", "A33", "7 | ORAL BOARD PRESENTATION REVISION"],
      ["Final Record", "A34", "INSTRUCTION - REPLACE: Identify the weakest revenue, valuation, implementation, or risk response; the evidence rechecked; and the revision made to your PowerPoint company analysis, recommendation, model support, or speaking notes."],
      ["Checkpoint Log", "B8", "Oral Board presentation: decision briefing plus live questions about revenue, valuation, implementation, and risk"],
    ],
  },
  {
    path: path.join(root, "CAPSTONE/bus311-capstone-valuation-model.xlsx"),
    updates: [
      ["Read Me", "D29", "Useful CFO/Board evidence and oral-presentation readiness"],
      ["Board Appendix", "A2", "Model-linked outputs and visuals designed for the PowerPoint appendix and live-question support during the oral Board presentation."],
    ],
  },
];

const safeName = (value) => value.replaceAll(/[^a-z0-9]+/gi, "-").replaceAll(/^-|-$/g, "").toLowerCase();
await fs.mkdir(qaRoot, { recursive: true });

for (const spec of workbooks) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(spec.path));
  for (const [sheetName, address, value] of spec.updates) {
    const sheet = workbook.worksheets.items.find((item) => item.name === sheetName);
    if (!sheet) throw new Error(`Missing worksheet ${sheetName} in ${spec.path}`);
    sheet.getRange(address).values = [[value]];
  }

  for (const term of ["executive summary", "Q&A", "Board Q&A", "individual Q&A"]) {
    const match = await workbook.inspect({ kind: "match", searchTerm: term, options: { maxResults: 100 }, maxChars: 12000 });
    if (!match.ndjson.includes("matched 0 entries")) throw new Error(`${term} remains in ${spec.path}: ${match.ndjson}`);
  }
  for (const error of ["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A"]) {
    const match = await workbook.inspect({ kind: "match", searchTerm: error, options: { maxResults: 100 }, maxChars: 12000 });
    if (!match.ndjson.includes("matched 0 entries")) throw new Error(`${error} remains in ${spec.path}: ${match.ndjson}`);
  }

  const stem = path.basename(spec.path, ".xlsx");
  const summary = await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 16000, tableMaxRows: 8, tableMaxCols: 10, tableMaxCellChars: 200 });
  await fs.writeFile(path.join(qaRoot, `${stem}-summary.ndjson`), summary.ndjson);
  for (const sheet of workbook.worksheets.items) {
    const image = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1, format: "png" });
    await fs.writeFile(path.join(qaRoot, `${stem}-${safeName(sheet.name)}.png`), new Uint8Array(await image.arrayBuffer()));
  }

  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(spec.path);
  console.log(path.relative(root, spec.path));
}

console.log(`Workbook QA: ${qaRoot}`);
