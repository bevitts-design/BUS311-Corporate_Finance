import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { financingM14Deck } from './decks/bus311-decisions-m03-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '03-FIRM-DECISIONS', 'M14', 'bus311-decisions-m14-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 31, 'Expected 31 slides; found ' + slideMatches.length + '.');
expect(financingM14Deck.slides.length === slideMatches.length, 'Content module and generated slide counts differ.');
expect(financingM14Deck.slides.every((item) => item.note && item.note.length >= 150), 'Every slide needs a substantive speaker note.');
const lessonMinutes = financingM14Deck.slides.reduce((total, item) => {
  const minutes = item.note.match(/Time:\s*([0-9.]+)\s*minutes?/i);
  const seconds = item.note.match(/Time:\s*([0-9.]+)\s*seconds?/i);
  return total + (minutes ? Number(minutes[1]) : 0) + (seconds ? Number(seconds[1]) / 60 : 0);
}, 0);
expect(Math.abs(lessonMinutes - 75) < 1e-12, 'Expected a 75-minute lesson; found ' + lessonMinutes + ' minutes.');

const covered = new Set();
slideMatches.forEach((match) => (match[3].match(/\d+/g) || []).forEach((value) => covered.add(Number(value))));
Array.from({length:20}, (_, index) => index + 1).forEach((source) => {
  expect(covered.has(source), 'Source slide ' + source + ' is not represented.');
});

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing maintained deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!html.includes('::slotted'), 'Shadow DOM selectors are prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(!html.includes('assets/media/'), 'Extracted PowerPoint media must not appear in the public deck.');
expect(!html.includes('OneDrive-Personal'), 'Local OneDrive paths must not appear in the generated deck.');
expect(!html.includes('FactSet Reported Share Analysis'), 'Proprietary FactSet screen content must not appear in the public deck.');
expect(!/<img\b/i.test(html), 'This rebuild should not depend on raster images or unverified logos.');

const fontSizes = [
  ...[...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1])),
  ...[...html.matchAll(/--type-[a-z-]+:\s*(\d+)px/g)].map((match) => Number(match[1]))
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
financingM14Deck.slides.forEach((item, index) => {
  provenancePatterns.forEach((pattern) => {
    expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' note contains source provenance or production commentary.');
  });
});

const requiredStrings = [
  '=SUM(B5:B7)',
  '83,276',
  '(19,154)',
  '(7,172)',
  '56,950',
  '$93.736B',
  '−$110.183B',
  '=INT(B4/(B5+1))+1',
  '251 shares',
  'Class A · GOOGL',
  'Class B',
  'Class C · GOOG',
  '=B5*(1-B6*(1-B7))',
  '5.37%',
  '4.35%',
  '$5.5B',
  '$49.562B',
  '$30.499B',
  '$19.063B',
  '114M',
  '$40B at-the-market (ATM) program',
  'Used by June 30: $0',
  '$96.902B → $131.371B',
  '$478.746B → $640.480B',
  '$126.843B → $242.474B',
  '$46.547B → $98.165B',
  '11.2% → 15.3%',
  '$380.34 → $368.53',
  '−3.1%',
  'BUS311_Ch14_EquityAccounts_Student.xlsx',
  'data-interactive="pecking"',
  'data-interactive="buyback"',
  'data-interactive="voting"',
  'data-interactive="factset-prediction"',
  'data-interactive="features"',
  'Press N for notes · F for fullscreen'
];
requiredStrings.forEach((value) => expect(html.includes(value), 'Missing required deck content: ' + value));
expect((html.match(/role="img"/g) || []).length >= 16, 'Expected at least 16 accessible editable diagrams.');
expect(financingM14Deck.slides.at(-1)?.label === 'Alphabet FactSet answers', 'The Alphabet FactSet answer reveal must be the last slide.');
expect(html.includes('id="slide-31" class="slide dark close answer-reveal-slide"'), 'The final generated slide is not the FactSet answer reveal.');

