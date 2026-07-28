import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const publicRoot = process.env.BUS311_PUBLIC_ROOT || path.resolve(import.meta.dirname, '..');
const outputPath = process.env.BUS311_M06_OUTPUT || path.join(publicRoot, '02-VALUATION/M06/bus311-valuation-m06-l01-starter.xlsx');
const qaRoot = process.env.BUS311_M06_QA_ROOT || '/private/tmp/bus311-m06-workbook-qa';

const colors = {
  ink: '#10213D', navy: '#17365D', slate: '#30465B', gold: '#D6B13F', terra: '#9C4A2B',
  paper: '#FAF8F3', white: '#FFFFFF', border: '#B8BDC5', soft: '#F2EEE5', blueFill: '#DDEBF7',
  input: '#0000FF', student: '#FFF07A', hint: '#E2F0D9', link: '#008000', output: '#E2F0D9',
  warning: '#FCE4D6', check: '#E7E6E6', pink: '#FCE4EC', cream: '#FFF8E1',
};

const money = '$#,##0.0;[Red]($#,##0.0);-';
const money2 = '$#,##0.00;[Red]($#,##0.00);-';
const integer = '#,##0;[Red](#,##0);-';
const percent = '0.00%;[Red](0.00%);-';
const multiple = '0.00x;[Red](0.00x);-';
const perShare = '$0.00;[Red]($0.00);-';

function body(sheet, range) {
  sheet.showGridLines = false;
  sheet.getRange(range).format.font = { name: 'Aptos', size: 10, color: '#000000' };
  sheet.getRange(range).format.verticalAlignment = 'center';
}

function title(sheet, text, endCol = 'H') {
  const r = sheet.getRange(`A1:${endCol}1`);
  r.merge();
  sheet.getRange('A1').values = [[text]];
  r.format = { fill: colors.ink, font: { bold: true, color: colors.gold, size: 17 }, horizontalAlignment: 'center', verticalAlignment: 'center' };
  sheet.getRange('1:1').format.rowHeight = 30;
  sheet.freezePanes.freezeRows(3);
}

function section(sheet, row, text, startCol = 'A', endCol = 'H') {
  const r = sheet.getRange(`${startCol}${row}:${endCol}${row}`);
  r.merge();
  sheet.getRange(`${startCol}${row}`).values = [[text]];
  r.format = { fill: colors.ink, font: { bold: true, color: colors.gold, size: 11 }, verticalAlignment: 'center' };
  r.format.rowHeight = 22;
}

function header(range) {
  range.format = {
    fill: colors.slate, font: { bold: true, color: colors.white }, horizontalAlignment: 'center',
    verticalAlignment: 'center', wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border },
  };
}

function input(range, format = integer) {
  range.format = { fill: colors.blueFill, font: { color: colors.input }, numberFormat: format, borders: { preset: 'all', style: 'thin', color: colors.border } };
}

function student(range, format = integer) {
  range.format = { fill: colors.student, font: { color: '#000000' }, numberFormat: format, borders: { preset: 'all', style: 'medium', color: colors.slate }, wrapText: true, verticalAlignment: 'top' };
}

function linked(range, format = integer) {
  range.format = { fill: colors.soft, font: { color: colors.link }, numberFormat: format, borders: { preset: 'all', style: 'thin', color: colors.border } };
}

function hint(range) {
  range.format = { fill: colors.hint, font: { color: '#3F7F43', italic: true }, wrapText: true, verticalAlignment: 'top', borders: { preset: 'all', style: 'thin', color: colors.border } };
}

function note(range, fill = colors.cream) {
  range.format = { fill, wrapText: true, verticalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: colors.border } };
}

function total(range, format = integer) {
  range.format = { fill: colors.soft, font: { bold: true }, numberFormat: format, borders: { top: { style: 'thin', color: colors.slate }, bottom: { style: 'double', color: colors.slate } } };
}

function setWidths(sheet, widths) {
  for (const [cols, width] of Object.entries(widths)) sheet.getRange(cols).format.columnWidth = width;
}

function addStart(workbook) {
  const s = workbook.worksheets.add('START HERE');
  body(s, 'A1:H38');
  title(s, 'BUS311 M06 — Bond Valuation, Interest Rates, and YTM');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['Meridian Industrial Corp. · student starter · $ thousands unless noted · Version 2026-07-28']];
  s.getRange('A3:H3').format = { fill: colors.terra, font: { bold: true, color: colors.white }, horizontalAlignment: 'center' };
  s.getRange('A5:H7').merge();
  s.getRange('A5').values = [['Decision objective: price Meridian’s bond with PV, PRICE, YIELD, and RATE; reconcile gross proceeds to issuance costs and every use; build closing-date balance sheets and first-year earnings; test financing capacity; and make a CFO recommendation that distinguishes “best full-size scenario” from “acceptable financing plan.”']];
  note(s.getRange('A5:H7'), colors.paper);
  section(s, 9, 'Required workflow');
  s.getRange('A10:B17').values = [
    ['Reconstruct', 'Complete the income statement and balanced baseline before using any ratio.'],
    ['Price', 'Use the same dated bond assumptions for PV and PRICE; solve reverse yields with YIELD and RATE.'],
    ['Reconcile', 'Start with gross cash proceeds, subtract issuance costs, and assign every remaining dollar to refinancing, capex, or retained cash.'],
    ['Model', 'Use a closing-date balance sheet; do not mix closing entries with first-year income.'],
    ['Tie', 'Connect debt face value, debt carrying value, cash, interest expense, tax, equity, shares, and EPS.'],
    ['Check', 'Clear the balance-sheet, sources-and-uses, debt-roll-forward, sign, and scenario checks.'],
    ['Size', 'Calculate the maximum face amount supported by leverage and coverage guardrails.'],
    ['Recommend', 'Cite price, two ratios, one tie-out, and one monitoring trigger.'],
  ];
  s.getRange('A10:A17').format = { fill: colors.blueFill, font: { bold: true, color: colors.navy }, horizontalAlignment: 'center', borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('B10:B17').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  section(s, 19, 'Model timing and sign conventions');
  s.getRange('A20:D24').values = [
    ['Convention', 'Required treatment', 'Convention', 'Required treatment'],
    ['Interest expense', 'Display as a positive expense; EBT = EBIT − interest expense.', 'Income tax expense', 'Display as a positive expense; net income = EBT − tax expense.'],
    ['Offering size', 'Face value is debt promised, not cash received.', 'Gross proceeds', 'Market price × bonds issued; may differ from face value.'],
    ['Debt carrying value', 'Gross proceeds less issuance costs at closing.', 'Credit-ratio debt', 'Use gross face debt so leverage is not understated by discount or fees.'],
    ['Closing equity', 'Unchanged because no shares are issued and first-year earnings have not yet occurred.', 'EPS', 'First-year net income ÷ unchanged diluted shares.'],
  ];
  header(s.getRange('A20:D20'));
  s.getRange('A21:D24').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A21:A24').format.font = { bold: true, color: colors.navy };
  s.getRange('C21:C24').format.font = { bold: true, color: colors.navy };
  section(s, 26, 'Color legend and completion rules');
  s.getRange('A27:D30').values = [
    ['Blue input', 'Given teaching-case assumption; use its cell reference.', 'Yellow cell', 'Student formula, link, interpretation, or written recommendation.'],
    ['Green font', 'Formula linked from another worksheet.', 'Black formula', 'Calculation on the current worksheet.'],
    ['Checks', 'COMPLETE means required student cells are blank; CHECK means a completed model does not reconcile.', 'Privacy', 'No answer, solution, instructor, grading, or hidden key sheet belongs in this public workbook.'],
    ['FactSet', 'If live values are substituted, record field, company, period, units, currency, and retrieval date.', 'Units', 'Financial statements are $000s; price per bond is dollars; shares are 000s.'],
  ];
  s.getRange('A27').format = { fill: colors.blueFill, font: { bold: true, color: colors.input } };
  s.getRange('C27').format = { fill: colors.student, font: { bold: true } };
  s.getRange('A28').format = { fill: colors.soft, font: { bold: true, color: colors.link } };
  s.getRange('C28').format = { fill: colors.soft, font: { bold: true } };
  s.getRange('A27:D30').format.borders = { preset: 'all', style: 'thin', color: colors.border };
  s.getRange('B27:D30').format.wrapText = true;
  section(s, 32, 'Baseline correction disclosed');
  s.getRange('A33:H36').merge();
  s.getRange('A33').values = [['The prior teaching case listed $486.5M of assets but only $425.5M of liabilities and equity. This reconstruction restores the omitted $61.0M non-debt “Other Long-Term Operating Liabilities” line (for example, lease, pension, and other operating obligations). It is shown explicitly, excluded from interest-bearing debt ratios, and never used as a hidden cash or equity plug.']];
  note(s.getRange('A33:H36'), colors.warning);
  setWidths(s, { 'A:A': 22, 'B:B': 68, 'C:C': 22, 'D:D': 68, 'E:H': 12 });
  s.getRange('5:7').format.rowHeight = 26;
  s.getRange('10:17').format.rowHeight = 30;
  s.getRange('21:24').format.rowHeight = 38;
  s.getRange('27:30').format.rowHeight = 38;
  s.getRange('33:36').format.rowHeight = 24;
}

