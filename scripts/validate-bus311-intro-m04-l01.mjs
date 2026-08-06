import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ratioM04Deck } from './decks/bus311-intro-m04-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '01-INTRO', 'M04', 'bus311-intro-m04-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slides = [...html.matchAll(/<section id="slide-(\d+)" class="slide ([^"]+)" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slides.length === 22, 'Expected 22 slides; found ' + slides.length + '.');
expect(ratioM04Deck.slides.length === slides.length, 'Content module and generated slide counts differ.');
expect(ratioM04Deck.slides.every((item) => item.note && item.note.length >= 180), 'Every slide needs a substantive teaching note of at least 180 characters.');
expect(slides.every((match, index) => Number(match[1]) === index + 1), 'Slide IDs must be continuous.');

const covered = new Set();
slides.forEach((match) => (match[4].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
for(let source = 1; source <= 27; source += 1) expect(covered.has(source), 'Prior M04 slide ' + source + ' is not represented.');

const times = ratioM04Deck.slides.map((item, index) => {
  const match = item.note.match(/Time:\s*(\d+)\s+minute/);
  expect(Boolean(match), 'Slide ' + (index + 1) + ' note lacks a time allocation.');
  return match ? Number(match[1]) : 0;
});
expect(times.reduce((sum, value) => sum + value, 0) === 75, 'Speaker-note time allocations must total 75 minutes.');

expect(html.includes('<title>BUS311 · M04 · Ratio Analysis and Corporate Performance</title>'), 'Browser title is not the required M04 title.');
expect(html.includes('BUS311 · Intro M04'), 'Slide-one M04 identifier is missing.');
expect(!/FOUNDATIONS M02|M02 · L02|Original BUS311 course artwork|original artwork/i.test(html), 'Obsolete M02 or original-artwork labeling remains.');
expect(!/Bill Ackman|lemonade/i.test(html), 'The class-exercise source must not be named or referenced in the HTML.');

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker-notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow(') && !html.includes('::slotted'), 'Shadow DOM is prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(html.includes('interactiveTarget'), 'Runtime must preserve native keyboard behavior in form controls.');
expect(html.includes('offsetX=(window.innerWidth-W*scale)/2'), 'Runtime must use pixel-offset centering.');
expect(html.includes("location.hash.match(/^#slide-(\\d+)$/)"), 'Runtime must support direct slide hashes.');

const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
expect(fontSizes.every((value) => value >= 24), 'Found a font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');
expect(html.includes('--navy:#0A2540') && html.includes('--steel:#2D7DD2') && html.includes('--teal:#1B998B') && html.includes('--gold:#E6A817') && html.includes('--terra:#9C4A2B'), 'Current BUS311 color tokens are incomplete.');
expect(html.includes("--font-body:'Geist'") && html.includes("--font-mono:'JetBrains Mono'") && html.includes("--font-display:'Instrument Serif'"), 'Required BUS311 type roles are incomplete.');

const projected = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/data-label="[^"]*"/g, '').replace(/data-source-slides="[^"]*"/g, '');
expect(!/<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i.test(projected), 'Found an ornamental numeric label in projected content.');
expect(!/>\s*Part\s+\d+\s+of\s+\d+/i.test(projected), 'Found an ornamental part label in projected content.');
expect((html.match(/role="img"/g) || []).length >= 14, 'Expected at least 14 accessible editable diagrams.');
expect((html.match(/data-interactive=/g) || []).length >= 4, 'Expected at least four interactive or response systems.');
expect((html.match(/Required deliverable|Deliverable|deliverable/g) || []).length >= 6, 'Activity and close slides need visible deliverables.');

const required = [
  '=B4/AVERAGE(B5:B6)', '2.00×', '60.0%', '1.50×', '50.0%', '40.0%',
  '10% × 1.5 × 2.67', 'Figma', 'CoreWeave', 'Reddit', '$1.056B', '−122%',
  '$5.131B', '$66.8B', '−23%', '$1.229B', '69%', '$2.2B', '$530M',
  'data-interactive="denominator"', 'data-interactive="conflict"', 'data-interactive="dupont"', 'data-interactive="exit"',
  'Source: Figma FY2025 results', 'Source: CoreWeave FY2025 results', 'Source: Reddit FY2025 results'
];
required.forEach((value) => expect(html.includes(value), 'Missing required M04 content: ' + value));

expect(await fs.stat(path.join(root, 'assets', 'lesson-media', 'heroes', 'foundations.webp')).then(() => true).catch(() => false), 'Approved hero image is missing.');

const currentRatio = 36000 / 18000;
const grossMargin = (120000 - 48000) / 120000;
const assetTurnover = 120000 / 80000;
const debtRatio = 44000 / 88000;
const roe = 12000 / ((28000 + 32000) / 2);
const dupont = (12000 / 120000) * (120000 / 80000) * (80000 / 30000);
expect(currentRatio === 2, 'Current-ratio calculation failed.');
expect(Math.abs(grossMargin - 0.60) < 1e-12, 'Gross-margin calculation failed.');
expect(Math.abs(assetTurnover - 1.50) < 1e-12, 'Asset-turnover calculation failed.');
expect(Math.abs(debtRatio - 0.50) < 1e-12, 'Debt-ratio calculation failed.');
expect(Math.abs(roe - 0.40) < 1e-12, 'ROE calculation failed.');
expect(Math.abs(dupont - roe) < 1e-12, 'DuPont decomposition does not reconcile to direct ROE.');

const provenancePatterns = [/source[- ]slide/i,/original (?:deck|powerpoint|pptx)/i,/carried over|carryover/i,/rebuild decision|production note/i];
ratioM04Deck.slides.forEach((item, index) => provenancePatterns.forEach((pattern) => {
  expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' note contains production provenance.');
}));

if(errors.length){
  console.error('BUS311 M04 ratio-analysis deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M04 ratio-analysis deck validation: PASS (22 slides, 75 minutes, 22 substantive notes, prior slides 1-27 represented, current IPO/AI evidence, four response systems, accessible editable visuals, and independently verified ratio/DuPont calculations).');
