import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { npvM08L01Deck } from './decks/bus311-valuation-m04-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '02-VALUATION', 'M08', 'bus311-valuation-m04-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];

const expect = (condition, message) => {
  if(!condition) errors.push(message);
};

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 30, 'Expected 30 slides; found ' + slideMatches.length + '.');
expect(npvM08L01Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(npvM08L01Deck.slides.every((item) => item.note && item.note.length >= 40), 'Every slide needs a substantive speaker note.');

const covered = new Set();
for(const match of slideMatches){
  const numbers = match[3].match(/\d+/g) || [];
  numbers.forEach((value) => covered.add(Number(value)));
}
for(let source = 9; source <= 26; source += 1){
  expect(covered.has(source), 'Source slide ' + source + ' is not represented.');
}
for(let source = 1; source <= 8; source += 1){
  expect(!covered.has(source), 'Unrelated carryover source slide ' + source + ' should not be presented.');
}

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing maintained deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(!html.includes('assets/media/'), 'Extracted source media must not appear in the public deck.');

const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
expect(fontSizes.every((value) => value >= 24), 'Found font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');

const visibleOrnamentalLabels = [
  /<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i,
  />\s*Part\s+\d+\s+of\s+\d+(?:\s*·[^<]*)?</i
];
visibleOrnamentalLabels.forEach((pattern) => {
  expect(!pattern.test(html), 'Found an ornamental numeric label in projected slide content.');
});

const provenanceNotePatterns = [
  /source[- ]slide/i,
  /source deck/i,
  /original (?:slide|deck|powerpoint|pptx)/i,
  /(?:powerpoint|pptx) provenance/i,
  /carried over|carryover/i,
  /derived from|rebuilt from|adapted from/i
];
npvM08L01Deck.slides.forEach((item, index) => {
  provenanceNotePatterns.forEach((pattern) => {
    expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' speaker note contains original-deck provenance or production commentary.');
  });
});

const requiredStrings = [
  '=NPV(B3,C6:G6)+B6',
  '=IRR(B6:G6)',
  '+$0.93M',
  '≈ 17.7%',
  "data-interactive='cashflow'",
  "data-interactive='rate'",
  "data-interactive='allocator'",
  "data-interactive='exit'",
  'role=\'img\'',
  'Harborside Medical Center',
  'VeridianEnergy'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect(html.includes("class='excel-sheet'"), 'Missing the editable mock Excel worksheet on slide 13.');
expect(html.includes('Harborside_NPV.xlsx'), 'Missing the mock Excel workbook title.');
expect(html.includes("class='selected-cell'>+$0.93"), 'Missing the selected Excel NPV result cell.');
expect(!html.includes('−3.60 + 0.95/1.09'), 'The removed manual NPV calculation is still present.');
expect(html.includes("class='excel-sheet irr-sheet'"), 'Missing the editable IRR worksheet on slide 17.');
expect(html.includes("class='selected-cell'>≈17.7%"), 'Missing the selected Excel IRR result cell.');
expect(html.includes('Exceeds the 9% required return'), 'Missing the IRR-to-hurdle comparison.');
expect(!html.includes("class='irr-bridge'"), 'The replaced IRR bridge graphic is still present.');
expect(html.includes("class='scale-challenge'"), 'Missing the mutually exclusive project setup slide.');
expect(html.includes('Which project should Harborside choose?'), 'Missing the student decision question before the scale-conflict reveal.');
expect(html.includes('Partner challenge · 3 minutes'), 'Missing the partner-work instruction on the setup slide.');
expect(html.includes('Reveal: a higher IRR can create less shareholder value'), 'Missing the scale-conflict answer reveal.');

const imagePaths = [...html.matchAll(/(?:src)=['"]([^'"]+\.(?:png|jpe?g|webp|svg))['"]/gi)].map((match) => match[1]);
expect(imagePaths.length === 5, 'Expected two presentation images and three company logo assets; found ' + imagePaths.length + '.');
['assets/logos/disney.svg', 'assets/logos/microsoft.svg', 'assets/logos/walmart.svg'].forEach((logoPath) => {
  expect(imagePaths.includes(logoPath), 'Missing company logo asset reference: ' + logoPath);
});
for(const imagePath of imagePaths){
  const absolute = path.join(path.dirname(deckPath), imagePath);
  try{
    await fs.access(absolute);
  }catch{
    errors.push('Missing local image: ' + imagePath);
  }
}

const cashFlows = [0.95, 1.05, 1.15, 1.20, 1.60];
const rate = 0.09;
const npv = -3.6 + cashFlows.reduce((sum, value, index) => sum + value / Math.pow(1 + rate, index + 1), 0);
expect(Math.abs(npv - 0.933335) < 0.00001, 'Harborside NPV math check failed.');

let low = -0.5;
let high = 1.0;
for(let index = 0; index < 200; index += 1){
  const guess = (low + high) / 2;
  const value = -3.6 + cashFlows.reduce((sum, cashFlow, period) => sum + cashFlow / Math.pow(1 + guess, period + 1), 0);
  if(value > 0) low = guess;
  else high = guess;
}
const irr = (low + high) / 2;
expect(Math.abs(irr - 0.177448) < 0.00001, 'Harborside IRR math check failed.');

if(errors.length){
  console.error('BUS311 NPV deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 NPV deck validation: PASS (30 slides, 30 teaching notes, setup-before-reveal scale challenge, no ornamental numeric labels or original-deck note provenance, source slides 9-26 represented, 2 local images, 3 local company logos, interactive controls present).');
