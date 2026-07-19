import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'assets', 'lesson-media', 'excel');
const qaDir = '/private/tmp/bus311-lecture-model-qa';

const colors = {
  ink: '#0E1116', terra: '#9C4A2B', paper: '#FAF8F3', white: '#FFFFFF',
  border: '#D9D5CB', input: '#FFF2CC', result: '#E2F0D9', blue: '#0000FF'
};

const models = [
  { id: 'intro-m01-l01', sheet: 'Value Creation', title: 'Costco Value-Creation Screen', inputs: [['Initial investment', -1000, '$m'], ['Discount rate', 0.08, '%'], ['Year 1 cash flow', 260, '$m'], ['Year 2 cash flow', 280, '$m'], ['Year 3 cash flow', 300, '$m'], ['Year 4 cash flow', 310, '$m'], ['Year 5 cash flow', 320, '$m']], formula: '=B4+B6/(1+B5)^1+B7/(1+B5)^2+B8/(1+B5)^3+B9/(1+B5)^4+B10/(1+B5)^5', result: 'Net present value', decision: 'Fund only if NPV remains positive after downside testing.' },
  { id: 'foundations-m01-l02', sheet: 'Market Cap', title: 'Apple Market Capitalization', inputs: [['Share price', 225, '$/share'], ['Diluted shares', 15.2, 'billion']], formula: '=B4*B5', result: 'Equity value', decision: 'Reconcile price date, share count, and units before comparing firms.' },
  { id: 'foundations-m02-l01', sheet: 'Statements', title: 'Microsoft Statement Bridge', inputs: [['Revenue', 1200, '$m'], ['Cost of goods sold', 520, '$m'], ['Operating expenses', 330, '$m'], ['Interest expense', 40, '$m'], ['Taxes', 65, '$m']], formula: '=B4-B5-B6-B7-B8', result: 'Net income', decision: 'Reconcile the result with retained earnings and operating cash flow.' },
  { id: 'foundations-m02-l02', sheet: 'Ratio Analysis', title: 'Nike Return on Equity', inputs: [['Net income', 245, '$m'], ['Beginning equity', 1000, '$m'], ['Ending equity', 1100, '$m']], formula: '=B4/AVERAGE(B5:B6)', result: 'Return on equity', decision: 'Decompose ROE into margin, asset use, and leverage before judging performance.' },
  { id: 'valuation-m01-l01', sheet: 'TVM', title: 'Berkshire Future Value', inputs: [['Present value', -10000, '$'], ['Annual rate', 0.08, '%'], ['Years', 5, 'years']], formula: '=-B4*(1+B5)^B6', result: 'Future value', decision: 'Use only after rate, period, timing, and sign conventions agree.' },
  { id: 'valuation-m02-l01', sheet: 'Bond Price', title: 'Caterpillar Bond Price', inputs: [['Face value', 1000, '$'], ['Coupon rate', 0.05, '%'], ['Yield to maturity', 0.06, '%'], ['Years to maturity', 10, 'years'], ['Payments per year', 2, 'count']], formula: '=-PV(B6/B8,B7*B8,B4*B5/B8,B4)', result: 'Estimated bond price', decision: 'Interpret price together with duration, credit quality, and liquidity.' },
  { id: 'valuation-m03-l01', sheet: 'Equity Value', title: 'Reddit Valuation Range', inputs: [['Next dividend / cash flow', 2.4, '$/share'], ['Long-run growth', 0.04, '%'], ['Required return', 0.10, '%']], formula: '=B4/(B6-B5)', result: 'Constant-growth value', decision: 'Triangulate with peer multiples and scenario evidence.' },
  { id: 'valuation-m04-l01', sheet: 'Capital Budget', title: 'Walmart Automation Project', inputs: [['Initial outlay', -500, '$k'], ['Discount rate', 0.10, '%'], ['Year 1 cash flow', 150, '$k'], ['Year 2 cash flow', 165, '$k'], ['Year 3 cash flow', 175, '$k'], ['Year 4 cash flow', 190, '$k']], formula: '=B4+B6/(1+B5)^1+B7/(1+B5)^2+B8/(1+B5)^3+B9/(1+B5)^4', result: 'Project NPV', decision: 'Accept only if NPV remains positive under defensible downside assumptions.' },
  { id: 'decisions-m01-l01', sheet: 'CAPM', title: 'Boeing Required Return', inputs: [['Risk-free rate', 0.04, '%'], ['Beta', 1.25, 'x'], ['Expected market return', 0.10, '%']], formula: '=B4+B5*(B6-B4)', result: 'CAPM required return', decision: 'Disclose estimation-window and company-specific limitations.' },
  { id: 'decisions-m02-l01', sheet: 'WACC', title: 'Target Weighted Cost of Capital', inputs: [['Equity weight', 0.70, '%'], ['Cost of equity', 0.105, '%'], ['Debt weight', 0.30, '%'], ['Pretax cost of debt', 0.058, '%'], ['Marginal tax rate', 0.25, '%']], formula: '=B4*B5+B6*B7*(1-B8)', result: 'WACC', decision: 'Apply only to projects with matching operating risk and cash-flow definitions.' },
  { id: 'decisions-m03-l01', sheet: 'Capital Structure', title: 'Delta Coverage Stress Test', inputs: [['Base EBIT', 1200, '$m'], ['Downside EBIT', 750, '$m'], ['Interest expense', 300, '$m']], formula: '=B4/B6', secondFormula: '=B5/B6', result: 'Base interest coverage', secondResult: 'Downside coverage', decision: 'Preserve liquidity and flexibility before adding fixed obligations.' }
];

