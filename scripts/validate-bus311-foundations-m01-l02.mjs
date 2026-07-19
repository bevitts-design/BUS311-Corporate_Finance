import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const deckPath = path.join(root, 'FOUNDATIONS', 'M01', 'bus311-foundations-m01-l02-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const errors = [];

const sections = [...html.matchAll(/<section class="slide [\s\S]*?<\/section>/g)].map((match) => match[0]);
const notesMatch = html.match(/<script type="application\/json" id="speaker-notes">([\s\S]*?)<\/script>/);
let notes = [];
try {
  notes = notesMatch ? JSON.parse(notesMatch[1]) : [];
} catch (error) {
  errors.push(`Speaker notes JSON is invalid: ${error.message}`);
}

if (sections.length !== 40) errors.push(`Expected 40 rebuilt slides; found ${sections.length}.`);
if (notes.length !== sections.length) errors.push(`Speaker-note parity failed: ${notes.length} notes for ${sections.length} slides.`);

const sourceSlides = new Set();
for (const section of sections) {
  const match = section.match(/data-source-slides="([^"]+)"/);
  if (!match) {
    errors.push('A slide is missing data-source-slides provenance.');
    continue;
  }
  for (const token of match[1].split(',')) {
    const trimmed = token.trim();
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) {
      for (let value = Number(range[1]); value <= Number(range[2]); value += 1) sourceSlides.add(value);
    } else if (/^\d+$/.test(trimmed)) {
      sourceSlides.add(Number(trimmed));
    }
  }
  const h2Count = (section.match(/<h2>/g) || []).length;
  if (h2Count > 1) errors.push(`Slide ${match[1]} contains more than one H2.`);
}
for (let index = 1; index <= 33; index += 1) {
  if (!sourceSlides.has(index)) errors.push(`PPTX source slide ${index} is not represented.`);
}
const projectedMarkup = sections.join('\n');

const banned = [
  ['Spring 2026 term', /Spring 2026/i],
  ['Canva SDK', /canva[^<\n]{0,30}(sdk|wrapper)/i],
  ['Tailwind', /tailwind/i],
  ['external JavaScript', /<script[^>]+src=/i],
  ['Shadow DOM', /attachShadow|::slotted/],
  ['React or Babel', /text\/babel|ReactDOM|createRoot\(/],
  ['proprietary FactSet content', /factset[^<\n]{0,30}(screenshot|capture)/i],
  ['unsupported four-trillion-first claim', /first company[^<\n]{0,30}\$?4\s*trillion/i],
];
for (const [label, pattern] of banned) {
  if (pattern.test(projectedMarkup)) errors.push(`Banned ${label} found in projected slide markup.`);
}

const rawFontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
const rawFontShorthandSizes = [...html.matchAll(/font:[^;{}]*?\s(\d+)px\//g)].map((match) => Number(match[1]));
for (const size of [...rawFontSizes, ...rawFontShorthandSizes]) {
  if (size < 24) errors.push(`Font-size floor failed: ${size}px.`);
}

const runtimeChecks = {
  'deck-stage': html.includes('<deck-stage width="1920" height="1080" no-rail>'),
  'Fall 2026 term': html.includes('FALL 2026') && html.includes('Fall 2026'),
  'approved BUS209 navy palette': html.includes('--navy:#0A2540') && html.includes('--steel:#2D7DD2'),
  'approved support colors': html.includes('--teal:#1B998B') && html.includes('--gold:#E6A817'),
  'restrained terra risk token': html.includes('--terra:#9C4A2B') && html.includes('--risk:var(--terra)'),
  'hash navigation': html.includes('#slide-') && html.includes('_indexFromHash'),
  'fullscreen': html.includes('requestFullscreen') && html.includes('fullscreenchange'),
  'counter': html.includes('this._counter.textContent'),
  'notes toggle': html.includes("event.key==='n'||event.key==='N'"),
  'all 33 source slides represented': sourceSlides.size >= 33,
  'BlackRock current example': html.includes('$15.3T') && html.includes('July 15, 2026') && html.includes('blackrock.com/corporate/newsroom'),
  'Coinbase current example': html.includes('100M+') && html.includes('May 7, 2026') && html.includes('investor.coinbase.com'),
  'official Bear Stearns data': html.includes('$18.1B') && html.includes('$2.0B') && html.includes('sec.gov/news/press/2008/2008-48'),
  'official crisis source': html.includes('federalreservehistory.org/essays/great-recession-of-200709'),
  'explicit classroom instructions': html.includes('With a partner:') && html.includes('Small groups · 4 minutes') && html.includes('Classroom activity · 10 minutes'),
  'market-cap numerical consistency': html.includes('$225/share × 15.2 billion shares') && html.includes('$3.42 trillion'),
  'editable graphics': ['market-bridge', 'taxonomy-map', 'function-wheel', 'information-loop', 'bear-bars', 'financing-matrix'].every((name) => html.includes(`class="${name}`)),
  'no remote image dependency': !/<img[^>]+src="https?:/i.test(html),
  'practical file size': Buffer.byteLength(html) < 500_000,
};
for (const [label, passed] of Object.entries(runtimeChecks)) {
  if (!passed) errors.push(`Deck check failed: ${label}.`);
}

if (errors.length) {
  console.error('BUS311 Financial Institutions deck validation: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`BUS311 Financial Institutions deck validation: PASS (${sections.length} rebuilt slides, 33/33 source slides represented)`);
}
