import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';
import { buildM05StarterWorkbook } from './build-bus311-valuation-m05-workbooks.mjs';

const root = path.resolve(import.meta.dirname, '..');
const privateRoot = process.env.BUS311_PRIVATE_ROOT || '/private/tmp/BUS311-instructor-stage';
const qaRoot = '/private/tmp/bus311-workbook-qa';

const colors = {
  ink: '#0E1116', terra: '#9C4A2B', paper: '#FAF8F3', white: '#FFFFFF',
  border: '#D9D5CB', input: '#0000FF', formula: '#000000', link: '#008000',
  yellow: '#FFF2CC', green: '#E2F0D9', soft: '#F2EEE5'
};

function baseWorkbook(title, lessonId) {
  const workbook = Workbook.create();
  const instructions = workbook.worksheets.add('Instructions');
  instructions.showGridLines = false;
  instructions.getRange('A1:F1').merge();
  instructions.getRange('A1').values = [[title]];
  instructions.getRange('A1:F1').format = { fill: colors.ink, font: { bold: true, color: colors.white, size: 18 } };
  instructions.getRange('A3:F3').merge();
  instructions.getRange('A3').values = [[`BUS311 · ${lessonId} · FactSet required`]];
  instructions.getRange('A3:F3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  instructions.getRange('A5:B10').values = [
    ['Step', 'Instruction'],
    [1, 'Read the lesson pre-reading and confirm FactSet access.'],
    [2, 'Enter or verify blue input values and document field definitions.'],
    [3, 'Complete yellow calculation cells with auditable formulas.'],
    [4, 'Use the Checks sheet before writing a recommendation.'],
    [5, 'State the decision, evidence, risk, and monitoring trigger.']
  ];
  instructions.getRange('A5:B5').format = { fill: colors.soft, font: { bold: true } };
  instructions.getRange('A5:B10').format.borders = { preset: 'outside', style: 'thin', color: colors.border };
  instructions.getRange('A:A').format.columnWidth = 12;
  instructions.getRange('B:B').format.columnWidth = 68;
  instructions.freezePanes.freezeRows(5);
  return workbook;
}

