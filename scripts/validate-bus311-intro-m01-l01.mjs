import fs from 'node:fs/promises';
import path from 'node:path';


const root = path.resolve(import.meta.dirname, '..');
const deckPath = path.join(root, '01-INTRO', 'M01', 'bus311-intro-m01-l01-slides.html');
const html = await fs.readFile(deckPath, 'utf8');
const capstone = JSON.parse(await fs.readFile(path.join(root, 'CAPSTONE', 'source', 'bus311-capstone.json'), 'utf8'));
const errors = [];
const expectedImageAssets = [
  'bus311-professor-evitts-headshot.png',
  'bus311-fall26-teaching-philosophy.png',
  'bus311-fall26-small-business.png',
  'bus311-fall26-industrial-operations.png',
  'bus311-fall26-finance-leadership.png',
  'bus311-fall26-strategic-analysis.png',
  'bus311-fall26-value-creation.png',
  'bus311-fall26-governance.png',
  'bus311-fall26-tyco-logo.svg',
  'bus311-fall26-enron-logo.svg',
];

for (const filename of expectedImageAssets) {
  try {
    await fs.access(path.join(root, '01-INTRO', 'M01', 'assets', filename));
  } catch {
    errors.push(`Missing local deck image asset: ${filename}.`);
  }
}