function addAssumptions(workbook) {
  const s = workbook.worksheets.add('1 Assumptions-Baseline');
  body(s, 'A1:H59');
  title(s, 'Meridian — Central Assumptions and Balanced Baseline');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['All scenario formulas must link here. Blue = given; yellow = student calculation. Fictional teaching case, FY 2025 baseline.']];
  s.getRange('A3:H3').format = { fill: colors.terra, font: { bold: true, color: colors.white }, horizontalAlignment: 'center' };
  section(s, 5, 'Baseline income statement and per-share data', 'A', 'D');
  s.getRange('A6:D19').values = [
    ['Income statement item', 'FY 2025 ($000s)', 'Student formula / definition', 'Role'],
    ['Revenue', 425000, 'Given', 'Input'],
    ['Cost of Goods Sold', 272000, 'Given', 'Input'],
    ['Gross Profit', null, 'Revenue − COGS', 'Student'],
    ['Selling, General & Admin', 61000, 'Given', 'Input'],
    ['Depreciation & Amortization', 18500, 'Given', 'Input'],
    ['EBIT (Operating Income)', null, 'Gross Profit − SG&A − D&A', 'Student'],
    ['Interest Expense', 9800, 'Positive expense', 'Input'],
    ['EBT', null, 'EBIT − Interest Expense', 'Student'],
    ['Income Tax Rate', 0.25, 'Applied to positive EBT', 'Input'],
    ['Income Tax Expense', null, 'Positive expense = MAX(EBT,0) × tax rate', 'Student'],
    ['Net Income', null, 'EBT − Income Tax Expense', 'Student'],
    ['Diluted Shares Outstanding (000s)', 50000, 'No issuance in debt scenarios', 'Input'],
    ['EPS', null, 'Net Income ÷ diluted shares', 'Student'],
  ];
  header(s.getRange('A6:D6'));
  for (const row of [7, 8, 10, 11, 13, 15, 18]) input(s.getRange(`B${row}`), row === 15 ? percent : integer);
  for (const row of [9, 12, 14, 16, 17, 19]) student(s.getRange(`B${row}`), row === 19 ? perShare : integer);
  s.getRange('C7:D19').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };

  section(s, 21, 'Balanced baseline statement of financial position', 'A', 'H');
  s.getRange('A22:D31').values = [
    ['Assets', 'FY 2025 ($000s)', 'Source / rationale', 'Role'],
    ['Cash & Cash Equivalents', 32500, 'Given', 'Input'],
    ['Accounts Receivable', 58000, 'Given', 'Input'],
    ['Inventory', 44200, 'Given', 'Input'],
    ['Other Current Assets', 8300, 'Given', 'Input'],
    ['Total Current Assets', null, 'Sum current assets', 'Student'],
    ['Property, Plant & Equipment (net)', 312000, 'Given net carrying amount', 'Input'],
    ['Intangible Assets', 22000, 'Given', 'Input'],
    ['Other Long-Term Assets', 9500, 'Given', 'Input'],
    ['Total Assets', null, 'Current assets + all long-term assets', 'Student'],
  ];
  s.getRange('E22:H34').values = [
    ['Liabilities & Equity', 'FY 2025 ($000s)', 'Source / rationale', 'Role'],
    ['Accounts Payable', 29400, 'Given', 'Input'],
    ['Short-Term Debt', 45000, 'Interest-bearing current debt', 'Input'],
    ['Other Current Liabilities', 13100, 'Given', 'Input'],
    ['Total Current Liabilities', null, 'Sum current liabilities', 'Student'],
    ['Existing Long-Term Debt', 110000, 'Interest-bearing debt', 'Input'],
    ['Deferred Tax Liability', 7200, 'Given', 'Input'],
    ['Other Long-Term Operating Liabilities', 61000, 'Restored omitted non-debt line; lease, pension, and operating obligations', 'Input'],
    ['Total Liabilities', null, 'Current + all long-term liabilities', 'Student'],
    ['Common Stock & APIC', 85000, 'Given', 'Input'],
    ['Retained Earnings', 135800, 'Given', 'Input'],
    ['Total Equity', null, 'Common Stock & APIC + Retained Earnings', 'Student'],
    ['Total Liabilities & Equity', null, 'Total Liabilities + Total Equity', 'Student'],
  ];
  header(s.getRange('A22:D22')); header(s.getRange('E22:H22'));
  for (const row of [23, 24, 25, 26, 28, 29, 30]) input(s.getRange(`B${row}`));
  for (const row of [27, 31]) student(s.getRange(`B${row}`));
  for (const row of [23, 24, 25, 27, 28, 29, 31, 32]) input(s.getRange(`F${row}`));
  for (const row of [26, 30, 33, 34]) student(s.getRange(`F${row}`));
  s.getRange('C23:D31').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('G23:H34').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };

  section(s, 36, 'Bond, financing, and scenario assumptions', 'A', 'H');
  s.getRange('A37:D49').values = [
    ['Bond / financing input', 'Value', 'Unit / definition', 'Role'],
    ['Par Value per Bond', 1000, '$ per bond', 'Input'],
    ['Number of Bonds Issued', 200000, 'bonds', 'Input'],
    ['Annual Coupon Rate', 0.055, 'nominal annual', 'Input'],
    ['Market YTM', 0.058, 'nominal annual, semiannual compounding', 'Input'],
    ['Settlement Date', new Date('2026-09-01T00:00:00Z'), 'coupon date; accrued interest = 0', 'Input'],
    ['Maturity Date', new Date('2036-09-01T00:00:00Z'), '10 years after settlement', 'Input'],
    ['Payment Frequency', 2, 'payments per year', 'Input'],
    ['Day-Count Basis', 0, '0 = US 30/360', 'Input'],
    ['Issuance Cost Rate', 0.01, '% of gross proceeds', 'Input'],
    ['Observed Clean Price', 96.5, '$ per $100 of par; separate reverse-yield test', 'Input'],
    ['Short-Term Debt Rate', 0.085, 'annual', 'Input'],
    ['Implied Existing LT Debt Rate', null, '(Baseline interest − ST interest) ÷ existing LT debt', 'Student'],
  ];
  header(s.getRange('A37:D37'));
  for (const row of [38, 39, 44, 45]) input(s.getRange(`B${row}`), integer);
  for (const row of [40, 41, 46, 48]) input(s.getRange(`B${row}`), percent);
  input(s.getRange('B42:B43'), 'yyyy-mm-dd');
  input(s.getRange('B47'), money2);
  student(s.getRange('B49'), percent);
  s.getRange('C38:D49').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };

  s.getRange('E37:H44').values = [
    ['Scenario driver', 'A — Refinance', 'B — CapEx', 'C — Mixed'],
    ['Refinancing Target ($000s)', 45000, 0, 45000],
    ['Fixed CapEx Target ($000s)', 0, 0, 100000],
    ['Allocate Residual Net Proceeds to CapEx?', 0, 1, 0],
    ['Revenue Growth', 0, 0.025, 0.015],
    ['EBIT Growth', 0, 0.025, 0.012],
    ['Incremental D&A ($000s)', 0, 10000, 5000],
    ['Cash Retained Rule', 'Residual', 'None', 'Residual'],
  ];
  header(s.getRange('E37:H37'));
  input(s.getRange('F38:H40'));
  input(s.getRange('F41:H42'), percent);
  input(s.getRange('F43:H43'));
  s.getRange('F44:H44').format = { fill: colors.blueFill, font: { color: colors.input }, horizontalAlignment: 'center', borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('E38:E44').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };

  s.getRange('E46:H51').values = [
    ['Credit benchmark', 'Threshold', 'Direction', 'Use'],
    ['Debt / Equity', 1.5, '≤', 'Capacity'],
    ['Debt / EBITDA', 3.0, '≤', 'Capacity'],
    ['Interest Coverage', 3.0, '≥', 'Capacity'],
    ['Net Debt / EBITDA', 2.5, '≤', 'Decision'],
    ['Current Ratio', 1.5, '≥', 'Decision'],
  ];
  header(s.getRange('E46:H46'));
  input(s.getRange('F47:F51'), multiple);
  s.getRange('E47:H51').format.borders = { preset: 'all', style: 'thin', color: colors.border };

  section(s, 53, 'Yield sensitivity inputs', 'A', 'D');
  s.getRange('A54:B58').values = [
    ['Rates Fall', 0.045], ['Par / Flat', 0.055], ['Base Case', 0.058], ['Rates Rise', 0.065], ['Stress Case', 0.075],
  ];
  s.getRange('A54:A58').format = { fill: colors.soft, font: { bold: true, color: colors.navy }, borders: { preset: 'all', style: 'thin', color: colors.border } };
  input(s.getRange('B54:B58'), percent);
  setWidths(s, { 'A:A': 34, 'B:B': 18, 'C:C': 44, 'D:D': 12, 'E:E': 34, 'F:H': 18 });
  s.getRange('6:19').format.rowHeight = 27;
  s.getRange('22:34').format.rowHeight = 28;
  s.getRange('37:51').format.rowHeight = 28;
}

