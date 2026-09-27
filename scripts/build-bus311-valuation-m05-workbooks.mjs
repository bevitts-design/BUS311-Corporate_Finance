import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const publicRoot = process.env.BUS311_PUBLIC_ROOT || path.resolve(import.meta.dirname, '..');
const qaRoot = process.env.BUS311_M05_QA_ROOT || '/private/tmp/bus311-m05-workbook-qa';

const colors = {
  ink: '#0E1116',
  navy: '#17365D',
  terra: '#9C4A2B',
  paper: '#FAF8F3',
  white: '#FFFFFF',
  border: '#D9D5CB',
  soft: '#F2EEE5',
  inputFill: '#DDEBF7',
  inputFont: '#0000FF',
  formulaFill: '#FFF2CC',
  outputFill: '#E2F0D9',
  checkFill: '#E7E6E6',
  linkFont: '#008000',
  warning: '#FCE4D6',
};

const money = '$#,##0.00;[Red]($#,##0.00);-';
const percent = '0.00%;[Red](0.00%);-';
const integer = '#,##0;[Red](#,##0);-';

function setTitle(sheet, title, endCol = 'H') {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${endCol}1`).merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange(`A1:${endCol}1`).format = {
    fill: colors.ink,
    font: { bold: true, color: colors.white, size: 18 },
    verticalAlignment: 'center',
  };
  sheet.getRange('1:1').format.rowHeight = 30;
  sheet.freezePanes.freezeRows(3);
}

function setSection(sheet, row, title, startCol = 'A', endCol = 'H') {
  const range = sheet.getRange(`${startCol}${row}:${endCol}${row}`);
  range.merge();
  sheet.getRange(`${startCol}${row}`).values = [[title]];
  range.format = {
    fill: colors.navy,
    font: { bold: true, color: colors.white, size: 11 },
    verticalAlignment: 'center',
  };
  range.format.rowHeight = 22;
}

function setHeader(range) {
  range.format = {
    fill: colors.terra,
    font: { bold: true, color: colors.white },
    wrapText: true,
    verticalAlignment: 'center',
    borders: { preset: 'inside', style: 'thin', color: colors.border },
  };
}

function setInput(range, numberFormat) {
  range.format = {
    fill: colors.inputFill,
    font: { color: colors.inputFont },
    numberFormat,
    borders: { preset: 'outside', style: 'thin', color: colors.border },
  };
}

function setStudentCell(range, numberFormat = '@') {
  range.format = {
    fill: colors.formulaFill,
    font: { color: '#000000' },
    numberFormat,
    borders: { preset: 'outside', style: 'thin', color: colors.terra },
    wrapText: true,
    verticalAlignment: 'top',
  };
}

function styleBody(sheet, range = 'A1:H40') {
  sheet.getRange(range).format.font = { name: 'Aptos', size: 10, color: '#000000' };
  sheet.getRange(range).format.verticalAlignment = 'top';
}

export function buildM05StarterWorkbook() {
  const workbook = Workbook.create();
  const start = workbook.worksheets.add('START HERE');
  const timeline = workbook.worksheets.add('1 Timeline-Diagnose');
  const model = workbook.worksheets.add('2 Build-Compare');
  const sensitivity = workbook.worksheets.add('3 Sensitivity');
  const checks = workbook.worksheets.add('4 Checks-Decision');
  const rateApplications = workbook.worksheets.add('5 Rate-Applications');
  const preferred = workbook.worksheets.add('6 Preferred-Stock');

  // START HERE
  styleBody(start, 'A1:H34');
  setTitle(start, 'Time Value of Money — Decision Model');
  start.getRange('A3:H3').merge();
  start.getRange('A3').values = [['BUS311 · Valuation M05 · Student starter · Version 2026-09-27']];
  start.getRange('A3:H3').format = { fill: colors.terra, font: { bold: true, color: colors.white }, verticalAlignment: 'center' };
  start.getRange('A5:H6').merge();
  start.getRange('A5').values = [[
    'Compare a cash purchase with beginning-of-month financing on the same valuation date. Then use the same terms to solve for an implied financing rate, test a reserve horizon and real return, and value a separate hypothetical preferred share.'
  ]];
  start.getRange('A5:H6').format = { fill: colors.paper, font: { size: 11 }, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(start, 8, 'Required decision sequence');
  const steps = [
    ['Map', 'Place each signed cash flow on the timeline and identify the valuation date.'],
    ['Diagnose', 'Explain the sign, unit, period-count, APR/EAR, and payment-timing errors in the broken formulas.'],
    ['Normalize', 'Convert the annual valuation discount rate to a monthly rate and calculate the EAR.'],
    ['Model', 'Use linked PV and FV inputs; then use RATE and NPER on the rate-applications sheet.'],
    ['Compare', 'Put the cash and financing alternatives in today’s dollars before choosing.'],
    ['Stress-test', 'Write one linked sensitivity formula, then copy it across and down.'],
    ['Decide', 'State the recommendation, evidence, and one assumption that could reverse it.'],
  ];
  start.getRange('A9:B15').values = steps;
  start.getRange('A9:A15').format = { fill: colors.soft, font: { bold: true, color: colors.navy }, horizontalAlignment: 'center' };
  start.getRange('A9:B15').format.borders = { preset: 'inside', style: 'thin', color: colors.border };
  start.getRange('B9:B15').format.wrapText = true;
  setSection(start, 17, 'Deliverables');
  start.getRange('A18:B22').values = [
    ['Timeline', 'Complete all cash-flow positions, directions, first-payment timing, and pattern labels.'],
    ['Model', 'Use linked PV, FV, RATE, and NPER inputs; value the preferred dividend separately.'],
    ['Sensitivity', 'Complete the 4 × 5 linked block and verify that the base case ties to the decision model.'],
    ['Checks', 'Clear each reasonableness, direction, sign, and tie-out check.'],
    ['Decision output', 'Write a short choice in today’s dollars with evidence and a reversal trigger.'],
  ];
  start.getRange('A18:A22').format = { fill: colors.soft, font: { bold: true, color: colors.navy } };
  start.getRange('A18:B22').format.borders = { preset: 'inside', style: 'thin', color: colors.border };
  start.getRange('B18:B22').format.wrapText = true;
  setSection(start, 24, 'Workbook legend and modeling conventions');
  start.getRange('A25:D27').values = [
    ['Blue input', 'Given teaching-scenario assumption', 'Yellow cell', 'Student formula, choice, diagnosis, or interpretation'],
    ['Green font', 'Formula linked from another worksheet', 'Black formula', 'Formula calculated on the current worksheet'],
    ['Cash-flow signs', 'Negative = cash paid; positive = cash received', 'Value date', 'Today unless the row explicitly says Month 24'],
  ];
  start.getRange('A25').format = { fill: colors.inputFill, font: { color: colors.inputFont, bold: true } };
  start.getRange('C25').format = { fill: colors.formulaFill, font: { bold: true } };
  start.getRange('A26').format = { fill: colors.outputFill, font: { color: colors.linkFont, bold: true } };
  start.getRange('C26').format = { fill: colors.outputFill, font: { bold: true } };
  start.getRange('A25:D27').format.borders = { preset: 'inside', style: 'thin', color: colors.border };
  start.getRange('B25:D27').format.wrapText = true;
  setSection(start, 29, 'Source and scope note');
  start.getRange('A30:H32').merge();
  start.getRange('A30').values = [[
    'This Berkshire Hathaway equipment scenario is hypothetical. The 9.6% annual rate is a valuation discount-rate assumption, not the financing offer’s stated APR. The cash amounts and preferred-share terms are teaching inputs, not company disclosures. Document the definition, units, period and source before replacing any rate.'
  ]];
  start.getRange('A30:H32').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  start.getRange('A:A').format.columnWidth = 18;
  start.getRange('B:B').format.columnWidth = 70;
  start.getRange('C:C').format.columnWidth = 18;
  start.getRange('D:D').format.columnWidth = 42;
  start.getRange('E:H').format.columnWidth = 12;
  start.getRange('5:6').format.rowHeight = 28;
  start.getRange('9:15').format.rowHeight = 28;
  start.getRange('18:22').format.rowHeight = 28;
  start.getRange('25:27').format.rowHeight = 30;
  start.getRange('30:32').format.rowHeight = 24;

  // 1 Timeline-Diagnose
  styleBody(timeline, 'A1:H34');
  setTitle(timeline, 'Map the cash before choosing the function');
  timeline.getRange('A3:H4').merge();
  timeline.getRange('A3').values = [[
    'Berkshire teaching scenario: a wholly owned operation can buy equipment for cash today or finance it with 24 beginning-of-month payments plus a balloon at Month 24. Treat all amounts from the company’s point of view.'
  ]];
  timeline.getRange('A3:H4').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(timeline, 6, 'Given assumptions', 'A', 'C');
  setSection(timeline, 6, 'Normalize the valuation rate and choose functions', 'E', 'H');
  timeline.getRange('A7:C14').values = [
    ['Input', 'Value', 'Unit / definition'],
    ['Cash price today', -80000, 'Company cash outflow at t = 0'],
    ['Annual valuation discount rate', 0.096, 'Nominal annual; compounded monthly'],
    ['Compounding periods per year', 12, 'Months per year'],
    ['Term', 24, 'Months'],
    ['Monthly payment', -3150, 'Company cash outflow'],
    ['Balloon payment', -8000, 'Company outflow at Month 24'],
    ['Payment type', 1, '1 = beginning; 0 = end'],
  ];
  setHeader(timeline.getRange('A7:C7'));
  setInput(timeline.getRange('B8'), money);
  setInput(timeline.getRange('B9'), percent);
  setInput(timeline.getRange('B10:B11'), integer);
  setInput(timeline.getRange('B12:B13'), money);
  setInput(timeline.getRange('B14'), integer);
  timeline.getRange('E7:H13').values = [
    ['Decision input', 'Student cell', 'Unit', 'Audit question'],
    ['Periodic rate', null, 'per month', 'Does the rate speak the same language as nper?'],
    ['Number of periods', null, 'months', 'How many payment intervals occur?'],
    ['Effective annual rate', null, 'EAR', 'What is the actual one-year growth rate?'],
    ['Payment-stream function', null, 'function', 'Which function values equal finite payments today?'],
    ['Balloon function', null, 'function', 'Which function values one future lump sum today?'],
    ['Payment timing', null, 'type meaning', 'Does the first payment occur today or one month later?'],
  ];
  setHeader(timeline.getRange('E7:H7'));
  setStudentCell(timeline.getRange('F8'), percent);
  setStudentCell(timeline.getRange('F9'), integer);
  setStudentCell(timeline.getRange('F10'), percent);
  setStudentCell(timeline.getRange('F11:F13'), '@');
  setSection(timeline, 16, 'Complete the cash-flow timeline before building the model');
  timeline.getRange('A17:H20').values = [
    ['Cash-flow element', 'Today (t=0)', 'Month 1', 'Months 2–23', 'Month 24', 'Direction', 'First payment', 'Pattern / function family'],
    ['Alternative A — cash price', null, null, null, null, null, null, null],
    ['Alternative B — monthly payments', null, null, null, null, null, null, null],
    ['Alternative B — balloon', null, null, null, null, null, null, null],
  ];
  setHeader(timeline.getRange('A17:H17'));
  setStudentCell(timeline.getRange('B18:H20'));
  timeline.getRange('B18:E20').format.numberFormat = money;
  timeline.getRange('A22:H22').merge();
  timeline.getRange('A22').values = [['Gate: do not move to the model until each row shows when cash moves, its sign, the first-payment date, and the matching cash-flow pattern.']];
  timeline.getRange('A22:H22').format = { fill: colors.warning, font: { bold: true, color: colors.terra }, wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.terra } };
  setSection(timeline, 24, 'Diagnose the model before trusting the output');
  timeline.getRange('A25:H31').values = [
    ['Broken setup', 'Student diagnosis', null, 'Corrected setup or rule', null, null, 'Direction / reasonableness check', null],
    ["'=PV(9.6%,2,-3150,0,0)", null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["'=FV(8%,5,0,10000,0)", null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['12.68% EAR is divided by 12 to get a monthly rate.', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  timeline.getRange('B25:C25').merge();
  timeline.getRange('D25:F25').merge();
  timeline.getRange('G25:H25').merge();
  setHeader(timeline.getRange('A25:H25'));
  for (const row of [26, 28, 30]) {
    timeline.getRange(`A${row}:A${row + 1}`).merge();
    timeline.getRange(`B${row}:C${row + 1}`).merge();
    timeline.getRange(`D${row}:F${row + 1}`).merge();
    timeline.getRange(`G${row}:H${row + 1}`).merge();
    setStudentCell(timeline.getRange(`B${row}:C${row + 1}`));
    setStudentCell(timeline.getRange(`D${row}:F${row + 1}`));
    setStudentCell(timeline.getRange(`G${row}:H${row + 1}`));
  }
  timeline.getRange('A26:A31').format.wrapText = true;
  timeline.getRange('A:A').format.columnWidth = 31;
  timeline.getRange('B:B').format.columnWidth = 17;
  timeline.getRange('C:C').format.columnWidth = 27;
  timeline.getRange('D:D').format.columnWidth = 22;
  timeline.getRange('E:E').format.columnWidth = 25;
  timeline.getRange('F:F').format.columnWidth = 25;
  timeline.getRange('G:G').format.columnWidth = 22;
  timeline.getRange('H:H').format.columnWidth = 31;
  timeline.getRange('3:4').format.rowHeight = 26;
  timeline.getRange('7:14').format.rowHeight = 30;
  timeline.getRange('17:20').format.rowHeight = 32;
  timeline.getRange('22:22').format.rowHeight = 30;
  timeline.getRange('25:31').format.rowHeight = 30;

  // 2 Build-Compare
  styleBody(model, 'A1:H34');
  setTitle(model, 'Build the functions, then compare on today’s date');
  model.getRange('A3:H4').merge();
  model.getRange('A3').values = [[
    'Use linked inputs from the timeline sheet. Enter each Excel function in the yellow result cell, audit the sign and value date, and compare alternatives only after both are stated as positive present costs.'
  ]];
  model.getRange('A3:H4').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(model, 6, 'Function build and present-value comparison');
  model.getRange('A7:H18').values = [
    ['Model line', 'Function choice', 'rate', 'nper', 'pmt', 'pv / fv', 'type', 'Student result'],
    ['Alternative A — cash cost today', null, null, null, null, null, null, null],
    ['Alternative A — Month 24 equivalent', null, null, null, null, null, null, null],
    ['Alternative A — round-trip PV check', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['Alternative B — payment-stream PV', null, null, null, null, null, null, null],
    ['Alternative B — balloon PV', null, null, null, null, null, null, null],
    ['Alternative B — total present cost', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['Timing audit — ordinary annuity PV', null, null, null, null, null, null, null],
    ['Timing audit — annuity-due PV', null, null, null, null, null, null, null],
    ['Value gained by paying one period earlier', null, null, null, null, null, null, null],
  ];
  setHeader(model.getRange('A7:H7'));
  const linkedRows = {
    8: [null, null, null, null, null, null],
    9: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", '=0', "='1 Timeline-Diagnose'!B8", '=0'],
    10: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", '=0', '=-H9', '=0'],
    12: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", "='1 Timeline-Diagnose'!B12", '=0', "='1 Timeline-Diagnose'!B14"],
    13: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", '=0', "='1 Timeline-Diagnose'!B13", '=0'],
    16: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", "='1 Timeline-Diagnose'!B12", '=0', '=0'],
    17: ["='1 Timeline-Diagnose'!F8", "='1 Timeline-Diagnose'!F9", "='1 Timeline-Diagnose'!B12", '=0', "='1 Timeline-Diagnose'!B14"],
  };
  for (const [rowText, formulas] of Object.entries(linkedRows)) {
    const row = Number(rowText);
    if (formulas[0]) model.getRange(`C${row}:G${row}`).formulas = [formulas];
  }
  model.getRange('C9:C17').format.numberFormat = percent;
  model.getRange('D9:D17').format.numberFormat = integer;
  model.getRange('E9:F17').format.numberFormat = money;
  model.getRange('G9:G17').format.numberFormat = integer;
  model.getRange('C9:G17').format.font = { color: colors.linkFont };
  model.getRange('C9:G17').format.fill = colors.soft;
  model.getRange('C9:G17').format.borders = { preset: 'inside', style: 'thin', color: colors.border };
  setStudentCell(model.getRange('B8:B10'));
  setStudentCell(model.getRange('B12:B14'));
  setStudentCell(model.getRange('B16:B18'));
  setStudentCell(model.getRange('H8:H10'), money);
  setStudentCell(model.getRange('H12:H14'), money);
  setStudentCell(model.getRange('H16:H18'), money);
  setSection(model, 20, 'Decision bridge — all values as of today');
  model.getRange('A21:H24').values = [
    ['Decision metric', 'Student result', null, null, null, 'Units', 'Reasonableness rule', null],
    ['Cash alternative — present cost', null, null, null, null, 'Today dollars', 'Must be positive and equal the t=0 cash price', null],
    ['Financing alternative — present cost', null, null, null, null, 'Today dollars', 'Must be below the undiscounted nominal outflows', null],
    ['Financing minus cash', null, null, null, null, 'Today dollars', 'Negative means financing has the lower PV cost', null],
  ];
  model.getRange('B21:E21').merge();
  model.getRange('G21:H21').merge();
  for (const row of [22, 23, 24]) {
    model.getRange(`B${row}:E${row}`).merge();
    model.getRange(`G${row}:H${row}`).merge();
  }
  model.getRange('G21:H24').format.wrapText = true;
  setHeader(model.getRange('A21:H21'));
  setStudentCell(model.getRange('B22:E24'), money);
  model.getRange('A26:H26').merge();
  model.getRange('A26').values = [['Reasonableness prompt: explain why a higher discount rate lowers the present cost of deferred financing cash flows, while a beginning-of-month payment raises PV relative to an end-of-month payment.']];
  model.getRange('A26:H26').format = { fill: colors.warning, font: { bold: true, color: colors.terra }, wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.terra } };
  model.getRange('A:A').format.columnWidth = 38;
  model.getRange('B:B').format.columnWidth = 17;
  model.getRange('C:C').format.columnWidth = 13;
  model.getRange('D:D').format.columnWidth = 11;
  model.getRange('E:F').format.columnWidth = 16;
  model.getRange('G:G').format.columnWidth = 12;
  model.getRange('H:H').format.columnWidth = 21;
  model.getRange('3:4').format.rowHeight = 26;
  model.getRange('7:18').format.rowHeight = 28;
  model.getRange('21:24').format.rowHeight = 32;
  model.getRange('26:26').format.rowHeight = 34;

  // 3 Sensitivity
  styleBody(sensitivity, 'A1:G27');
  setTitle(sensitivity, 'Stress-test the financing alternative', 'G');
  sensitivity.getRange('A3:G4').merge();
  sensitivity.getRange('A3').values = [[
    'Write one linked formula in B8 using the annual discount-rate header in row 7 and monthly-payment input in column A. Lock only the rows/columns that should stay fixed, then copy the formula across and down. Every cell must recalculate the payment-stream PV plus balloon PV.'
  ]];
  sensitivity.getRange('A3:G4').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(sensitivity, 6, 'Present cost of financing — today dollars', 'A', 'F');
  sensitivity.getRange('A7:F11').values = [
    ['Monthly payment \ Annual discount rate', 0.06, 0.08, 0.096, 0.12, 0.14],
    [-3000, null, null, null, null, null],
    [-3150, null, null, null, null, null],
    [-3300, null, null, null, null, null],
    [-3450, null, null, null, null, null],
  ];
  setHeader(sensitivity.getRange('A7:F7'));
  setInput(sensitivity.getRange('A8:A11'), money);
  setInput(sensitivity.getRange('B7:F7'), percent);
  setStudentCell(sensitivity.getRange('B8:F11'), money);
  sensitivity.getRange('A13:F13').merge();
  sensitivity.getRange('A13').values = [['Copy audit: the base case uses −$3,150 per month and a 9.60% annual discount rate. It must tie to the financing present cost on the model sheet.']];
  sensitivity.getRange('A13:F13').format = { fill: colors.warning, font: { bold: true, color: colors.terra }, wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.terra } };
  setSection(sensitivity, 15, 'Interpret the sensitivity — do not stop at the table', 'A', 'F');
  sensitivity.getRange('A16:F23').values = [
    ['Prompt', 'Student interpretation', null, null, null, null],
    ['Across a row, what happens to PV cost as the discount rate rises? Why?', null, null, null, null, null],
    [null, null, null, null, null, null],
    ['Down a column, what happens as the payment becomes more negative? Why?', null, null, null, null, null],
    [null, null, null, null, null, null],
    ['Where does the choice between cash and financing change?', null, null, null, null, null],
    [null, null, null, null, null, null],
    ['Is the base recommendation robust? Name the assumption most likely to reverse it.', null, null, null, null, null],
  ];
  sensitivity.getRange('B16:F16').merge();
  setHeader(sensitivity.getRange('A16:F16'));
  for (const row of [17, 19, 21, 23]) {
    sensitivity.getRange(`A${row}:A${row + 1}`).merge();
    sensitivity.getRange(`B${row}:F${row + 1}`).merge();
    setStudentCell(sensitivity.getRange(`B${row}:F${row + 1}`));
  }
  sensitivity.getRange('A17:A24').format.wrapText = true;
  sensitivity.getRange('A:A').format.columnWidth = 38;
  sensitivity.getRange('B:F').format.columnWidth = 18;
  sensitivity.getRange('G:G').format.columnWidth = 4;
  sensitivity.getRange('3:4').format.rowHeight = 29;
  sensitivity.getRange('7:11').format.rowHeight = 26;
  sensitivity.getRange('13:13').format.rowHeight = 34;
  sensitivity.getRange('16:23').format.rowHeight = 31;

  // 4 Checks-Decision
  styleBody(checks, 'A1:G32');
  setTitle(checks, 'Audit the model and make the decision', 'G');
  checks.getRange('A3:G3').merge();
  checks.getRange('A3').values = [['MODEL STATUS']];
  checks.getRange('A3:G3').format = { fill: colors.checkFill, font: { bold: true, color: colors.navy, size: 13 }, horizontalAlignment: 'center' };
  checks.getRange('A4:G4').merge();
  checks.getRange('A4').formulas = [[
    '=IF(COUNTIF(E7:E14,"CHECK")>0,"CHECK",IF(COUNTIF(E7:E14,"INCOMPLETE")>0,"INCOMPLETE","READY"))'
  ]];
  checks.getRange('A4:G4').format = { fill: colors.warning, font: { bold: true, color: colors.terra, size: 12 }, horizontalAlignment: 'center' };
  setSection(checks, 6, 'Visible control checks', 'A', 'G');
  checks.getRange('A7:G14').values = [
    ['Check', 'Actual / delta', 'Pass rule', 'Tolerance', 'Status', 'Where to fix', 'Why it matters'],
    ['Timeline completion', null, '0 blanks', 0, null, '1 Timeline-Diagnose', 'Function choice must follow the cash-flow map.'],
    ['Rate-period match', null, 'monthly / monthly', null, null, '1 Timeline-Diagnose F8:F9', 'A valid function with mismatched units is still wrong.'],
    ['Cash-flow signs', null, 'all company payments negative', null, null, '1 Timeline-Diagnose B8:B14', 'Excel signs describe direction, not profitability.'],
    ['PV/FV round trip', null, 'approximately 0', 0.01, null, '2 Build-Compare H8:H10', 'Inverse moves should return the same today value.'],
    ['Payment-timing direction', null, 'due PV > ordinary PV', 0, null, '2 Build-Compare H16:H18', 'Earlier payments are discounted for one fewer period.'],
    ['Sensitivity base tie', null, 'approximately 0', 0.01, null, '3 Sensitivity D9', 'The copied block must recalculate the same base model.'],
    ['Sensitivity rate direction', null, 'PV cost falls as discount rate rises', null, null, '3 Sensitivity row 9', 'Fixed future payments have a lower PV at a higher discount rate.'],
  ];
  setHeader(checks.getRange('A7:G7'));
  checks.getRange('B8').formulas = [["=COUNTBLANK('1 Timeline-Diagnose'!B18:H20)"]];
  checks.getRange('B9').formulas = [["=IF(COUNT('1 Timeline-Diagnose'!F8:F10)<3,\"\",IF(AND('1 Timeline-Diagnose'!F8>0,'1 Timeline-Diagnose'!F9='1 Timeline-Diagnose'!B11),\"monthly / monthly\",\"CHECK\"))"]];
  checks.getRange('B10').formulas = [["=IF(AND('1 Timeline-Diagnose'!B8<0,'1 Timeline-Diagnose'!B12<0,'1 Timeline-Diagnose'!B13<0),\"all company payments negative\",\"CHECK\")"]];
  checks.getRange('B11').formulas = [["=IF(COUNT('2 Build-Compare'!H8:H10)<3,\"\",'2 Build-Compare'!H10-'2 Build-Compare'!H8)"]];
  checks.getRange('B12').formulas = [["=IF(COUNT('2 Build-Compare'!H16:H18)<3,\"\",'2 Build-Compare'!H18)"]];
  checks.getRange('B13').formulas = [["=IF(COUNT('3 Sensitivity'!B8:F11)<20,\"\",'3 Sensitivity'!D9-'2 Build-Compare'!H14)"]];
  checks.getRange('B14').formulas = [["=IF(COUNT('3 Sensitivity'!B8:F11)<20,\"\",IF(AND('3 Sensitivity'!B9>'3 Sensitivity'!C9,'3 Sensitivity'!C9>'3 Sensitivity'!D9,'3 Sensitivity'!D9>'3 Sensitivity'!E9,'3 Sensitivity'!E9>'3 Sensitivity'!F9),\"PV cost falls as discount rate rises\",\"CHECK\"))"]];
  checks.getRange('E8').formulas = [['=IF(B8=0,"OK","INCOMPLETE")']];
  checks.getRange('E9').formulas = [['=IF(B9="","INCOMPLETE",IF(B9=C9,"OK","CHECK"))']];
  checks.getRange('E10').formulas = [['=IF(B10=C10,"OK","CHECK")']];
  checks.getRange('E11').formulas = [["=IF(COUNT('2 Build-Compare'!H8:H10)<3,\"INCOMPLETE\",IF(ABS(B11)<=D11,\"OK\",\"CHECK\"))"]];
  checks.getRange('E12').formulas = [['=IF(B12="","INCOMPLETE",IF(B12>D12,"OK","CHECK"))']];
  checks.getRange('E13').formulas = [["=IF(OR(COUNT('3 Sensitivity'!B8:F11)<20,COUNT('2 Build-Compare'!H14)<1),\"INCOMPLETE\",IF(ABS(B13)<=D13,\"OK\",\"CHECK\"))"]];
  checks.getRange('E14').formulas = [['=IF(B14="","INCOMPLETE",IF(B14=C14,"OK","CHECK"))']];
  checks.getRange('B8:B14').format = { fill: colors.checkFill, font: { color: colors.linkFont }, numberFormat: money, wrapText: true };
  checks.getRange('B8').format.numberFormat = integer;
  checks.getRange('B9:B10').format.numberFormat = '@';
  checks.getRange('B14').format.numberFormat = '@';
  checks.getRange('D8:D14').format.numberFormat = '0.00';
  checks.getRange('E8:E14').format = { fill: colors.checkFill, font: { bold: true }, horizontalAlignment: 'center' };
  checks.getRange('A7:G14').format.borders = { preset: 'inside', style: 'thin', color: colors.border };
  setSection(checks, 16, 'Decision output — state the choice in today’s dollars', 'A', 'G');
  checks.getRange('A17:G26').values = [
    ['Recommendation', null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['Evidence', null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['Risk / reversal trigger', null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['Final audit', 'Amount + value date + periodic rate + timing + evidence + trigger', null, null, null, null, null],
  ];
  for (const row of [17, 20, 23]) {
    checks.getRange(`A${row}:A${row + 2}`).merge();
    checks.getRange(`B${row}:G${row + 2}`).merge();
    setStudentCell(checks.getRange(`B${row}:G${row + 2}`));
    checks.getRange(`A${row}:A${row + 2}`).format = { fill: colors.soft, font: { bold: true, color: colors.navy }, verticalAlignment: 'center', wrapText: true };
  }
  checks.getRange('B26:G26').merge();
  checks.getRange('A26:G26').format = { fill: colors.warning, font: { bold: true, color: colors.terra }, wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.terra } };
  checks.getRange('A:A').format.columnWidth = 31;
  checks.getRange('B:B').format.columnWidth = 19;
  checks.getRange('C:C').format.columnWidth = 25;
  checks.getRange('D:D').format.columnWidth = 12;
  checks.getRange('E:E').format.columnWidth = 14;
  checks.getRange('F:F').format.columnWidth = 29;
  checks.getRange('G:G').format.columnWidth = 34;
  checks.getRange('7:14').format.rowHeight = 36;
  checks.getRange('17:25').format.rowHeight = 27;
  checks.getRange('26:26').format.rowHeight = 34;

  // 5 Rate-Applications
  styleBody(rateApplications, 'A1:H36');
  setTitle(rateApplications, 'Solve the rate and time, then adjust for inflation');
  rateApplications.getRange('A3:H4').merge();
  rateApplications.getRange('A3').values = [[
    'The equipment terms are hypothetical. Treat 9.6% as the company’s annual valuation discount rate, compounded monthly. RATE finds the financing offer’s implied APR; NPER finds the time to a reserve target. Use effective annual rates with annual inflation.'
  ]];
  rateApplications.getRange('A3:H4').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(rateApplications, 6, 'Implied rate of the equipment financing offer');
  rateApplications.getRange('A7:C16').values = [
    ['Offer input or result', 'Student cell', 'Unit and meaning'],
    ['Amount financed today', null, 'Positive company cash received at t = 0'],
    ['Beginning-of-month payment', null, 'Negative company cash flow each month'],
    ['Month 24 balloon', null, 'Negative company cash flow at the end'],
    ['Number of payments', null, 'Monthly intervals'],
    ['Payment type', null, '1 = beginning of month'],
    ['Implied monthly rate', null, 'RATE output per month'],
    ['Implied nominal APR', null, 'Monthly rate multiplied by 12'],
    ['Implied effective annual rate', null, 'Compounded financing cost'],
    ['Implied APR minus valuation rate', null, 'Percentage-point difference'],
  ];
  setHeader(rateApplications.getRange('A7:C7'));
  rateApplications.getRange('B8').formulas = [["=-'1 Timeline-Diagnose'!B8"]];
  rateApplications.getRange('B9:B12').formulas = [
    ["='1 Timeline-Diagnose'!B12"],
    ["='1 Timeline-Diagnose'!B13"],
    ["='1 Timeline-Diagnose'!B11"],
    ["='1 Timeline-Diagnose'!B14"],
  ];
  rateApplications.getRange('B8:B12').format = { fill: colors.outputFill, font: { color: colors.linkFont }, borders: { preset: 'outside', style: 'thin', color: colors.border } };
  rateApplications.getRange('B8:B10').format.numberFormat = money;
  rateApplications.getRange('B11:B12').format.numberFormat = integer;
  setStudentCell(rateApplications.getRange('B13:B16'), percent);
  setSection(rateApplications, 18, 'Replacement reserve horizon');
  rateApplications.getRange('A19:C24').values = [
    ['Reserve input or result', 'Student cell', 'Unit and meaning'],
    ['Amount invested today', null, 'Positive balance; enter as an outflow in NPER'],
    ['Replacement target', 100000, 'Hypothetical equipment reserve target'],
    ['Monthly growth assumption', null, 'Teaching assumption linked to the monthly model rate'],
    ['Months to reach target', null, 'NPER may return part of a month'],
    ['First whole month at target', null, 'Round up; then check the future balance'],
  ];
  setHeader(rateApplications.getRange('A19:C19'));
  rateApplications.getRange('B20').formulas = [["=-'1 Timeline-Diagnose'!B8"]];
  rateApplications.getRange('B22').formulas = [["=IF('1 Timeline-Diagnose'!F8=\"\",\"\",'1 Timeline-Diagnose'!F8)"]];
  rateApplications.getRange('B20').format = { fill: colors.outputFill, font: { color: colors.linkFont }, numberFormat: money };
  rateApplications.getRange('B22').format = { fill: colors.outputFill, font: { color: colors.linkFont }, numberFormat: percent };
  setInput(rateApplications.getRange('B21'), money);
  setStudentCell(rateApplications.getRange('B23'), '0.000');
  setStudentCell(rateApplications.getRange('B24'), integer);
  setSection(rateApplications, 27, 'Real annual return after inflation');
  rateApplications.getRange('A28:C33').values = [
    ['Annual input or result', 'Student cell', 'Unit and meaning'],
    ['Inflation assumption', 0.03, 'Hypothetical annual inflation rate'],
    ['Effective nominal annual rate', null, 'Link to the annual effective valuation rate'],
    ['Exact real annual rate', null, 'Use annual rates in both numerator and denominator'],
    ['Nominal less inflation', null, 'Approximation for comparison'],
    ['Exact minus approximate', null, 'Percentage-point gap'],
  ];
  setHeader(rateApplications.getRange('A28:C28'));
  setInput(rateApplications.getRange('B29'), percent);
  rateApplications.getRange('B30').formulas = [["=IF('1 Timeline-Diagnose'!F10=\"\",\"\",'1 Timeline-Diagnose'!F10)"]];
  rateApplications.getRange('B30').format = { fill: colors.outputFill, font: { color: colors.linkFont }, numberFormat: percent };
  setStudentCell(rateApplications.getRange('B31:B33'), percent);
  rateApplications.getRange('A35:H36').merge();
  rateApplications.getRange('A35').values = [[
    'Audit: RATE is the financing offer’s implied rate. The 9.6% rate values fixed cash flows for the company. Changing a valuation discount rate while holding payments fixed does not describe a repriced loan quote.'
  ]];
  rateApplications.getRange('A35:H36').format = { fill: colors.warning, font: { color: colors.terra, bold: true }, wrapText: true, verticalAlignment: 'center' };
  rateApplications.getRange('A:A').format.columnWidth = 42;
  rateApplications.getRange('B:B').format.columnWidth = 23;
  rateApplications.getRange('C:C').format.columnWidth = 65;
  rateApplications.getRange('D:H').format.columnWidth = 13;
  rateApplications.getRange('3:4').format.rowHeight = 27;
  rateApplications.getRange('7:16').format.rowHeight = 29;
  rateApplications.getRange('19:24').format.rowHeight = 30;
  rateApplications.getRange('28:33').format.rowHeight = 30;
  rateApplications.getRange('35:36').format.rowHeight = 29;

  // 6 Preferred-Stock
  styleBody(preferred, 'A1:H29');
  setTitle(preferred, 'Value a level preferred dividend');
  preferred.getRange('A3:H4').merge();
  preferred.getRange('A3').values = [[
    'A Berkshire treasury team considers a hypothetical preferred share. The first level dividend arrives next quarter and payments continue indefinitely. These terms are teaching assumptions, not a real security quote.'
  ]];
  preferred.getRange('A3:H4').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  setSection(preferred, 6, 'Quarterly dividend and required return');
  preferred.getRange('A7:C15').values = [
    ['Preferred-share input or result', 'Student cell', 'Unit and meaning'],
    ['Dividend each quarter', 2.5, 'Cash paid per share next quarter and thereafter'],
    ['Nominal annual required return', 0.10, 'Compounded quarterly'],
    ['Quarters per year', 4, 'Match rate and dividend frequency'],
    ['First dividend', 'Next quarter', 'The level-perpetuity formula assumes one period from now'],
    ['Required return per quarter', null, 'Annual nominal rate divided by four'],
    ['Value per share today', null, 'Quarterly dividend divided by quarterly return'],
    ['Annual dividends per share', null, 'Four level dividends'],
    ['Annual dividend yield at calculated value', null, 'Reasonableness check'],
  ];
  setHeader(preferred.getRange('A7:C7'));
  setInput(preferred.getRange('B8'), money);
  setInput(preferred.getRange('B9'), percent);
  setInput(preferred.getRange('B10'), integer);
  setInput(preferred.getRange('B11'), '@');
  setStudentCell(preferred.getRange('B12'), percent);
  setStudentCell(preferred.getRange('B13:B14'), money);
  setStudentCell(preferred.getRange('B15'), percent);
  setSection(preferred, 17, 'Treasury investment size');
  preferred.getRange('A18:C20').values = [
    ['Investment input or result', 'Student cell', 'Unit and meaning'],
    ['Available investment budget', 100000, 'Hypothetical treasury allocation'],
    ['Whole shares affordable', null, 'Do not exceed the budget'],
  ];
  setHeader(preferred.getRange('A18:C18'));
  setInput(preferred.getRange('B19'), money);
  setStudentCell(preferred.getRange('B20'), integer);
  setSection(preferred, 22, 'Check the perpetuity conditions');
  preferred.getRange('A23:H24').merge();
  preferred.getRange('A23').values = [[
    'The shortcut requires level payments forever, a first payment one quarter from today, and a quarterly required return. The 24-payment equipment loan is finite and cannot use this shortcut.'
  ]];
  preferred.getRange('A23:H24').format = { fill: colors.paper, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
  preferred.getRange('A26:A28').merge();
  preferred.getRange('A26').values = [['Interpretation']];
  preferred.getRange('A26:A28').format = { fill: colors.soft, font: { bold: true, color: colors.navy }, verticalAlignment: 'center' };
  preferred.getRange('B26:H28').merge();
  setStudentCell(preferred.getRange('B26:H28'));
  preferred.getRange('A:A').format.columnWidth = 44;
  preferred.getRange('B:B').format.columnWidth = 23;
  preferred.getRange('C:C').format.columnWidth = 67;
  preferred.getRange('D:H').format.columnWidth = 13;
  preferred.getRange('3:4').format.rowHeight = 27;
  preferred.getRange('7:15').format.rowHeight = 31;
  preferred.getRange('18:20').format.rowHeight = 31;
  preferred.getRange('23:24').format.rowHeight = 28;
  preferred.getRange('26:28').format.rowHeight = 28;

  return workbook;
}

async function exportWorkbook() {
  const workbook = buildM05StarterWorkbook();
  workbook.recalculate();
  const outputPath = path.join(publicRoot, '02-VALUATION/M05/bus311-valuation-m05-l01-starter.xlsx');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(outputPath);
  const renderDir = path.join(qaRoot, 'starter');
  await fs.mkdir(renderDir, { recursive: true });
  for (const sheet of workbook.worksheets.items) {
    const safe = sheet.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
    const image = await workbook.render({ sheetName: sheet.name, autoCrop: 'all', scale: 1.25, format: 'png' });
    await fs.writeFile(path.join(renderDir, `${safe}.png`), new Uint8Array(await image.arrayBuffer()));
  }
  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(await exportWorkbook());
}
