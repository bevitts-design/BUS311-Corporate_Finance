import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waccM13Deck } from './decks/bus311-decisions-m02-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '03-FIRM-DECISIONS', 'M13', 'bus311-decisions-m13-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 37, 'Expected 37 slides; found ' + slideMatches.length + '.');
expect(waccM13Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(waccM13Deck.slides.every((item) => item.note && item.note.length >= 120), 'Every slide needs a substantive speaker note.');

const covered = new Set();
slideMatches.forEach((match) => (match[3].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
[1, ...Array.from({length:23}, (_, index) => index + 4)].forEach((source) => {
  expect(covered.has(source), 'Source slide ' + source + ' is not represented.');
});
expect(!covered.has(2), 'Private roster source slide 2 must not be represented.');
expect(!covered.has(3), 'Unverified QR-code source slide 3 must not be represented.');

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing maintained deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(!html.includes('assets/media/'), 'Extracted PowerPoint media must not appear in the public deck.');
expect(!html.includes('OneDrive-Personal'), 'Local OneDrive paths must not appear in the generated deck.');
expect(!html.includes('Howard, Cody') && !html.includes('Watson, Oliver'), 'Private roster names entered the public deck.');

const fontSizes = [
  ...[...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1])),
  ...[...html.matchAll(/--type-[^:]+:(\d+)px/g)].map((match) => Number(match[1]))
];
expect(fontSizes.length >= 10, 'Expected explicit typography declarations.');
expect(fontSizes.every((value) => value >= 24), 'Found font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');

const h2Values = [...html.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) => match[1].replace(/<[^>]+>/g, '').trim());
expect(h2Values.every((value) => !/[.]$/.test(value)), 'An h2 slide header ends with a terminal period.');
[
  /<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i,
  />\s*Part\s+\d+\s+of\s+\d+(?:\s*·[^<]*)?</i
].forEach((pattern) => expect(!pattern.test(html), 'Found an ornamental numeric label in projected slide content.'));

const provenancePatterns = [
  /source[- ]slide/i,
  /source deck/i,
  /original (?:slide|deck|powerpoint|pptx)/i,
  /(?:powerpoint|pptx) provenance/i,
  /carried over|carryover/i,
  /derived from|rebuilt from|adapted from/i
];
waccM13Deck.slides.forEach((item, index) => {
  provenancePatterns.forEach((pattern) => {
    expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' note contains source provenance or production commentary.');
  });
});

const requiredStrings = [
  '=SUMPRODUCT(C5:C6,D5:D6,E5:E6)',
  '=RATE(B13,B14,-B15,B16)*B17',
  '=B7+B6*B8',
  '8.655%',
  '8.66%',
  '=NPV($B$3,C8:F8)+F10/(1+$B$3)^4',
  '$1,428.27M',
  '$1,242.69M',
  '$20.85',
  'Target_WACC.xlsx',
  'Target_DCF.xlsx',
  'data-interactive="project-fit"',
  'data-interactive="dcf"',
  'data-interactive="audit"',
  'data-interactive="exit"',
  'Press N for notes · F for fullscreen'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect((html.match(/role="img"/g) || []).length >= 16, 'Expected at least 16 accessible editable diagrams.');
expect(!/<img\b/i.test(html), 'This rebuild should not depend on raster images or unverified logos.');

const activitySlides = waccM13Deck.slides.filter((item) => item.classes.includes('activity-slide'));
expect(activitySlides.length === 9, 'Expected nine explicit activity slides.');
activitySlides.forEach((item, index) => {
  expect(/minute/i.test(item.body), 'Activity ' + (index + 1) + ' is missing visible timing.');
  expect(/deliverable/i.test(item.body), 'Activity ' + (index + 1) + ' is missing a visible deliverable.');
  expect(/answer|correct|expected|base case/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing the formative answer.');
  expect(/misconception/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing likely misconceptions.');
  expect(/debrief/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing a debrief question.');
});

const costEquity = 0.04 + 1.30 * 0.05;
const afterTaxDebt = 0.058 * (1 - 0.25);
const wacc = 0.70 * costEquity + 0.30 * afterTaxDebt;
expect(Math.abs(costEquity - 0.105) < 1e-12, 'CAPM cost-of-equity calculation failed.');
expect(Math.abs(afterTaxDebt - 0.0435) < 1e-12, 'After-tax debt calculation failed.');
expect(Math.abs(wacc - 0.08655) < 1e-12, 'WACC calculation failed.');
expect(Math.abs(90000 * (1 - 0.21) - 71100) < 1e-9, 'Debt tax-shield dollar calculation failed.');

const cashFlows = [55.4, 70.3, 80.2, 83.2];
const enterpriseValue = (rate, growth) => {
  const forecast = cashFlows.reduce((sum, value, index) => sum + value / Math.pow(1 + rate, index + 1), 0);
  const horizon = cashFlows.at(-1) * (1 + growth) / (rate - growth);
  return forecast + horizon / Math.pow(1 + rate, cashFlows.length);
};
const forecastPv = cashFlows.reduce((sum, value, index) => sum + value / Math.pow(1.09, index + 1), 0);
const horizon = cashFlows.at(-1) * 1.03 / (0.09 - 0.03);
const horizonPv = horizon / Math.pow(1.09, 4);
const baseValue = enterpriseValue(0.09, 0.03);
expect(Math.abs(horizon - 1428.266666666667) < 1e-9, 'Horizon-value calculation failed.');
expect(Math.abs(forecastPv - 230.86588426155532) < 1e-9, 'Forecast-FCF present value failed.');
expect(Math.abs(horizonPv - 1011.8201147907179) < 1e-9, 'Horizon-value present value failed.');
expect(Math.abs(baseValue - 1242.6859990522732) < 1e-9, 'Enterprise-value calculation failed.');
expect(Math.abs((baseValue - 200) / 50 - 20.853719981045464) < 1e-9, 'Equity-value-per-share calculation failed.');
expect(Math.abs(horizonPv / baseValue - 0.814220258023649) < 0.000001, 'Horizon-value share calculation failed.');
expect(Math.abs(enterpriseValue(0.10, 0.02) - 950.0856498873026) < 1e-9, 'Low sensitivity endpoint failed.');
expect(Math.abs(enterpriseValue(0.08, 0.04) - 1826.403622415282) < 1e-9, 'High sensitivity endpoint failed.');

if(errors.length){
  console.error('BUS311 M13 WACC deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M13 WACC deck validation: PASS (37 slides, 37 teaching notes, source slides 1 and 4-26 represented, private roster and QR slides excluded, 9 explicit activities, 16+ accessible editable diagrams, no ornamental numeric labels or note provenance, WACC/tax-shield/DCF/sensitivity calculations verified).');