function addBondPricing(workbook) {
  const s = workbook.worksheets.add('2 Bond Pricing');
  body(s, 'A1:H52');
  title(s, 'Meridian — Bond Pricing, Yield, and Effective Interest');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['Use investor signs for valuation: price today is a cash outflow; coupons and principal are future inflows. Use issuer signs for proceeds and interest expense.']];
  note(s.getRange('A3:H3'), colors.paper);
  section(s, 5, 'Linked bond assumptions', 'A', 'D');
  s.getRange('A6:C15').values = [
    ['Assumption', 'Linked value', 'Definition'],
    ['Par Value per Bond', null, '$ per bond'], ['Number of Bonds', null, 'bonds'], ['Annual Coupon Rate', null, 'nominal annual'],
    ['Market YTM', null, 'nominal annual'], ['Settlement Date', null, 'coupon date'], ['Maturity Date', null, 'coupon date'],
    ['Payment Frequency', null, 'periods per year'], ['Day-Count Basis', null, '0 = US 30/360'], ['Issuance Cost Rate', null, '% of gross proceeds'],
  ];
  header(s.getRange('A6:C6'));
  const assumptionLinks = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  for (let i = 0; i < assumptionLinks.length; i += 1) s.getRange(`B${7 + i}`).formulas = [[`='1 Assumptions-Baseline'!B${assumptionLinks[i]}`]];
  linked(s.getRange('B7:B8'), integer); linked(s.getRange('B9:B10'), percent); linked(s.getRange('B11:B12'), 'yyyy-mm-dd'); linked(s.getRange('B13:B14'), integer); linked(s.getRange('B15'), percent);
  s.getRange('A7:C15').format.borders = { preset: 'all', style: 'thin', color: colors.border };

  section(s, 17, 'Student build — PV, PRICE, YIELD, RATE, proceeds, and effective interest', 'A', 'H');
  s.getRange('A18:D39').values = [
    ['Metric', 'Student formula', 'Required relationship', 'Audit meaning'],
    ['Coupon per Period ($ / bond)', null, 'Par × coupon rate ÷ frequency', 'Contract cash flow'],
    ['Market Yield per Period', null, 'YTM ÷ frequency', 'Discount rate'],
    ['Total Coupon Periods', null, 'Years × frequency, or dated equivalent', 'Timing'],
    ['Price per Bond — PV', null, 'Negative PV of investor inflows', 'General TVM method'],
    ['Price per Bond — PRICE', null, 'PRICE × par ÷ 100', 'Dated bond method'],
    ['PV vs PRICE Difference', null, 'PV price − PRICE price', 'Should be zero on coupon date'],
    ['Gross Offering Proceeds ($000s)', null, 'Price × bonds ÷ 1,000', 'Cash source before fees'],
    ['Issuance Costs ($000s)', null, 'Gross proceeds × issuance cost rate', 'Cash use at closing'],
    ['Net Proceeds / Initial Carrying Amount ($000s)', null, 'Gross proceeds − issuance costs', 'Deployable cash and debt carrying value'],
    ['Face Discount + Issuance Costs ($000s)', null, 'Face amount − initial carrying amount', 'Contra-debt at closing'],
    ['Annual Cash Coupon ($000s)', null, 'Face amount × coupon rate', 'Cash paid; not full accounting interest'],
    ['Observed Clean Price ($ per $100)', null, 'Link the separate observed quote', 'Reverse-yield audit input'],
    ['YIELD from Observed Price', null, 'YIELD using dated terms', 'Nominal annual investor yield'],
    ['RATE from Observed Price', null, 'RATE periodic result × frequency', 'Independent reverse-yield method'],
    ['Issuer EIR per Period', null, 'RATE using net proceeds as PV', 'Includes discount and issuance costs'],
    ['Issuer Nominal Annual EIR', null, 'Periodic issuer EIR × frequency', 'All-in accounting rate'],
    ['Period 1 Interest Expense ($000s)', null, 'Opening carrying value × periodic EIR', 'Positive expense'],
    ['Ending Carrying Value — Period 1', null, 'Opening carry + interest expense − cash coupon', 'Debt accretes toward face'],
    ['Period 2 Interest Expense ($000s)', null, 'Period 1 ending carry × periodic EIR', 'Positive expense'],
    ['Year 1 New-Bond Interest Expense ($000s)', null, 'Period 1 + Period 2 expense', 'Used in scenario net income'],
    ['Ending Carrying Value — Year 1', null, 'Period 1 ending carry + period 2 expense − cash coupon', 'Debt roll-forward'],
  ];
  header(s.getRange('A18:D18'));
  student(s.getRange('B19'), money2); student(s.getRange('B20'), percent); student(s.getRange('B21'), integer);
  student(s.getRange('B22:B23'), money2); student(s.getRange('B24'), money2); student(s.getRange('B25:B29'), money);
  student(s.getRange('B30'), money2); student(s.getRange('B31:B34'), percent); student(s.getRange('B35:B39'), money);
  s.getRange('C19:D39').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };

  section(s, 42, 'Yield sensitivity — one copy-down PRICE formula', 'A', 'F');
  s.getRange('A43:F48').values = [
    ['Scenario', 'Linked YTM', 'Price per Bond', 'Premium / (Discount)', 'Gross Proceeds ($000s)', 'Interpretation'],
    ['Rates Fall', null, null, null, null, 'Coupon exceeds market yield → premium'],
    ['Par / Flat', null, null, null, null, 'Coupon equals market yield → par'],
    ['Base Case', null, null, null, null, 'Market yield exceeds coupon → discount'],
    ['Rates Rise', null, null, null, null, 'Discount widens'],
    ['Stress Case', null, null, null, null, 'Deep discount; funding shortfall grows'],
  ];
  header(s.getRange('A43:F43'));
  for (let i = 0; i < 5; i += 1) s.getRange(`B${44 + i}`).formulas = [[`='1 Assumptions-Baseline'!B${54 + i}`]];
  linked(s.getRange('B44:B48'), percent);
  student(s.getRange('C44:E48'), money2);
  s.getRange('F44:F48').format = { fill: colors.soft, wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A50:H52').merge();
  s.getRange('A50').values = [['Reasonableness gate: coupon rate > YTM implies premium, coupon rate = YTM implies par, and coupon rate < YTM implies discount. The sensitivity table must move monotonically in the opposite direction from YTM.']];
  note(s.getRange('A50:H52'), colors.warning);
  setWidths(s, { 'A:A': 38, 'B:B': 22, 'C:C': 44, 'D:D': 42, 'E:E': 21, 'F:F': 42, 'G:H': 12 });
  s.getRange('18:39').format.rowHeight = 28;
  s.getRange('43:48').format.rowHeight = 30;
}

