import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const root = path.resolve(import.meta.dirname, '..');
const privateRoot = process.env.BUS311_PRIVATE_ROOT || '/private/tmp/BUS311-instructor-stage';
const qaRoot = '/private/tmp/bus311-workbook-qa';

const lessons = [
  ['02-VALUATION', 'M02', 'foundations-m01-l02', 'Financial Institutions, Markets, and Ethics'],
  ['02-VALUATION', 'M04', 'foundations-m02-l02', 'Ratio Analysis and Corporate Performance'],
  ['02-VALUATION', 'M06', 'valuation-m02-l01', 'Bond Valuation, Interest Rates, and YTM'],
  ['02-VALUATION', 'M07', 'valuation-m03-l01', 'Equity Valuation and IPO Analysis'],
  ['02-VALUATION', 'M08', 'valuation-m04-l01', 'Capital Budgeting and Project Selection'],
  ['03-FIRM-DECISIONS', 'M10', 'decisions-m02-l01', 'Cost of Capital and WACC'],
  ['03-FIRM-DECISIONS', 'M11', 'decisions-m03-l01', 'Capital Structure and Financing Decisions']
];

const colors = {
  ink: '#0E1116', terra: '#9C4A2B', white: '#FFFFFF',
  soft: '#F2EEE5', yellow: '#FFF2CC', border: '#D9D5CB'
};

function populateGuide(workbook, title, lessonId, keyed) {
  let sheet = workbook.worksheets.items.find((item) => item.name === 'BUS311 Guide');
  if (!sheet) sheet = workbook.worksheets.add('BUS311 Guide');
  sheet.showGridLines = false;
  sheet.getRange('A1:F1').merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange('A1:F1').format = { fill: colors.ink, font: { bold: true, color: colors.white, size: 18 } };
  sheet.getRange('A3:F3').merge();
  sheet.getRange('A3').values = [[`BUS311 · ${lessonId} · FactSet required · ${keyed ? 'private activity key' : 'student starter'}`]];
  sheet.getRange('A3:F3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };

  sheet.getRange('A5:B10').values = [
    ['Step', 'Required workflow'],
    [1, 'Read the lesson pre-reading and confirm FactSet access.'],
    [2, 'Enter or verify source values; keep units and periods consistent.'],
    [3, 'Document every FactSet field, period, and retrieval date below.'],
    [4, 'Complete calculations with visible, auditable Excel formulas.'],
    [5, 'Use the model outputs to state a decision, evidence, risk, and monitoring trigger.']
  ];
  sheet.getRange('A5:B5').format = { fill: colors.soft, font: { bold: true } };
  sheet.getRange('A5:B10').format.borders = { preset: 'outside', style: 'thin', color: colors.border };

  sheet.getRange('A12:D17').values = [
    ['FactSet input', 'Field / definition', 'Period / units', 'Source note'],
    ['Company identifier', '', '', ''],
    ['Market or price input', '', '', ''],
    ['Financial statement input', '', '', ''],
    ['Risk or discount-rate input', '', '', ''],
    ['Comparison-company input', '', '', '']
  ];
  sheet.getRange('A12:D12').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  sheet.getRange('B13:D17').format = { fill: colors.yellow, font: { color: '#0000FF' } };
  sheet.getRange('A12:D17').format.borders = { preset: 'outside', style: 'thin', color: colors.border };

  sheet.getRange('A19:F23').values = [
    ['Decision output', 'Response', '', '', '', ''],
    ['Recommendation', '', '', '', '', ''],
    ['Evidence from the model', '', '', '', '', ''],
    ['Primary risk or limitation', '', '', '', '', ''],
    ['Monitoring trigger', '', '', '', '', '']
  ];
  sheet.getRange('A19:F19').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  sheet.getRange('B20:F23').merge();
  sheet.getRange('B20:F23').unmerge();
  sheet.getRange('B20:F23').format = { fill: keyed ? '#E2F0D9' : colors.yellow, wrapText: true };
  sheet.getRange('A19:F23').format.borders = { preset: 'outside', style: 'thin', color: colors.border };

  sheet.getRange('A:A').format.columnWidth = 24;
  sheet.getRange('B:B').format.columnWidth = 34;
  sheet.getRange('C:D').format.columnWidth = 22;
  sheet.getRange('E:F').format.columnWidth = 18;
  sheet.freezePanes.freezeRows(5);
  return sheet;
}

async function normalize(filePath, title, lessonId, keyed) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
  const guide = populateGuide(workbook, title, lessonId, keyed);
  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(filePath);
  await fs.mkdir(qaRoot, { recursive: true });
  const preview = await workbook.render({ sheetName: guide.name, autoCrop: 'all', scale: 1, format: 'png' });
  await fs.writeFile(
    path.join(qaRoot, `${lessonId}-${keyed ? 'key' : 'starter'}-bus311-guide.png`),
    new Uint8Array(await preview.arrayBuffer())
  );
}

for (const [track, module, lessonId, title] of lessons) {
  await normalize(path.join(root, track, module, `bus311-${lessonId}-starter.xlsx`), title, lessonId, false);
  await normalize(path.join(privateRoot, track, module, `bus311-${lessonId}-activity-key.xlsx`), title, lessonId, true);
}

console.log(`Normalized ${lessons.length} reused BUS311 starter/key workbook pairs.`);
