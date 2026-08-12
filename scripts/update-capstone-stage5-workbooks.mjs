import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = path.resolve(import.meta.dirname, "..");
const qaRoot = process.env.BUS311_WORKBOOK_QA || "/private/tmp/bus311-capstone-stage5-workbook-qa";

const workbooks = [
  path.join(root, "CAPSTONE/bus311-capstone-red-team-record.xlsx"),
  path.join(root, "CAPSTONE/bus311-capstone-valuation-model.xlsx"),
];

const safeName = (value) => value.replaceAll(/[^a-z0-9]+/gi, "-").replaceAll(/^-|-$/g, "").toLowerCase();
await fs.mkdir(qaRoot, { recursive: true });
execFileSync(process.env.PYTHON || "python3", [path.join(root, "scripts/update-capstone-stage5-workbooks.py")], {
  cwd: root,
  stdio: "inherit",
});

for (const workbookPath of workbooks) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));

  for (const term of ["executive summary", "Q&A", "Board Q&A", "individual Q&A"]) {
    const match = await workbook.inspect({ kind: "match", searchTerm: term, options: { maxResults: 100 }, maxChars: 12000 });
    if (!match.ndjson.includes("matched 0 entries")) throw new Error(`${term} remains in ${workbookPath}: ${match.ndjson}`);
  }
  for (const error of ["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A"]) {
    const match = await workbook.inspect({ kind: "match", searchTerm: error, options: { maxResults: 100 }, maxChars: 12000 });
    if (match.ndjson.includes("matched 0 entries")) continue;
    const entries = match.ndjson.trim().split("\n").map((line) => JSON.parse(line));
    const storedErrors = entries.filter((entry) => entry.match === "formula" || !entry.formula);
    if (storedErrors.length) throw new Error(`${error} remains in ${workbookPath}: ${storedErrors.map((entry) => JSON.stringify(entry)).join("\n")}`);
    console.log(`inspection-note: ignored ${entries.length} computed ${error} value(s) on formula cells in ${path.basename(workbookPath)}`);
  }

  const stem = path.basename(workbookPath, ".xlsx");
  const summary = await workbook.inspect({ kind: "workbook,sheet,table", maxChars: 16000, tableMaxRows: 8, tableMaxCols: 10, tableMaxCellChars: 200 });
  await fs.writeFile(path.join(qaRoot, `${stem}-summary.ndjson`), summary.ndjson);
  for (const sheet of workbook.worksheets.items) {
    const image = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1, format: "png" });
    await fs.writeFile(path.join(qaRoot, `${stem}-${safeName(sheet.name)}.png`), new Uint8Array(await image.arrayBuffer()));
  }

  console.log(`validated: ${path.relative(root, workbookPath)}`);
}

console.log(`Workbook QA: ${qaRoot}`);