function addSourcesUses(workbook) {
  const s = workbook.worksheets.add('3 Sources-Uses');
  body(s, 'A1:H36');
  title(s, 'Meridian — Sources, Uses, and Debt Roll-Forward');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['Every dollar of gross proceeds must be assigned exactly once. Discount and fees reduce cash received but do not reduce the promised face amount used in credit ratios.']];
  note(s.getRange('A3:H3'), colors.paper);
  section(s, 5, 'Closing sources and uses', 'A', 'E');
  s.getRange('A6:D18').values = [
    ['Sources / Uses ($000s)', 'A — Refinance', 'B — CapEx', 'C — Mixed'],
    ['Gross Bond Proceeds', null, null, null],
    ['', null, null, null],
    ['Issuance Costs', null, null, null],
    ['Refinance Short-Term Debt', null, null, null],
    ['Capital Expenditure', null, null, null],
    ['Cash Retained', null, null, null],
    ['Total Uses', null, null, null],
    ['Sources − Uses Check', null, null, null],
    ['', null, null, null],
    ['Net Proceeds', null, null, null],
    ['Refi + CapEx + Cash Retained', null, null, null],
    ['Net Proceeds − Deployment Check', null, null, null],
  ];
  header(s.getRange('A6:D6'));
  for (const col of ['B','C','D']) {
    s.getRange(`${col}7`).formulas = [["='2 Bond Pricing'!$B$25"]];
    linked(s.getRange(`${col}7`), money);
    student(s.getRange(`${col}9:${col}14`), money);
    s.getRange(`${col}16`).formulas = [["='2 Bond Pricing'!$B$27"]];
    linked(s.getRange(`${col}16`), money);
    student(s.getRange(`${col}17:${col}18`), money);
  }
  s.getRange('A7:A18').format = { font: { bold: true }, borders: { preset: 'all', style: 'thin', color: colors.border } };

  section(s, 20, 'Debt face value, carrying value, and roll-forward', 'A', 'E');
  s.getRange('A21:D30').values = [
    ['Debt Bridge ($000s)', 'A — Refinance', 'B — CapEx', 'C — Mixed'],
    ['Beginning Short-Term Debt', null, null, null],
    ['Refinancing Repayment', null, null, null],
    ['Ending Short-Term Debt', null, null, null],
    ['Beginning Existing LT Debt — Face', null, null, null],
    ['New Bond — Face', null, null, null],
    ['Ending Gross Face Debt', null, null, null],
    ['New Bond — Initial Carrying Value', null, null, null],
    ['Contra-Debt: Discount + Issuance Costs', null, null, null],
    ['New Bond Face − Carrying − Contra Check', null, null, null],
  ];
  header(s.getRange('A21:D21'));
  for (const col of ['B','C','D']) {
    s.getRange(`${col}22`).formulas = [["='1 Assumptions-Baseline'!$F$24"]];
    s.getRange(`${col}25`).formulas = [["='1 Assumptions-Baseline'!$F$27"]];
    linked(s.getRange(`${col}22`), money); linked(s.getRange(`${col}25`), money);
    student(s.getRange(`${col}23:${col}24`), money);
    student(s.getRange(`${col}26:${col}30`), money);
  }
  s.getRange('A22:A30').format = { font: { bold: true }, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A32:H35').merge();
  s.getRange('A32').values = [['Accounting rationale: the new bond is recorded at initial carrying value (gross proceeds less issuance costs). The difference between face value and carrying value is visible contra-debt, not missing cash. Credit ratios use ending gross face debt; the balance sheet uses carrying value.']];
  note(s.getRange('A32:H35'), colors.warning);
  setWidths(s, { 'A:A': 44, 'B:D': 22, 'E:E': 12, 'F:H': 14 });
  s.getRange('6:18').format.rowHeight = 28;
  s.getRange('21:30').format.rowHeight = 28;
}