function styleTitle(sheet, title, endCol = 'F') {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${endCol}1`).merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange(`A1:${endCol}1`).format = { fill: colors.ink, font: { bold: true, color: colors.white, size: 17 } };
  sheet.freezePanes.freezeRows(4);
}

function inputStyle(range) {
  range.format = { fill: colors.yellow, font: { color: colors.input }, numberFormat: '#,##0.00' };
}

function answerStyle(range, keyed) {
  range.format = { fill: keyed ? colors.green : colors.yellow, font: { color: colors.formula }, numberFormat: '#,##0.00' };
}

async function exportPair(definition) {
  for (const keyed of definition.publicOnly ? [false] : [false, true]) {
    const workbook = definition.build(keyed);
    const outDir = keyed ? path.join(privateRoot, definition.track, definition.module) : path.join(root, definition.track, definition.module);
    const artifactId = definition.artifactId || definition.id;
    const filename = `bus311-${artifactId}-${keyed ? 'activity-key' : 'starter'}.xlsx`;
    await fs.mkdir(outDir, { recursive: true });
    const blob = await SpreadsheetFile.exportXlsx(workbook);
    await blob.save(path.join(outDir, filename));
    await fs.mkdir(qaRoot, { recursive: true });
    for (const sheet of workbook.worksheets.items) {
      const image = await workbook.render({ sheetName: sheet.name, autoCrop: 'all', scale: 1, format: 'png' });
      const safe = sheet.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
      await fs.writeFile(path.join(qaRoot, `${definition.id}-${keyed ? 'key' : 'starter'}-${safe}.png`), new Uint8Array(await image.arrayBuffer()));
    }
  }
}

const definitions = [
  // M03 is generated as a shared pair by BUS311-instructor/scripts/build-bus311-m03-workbooks.mjs.
  {
    id: 'valuation-m01-l01', artifactId: 'valuation-m05-l01', track: '02-VALUATION', module: 'M05', publicOnly: true,
    build() {
      return buildM05StarterWorkbook();
    }
  },
  {
    id: 'decisions-m01-l01', artifactId: 'decisions-m12-l01', track: '03-FIRM-DECISIONS', module: 'M12',
    build(keyed) {
      const wb = baseWorkbook('Risk, Return, and CAPM', 'decisions-m01-l01');
      const s = wb.worksheets.add('CAPM Lab'); styleTitle(s, 'Boeing Risk and Required Return', 'G');
      s.getRange('A3:C3').values = [['Input', 'Value', 'Source / definition']]; s.getRange('A3:C3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
      s.getRange('A4:C7').values = [['Risk-free rate', 0.04, 'FactSet / Treasury benchmark'], ['Expected market return', 0.10, 'Course assumption'], ['Beta', 1.25, 'FactSet, record window and benchmark'], ['CAPM required return', null, 'Calculated']];
      inputStyle(s.getRange('B4:B6')); if (keyed) s.getRange('B7').formulas = [['=B4+B6*(B5-B4)']]; answerStyle(s.getRange('B7'), keyed);
      s.getRange('B4:B5').format.numberFormat = '0.0%';
      s.getRange('B6').format.numberFormat = '0.00';
      s.getRange('B7').format.numberFormat = '0.0%';
      s.getRange('A10:C10').values = [['Beta Scenario', 'Required Return', 'Interpretation']]; s.getRange('A10:C10').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
      s.getRange('A11:A15').values = [[0.8], [1.0], [1.25], [1.5], [1.8]];
      s.getRange('C11:C15').values = [['Defensive market exposure'], ['Market-like exposure'], ['Base company estimate'], ['Higher cyclical exposure'], ['High market sensitivity']];
      inputStyle(s.getRange('A11:A15')); if (keyed) s.getRange('B11:B15').formulas = [['=$B$4+A11*($B$5-$B$4)'], ['=$B$4+A12*($B$5-$B$4)'], ['=$B$4+A13*($B$5-$B$4)'], ['=$B$4+A14*($B$5-$B$4)'], ['=$B$4+A15*($B$5-$B$4)']]; answerStyle(s.getRange('B11:B15'), keyed); s.getRange('B11:B15').format.numberFormat = '0.0%';
      s.getRange('A:A').format.columnWidth = 24; s.getRange('B:B').format.columnWidth = 18; s.getRange('C:C').format.columnWidth = 42;
      const c = wb.worksheets.add('Checks'); styleTitle(c, 'CAPM Checks', 'E');
      c.getRange('A3:E3').values = [['Check', 'Actual', 'Expected', 'Difference', 'Status']]; c.getRange('A3:E3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
      c.getRange('A4:A5').values = [['Base required return'], ['Scenario ordering']];
      c.getRange('B4').formulas = [["='CAPM Lab'!B7"]]; c.getRange('C4').values = [[0.115]]; c.getRange('D4').formulas = [['=B4-C4']]; c.getRange('E4').formulas = [['=IF(ABS(D4)<0.0001,"OK","CHECK")']];
      c.getRange('B5').formulas = [["='CAPM Lab'!B15-'CAPM Lab'!B11"]]; c.getRange('C5').values = [[0.06]]; c.getRange('D5').formulas = [['=B5-C5']]; c.getRange('E5').formulas = [['=IF(ABS(D5)<0.0001,"OK","CHECK")']];
      c.getRange('A:A').format.columnWidth = 24; c.getRange('B:D').format.columnWidth = 17; c.getRange('E:E').format.columnWidth = 14;
      return wb;
    }
  }
];

for (const definition of definitions) await exportPair(definition);
console.log(`Built ${definitions.length} new BUS311 starter/key workbook pairs.`);
