import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { equityM07Deck } from './decks/bus311-valuation-m07-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '02-VALUATION', 'M07', 'bus311-valuation-m07-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slides = [...html.matchAll(/<section id="slide-(\d+)" class="slide ([^"]+)" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slides.length === 21, 'Expected 21 slides; found ' + slides.length + '.');
expect(equityM07Deck.slides.length === slides.length, 'Content module and generated slide counts differ.');
expect(equityM07Deck.slides.every((item) => item.note && item.note.length >= 180), 'Every slide needs a substantive teaching note of at least 180 characters.');
expect(slides.every((match, index) => Number(match[1]) === index + 1), 'Slide IDs must be continuous.');

const expandSources = (value) => {
  const covered = [];
  for(const token of value.split(',').map((item) => item.trim()).filter(Boolean)){
    const range = token.match(/^(\d+)-(\d+)$/);
    if(range){
      for(let number=Number(range[1]);number<=Number(range[2]);number+=1)covered.push(number);
    }else if(/^\d+$/.test(token))covered.push(Number(token));
  }
  return covered;
};
const covered = new Set(slides.flatMap((match) => expandSources(match[4])));
for(let source=1;source<=64;source+=1)expect(covered.has(source), 'Prior M07 source slide ' + source + ' is not represented.');

const times = equityM07Deck.slides.map((item, index) => {
  const match = item.note.match(/Time:\s*(\d+)\s+minute/);
  expect(Boolean(match), 'Slide ' + (index + 1) + ' note lacks a time allocation.');
  return match ? Number(match[1]) : 0;
});
expect(times.reduce((sum, value) => sum + value, 0) === 75, 'Speaker-note time allocations must total 75 minutes.');

expect(html.includes('<title>BUS311 · M07 · Equity Valuation and Going Public</title>'), 'Browser title is not the required M07 title.');
expect(html.includes('BUS311 · Valuation M07'), 'Slide-one M07 identifier is missing.');
expect(!/Valuation M03|SPCX|SpaceX shows|XYZ Corporation|XYZ Energy/i.test(html), 'Legacy M03, speculative SpaceX, or generic XYZ content remains.');

expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker-notes JSON.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing inlined deck-stage runtime.');
expect(!html.includes('attachShadow(') && !html.includes('::slotted'), 'Shadow DOM is prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('tweaks-panel'), 'Tweaks panel should be omitted.');
expect(html.includes('interactiveTarget'), 'Runtime must preserve native keyboard behavior in form controls.');
expect(html.includes('offsetX=(window.innerWidth-W*scale)/2'), 'Runtime must use pixel-offset centering.');
expect(html.includes("location.hash.match(/^#slide-(\\d+)$/)"), 'Runtime must support direct slide hashes.');
expect(html.includes('requestFullscreen') && html.includes('fullscreenchange'), 'Runtime must include fullscreen control and state handling.');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
expect(Boolean(styleMatch), 'Missing inlined deck CSS.');
if(styleMatch){
  const slideRule = styleMatch[1].match(/\.slide\{([^}]*)\}/)?.[1] || '';
  expect(!/(?:^|;)\s*(?:position|display)\s*:/.test(slideRule), 'The base slide CSS must not set position or display.');
}
const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
expect(fontSizes.every((value) => value >= 24), 'Found a font-size below the 24px projector floor.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');
expect(html.includes('--navy:#0A2540') && html.includes('--steel:#2D7DD2') && html.includes('--teal:#1B998B') && html.includes('--gold:#E6A817') && html.includes('--terra:#9C4A2B'), 'Current BUS311 color tokens are incomplete.');
expect(html.includes("--font-body:'Geist'") && html.includes("--font-mono:'JetBrains Mono'") && html.includes("--font-display:'Instrument Serif'"), 'Required BUS311 type roles are incomplete.');