function addScenarioImpact(workbook) {
  const s = workbook.worksheets.add('4 Scenario Impact');
  body(s, 'A1:H58');
  title(s, 'Meridian — Closing Balance Sheet, Year-1 Earnings, and Ratios');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['Timing discipline: the balance sheet is measured immediately after closing; the income statement and EPS show the first full year after closing. Closing equity is unchanged because no shares are issued and year-1 earnings have not yet accumulated.']];
  note(s.getRange('A3:H3'), colors.paper);
  section(s, 5, 'Closing-date balance sheet', 'A', 'F');
  s.getRange('A6:E27').values = [
    ['Line Item ($000s)', 'Baseline', 'A — Refinance', 'B — CapEx', 'C — Mixed'],
    ['Cash & Cash Equivalents', null, null, null, null],
    ['Total Current Assets', null, null, null, null],
    ['PP&E (net)', null, null, null, null],
    ['Intangible Assets', null, null, null, null],
    ['Other Long-Term Assets', null, null, null, null],
    ['Total Assets', null, null, null, null],
    ['', null, null, null, null],
    ['Accounts Payable', null, null, null, null],
    ['Short-Term Debt', null, null, null, null],
    ['Other Current Liabilities', null, null, null, null],
    ['Total Current Liabilities', null, null, null, null],
    ['Existing Long-Term Debt', null, null, null, null],
    ['New Bond — Carrying Value', null, null, null, null],
    ['Deferred Tax Liability', null, null, null, null],
    ['Other Long-Term Operating Liabilities', null, null, null, null],
    ['Total Liabilities', null, null, null, null],
    ['Common Stock & APIC', null, null, null, null],
    ['Retained Earnings', null, null, null, null],
    ['Total Equity at Closing', null, null, null, null],
    ['Total Liabilities & Equity', null, null, null, null],
    ['Balance Sheet Check', null, null, null, null],
  ];
  header(s.getRange('A6:E6'));
  const baseLinks = {7:'B23',8:'B27',9:'B28',10:'B29',11:'B30',12:'B31',14:'F23',15:'F24',16:'F25',17:'F26',18:'F27',20:'F28',21:'F29',22:'F30',23:'F31',24:'F32',25:'F33',26:'F34'};
  for (const [row, ref] of Object.entries(baseLinks)) s.getRange(`B${row}`).formulas = [[`='1 Assumptions-Baseline'!${ref}`]];
  s.getRange('B19').values = [[0]];
  linked(s.getRange('B7:B26'), money);
  for (const col of ['C','D','E']) student(s.getRange(`${col}7:${col}27`), money);
  total(s.getRange('A12:E12'), money); total(s.getRange('A22:E22'), money); total(s.getRange('A25:E25'), money); total(s.getRange('A26:E26'), money); total(s.getRange('A27:E27'), money);

  section(s, 29, 'First full year after closing — positive expense convention', 'A', 'F');
  s.getRange('A30:E43').values = [
    ['Income Statement / Per Share', 'Baseline', 'A — Refinance', 'B — CapEx', 'C — Mixed'],
    ['Revenue', null, null, null, null], ['EBIT', null, null, null, null], ['D&A', null, null, null, null], ['EBITDA', null, null, null, null],
    ['Short-Term Debt Interest Expense', null, null, null, null], ['Existing LT Debt Interest Expense', null, null, null, null], ['New Bond Year-1 Interest Expense', null, null, null, null],
    ['Total Interest Expense', null, null, null, null], ['EBT', null, null, null, null], ['Income Tax Expense', null, null, null, null], ['Net Income', null, null, null, null],
    ['Diluted Shares Outstanding (000s)', null, null, null, null], ['EPS', null, null, null, null],
  ];
  header(s.getRange('A30:E30'));
  const incomeLinks = {31:'B7',32:'B12',33:'B11',39:'B14',40:'B16',41:'B17',42:'B18',43:'B19'};
  for (const [row, ref] of Object.entries(incomeLinks)) s.getRange(`B${row}`).formulas = [[`='1 Assumptions-Baseline'!${ref}`]];
  s.getRange('B34').formulas = [["=IF(ISBLANK('1 Assumptions-Baseline'!B12),\"\",'1 Assumptions-Baseline'!B12+'1 Assumptions-Baseline'!B11)"]];
  s.getRange('B35').formulas = [["='1 Assumptions-Baseline'!F24*'1 Assumptions-Baseline'!B48"]];
  s.getRange('B36').formulas = [["=IF(ISBLANK('1 Assumptions-Baseline'!B49),\"\",'1 Assumptions-Baseline'!F27*'1 Assumptions-Baseline'!B49)"]];
  s.getRange('B37').values = [[0]];
  s.getRange('B38').formulas = [["=IF(COUNT(B35:B37)<3,\"\",SUM(B35:B37))"]];
  linked(s.getRange('B31:B42'), money); linked(s.getRange('B43'), perShare);
  for (const col of ['C','D','E']) {
    student(s.getRange(`${col}31:${col}41`), money);
    student(s.getRange(`${col}42`), integer);
    student(s.getRange(`${col}43`), perShare);
  }
  total(s.getRange('A34:E34'), money); total(s.getRange('A38:E38'), money); total(s.getRange('A41:E41'), money); total(s.getRange('A43:E43'), perShare);

  section(s, 46, 'Credit and liquidity ratio comparison', 'A', 'G');
  s.getRange('A47:G53').values = [
    ['Metric', 'Baseline', 'A — Refinance', 'B — CapEx', 'C — Mixed', 'Benchmark', 'Interpretation'],
    ['Gross Face Debt ($000s)', null, null, null, null, 'n/a', 'Uses promised debt, not carrying value'],
    ['Debt / Equity', null, null, null, null, '≤ 1.50x', 'Lower is stronger'],
    ['Debt / EBITDA', null, null, null, null, '≤ 3.00x', 'Primary capacity constraint'],
    ['Interest Coverage', null, null, null, null, '≥ 3.00x', 'EBIT ÷ positive interest expense'],
    ['Net Debt / EBITDA', null, null, null, null, '≤ 2.50x', 'Cash retained reduces net debt'],
    ['Current Ratio', null, null, null, null, '≥ 1.50x', 'Closing current assets ÷ current liabilities'],
  ];
  header(s.getRange('A47:G47'));
  for (const col of ['B','C','D','E']) student(s.getRange(`${col}48`), money);
  for (const col of ['B','C','D','E']) student(s.getRange(`${col}49:${col}53`), multiple);
  s.getRange('F48:G53').format = { fill: colors.soft, wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A55:H57').merge();
  s.getRange('A55').values = [['Required interpretation: a scenario may rank best but still fail an absolute benchmark. Keep face debt and carrying debt distinct; include retained cash in net debt; and never improve net income by adding a positive interest expense.']];
  note(s.getRange('A55:H57'), colors.warning);
  setWidths(s, { 'A:A': 42, 'B:E': 20, 'F:F': 18, 'G:G': 42, 'H:H': 12 });
  s.getRange('6:27').format.rowHeight = 27;
  s.getRange('30:43').format.rowHeight = 27;
  s.getRange('47:53').format.rowHeight = 28;
}

