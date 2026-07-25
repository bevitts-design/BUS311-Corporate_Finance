import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { riskReturnM12Deck } from './decks/bus311-decisions-m01-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '03-FIRM-DECISIONS', 'M12', 'bus311-decisions-m01-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 32, 'Expected 32 slides; found ' + slideMatches.length + '.');
expect(riskReturnM12Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(riskReturnM12Deck.slides.every((item) => item.note && item.note.length >= 120), 'Every slide needs a substantive speaker note.');

const covered = new Set();
slideMatches.forEach((match) => (match[3].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
for(let source = 1; source <= 22; source += 1){
  expect(covered.has(source), 'Source slide ' + source + ' is not represented.');
}

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing maintained deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(!html.includes('assets/media/'), 'Extracted source media must not appear in the public deck.');
expect(!html.includes('OneDrive-Personal'), 'Local OneDrive paths must not appear in the generated deck.');

const fontSizes = [
  ...[...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1])),
  ...[...html.matchAll(/--type-[^:]+:(\d+)px/g)].map((match) => Number(match[1]))
];
expect(fontSizes.length >= 10, 'Expected explicit typography declarations.');
expect(fontSizes.every((value) => value >= 24), 'Found font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');

const h2Values = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((match) => match[1].trim());
expect(h2Values.every((value) => !/[.]$/.test(value)), 'An h2 slide header ends with a terminal period.');
const visibleOrnamentalLabels = [
  /<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i,
  />\s*Part\s+\d+\s+of\s+\d+(?:\s*·[^<]*)?</i
];
visibleOrnamentalLabels.forEach((pattern) => expect(!pattern.test(html), 'Found an ornamental numeric label in projected slide content.'));

const provenanceNotePatterns = [
  /source[- ]slide/i,
  /source deck/i,
  /original (?:slide|deck|powerpoint|pptx)/i,
  /(?:powerpoint|pptx) provenance/i,
  /carried over|carryover/i,
  /derived from|rebuilt from|adapted from/i
];
riskReturnM12Deck.slides.forEach((item, index) => {
  provenanceNotePatterns.forEach((pattern) => {
    expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' speaker note contains original-deck provenance or production commentary.');
  });
});

const requiredStrings = [
  '=SLOPE(B3:B8,C3:C8)',
  '=B4+B6*(B5-B4)',
  '=$B$4+A11*($B$5-$B$4)',
  '11.5%',
  '8.8%',
  '13.0%',
  '14.8 percent',
  'β = Cov(asset return, market return) ÷ Var(market return)',
  'Security Market Line',
  'Boeing',
  'Duke Energy',
  'data-interactive=\'risk-sort\'',
  'data-interactive=\'sml-choice\'',
  'data-interactive=\'project-beta\'',
  'data-interactive=\'exit\'',
  'role=\'img\'',
  'Press N for notes · F for fullscreen'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect((html.match(/role='img'/g) || []).length >= 13, 'Expected at least 13 accessible editable diagrams.');
expect(!/<img\b/i.test(html), 'This rebuild should not depend on raster images or unverified logos.');

const activitySlides = riskReturnM12Deck.slides.filter((item) => item.classes.includes('activity-slide') || item.classes.includes('activity-launch-slide'));
expect(activitySlides.length === 5, 'Expected five explicit activity slides.');
activitySlides.forEach((item, index) => {
  expect(/minute/i.test(item.body), 'Activity ' + (index + 1) + ' is missing visible timing.');
  expect(/deliverable/i.test(item.body), 'Activity ' + (index + 1) + ' is missing a visible deliverable.');
  expect(/answer|correct|expected/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing the formative answer.');
  expect(/misconception/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing likely misconceptions.');
  expect(/debrief/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing a debrief question.');
});

const marketReturns = [-8, -4, 0, 4, 8, 10];
const boeingReturns = [-11, -5, 1, 7, 13, 16];
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const marketMean = mean(marketReturns);
const boeingMean = mean(boeingReturns);
const covariance = marketReturns.reduce((sum, value, index) => sum + (value - marketMean) * (boeingReturns[index] - boeingMean), 0);
const variance = marketReturns.reduce((sum, value) => sum + Math.pow(value - marketMean, 2), 0);
expect(Math.abs(covariance / variance - 1.5) < 1e-12, 'SLOPE beta calculation failed.');

const capm = (beta) => 0.04 + beta * (0.10 - 0.04);
expect(Math.abs(capm(1.25) - 0.115) < 1e-12, 'Base CAPM calculation failed.');
expect(Math.abs(capm(0.8) - 0.088) < 1e-12, 'Project-beta CAPM calculation failed.');
expect(Math.abs(capm(1.0) - 0.10) < 1e-12, 'Market-beta CAPM calculation failed.');
expect(Math.abs(capm(1.5) - 0.13) < 1e-12, 'Company-beta CAPM calculation failed.');
expect(Math.abs(capm(1.8) - 0.148) < 1e-12, 'High-beta CAPM calculation failed.');
expect(0.11 > capm(0.8) && 0.11 < capm(1.5), 'Project decision should flip between project and company beta hurdles.');
expect(Math.abs((0.5 * 1.2 + 0.5 * 0.6) - 0.9) < 1e-12, 'Portfolio beta calculation failed.');

if(errors.length){
  console.error('BUS311 M12 risk-return deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M12 risk-return deck validation: PASS (32 slides, 32 teaching notes, all 22 source slides represented, 5 explicit activities, 13+ accessible editable diagrams, no ornamental numeric labels or note provenance, SLOPE/CAPM/portfolio/project calculations verified).');