const projected = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/data-label="[^"]*"/g, '').replace(/data-source-slides="[^"]*"/g, '');
expect(!/<(?:b|span|div)[^>]*>\s*0[1-9]\s*<\/(?:b|span|div)>/i.test(projected), 'Found an ornamental numeric label in projected content.');
expect(!/>\s*Part\s+\d+\s+of\s+\d+/i.test(projected), 'Found an ornamental part label in projected content.');
expect((html.match(/role="img"/g) || []).length >= 13, 'Expected at least 13 accessible editable diagrams.');
expect((html.match(/src="assets\//g) || []).length >= 3, 'Expected at least three purposeful local visual-media placements.');
expect((html.match(/data-interactive=/g) || []).length >= 4, 'Expected at least four interactive or response systems.');
expect((html.match(/Required deliverable|Deliver:/g) || []).length >= 4, 'Activity slides need visible deliverables.');

const required = [
  'FACTSET WORKFLOW MOCKUP', 'public data only', 'Field', 'Definition', 'Period', 'Units', 'Currency', 'Supplier', 'Retrieval date',
  'BUS311 LECTURE MODEL', '=-PV(B5,1,0,B3+B4)', '$75.00', '=SUM(F2:F5)', '=-PV($B$7,C2,0,B2)',
  'Sensitivity setup', 'Sensitivity reveal', 'data-interactive="sensitivity"', 'id="required-return-slider"', 'id="growth-slider"', 'id="gordon-output"',
  'Decision standard', 'evidence → calculation → assumption → recommendation', 'data-interactive="decision"',
  '$2.12 per share', '$3.04', '$47.11', '$66.88', 'Coca-Cola 2025 Form 10-K',
  'SEC Investor Bulletin on IPOs', 'Primary market', 'Secondary market', 'Apex IPO classroom case'
];
required.forEach((value) => expect(html.includes(value), 'Missing required M07 content: ' + value));

const onePeriod = (3 + 81) / 1.12;
const multiStage = 3/1.12 + 3.24/(1.12**2) + 3.50/(1.12**3) + 94.48/(1.12**3);
const gordon = 2.12 / (0.085 - 0.04);
const growthUp = 2.12 / (0.085 - 0.05);
const returnUp = 2.12 / (0.095 - 0.04);
const relative = 3.04 * 22;
const postDebtToEquity = (300 - 200) / (200 + 400);
const postRoe = 30 / (200 + 400);
expect(Math.abs(onePeriod - 75) < 1e-10, 'One-period valuation calculation failed.');
expect(Math.abs(multiStage - 75) < 0.02, 'Multi-stage valuation does not reconcile to about 75 dollars.');
expect(Math.abs(gordon - 47.1111111111) < 1e-8, 'Gordon-growth base case failed.');
expect(Math.abs(growthUp - 60.5714285714) < 1e-8, 'Growth sensitivity calculation failed.');
expect(Math.abs(returnUp - 38.5454545455) < 1e-8, 'Required-return sensitivity calculation failed.');
expect(Math.abs(relative - 66.88) < 1e-10, 'Relative valuation calculation failed.');
expect(Math.abs(postDebtToEquity - 1/6) < 1e-10 && Math.abs(postRoe - 0.05) < 1e-10, 'Apex IPO ratio calculations failed.');

expect(await fs.stat(path.join(root, '02-VALUATION', 'M07', 'assets', 'valuation-hero.webp')).then(() => true).catch(() => false), 'Approved valuation hero image is missing.');

const provenancePatterns = [/source[- ]slide/i,/original (?:deck|powerpoint|pptx)/i,/carried over|carryover/i,/rebuild decision|production note/i];
equityM07Deck.slides.forEach((item, index) => provenancePatterns.forEach((pattern) => {
  expect(!pattern.test(item.note), 'Slide ' + (index + 1) + ' note contains production provenance.');
}));

if(errors.length){
  console.error('BUS311 M07 equity-valuation deck validation: FAIL');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('BUS311 M07 equity-valuation deck validation: PASS (21 slides, 75 minutes, 21 substantive notes, prior source slides 1-64 represented, public evidence workflow, editable Excel models, setup-attempt-reveal sensitivity, IPO exercise, and auditable decision standard).');