function addCapacityDecision(workbook) {
  const s = workbook.worksheets.add('5 Capacity-Decision');
  body(s, 'A1:H62');
  title(s, 'Meridian — Financing Capacity and CFO Recommendation');
  s.getRange('A3:H3').merge();
  s.getRange('A3').values = [['First identify the strongest full-size use of proceeds. Then calculate whether the $200M face amount is supportable under the stated guardrails.']];
  note(s.getRange('A3:H3'), colors.paper);
  section(s, 5, 'Full-size scenario scorecard', 'A', 'F');
  s.getRange('A6:E12').values = [
    ['Metric', 'A — Refinance', 'B — CapEx', 'C — Mixed', 'Best full-size case and why'],
    ['Debt / Equity', null, null, null, null], ['Debt / EBITDA', null, null, null, null], ['Interest Coverage', null, null, null, null],
    ['Net Debt / EBITDA', null, null, null, null], ['Current Ratio', null, null, null, null], ['EPS', null, null, null, null],
  ];
  header(s.getRange('A6:E6'));
  student(s.getRange('B7:D11'), multiple); student(s.getRange('B12:D12'), perShare); student(s.getRange('E7:E12'), '@');

  section(s, 15, 'Resize-and-stage capacity test — use Scenario C operating assumptions', 'A', 'F');
  s.getRange('A16:D35').values = [
    ['Capacity input / output', 'Student formula', 'Unit', 'Required relationship'],
    ['Scenario C EBITDA', null, '$000s', 'Link completed scenario model'],
    ['Scenario C EBIT', null, '$000s', 'Link completed scenario model'],
    ['Closing Equity', null, '$000s', 'Link completed scenario model'],
    ['Remaining Pre-Existing Face Debt after Refi', null, '$000s', 'Ending ST debt + existing LT debt'],
    ['', null, '', ''],
    ['New Face Capacity — Debt / Equity', null, '$000s', 'D/E max × equity − remaining debt'],
    ['New Face Capacity — Debt / EBITDA', null, '$000s', 'Debt/EBITDA max × EBITDA − remaining debt'],
    ['New Face Capacity — Interest Coverage', null, '$000s', 'Interest headroom ÷ new-bond interest per $1 face'],
    ['Recommended Maximum New Face Amount', null, '$000s', 'Minimum of the three positive capacity limits'],
    ['', null, '', ''],
    ['Gross Proceeds at Capacity', null, '$000s', 'Capacity face ÷ par × price per bond'],
    ['Issuance Costs at Capacity', null, '$000s', 'Gross proceeds × issuance cost rate'],
    ['Net Proceeds at Capacity', null, '$000s', 'Gross proceeds − issuance costs'],
    ['Refinance Short-Term Debt', null, '$000s', 'Scenario C target'],
    ['Staged CapEx', null, '$000s', 'Scenario C fixed target'],
    ['Cash Retained', null, '$000s', 'Net proceeds − refinancing − capex'],
    ['Total Uses', null, '$000s', 'Issuance costs + refinancing + capex + cash'],
    ['Capacity Sources − Uses Check', null, '$000s', 'Gross proceeds − total uses'],
    ['Debt / EBITDA at Capacity', null, 'x', '(Remaining debt + new face) ÷ EBITDA'],
  ];
  header(s.getRange('A16:D16'));
  student(s.getRange('B17:B35'), money);
  s.getRange('B35').format.numberFormat = multiple;
  s.getRange('C17:D35').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A17:A35').format = { font: { bold: true }, borders: { preset: 'all', style: 'thin', color: colors.border } };

  section(s, 38, 'CFO recommendation memo', 'A', 'H');
  const prompts = [
    ['Recommendation', 'Choose the best full-size comparison, state whether the issue should be resized, and name the staged uses.'],
    ['Evidence', 'Cite bond price / proceeds, two ratios, the capacity amount, and one tie-out.'],
    ['Accounting rationale', 'Explain face debt versus carrying value and why interest expense lowers EBT and net income.'],
    ['Primary risk', 'Name the leverage, execution, or liquidity risk most likely to change the decision.'],
    ['Monitoring trigger', 'State a measurable threshold and the action management should take if breached.'],
  ];
  let row = 39;
  for (const [label, prompt] of prompts) {
    s.getRange(`A${row}:H${row}`).merge(); s.getRange(`A${row}`).values = [[`${label}: ${prompt}`]];
    s.getRange(`A${row}:H${row}`).format = { fill: colors.blueFill, font: { bold: true, color: colors.navy }, wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.border } };
    s.getRange(`A${row + 1}:H${row + 2}`).merge(); student(s.getRange(`A${row + 1}:H${row + 2}`), '@');
    s.getRange(`${row}:${row}`).format.rowHeight = 26; s.getRange(`${row + 1}:${row + 2}`).format.rowHeight = 28;
    row += 4;
  }
  setWidths(s, { 'A:A': 44, 'B:B': 22, 'C:C': 17, 'D:D': 50, 'E:E': 45, 'F:H': 14 });
  s.getRange('6:12').format.rowHeight = 30;
  s.getRange('16:35').format.rowHeight = 28;
}

function statusFormula(row) {
  return `=IF(OR(NOT(ISNUMBER(B${row})),NOT(ISNUMBER(C${row}))),"COMPLETE",IF(ABS(D${row})<=E${row},"OK","CHECK"))`;
}