function buildSheet(workbook, model) {
  const sheet = workbook.worksheets.add(model.sheet);
  sheet.showGridLines = false;
  sheet.getRange('A1:F1').merge();
  sheet.getRange('A1').values = [[model.title]];
  sheet.getRange('A1:F1').format = { fill: colors.ink, font: { bold: true, color: colors.white, size: 18 } };
  sheet.getRange('A3:C3').values = [['Input', 'Value', 'Units']];
  sheet.getRange('A3:C3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  const start = 4;
  model.inputs.forEach((item, index) => sheet.getRange(`A${start + index}:C${start + index}`).values = [[...item]]);
  const end = start + model.inputs.length - 1;
  sheet.getRange(`B${start}:B${end}`).format = { fill: colors.input, font: { color: colors.blue }, numberFormat: '#,##0.00' };
  model.inputs.forEach((item, index) => {
    if (item[2] === '%') sheet.getRange(`B${start + index}`).format.numberFormat = '0.0%';
  });
  const resultRow = Math.max(12, end + 2);
  sheet.getRange(`A${resultRow}:C${resultRow}`).values = [['Model output', 'Calculated value', 'Interpretation']];
  sheet.getRange(`A${resultRow}:C${resultRow}`).format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  sheet.getRange(`A${resultRow + 1}`).values = [[model.result]];
  sheet.getRange(`B${resultRow + 1}`).formulas = [[model.formula]];
  sheet.getRange(`C${resultRow + 1}`).values = [[model.decision]];
  sheet.getRange(`B${resultRow + 1}:C${resultRow + 1}`).format = { fill: colors.result, wrapText: true };
  if (/return|roe|wacc|rate/i.test(model.result)) sheet.getRange(`B${resultRow + 1}`).format.numberFormat = '0.0%';
  else sheet.getRange(`B${resultRow + 1}`).format.numberFormat = '#,##0.00';
  if (model.secondFormula) {
    sheet.getRange(`A${resultRow + 2}`).values = [[model.secondResult]];
    sheet.getRange(`B${resultRow + 2}`).formulas = [[model.secondFormula]];
    sheet.getRange(`B${resultRow + 2}`).format = { fill: colors.result, numberFormat: '0.0x' };
  }
  sheet.getRange(`A3:C${resultRow + (model.secondFormula ? 2 : 1)}`).format.borders = { preset: 'outside', style: 'thin', color: colors.border };
  sheet.getRange('A:A').format.columnWidth = 30;
  sheet.getRange('B:B').format.columnWidth = 20;
  sheet.getRange('C:C').format.columnWidth = 58;
  sheet.freezePanes.freezeRows(3);
  return { sheet, endRow: resultRow + (model.secondFormula ? 2 : 1) };
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });
const workbook = Workbook.create();
for (const model of models) {
  const { sheet, endRow } = buildSheet(workbook, model);
  const image = await workbook.render({ sheetName: sheet.name, range: `A1:C${endRow}`, scale: 1.5, format: 'png' });
  const bytes = new Uint8Array(await image.arrayBuffer());
  await fs.writeFile(path.join(outputDir, `${model.id}-excel.png`), bytes);
  await fs.writeFile(path.join(qaDir, `${model.id}-excel.png`), bytes);
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, 'bus311-lecture-models.xlsx'));
console.log(`Built ${models.length} lecture-only Excel examples.`);