const activitySlides = financingM14Deck.slides.filter((item) => item.classes.includes('activity-slide'));
expect(activitySlides.length === 10, 'Expected ten explicit activity slides.');
activitySlides.forEach((item, index) => {
  expect(/minute/i.test(item.body), 'Activity ' + (index + 1) + ' is missing visible timing.');
  expect(/deliverable/i.test(item.body), 'Activity ' + (index + 1) + ' is missing a visible deliverable.');
  expect(/answer|correct|accept|defensible|no single/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing the formative answer.');
  expect(/misconception/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing likely misconceptions.');
  expect(/debrief/i.test(item.note), 'Activity ' + (index + 1) + ' note is missing a debrief question.');
});

const appleEquity = 83276 - 19154 - 7172;
const appleDistributions = 15234 + 94949;
const preferredAfterTax = 0.06 * (1 - 0.21 * (1 - 0.50));
const bondAfterTax = 0.055 * (1 - 0.21);
const voteThreshold = Math.floor(1000 / (3 + 1)) + 1;
const alphabetNetEquityProceeds = 30499 + 19063;
const alphabetShareIncrease = (12230 - 12116) / 12116;
const alphabetApicIncrease = 131371 - 96902;
const alphabetEquityIncrease = 640480 - 478746;
const alphabetCashSecuritiesIncrease = (242474 - 126843) / 126843;
const alphabetDebtIncrease = (98165 - 46547) / 46547;
const alphabetDebtToEquityBefore = 46547 / 415265;
const alphabetDebtToEquityAfter = 98165 / 640480;
const alphabetEventReturn = (368.53 - 380.34) / 380.34;
expect(appleEquity === 56950, 'Apple FY2024 equity reconciliation failed.');
expect(appleDistributions === 110183, 'Apple FY2024 dividend and repurchase total failed.');
expect(Math.abs(preferredAfterTax - 0.0537) < 1e-12, 'Preferred after-tax yield calculation failed.');
expect(Math.abs(bondAfterTax - 0.04345) < 1e-12, 'Bond after-tax yield calculation failed.');
expect(voteThreshold === 251, 'Cumulative-voting threshold calculation failed.');
expect(alphabetNetEquityProceeds === 49562, 'Alphabet completed net equity proceeds failed.');
expect(Math.abs(alphabetShareIncrease - 0.009409045889732586) < 1e-12, 'Alphabet Q2 common-share increase failed.');
expect(alphabetApicIncrease === 34469, 'Alphabet common stock and APIC increase failed.');
expect(alphabetEquityIncrease === 161734, 'Alphabet total-equity increase failed.');
expect(Math.abs(alphabetCashSecuritiesIncrease - 0.9116072625213847) < 1e-12, 'Alphabet cash and marketable-securities increase failed.');
expect(Math.abs(alphabetDebtIncrease - 1.1089436483554257) < 1e-12, 'Alphabet long-term-debt increase failed.');
expect(Math.abs(alphabetDebtToEquityBefore - 0.11208987032376916) < 1e-12, 'Alphabet pre-period long-term-debt-to-equity calculation failed.');
expect(Math.abs(alphabetDebtToEquityAfter - 0.15326786160379715) < 1e-12, 'Alphabet post-period long-term-debt-to-equity calculation failed.');
expect(Math.abs(alphabetEventReturn - (-0.031051164747331343)) < 1e-12, 'Alphabet GOOGL event-window return failed.');

if(errors.length){
  console.error('BUS311 M14 corporate financing deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M14 corporate financing deck validation: PASS (31 slides, 31 teaching notes, 75 minutes, all 20 source slides represented, 10 explicit activities, final-slide Alphabet FactSet answer reveal, 16+ accessible editable diagrams, no proprietary screenshots, no ornamental numeric labels or note provenance, Apple equity/distribution, preferred-tax, bond-tax, voting, and Alphabet financing calculations verified).');