function addChecks(workbook) {
  const s = workbook.worksheets.add('6 Checks');
  body(s, 'A1:G44');
  title(s, 'Meridian — Model Checks and Scenario Tie-Outs', 'G');
  s.getRange('A3').values = [['MODEL STATUS']];
  s.getRange('B3:D3').merge();
  s.getRange('B3').formulas = [['=IF(COUNTIF(F7:F39,"CHECK")>0,"FAIL",IF(COUNTIF(F7:F39,"COMPLETE")>0,"COMPLETE MODEL","PASS"))']];
  s.getRange('A3:D3').format = { fill: colors.check, font: { bold: true, size: 12 }, horizontalAlignment: 'center', borders: { preset: 'all', style: 'thin', color: colors.border } };
  section(s, 5, 'One assertion per row — do not proceed while a completed row says CHECK', 'A', 'G');
  s.getRange('A6:G39').values = [
    ['Check', 'Actual', 'Expected', 'Difference', 'Tolerance', 'Status', 'Where to fix / meaning'],
    ['Baseline balance sheet', null, null, null, 0.1, null, '1 Assumptions-Baseline · Total Assets vs L+E'],
    ['Baseline tax expense sign', null, null, null, 0.1, null, 'Tax expense must be positive'],
    ['Baseline net income', null, null, null, 0.1, null, 'EBT − tax expense'],
    ['Baseline EPS', null, null, null, 0.0001, null, 'Net income ÷ shares'],
    ['PV vs PRICE', null, 0, null, 0.01, null, '2 Bond Pricing · settlement is a coupon date'],
    ['Gross proceeds calculation', null, null, null, 0.1, null, 'Price × bonds ÷ 1,000'],
    ['Scenario A sources and uses', null, 0, null, 0.1, null, '3 Sources-Uses'],
    ['Scenario B sources and uses', null, 0, null, 0.1, null, '3 Sources-Uses'],
    ['Scenario C sources and uses', null, 0, null, 0.1, null, '3 Sources-Uses'],
    ['Scenario A net proceeds deployed', null, 0, null, 0.1, null, 'Refi + CapEx + cash retained'],
    ['Scenario B net proceeds deployed', null, 0, null, 0.1, null, 'Refi + CapEx + cash retained'],
    ['Scenario C net proceeds deployed', null, 0, null, 0.1, null, 'Refi + CapEx + cash retained'],
    ['Scenario A debt face/carrying bridge', null, 0, null, 0.1, null, 'Face − carrying − contra-debt'],
    ['Scenario B debt face/carrying bridge', null, 0, null, 0.1, null, 'Face − carrying − contra-debt'],
    ['Scenario C debt face/carrying bridge', null, 0, null, 0.1, null, 'Face − carrying − contra-debt'],
    ['Scenario A balance sheet', null, 0, null, 0.1, null, '4 Scenario Impact'],
    ['Scenario B balance sheet', null, 0, null, 0.1, null, '4 Scenario Impact'],
    ['Scenario C balance sheet', null, 0, null, 0.1, null, '4 Scenario Impact'],
    ['Scenario A ending ST debt', null, null, null, 0.1, null, 'Beginning ST − refinancing'],
    ['Scenario B ending ST debt', null, null, null, 0.1, null, 'Beginning ST − refinancing'],
    ['Scenario C ending ST debt', null, null, null, 0.1, null, 'Beginning ST − refinancing'],
    ['Scenario A total interest expense', null, null, null, 0.1, null, 'ST + existing LT + new bond'],
    ['Scenario B total interest expense', null, null, null, 0.1, null, 'ST + existing LT + new bond'],
    ['Scenario C total interest expense', null, null, null, 0.1, null, 'ST + existing LT + new bond'],
    ['Scenario A net income', null, null, null, 0.1, null, 'EBIT − interest − positive tax expense'],
    ['Scenario B net income', null, null, null, 0.1, null, 'EBIT − interest − positive tax expense'],
    ['Scenario C net income', null, null, null, 0.1, null, 'EBIT − interest − positive tax expense'],
    ['Scenario A closing equity unchanged', null, null, null, 0.1, null, 'No equity issuance; closing timing'],
    ['Scenario B closing equity unchanged', null, null, null, 0.1, null, 'No equity issuance; closing timing'],
    ['Scenario C closing equity unchanged', null, null, null, 0.1, null, 'No equity issuance; closing timing'],
    ['YIELD vs RATE from observed price', null, null, null, 0.000001, null, '2 Bond Pricing · independent reverse-yield methods'],
    ['Capacity sources and uses', null, 0, null, 0.1, null, '5 Capacity-Decision'],
    ['Capacity Debt / EBITDA', null, null, null, 0.0001, null, 'Must equal the binding 3.00x guardrail'],
  ];
  header(s.getRange('A6:G6'));
  const formulas = {
    7:['=IF(ISBLANK(\'1 Assumptions-Baseline\'!B31),"",\'1 Assumptions-Baseline\'!B31)','=IF(ISBLANK(\'1 Assumptions-Baseline\'!F34),"",\'1 Assumptions-Baseline\'!F34)'],
    8:["='1 Assumptions-Baseline'!B16",'=IF(\'1 Assumptions-Baseline\'!B14="","",MAX(\'1 Assumptions-Baseline\'!B14,0)*\'1 Assumptions-Baseline\'!B15)'],
    9:["='1 Assumptions-Baseline'!B17",'=IF(OR(\'1 Assumptions-Baseline\'!B14="",\'1 Assumptions-Baseline\'!B16=""),"",\'1 Assumptions-Baseline\'!B14-\'1 Assumptions-Baseline\'!B16)'],
    10:["='1 Assumptions-Baseline'!B19",'=IF(OR(\'1 Assumptions-Baseline\'!B17="",\'1 Assumptions-Baseline\'!B18=""),"",\'1 Assumptions-Baseline\'!B17/\'1 Assumptions-Baseline\'!B18)'],
    11:['=IF(ISBLANK(\'2 Bond Pricing\'!B24),"",\'2 Bond Pricing\'!B24)','=0'],
    12:["='2 Bond Pricing'!B25",'=IF(\'2 Bond Pricing\'!B22="","",\'2 Bond Pricing\'!B22*\'2 Bond Pricing\'!B8/1000)'],
    13:['=IF(ISBLANK(\'3 Sources-Uses\'!B14),"",\'3 Sources-Uses\'!B14)','=0'],14:['=IF(ISBLANK(\'3 Sources-Uses\'!C14),"",\'3 Sources-Uses\'!C14)','=0'],15:['=IF(ISBLANK(\'3 Sources-Uses\'!D14),"",\'3 Sources-Uses\'!D14)','=0'],
    16:['=IF(ISBLANK(\'3 Sources-Uses\'!B18),"",\'3 Sources-Uses\'!B18)','=0'],17:['=IF(ISBLANK(\'3 Sources-Uses\'!C18),"",\'3 Sources-Uses\'!C18)','=0'],18:['=IF(ISBLANK(\'3 Sources-Uses\'!D18),"",\'3 Sources-Uses\'!D18)','=0'],
    19:['=IF(ISBLANK(\'3 Sources-Uses\'!B30),"",\'3 Sources-Uses\'!B30)','=0'],20:['=IF(ISBLANK(\'3 Sources-Uses\'!C30),"",\'3 Sources-Uses\'!C30)','=0'],21:['=IF(ISBLANK(\'3 Sources-Uses\'!D30),"",\'3 Sources-Uses\'!D30)','=0'],
    22:['=IF(ISBLANK(\'4 Scenario Impact\'!C27),"",\'4 Scenario Impact\'!C27)','=0'],23:['=IF(ISBLANK(\'4 Scenario Impact\'!D27),"",\'4 Scenario Impact\'!D27)','=0'],24:['=IF(ISBLANK(\'4 Scenario Impact\'!E27),"",\'4 Scenario Impact\'!E27)','=0'],
    25:['=IF(ISBLANK(\'3 Sources-Uses\'!B24),"",\'3 Sources-Uses\'!B24)','=IF(OR(ISBLANK(\'3 Sources-Uses\'!B22),ISBLANK(\'3 Sources-Uses\'!B23)),"",\'3 Sources-Uses\'!B22-\'3 Sources-Uses\'!B23)'],
    26:['=IF(ISBLANK(\'3 Sources-Uses\'!C24),"",\'3 Sources-Uses\'!C24)','=IF(OR(ISBLANK(\'3 Sources-Uses\'!C22),ISBLANK(\'3 Sources-Uses\'!C23)),"",\'3 Sources-Uses\'!C22-\'3 Sources-Uses\'!C23)'],
    27:['=IF(ISBLANK(\'3 Sources-Uses\'!D24),"",\'3 Sources-Uses\'!D24)','=IF(OR(ISBLANK(\'3 Sources-Uses\'!D22),ISBLANK(\'3 Sources-Uses\'!D23)),"",\'3 Sources-Uses\'!D22-\'3 Sources-Uses\'!D23)'],
    28:["='4 Scenario Impact'!C38",'=IF(COUNT(\'4 Scenario Impact\'!C35:C37)<3,"",SUM(\'4 Scenario Impact\'!C35:C37))'],
    29:["='4 Scenario Impact'!D38",'=IF(COUNT(\'4 Scenario Impact\'!D35:D37)<3,"",SUM(\'4 Scenario Impact\'!D35:D37))'],
    30:["='4 Scenario Impact'!E38",'=IF(COUNT(\'4 Scenario Impact\'!E35:E37)<3,"",SUM(\'4 Scenario Impact\'!E35:E37))'],
    31:["='4 Scenario Impact'!C41",'=IF(OR(\'4 Scenario Impact\'!C39="",\'4 Scenario Impact\'!C40=""),"",\'4 Scenario Impact\'!C39-\'4 Scenario Impact\'!C40)'],
    32:["='4 Scenario Impact'!D41",'=IF(OR(\'4 Scenario Impact\'!D39="",\'4 Scenario Impact\'!D40=""),"",\'4 Scenario Impact\'!D39-\'4 Scenario Impact\'!D40)'],
    33:["='4 Scenario Impact'!E41",'=IF(OR(\'4 Scenario Impact\'!E39="",\'4 Scenario Impact\'!E40=""),"",\'4 Scenario Impact\'!E39-\'4 Scenario Impact\'!E40)'],
    34:['=IF(ISBLANK(\'4 Scenario Impact\'!C25),"",\'4 Scenario Impact\'!C25)','=IF(ISBLANK(\'4 Scenario Impact\'!B25),"",\'4 Scenario Impact\'!B25)'],35:['=IF(ISBLANK(\'4 Scenario Impact\'!D25),"",\'4 Scenario Impact\'!D25)','=IF(ISBLANK(\'4 Scenario Impact\'!B25),"",\'4 Scenario Impact\'!B25)'],36:['=IF(ISBLANK(\'4 Scenario Impact\'!E25),"",\'4 Scenario Impact\'!E25)','=IF(ISBLANK(\'4 Scenario Impact\'!B25),"",\'4 Scenario Impact\'!B25)'],
    37:['=IF(ISBLANK(\'2 Bond Pricing\'!B31),"",\'2 Bond Pricing\'!B31)','=IF(ISBLANK(\'2 Bond Pricing\'!B32),"",\'2 Bond Pricing\'!B32)'],
    38:['=IF(ISBLANK(\'5 Capacity-Decision\'!B34),"",\'5 Capacity-Decision\'!B34)','=0'],
    39:['=IF(ISBLANK(\'5 Capacity-Decision\'!B35),"",\'5 Capacity-Decision\'!B35)',"='1 Assumptions-Baseline'!F48"],
  };
  for (let row = 7; row <= 39; row += 1) {
    s.getRange(`B${row}:C${row}`).formulas = [[formulas[row][0], formulas[row][1]]];
    s.getRange(`D${row}`).formulas = [[`=IF(OR(NOT(ISNUMBER(B${row})),NOT(ISNUMBER(C${row}))),"",B${row}-C${row})`]];
    s.getRange(`F${row}`).formulas = [[statusFormula(row)]];
  }
  s.getRange('B7:D39').format.numberFormat = money2;
  s.getRange('E7:E39').format.numberFormat = money2;
  s.getRange('B37:E37').format.numberFormat = percent;
  s.getRange('B39:E39').format.numberFormat = multiple;
  s.getRange('B7:F39').format.borders = { preset: 'all', style: 'thin', color: colors.border };
  s.getRange('F7:F39').conditionalFormats.add('containsText', { text: 'OK', format: { fill: '#C6EFCE', font: { color: '#006100', bold: true } } });
  s.getRange('F7:F39').conditionalFormats.add('containsText', { text: 'CHECK', format: { fill: '#FFC7CE', font: { color: '#9C0006', bold: true } } });
  s.getRange('F7:F39').conditionalFormats.add('containsText', { text: 'COMPLETE', format: { fill: '#FFF2CC', font: { color: '#9C6500', bold: true } } });
  s.getRange('G7:G39').format = { wrapText: true, borders: { preset: 'all', style: 'thin', color: colors.border } };
  s.getRange('A41:G44').merge();
  s.getRange('A41').values = [['PASS means every required tie-out is complete within tolerance. It does not by itself prove the recommendation is economically sound; use the capacity analysis and explain the decision logic.']];
  note(s.getRange('A41:G44'), colors.warning);
  setWidths(s, { 'A:A': 38, 'B:D': 19, 'E:E': 14, 'F:F': 16, 'G:G': 45 });
  s.getRange('6:39').format.rowHeight = 27;
}

