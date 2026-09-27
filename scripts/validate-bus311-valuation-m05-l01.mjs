import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tvmM05L01Deck } from './decks/bus311-valuation-m05-l01-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await fs.readFile(path.join(root, '02-VALUATION/M05/bus311-valuation-m05-l01-slides.html'), 'utf8');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const slideMatches = [...html.matchAll(/<section id="slide-(\d+)" class="slide [^"]+" data-label="([^"]+)" data-source-slides="([^"]+)">/g)];
expect(slideMatches.length === 38, `Expected 38 slides; found ${slideMatches.length}.`);
expect(tvmM05L01Deck.slides.length === slideMatches.length, 'Content module and generated HTML differ.');
expect(tvmM05L01Deck.slides.every((s) => s.note?.length >= 140), 'Every slide needs a substantive speaker note.');
expect(tvmM05L01Deck.slides[1]?.body.includes('Company valuation rate'), 'Opening case must identify the valuation assumption.');
expect(!html.includes('9.6% nominal APR'), 'The company valuation assumption must not be labeled as an offer APR.');

const topics = ['Rate conventions','Future value','Present value','Annuity due','RATE','NPER','Real versus nominal rates','Preferred stock perpetuity'];
const stages = ['definition','Excel function','corporate use','Excel example'];
for (const topic of topics) {
  const positions = stages.map((stage) => tvmM05L01Deck.slides.findIndex((s) => s.label === `${topic}: ${stage}`));
  expect(positions.every((p) => p >= 0), `${topic} is missing a teaching stage.`);
  expect(positions.every((p, i) => i === 0 || p === positions[i - 1] + 1), `${topic} stages are out of order.`);
}
expect(tvmM05L01Deck.slides.findIndex((s) => s.label.startsWith('RATE:')) > tvmM05L01Deck.slides.findIndex((s) => s.label.startsWith('Equipment decision:')), 'Later applications should follow the integrated decision.');
expect(!/\b(?:NPV|XNPV)\b/.test(html), 'Project cash-flow functions belong in Chapter 8.');
for (const value of ['=FV(C9,D9,E9,F9,G9)', '=PV(C13,D13,E13,F13,G13)', '=PV(C12,D12,E12,F12,G12)', '=RATE(B11,B9,B8,B10,B12)', '=NPER(B22,0,-B20,B21)', '=(1+B30)/(1+B29)-1', '=B8/B12', '5 Rate-Applications', '6 Preferred-Stock', 'Chapter 8']) {
  expect(html.includes(value), `Missing deck content: ${value}`);
}
expect((html.match(/data-reveal=/g) || []).length === 8, 'Each teaching block needs one result reveal.');
expect(html.includes('<deck-stage width="1920" height="1080" no-rail>'), 'Missing deck-stage scaffold.');
expect(html.includes('id="speaker-notes"'), 'Missing speaker notes.');
expect(html.includes("customElements.define('deck-stage'"), 'Missing deck runtime.');
expect(!html.includes('attachShadow('), 'Shadow DOM is prohibited.');
expect(!/<script[^>]+src=/i.test(html), 'External JavaScript is prohibited.');
expect(!html.includes('clamp('), 'Clamp-based sizing is prohibited.');
const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map((m) => Number(m[1]));
expect(fontSizes.every((n) => n >= 24), 'Found a font size below the 24px projector floor.');
const notes = tvmM05L01Deck.slides.map((s) => s.note).join('\n');
expect(!/source[- ]slide|source deck|original (?:slide|deck|powerpoint)|legacy deck|production note/i.test(notes), 'Speaker notes contain production commentary.');

const r = 0.096 / 12;
const ear = (1 + r) ** 12 - 1;
const fvCash = 80000 * (1 + r) ** 24;
const balloonPV = 8000 / (1 + r) ** 24;
const ordinaryPV = 3150 * (1 - (1 + r) ** -24) / r;
const duePV = ordinaryPV * (1 + r);
const financePV = duePV + balloonPV;
const real = (1 + ear) / 1.03 - 1;
const reserveN = Math.log(100000 / 80000) / Math.log(1 + r);
const f = (rate) => 80000 - 3150 * (1 - (1 + rate) ** -24) / rate * (1 + rate) - 8000 / (1 + rate) ** 24;
let low = 0.0001, high = 0.02;
for (let i = 0; i < 100; i += 1) { const mid = (low + high) / 2; if (f(mid) > 0) high = mid; else low = mid; }
const implied = (low + high) / 2;
expect(Math.abs(ear - 0.10033869371614634) < 1e-10, 'EAR failed independent check.');
expect(Math.abs(fvCash - 96859.619) < 0.01, 'FV failed independent check.');
expect(Math.abs(balloonPV - 6607.50068) < 0.01, 'Balloon PV failed independent check.');
expect(Math.abs(duePV - 69085.3726) < 0.01 && duePV > ordinaryPV, 'Annuity timing failed independent check.');
expect(Math.abs(financePV - 75692.8733) < 0.01, 'Financing present cost failed independent check.');
expect(Math.abs(real - 0.06828999) < 1e-6, 'Real return failed independent check.');
expect(Math.abs(reserveN - 28.0043675) < 1e-5, 'Reserve horizon failed independent check.');
expect(Math.abs(implied * 12 - 0.0420048) < 1e-5, 'Implied APR failed independent check.');
expect(2.5 / (0.10 / 4) === 100, 'Preferred-share value failed independent check.');

if (errors.length) { console.error('BUS311 M05 TVM deck validation: FAIL'); errors.forEach((e) => console.error(`- ${e}`)); process.exit(1); }
console.log('BUS311 M05 TVM deck validation: PASS (38 slides, 8 ordered teaching blocks, 8 reveals, substantive notes, independent financial checks).');
