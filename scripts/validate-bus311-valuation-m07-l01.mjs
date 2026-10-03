import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apexM07Case, apexM07Results } from './decks/bus311-valuation-m07-l01-case.mjs';
import { equityM07Deck } from './decks/bus311-valuation-m07-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deckPath = path.join(root, '02-VALUATION', 'M07', 'bus311-valuation-m07-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];
const expect = (condition, message) => { if(!condition) errors.push(message); };

const slides = [...html.matchAll(/<section id="slide-(\d+)" class="slide ([^"]+)" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slides.length === 29, 'Expected 29 slides; found ' + slides.length + '.');
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
expect(times.reduce((sum, value) => sum + value, 0) === 66 && equityM07Deck.transitionMinutes === 9, 'Require 66 teaching minutes and 9 transition minutes.');

expect(html.includes('<title>BUS311 · M07 · Equity Valuation and Going Public</title>'), 'Browser title is not the required M07 title.');
expect(html.includes('<title>BUS311 · M07'), 'M07 deck identifier is missing.');
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
expect((html.match(/src="assets\//g) || []).length >= 1, 'Expected a locally stored title visual.');
expect((html.match(/data-interactive=/g) || []).length >= 4, 'Expected at least four interactive or response systems.');
expect((html.match(/Required deliverable|Deliver:/g) || []).length >= 4, 'Activity slides need visible deliverables.');

const required = [
  'FACTSET WORKFLOW MOCKUP', 'public data only', 'Field', 'Definition', 'Period', 'Units', 'Currency', 'Supplier', 'Retrieval date',
  '=-PV(B5,1,0,B3+B4)', '$75.00', 'SUM(F2:F5)', '=-PV($B$7,C2,0,B2)',
  'Which one-point change moves value more?', 'Sensitivity comparison', 'data-interactive="sensitivity"', 'id="required-return-slider"', 'id="growth-slider"', 'id="gordon-output"',
  'data-interactive="decision"', 'insufficient evidence',
  '$2.12 per share', '$3.04', '$47.11', '$66.88', 'Coca-Cola 2025 Form 10-K',
  'SEC Investor Bulletin on IPOs', 'Primary market', 'Secondary market', '20M shares × $20',
  'FCFE already gives equity value', '$322.78M', '$6.46', '$45.50', '$40.14',
  '$32.62', '$70.67', '$34.09', '$41.67', '$75.00', '$229.95M', '28.6%', '9% WACC',
  'capex enters EV dollar-for-dollar', 'Cash stays', '$645M', '$182.25M'
];
required.forEach((value) => expect(html.includes(value), 'Missing required M07 content: ' + value));

const onePeriod = (3 + 81) / 1.12;
const terminalPrice = 3.5 * 1.04 / (0.12 - 0.04);
const multiStage = 3/1.12 + 3.24/(1.12**2) + 3.50/(1.12**3) + terminalPrice/(1.12**3);
const gordon = 2.12 / (0.085 - 0.04);
const growthUp = 2.12 / (0.085 - 0.05);
const returnUp = 2.12 / (0.095 - 0.04);
const relative = 3.04 * 22;
const apex = apexM07Results();
expect(Math.abs(onePeriod - 75) < 1e-10, 'One-period valuation calculation failed.');
expect(Math.abs(multiStage - 40.13871173469388) < 1e-8 && Math.abs(terminalPrice - 45.5) < 1e-8, 'Constructed terminal valuation failed.');
expect(Math.abs(gordon - 47.1111111111) < 1e-8, 'Gordon-growth base case failed.');
expect(Math.abs(growthUp - 60.5714285714) < 1e-8, 'Growth sensitivity calculation failed.');
expect(Math.abs(returnUp - 38.5454545455) < 1e-8, 'Required-return sensitivity calculation failed.');
expect(Math.abs(relative - 66.88) < 1e-10, 'Relative valuation calculation failed.');
expect(Math.abs(apex.postDE - 100/645) < 1e-10 && Math.abs(apex.postROE - 182.25/645) < 1e-10, 'Apex IPO ratio calculations failed.');
expect(apex.cash === 45 && apex.shares === 70 && apex.postIncome === 182.25, 'Apex cash, shares and income reconciliation failed.');
expect(Math.abs(apex.postEPS - 182.25/70) < 1e-10 && Math.abs(apex.epsHurdle - 229.95) < 1e-10, 'EPS dilution and earnings hurdle failed.');
expect(Math.abs(apex.preCurrent - 200/145) < 1e-10 && Math.abs(apex.postCurrent - 200/85) < 1e-10, 'Liquidity denominators failed.');
expect(Math.abs(apex.valuePerShare - 15.70) < 1e-10, 'FCFF equity bridge failed.');
const higherShares = apexM07Results({...apexM07Case,newShares:25});
expect(higherShares.shares === 75 && higherShares.postEPS < apex.postEPS, 'Share-count sensitivity failed.');
const growthValues = [0.08,0.12,0.20].map(returnOnNewEquity => 3/(0.12 - 0.4*returnOnNewEquity));
expect(growthValues[0] < 5/0.12 && Math.abs(growthValues[1]-5/0.12)<1e-10 && growthValues[2] > 5/0.12, 'Growth value creation test failed.');

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

console.log('BUS311 M07 equity-valuation deck validation: PASS (29 slides, 66 teaching minutes plus 9 transition minutes; reconciled Apex, claim matching, constructed terminal value, scenario limits, dilution and growth hurdles).');
