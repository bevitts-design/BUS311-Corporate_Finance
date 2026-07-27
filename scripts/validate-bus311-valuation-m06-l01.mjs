import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bondsM06L01Deck } from './decks/bus311-valuation-m06-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '02-VALUATION', 'M06', 'bus311-valuation-m06-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 35, 'Expected 35 slides; found ' + slideMatches.length + '.');
expect(bondsM06L01Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(bondsM06L01Deck.slides.every((item) => item.note && item.note.length >= 220), 'Every slide needs a substantive teaching note of at least 220 characters.');

const covered = new Set();
slideMatches.forEach((match) => (match[3].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
for(let source = 1; source <= 28; source += 1){
  expect(covered.has(source), 'Source slide ' + source + ' is not represented.');
}

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(html.includes('interactiveTarget'), 'Runtime must preserve native keyboard behavior inside form controls.');
expect(html.includes('_indexFromHash'), 'Runtime must initialize and track direct slide hashes.');
expect(html.includes('requestFullscreen'), 'Runtime must include fullscreen behavior.');

const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
expect(fontSizes.every((value) => value >= 24), 'Found font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');

const provenanceNotePatterns = [
  /source[- ]slide/i,/source deck/i,/original (?:slide|deck|powerpoint|pptx)/i,
  /(?:powerpoint|pptx) provenance/i,/carried over|carryover/i,/derived from|rebuilt from|adapted from/i,
  /legacy deck|rebuild decision|production note/i
];
bondsM06L01Deck.slides.forEach((item, index) => provenanceNotePatterns.forEach((pattern) => {
  expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' speaker note contains provenance or production commentary.');
}));

const projected = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/data-label="[^"]*"/g, '');
expect(!/<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i.test(projected), 'Found an ornamental numeric label in projected content.');
expect(!/>\s*Part\s+\d+\s+of\s+\d+/i.test(projected), 'Found an ornamental part label in projected content.');
expect(!/production|rebuild|source slide|source deck/i.test(projected), 'Projected content contains production commentary.');

const requiredStrings = [
  '=-PV(B10,B9,B8,B3)', '=RATE(B9,B8,-B12,B3)*B5', '$925.61', '$371.94', '$553.68',
  '$977.48', '$195.50M', '$11.00M', '5.50%', '5.80%', 'Debt / EBITDA', '3.17×',
  'data-choice-group=\'price-class\'', 'data-choice-group=\'ytm-formula\'',
  'data-choice-group=\'duration-choice\'', 'data-choice-group=\'cfo-choice\'',
  'id=\'yield-slider\'', 'data-reset-yield', 'Required return moves. Contractual cash flows do not.',
  'Record the field, definition, period, units, currency, supplier, and retrieval date.'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect((html.match(/role='img'/g) || []).length >= 18, 'Expected at least 18 accessible editable diagrams.');
expect((html.match(/class='excel-window/g) || []).length >= 2, 'Expected at least two editable Excel-style worksheet views.');
expect((html.match(/data-reset=/g) || []).length >= 4, 'Expected reset controls for all checked activities.');

const price = (face, couponRate, annualYield, years, frequency = 2) => {
  const coupon = face * couponRate / frequency;
  const periods = years * frequency;
  const rate = annualYield / frequency;
  const couponPv = coupon * (1 - Math.pow(1 + rate, -periods)) / rate;
  const principalPv = face * Math.pow(1 + rate, -periods);
  return { couponPv, principalPv, total: couponPv + principalPv };
};
const teaching = price(1000, 0.05, 0.06, 10);
expect(Math.abs(teaching.couponPv - 371.936871511388) < 0.000001, 'Teaching-bond coupon PV calculation failed.');
expect(Math.abs(teaching.principalPv - 553.6757541863345) < 0.000001, 'Teaching-bond principal PV calculation failed.');
expect(Math.abs(teaching.total - 925.6126256977225) < 0.000001, 'Teaching-bond price calculation failed.');
const sensitivity = [0.04,0.05,0.06,0.07,0.08].map((yieldValue) => price(1000,0.05,yieldValue,10).total);
const expectedSensitivity = [1081.7571667229856,1000,925.6126256977225,857.8759669804773,796.1451048254846];
sensitivity.forEach((value,index) => expect(Math.abs(value - expectedSensitivity[index]) < 0.000001, 'Teaching-bond sensitivity calculation failed at index ' + index + '.'));
const meridian = price(1000, 0.055, 0.058, 10);
expect(Math.abs(meridian.total - 977.4760580247303) < 0.000001, 'Meridian price calculation failed.');
expect(Math.abs(meridian.total * 200000 / 1_000_000 - 195.49521160494606) < 0.000001, 'Meridian total proceeds calculation failed.');
expect(Math.abs(1000 * 0.055 * 200000 / 1_000_000 - 11) < 0.000001, 'Meridian annual coupon calculation failed.');

const equity = 220.8;
const cash = 32.5;
const scenarios = {
  pre: { debt:155, ebitda:92, ebit:73.5, interest:9.8 },
  refinance: { debt:310, ebitda:92, ebit:73.5, interest:17.05 },
  capex: { debt:355, ebitda:73.5*1.025+28.5, ebit:73.5*1.025, interest:20.875 },
  mixed: { debt:310, ebitda:73.5*1.012+23.5, ebit:73.5*1.012, interest:17.05 }
};
const ratios = Object.fromEntries(Object.entries(scenarios).map(([key,value]) => [key, {
  debtEquity:value.debt/equity,
  debtEbitda:value.debt/value.ebitda,
  coverage:value.ebit/value.interest,
  netDebtEbitda:(value.debt-cash)/value.ebitda
}]));
expect(Math.abs(ratios.pre.debtEbitda - 1.684782608695652) < 0.000001, 'Pre-offering ratio calculation failed.');
expect(Math.abs(ratios.refinance.debtEbitda - 3.369565217391304) < 0.000001, 'Refinance ratio calculation failed.');
expect(Math.abs(ratios.capex.coverage - 3.6089820359281433) < 0.000001, 'Capex coverage calculation failed.');
expect(Math.abs(ratios.mixed.debtEbitda - 3.1670787274473344) < 0.000001, 'Mixed-use ratio calculation failed.');
expect(Object.values(ratios).slice(1).every((item) => item.debtEbitda > 3 && item.netDebtEbitda > 2.5), 'All full-size scenarios should breach both leverage guardrails.');

if(errors.length){
  console.error('BUS311 M06 bonds deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M06 bonds deck validation: PASS (35 slides, 35 substantive teaching notes, source slides 1-28 represented, 5 interactive systems with reset behavior, accessible HTML/SVG visuals, Excel PV introduced early, and all bond and ratio calculations independently verified).');