function addGuide(workbook) {
  const s = workbook.worksheets.add('BUS311 Guide');
  body(s, 'A1:F25');
  title(s, 'Bond Valuation, Interest Rates, and YTM', 'F');
  s.getRange('A3:F3').merge();
  s.getRange('A3').values = [['BUS311 · valuation-m02-l01 · display module M06 · FactSet required · student starter']];
  s.getRange('A3:F3').format = { fill: colors.terra, font: { bold: true, color: colors.white } };
  s.getRange('A5:B10').values = [
    ['Step', 'Required workflow'], [1, 'Read the lesson pre-reading and confirm FactSet access.'], [2, 'Enter or verify source values; keep units and periods consistent.'],
    [3, 'Document any live FactSet field, period, units, currency, and retrieval date below.'], [4, 'Complete calculations with visible, auditable Excel formulas.'], [5, 'Use the Checks sheet before stating a recommendation.'],
  ];
  header(s.getRange('A5:B5'));
  s.getRange('A6:B10').format.borders = { preset: 'all', style: 'thin', color: colors.border };
  s.getRange('A12:D17').values = [
    ['FactSet input', 'Field / definition', 'Period / units', 'Source note'], ['Company identifier', null, null, null], ['Market or price input', null, null, null],
    ['Financial statement input', null, null, null], ['Risk or discount-rate input', null, null, null], ['Comparison-company input', null, null, null],
  ];
  header(s.getRange('A12:D12')); student(s.getRange('B13:D17'), '@');
  s.getRange('A19:B23').values = [['Decision output', 'Response'], ['Recommendation', null], ['Evidence from the model', null], ['Primary risk or limitation', null], ['Monitoring trigger', null]];
  header(s.getRange('A19:B19')); student(s.getRange('B20:B23'), '@');
  setWidths(s, { 'A:A': 32, 'B:B': 55, 'C:C': 28, 'D:D': 42, 'E:F': 16 });
  s.getRange('6:10').format.rowHeight = 26;
  s.getRange('13:17').format.rowHeight = 28;
  s.getRange('20:23').format.rowHeight = 30;
}

export function buildM06StarterWorkbook() {
  const workbook = Workbook.create();
  addStart(workbook);
  addAssumptions(workbook);
  addBondPricing(workbook);
  addSourcesUses(workbook);
  addScenarioImpact(workbook);
  addCapacityDecision(workbook);
  addChecks(workbook);
  addGuide(workbook);
  return workbook;
}

export async function exportM06Starter() {
  const workbook = buildM06StarterWorkbook();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const blob = await SpreadsheetFile.exportXlsx(workbook);
  await blob.save(outputPath);
  await fs.mkdir(qaRoot, { recursive: true });
  for (const sheet of workbook.worksheets.items) {
    const safe = sheet.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
    const image = await workbook.render({ sheetName: sheet.name, autoCrop: 'all', scale: 1.15, format: 'png' });
    await fs.writeFile(path.join(qaRoot, `starter--${safe}.png`), new Uint8Array(await image.arrayBuffer()));
  }
  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) console.log(await exportM06Starter());
