import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { financingM14Deck } from './decks/bus311-decisions-m03-l01-content.mjs';
import { deckRuntime } from './deck-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lessonDir = path.join(root, '03-FIRM-DECISIONS', 'M14');
const output = path.join(lessonDir, 'bus311-decisions-m03-l01-slides.html');
const css = await fs.readFile(path.join(lessonDir, 'assets', 'deck.css'), 'utf8');
const activities = await fs.readFile(path.join(lessonDir, 'assets', 'activities.js'), 'utf8');

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slides = financingM14Deck.slides.map((item, index) => {
  const number = String(index + 1).padStart(2, '0');
  return '<section id="slide-' + (index + 1) + '" class="slide ' + item.classes
    + '" data-label="' + number + ' ' + esc(item.label)
    + '" data-source-slides="' + esc(item.slides) + '">' + item.body + '</section>';
});

const notes = financingM14Deck.slides.map((item) => item.note);
const html = [
  '<!doctype html><html lang="en"><head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<meta name="description" content="BUS311 M14 corporate financing, equity accounts, governance, preferred stock, and debt-feature lesson with editable financial visuals, Excel models, and classroom activities.">',
  '<title>BUS311 · Firm Decisions M14 · ', esc(financingM14Deck.title), '</title>',
  '<link rel="icon" href="data:,">',
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">',
  '<meta name="source-presentation" content="', esc(financingM14Deck.source), '">',
  '<script type="application/json" id="speaker-notes">', JSON.stringify(notes).replaceAll('<', '\\u003c'), '</script>',
  '<style>', css, '</style></head><body>',
  '<deck-stage width="1920" height="1080" no-rail>', slides.join(''), '</deck-stage>',
  '<script>', deckRuntime(), '</script>',
  '<script>', activities, '</script>',
  '</body></html>'
].join('');

await fs.mkdir(lessonDir, { recursive: true });
await fs.writeFile(output, html);
console.log('Built ' + output + ' (' + slides.length + ' slides).');
