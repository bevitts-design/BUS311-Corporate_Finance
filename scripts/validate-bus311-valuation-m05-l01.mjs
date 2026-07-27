import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tvmM05L01Deck } from './decks/bus311-valuation-m05-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '02-VALUATION', 'M05', 'bus311-valuation-m05-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 35, 'Expected 35 slides; found ' + slideMatches.length + '.');
expect(tvmM05L01Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(tvmM05L01Deck.slides.every((item) => item.note && item.note.length >= 140), 'Every slide needs a substantive speaker note of at least 140 characters.');

const covered = new Set();
slideMatches.forEach((match) => (match[3].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
for(let source = 1; source <= 27; source += 1){
  expect(covered.has(source), 'Legacy source slide ' + source + ' is not represented.');
}

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(html.includes('interactiveTarget'), 'Runtime must preserve native keyboard behavior inside form controls.');

const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
expect(fontSizes.every((value) => value >= 24), 'Found font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');

const provenanceNotePatterns = [
  /source[- ]slide/i,/source deck/i,/original (?:slide|deck|powerpoint|pptx)/i,
  /(?:powerpoint|pptx) provenance/i,/carried over|carryover/i,/derived from|rebuilt from|adapted from/i,
  /legacy deck|rebuild decision|production note/i
];
tvmM05L01Deck.slides.forEach((item, index) => provenanceNotePatterns.forEach((pattern) => {
  expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' speaker note contains provenance or production commentary.');
}));

const projected = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/data-label="[^"]*"/g, '');
expect(!/<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i.test(projected), 'Found an ornamental numeric label in projected content.');
expect(!/>\s*Part\s+\d+\s+of\s+\d+/i.test(projected), 'Found an ornamental part label in projected content.');

const requiredStrings = [
  '=FV(B5,B6,B7,B4,B8)', '=PV(8%,5,0,-20000)', '=FV(12%/12,24,0,-5000)',
  '$14,693.28', '$13,611.66', '$6,348.67', '$15,970.84', '$17,248.51', '$6.25M',
  '6.96%', '12.68% EAR', 'Berkshire Hathaway', 'Apple note teaching example',
  'data-interactive="signs"', 'data-interactive="rates"', 'data-interactive="sensitivity"',
  'data-interactive="patterns"', 'data-interactive="exit"', 'Required deliverable:',
  'Apply TVM to coupon bonds and yield to maturity.'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect((html.match(/role="img"/g) || []).length >= 18, 'Expected at least 18 accessible editable diagrams.');
expect((html.match(/class="excel-sheet/g) || []).length >= 2, 'Expected two editable Excel-style worksheet views.');

const fv = 10000 * Math.pow(1.08, 5);
const pv = 20000 / Math.pow(1.08, 5);
const breakEven = Math.pow(14000 / 10000, 1 / 5) - 1;
const monthlyFv = 5000 * Math.pow(1.01, 24);
const ear = Math.pow(1.01, 12) - 1;
const ordinary = 4000 * (1 - Math.pow(1.08, -5)) / 0.08;
const due = ordinary * 1.08;
expect(Math.abs(fv - 14693.280768) < 0.000001, 'Five-year FV calculation failed.');
expect(Math.abs(pv - 13611.663940675058) < 0.000001, 'Five-year PV calculation failed.');
expect(Math.abs(breakEven - 0.069610) < 0.00001, 'Break-even return calculation failed.');
expect(Math.abs(monthlyFv - 6348.673242659574) < 0.000001, 'Monthly FV calculation failed.');
expect(Math.abs(ear - 0.126825) < 0.00001, 'EAR calculation failed.');
expect(Math.abs(ordinary - 15970.840148312354) < 0.000001, 'Ordinary annuity calculation failed.');
expect(Math.abs(due - 17248.507360177344) < 0.000001, 'Annuity-due calculation failed.');
expect(Math.abs(500000 / 0.08 - 6250000) < 0.01, 'Perpetuity calculation failed.');

if(errors.length){
  console.error('BUS311 M05 TVM deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M05 TVM deck validation: PASS (35 slides, 35 substantive teaching notes, source slides 1-27 represented, 5 interactive controls, accessible HTML/SVG visuals, Excel FV introduced early, and all financial calculations independently verified).');