const sections = [...html.matchAll(/<section class="slide [\s\S]*?<\/section>/g)].map((match) => match[0]);
const slideByNumber = (number) => sections.find((section) => section.includes(`data-label="${String(number).padStart(2, '0')} `)) || '';
const notesMatch = html.match(/<script type="application\/json" id="speaker-notes">([\s\S]*?)<\/script>/);
let notes = [];
try {
  notes = notesMatch ? JSON.parse(notesMatch[1]) : [];
} catch (error) {
  errors.push(`Speaker notes JSON is invalid: ${error.message}`);
}

if (sections.length !== 52) errors.push(`Expected 52 approved slides; found ${sections.length}.`);
if (notes.length !== sections.length) errors.push(`Speaker-note parity failed: ${notes.length} notes for ${sections.length} slides.`);

const slide3 = slideByNumber(3);
if (!slide3.includes('bus311-professor-evitts-headshot.png') || !slide3.includes('class="profile-layout"')) {
  errors.push('Slide 3 is missing the public professor-introduction treatment and professional headshot.');
}
if ((slide3.match(/Assistant Professor/g) || []).length !== 1 || !slide3.includes('<figcaption>Assistant Professor · Gerrish School of Business</figcaption>')) {
  errors.push('Slide 3 must identify Assistant Professor once in the photo caption without duplicating the title under Teaching goal.');
}
const slide2 = slideByNumber(2);
if (/class="sequence-step[^>]*">[\s\S]*?<b>0[1-5]<\/b>/.test(slide2)) {
  errors.push('Slide 2 still contains decorative 01–05 prompt labels.');
}
if (!slide2.includes('Are you interested in any of these paths: Series 7, CFA, CFP, or another path?')) {
  errors.push('Slide 2 is missing the approved professional-path prompt.');
}
const slide49 = slideByNumber(49);
if (!slide49.includes('Sarbanes–Oxley (SOX)') || !slide49.includes('class="failure-symbol sox">LAW</div>')) {
  errors.push('Slide 49 does not introduce Sarbanes–Oxley before using the SOX abbreviation.');
}

const stageIds = capstone.hub.stages.map((stage) => stage.stageId);
for (const slideNumber of [17, 18]) {
  const section = slideByNumber(slideNumber);
  const renderedStageIds = [...section.matchAll(/data-stage-id="([^"]+)"/g)].map((match) => match[1]);
  if (renderedStageIds.join('|') !== stageIds.join('|')) {
    errors.push(`Slide ${slideNumber} capstone stage order does not match the maintained capstone source.`);
  }
}
const slide17 = slideByNumber(17);
for (const stage of capstone.hub.stages) {
  if (!slide17.includes(`data-stage-id="${stage.stageId}" data-date="${stage.dateLabel}" data-points="${stage.points}"`)) {
    errors.push(`Slide 17 does not match ${stage.stageId} date and points from the capstone source.`);
  }
  if (!slide17.includes(`<strong>${stage.title}</strong>`)) {
    errors.push(`Slide 17 does not use the maintained title for ${stage.stageId}.`);
  }
}
const slide18 = slideByNumber(18);
for (const stage of capstone.hub.stages) {
  if (!slide18.includes(`<h3>${stage.title}</h3>`)) errors.push(`Slide 18 does not use the maintained title for ${stage.stageId}.`);
}
if (!slide18.includes('The revenue hypothesis drives the valuation model')) {
  errors.push('Slide 18 is missing the required revenue-before-valuation sequencing rule.');
}
if (!slide18.includes('AI/web plus required FactSet') || !slide18.includes('one FactSet finding and feature')) {
  errors.push('Slide 18 is missing the required beginner FactSet discovery and feature-used prompt.');
}
if (!slide18.includes('Stage 1 explores; verification begins in Stage 2.')) {
  errors.push('Slide 18 is missing the explicit Stage 1 exploration and later-verification boundary.');
}

for (const slideNumber of [25, 26, 27]) {
  const section = slideByNumber(slideNumber);
  if (/>(?:0?[1-4])<\//.test(section)) errors.push(`Slide ${slideNumber} still contains a visible ornamental numeric label.`);
}
const slide25 = slideByNumber(25);
if ((slide25.match(/marker-end="url\(#judgment-arrow\)"/g) || []).length !== 3 || !slide25.includes('Financial judgment')) {
  errors.push('Slide 25 must show three explicit arrow connectors pointing to Financial Judgment.');
}
for (const slideNumber of [26, 27]) {
  if (!slideByNumber(slideNumber).includes('class="course-map-ribbon"')) errors.push(`Slide ${slideNumber} is missing its labeled flow connector.`);
}
if (!slideByNumber(28).includes('class="history-time-visual early"') || !slideByNumber(29).includes('class="history-time-visual modern"')) {
  errors.push('Slides 28 and 29 are missing the paired editable time visuals.');
}
if (!slideByNumber(34).includes('class="c-suite-layout"')) errors.push('Slide 34 is missing the redesigned C-suite composition.');
if (!slideByNumber(40).includes('BUS311 focus · next concept') || !slideByNumber(40).includes('agency problem')) {
  errors.push('Slide 40 does not explain the purpose of the corporation highlight.');
}
if (!slideByNumber(42).includes('class="alignment-hook"') || !slideByNumber(43).includes('class="car-example"')) {
  errors.push('Slides 42 and 43 do not form the intended alignment-to-car-example sequence.');
}

const sourceSlides = new Set();
for (const section of sections) {
  const match = section.match(/data-source-slides="([^"]+)"/);
  if (!match) {
    errors.push('A slide is missing data-source-slides provenance.');
    continue;
  }
  for (const token of match[1].split(',')) {
    const value = Number(token.trim());
    if (Number.isInteger(value)) sourceSlides.add(value);
  }
  const h2Count = (section.match(/<h2>/g) || []).length;
  if (h2Count > 1) errors.push(`Slide ${match[1]} contains more than one H2.`);
}
const intentionallyExcludedSourceSlides = new Set([4]);
for (let index = 1; index <= 46; index += 1) {
  if (intentionallyExcludedSourceSlides.has(index)) continue;
  if (!sourceSlides.has(index)) errors.push(`Canva source slide ${index} is not represented.`);
}

const banned = [
  ['Canva SDK', /canva[^<\n]{0,30}(sdk|wrapper)/i],
  ['Tailwind', /tailwind/i],
  ['external JavaScript', /<script[^>]+src=/i],
  ['Shadow DOM', /attachShadow|::slotted/],
  ['React or Babel', /text\/babel|ReactDOM|createRoot\(/],
  ['private student data', /student[-_ ]?data|live gradebook|answer key|solution bank/i],
];
for (const [label, pattern] of banned) {
  if (pattern.test(html)) errors.push(`Banned ${label} found in approved deck HTML.`);
}

const rawFontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
const rawFontShorthandSizes = [...html.matchAll(/font:[^;{}]*?\s(\d+)px\//g)].map((match) => Number(match[1]));
for (const size of [...rawFontSizes, ...rawFontShorthandSizes]) {
  if (size < 24) errors.push(`Font-size floor failed: ${size}px.`);
}

const runtimeChecks = {
  'deck-stage': html.includes('<deck-stage width="1920" height="1080" no-rail>'),
  'Fall 2026 term': html.includes('Fall 2026') && !html.includes('Spring 2026'),
  'BUS209 navy palette': html.includes('--navy:#0A2540') && html.includes('--steel:#2D7DD2'),
  'BUS209 support colors': html.includes('--teal:#1B998B') && html.includes('--gold:#E6A817'),
  'restrained BUS311 terra token': html.includes('--terra:#9C4A2B') && html.includes('--risk:var(--terra)'),
  'slide 12 title spacing': html.includes('.data-slide{padding-top:120px}'),
  'BUS209 visual reference provenance': html.includes('Visual reference: BUS209 FactSet decks'),
  'hash navigation': html.includes('#slide-') && html.includes('_indexFromHash'),
  'fullscreen': html.includes('requestFullscreen') && html.includes('fullscreenchange'),
  'counter': html.includes('this._counter.textContent'),
  'notes toggle': html.includes("event.key==='n'||event.key==='N'"),
  'full teaching philosophy quote': html.includes('Tell me and I forget. Teach me and I may remember. Involve me and I learn.'),
  'editable five-area finance graphic': html.includes('class="finance-map"') && ['Corporate', 'Investments', 'Financial', 'International', 'Fintech'].every((label) => html.includes(label)),
  'editable evidence-to-valuation infographic': html.includes('class="course-map-flow"') && html.includes('Risk-adjusted judgment'),
  'editable markets-and-financing infographic': html.includes('class="course-map-flow three-stage"') && html.includes('Evaluate the securities'),
  'editable three-decision graphic': html.includes('class="decision-radial"') && html.includes('Increase firm value'),
  'all expected local visual assets': [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].filter((match) => match[1].startsWith('assets/')).length === expectedImageAssets.length,
  'accessible image descriptions': [...html.matchAll(/<img\b[^>]*>/g)].every((match) => /\balt="[^"]+"/.test(match[0])),
  'no remote image dependency': !/<img[^>]+src="https?:/i.test(html),
  'practical file size': Buffer.byteLength(html) < 1_000_000,
};
for (const [label, passed] of Object.entries(runtimeChecks)) {
  if (!passed) errors.push(`Approved-deck check failed: ${label}.`);
}

if (errors.length) {
  console.error('BUS311 approved deck validation: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`BUS311 approved deck validation: PASS (${sections.length} rebuilt slides, 45/46 source slides represented; source slide 4 intentionally excluded)`);
}
