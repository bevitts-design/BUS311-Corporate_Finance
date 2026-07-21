import fs from 'node:fs/promises';
import path from 'node:path';
import { deckRuntime } from './deck-runtime.mjs';
import { lessonContent } from './lesson-content.mjs';
import { totalMinutes, visualProfiles } from './visual-content.mjs';

const root = path.resolve(import.meta.dirname, '..');
const privateRoot = process.env.BUS311_PRIVATE_ROOT || '/private/tmp/BUS311-instructor-stage';
const courseMap = JSON.parse(await fs.readFile(path.join(root, 'course-map.json'), 'utf8'));
const mediaManifest = JSON.parse(await fs.readFile(path.join(root, 'assets', 'lesson-media', 'media-manifest.json'), 'utf8'));
const mapById = new Map(courseMap.lessons.map((lesson) => [lesson.id, lesson]));
const trackById = new Map(courseMap.tracks.map((track) => [track.id, track]));
const mediaById = new Map(mediaManifest.assets.map((asset) => [asset.id, asset]));
const variantIndex = process.argv.indexOf('--variant');
const requestedVariant = variantIndex >= 0 ? process.argv[variantIndex + 1] : 'both';
if (!['public', 'classroom', 'both'].includes(requestedVariant)) throw new Error(`Unknown --variant ${requestedVariant}`);
const approvedPublicDeckIds = new Set(['intro-m01-l01', 'intro-m02-l01']);

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const formulaSafe = (value) => String(value).replaceAll('`', '\\`');

function moduleDir(base, lesson) {
  const mapLesson = mapById.get(lesson.id);
  const publicMaterial = mapLesson?.materials.find((material) => material.path);
  if (!publicMaterial) throw new Error(`Missing public material path for ${lesson.id}`);
  return path.join(base, path.dirname(publicMaterial.path));
}

async function dataUri(relativePath) {
  const absolute = path.join(root, relativePath);
  const bytes = await fs.readFile(absolute);
  const ext = path.extname(relativePath).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

function heroAsset(profile) {
  const asset = mediaById.get(`hero-${profile.hero}`);
  if (!asset || !asset.publicAllowed) throw new Error(`Missing approved hero media for ${profile.hero}`);
  return asset;
}

function timingLabel(profile) {
  return Object.entries(profile.timing).map(([key, value]) => `${key} ${value}m`).join(' · ');
}

function iconFor(title) {
  const lower = title.toLowerCase();
  if (/cash|value|npv|flow/.test(lower)) return '↗';
  if (/risk|beta|credit|agency/.test(lower)) return '△';
  if (/market|price|yield|rate/.test(lower)) return '◎';
  if (/debt|bond|leverage|capital/.test(lower)) return 'Ⅱ';
  if (/equity|stock|share|dividend/.test(lower)) return '◇';
  if (/statement|ratio|margin|profit/.test(lower)) return '▥';
  if (/factset|data|information|footnote/.test(lower)) return '⌁';
  return '◆';
}

function flowGraphic(labels) {
  return `<svg class="diagram" viewBox="0 0 760 420" role="img" aria-label="Decision process diagram">
    ${labels.map((label, index) => {
      const x = 30 + index * 245;
      return `<g><rect x="${x}" y="130" width="210" height="150" rx="22" class="svg-card"/><text x="${x + 105}" y="190" text-anchor="middle" class="svg-index">0${index + 1}</text><text x="${x + 105}" y="235" text-anchor="middle" class="svg-label">${esc(label)}</text></g>${index < labels.length - 1 ? `<path d="M${x + 214} 205 H${x + 238}" class="svg-arrow"/>` : ''}`;
    }).join('')}
  </svg>`;
}

function conceptGraphic(item, index) {
  return `<div class="concept-visual" aria-label="Visual marker for ${esc(item.title)}">
    <div class="concept-icon">${iconFor(item.title)}</div>
    <div class="concept-axis"><span></span><span></span><span></span><span></span></div>
    <div class="concept-number">0${index + 1}</div>
    <div class="concept-caption">${esc(item.image)}</div>
  </div>`;
}

function chartGraphic(chart) {
  const values = chart.values.map(Number);
  const max = Math.max(...values.map((value) => Math.abs(value)), 1);
  if (chart.kind === 'curve') {
    const points = values.map((value, index) => {
      const x = 90 + index * (600 / Math.max(values.length - 1, 1));
      const y = 330 - (value / max) * 230;
      return `${x},${y}`;
    }).join(' ');
    return `<svg class="chart" viewBox="0 0 800 430" role="img" aria-label="Sensitivity curve">
      <path d="M80 350 H730 M80 70 V350" class="chart-axis"/><polyline points="${points}" class="chart-line"/>
      ${values.map((value, index) => { const x = 90 + index * (600 / Math.max(values.length - 1, 1)); const y = 330 - (value / max) * 230; return `<circle cx="${x}" cy="${y}" r="9" class="chart-dot"/><text x="${x}" y="390" text-anchor="middle" class="chart-label">${esc(chart.labels[index])}</text>`; }).join('')}
    </svg>`;
  }
  return `<svg class="chart" viewBox="0 0 800 430" role="img" aria-label="Financial evidence chart">
    <path d="M80 350 H740" class="chart-axis"/>
    ${values.map((value, index) => {
      const width = Math.max(54, 570 / values.length);
      const x = 100 + index * (620 / values.length);
      const height = Math.max(10, Math.abs(value) / max * 235);
      const y = value >= 0 ? 350 - height : 350;
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" class="chart-bar ${value < 0 ? 'negative' : ''}"/><text x="${x + width / 2}" y="390" text-anchor="middle" class="chart-label">${esc(chart.labels[index])}</text><text x="${x + width / 2}" y="${value >= 0 ? y - 14 : y + height + 30}" text-anchor="middle" class="chart-value">${esc(value)}</text>`;
    }).join('')}
  </svg>`;
}

function factsetMock(profile, privateCaptureUri) {
  if (privateCaptureUri) {
    return `<figure class="screen-frame"><img src="${privateCaptureUri}" alt="Private instructor FactSet capture for ${esc(profile.factsetView)}"><figcaption>Private classroom capture · verify retrieval date and supplier attribution before teaching</figcaption></figure>`;
  }
  return `<div class="terminal-frame" role="img" aria-label="Original FactSet workflow mockup with illustrative data">
    <div class="terminal-top"><span>FACTSET WORKFLOW MOCKUP</span><span>ILLUSTRATIVE · NO PROPRIETARY DATA</span></div>
    <div class="terminal-body"><div class="terminal-nav"><strong>Company</strong><span>Financials</span><span>Markets</span><span>Peers</span><span>Definitions</span></div><div class="terminal-main"><div class="terminal-kicker">${esc(profile.lectureCase)}</div><h3>${esc(profile.factsetView)}</h3><div class="terminal-grid"><div><span>FIELD</span><strong>Definition first</strong></div><div><span>PERIOD</span><strong>Match the model</strong></div><div><span>UNITS</span><strong>Label every scale</strong></div><div><span>SOURCE</span><strong>Record retrieval date</strong></div></div></div></div>
  </div>`;
}

function spreadsheetFrame(imageUri, lesson) {
  return `<div class="excel-frame"><div class="excel-ribbon"><span>BUS311 LECTURE MODEL</span><span>fx</span><code>${esc(lesson.worked.excel)}</code></div><img src="${imageUri}" alt="Lecture-only Excel example for ${esc(lesson.title)}"><div class="excel-caption">Independent lecture example · not the student activity answer key</div></div>`;
}

async function privateCapture(lessonId) {
  const candidates = ['png', 'jpg', 'jpeg', 'webp'];
  for (const ext of candidates) {
    const relative = path.join('assets', 'factset', `${lessonId}.${ext}`);
    const absolute = path.join(privateRoot, relative);
    try {
      const bytes = await fs.readFile(absolute);
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      return `data:${mime};base64,${bytes.toString('base64')}`;
    } catch {}
  }
  return null;
}

async function buildDeck(lesson, variant) {
  const profile = visualProfiles[lesson.id];
  const mapLesson = mapById.get(lesson.id);
  const displayTrack = trackById.get(mapLesson?.track)?.label || lesson.track;
  const displayModule = mapLesson?.displayModule || lesson.module;
  if (!profile) throw new Error(`Missing visual profile for ${lesson.id}`);
  if (totalMinutes(profile) !== 75) throw new Error(`Teaching time for ${lesson.id} must total 75 minutes.`);
  const hero = heroAsset(profile);
  const heroUri = await dataUri(hero.path);
  const excelUri = await dataUri(`assets/lesson-media/excel/${lesson.id}-excel.png`);
  const captureUri = variant === 'classroom' ? await privateCapture(lesson.id) : null;
  const slides = [];
  const notes = [];
  const add = (label, classes, content, note) => {
    const number = String(slides.length + 1).padStart(2, '0');
    slides.push(`<section class="slide ${classes}" data-label="${number} ${esc(label)}">${content}</section>`);
    notes.push(note);
  };

  add('Title', 'dark hero', `<img class="hero-image" src="${heroUri}" alt="${esc(hero.alt)}"><div class="hero-overlay"></div><div class="hero-copy"><div class="eyebrow">BUS311 · ${esc(displayTrack.toUpperCase())} ${esc(displayModule)}</div><h1>${esc(lesson.title)}</h1><p>${esc(profile.lectureCase)} · executive decision brief</p></div><div class="hero-credit">${esc(hero.credit)}</div>`, `Open with ${profile.lectureCase}. Frame ${lesson.title} as a decision the finance team must defend.`);
  add('Agenda', 'cream', `<div class="header-row"><h2>Today’s decision path</h2><span class="eyebrow">75 minutes</span></div><div class="rule"></div><div class="number-grid">${lesson.parts.map((part, index) => `<div class="numbered"><div class="n">0${index + 1}</div><div class="n-body">${esc(part.title)}</div></div>`).join('')}</div><div class="timing-strip">${esc(timingLabel(profile))}</div>`, `Preview the three-part path and the calculation sequence. The deck length follows the topic; the class clock remains 75 minutes.`);
  add('Learning objectives', 'cream', `<div class="header-row"><h2>What you will be able to do</h2><span class="eyebrow">${esc(lesson.outcomes.join(' · '))}</span></div><div class="rule"></div><div class="number-grid">${lesson.objectives.map((objective, index) => `<div class="numbered"><div class="n">0${index + 1}</div><div class="n-body">${esc(objective)}</div></div>`).join('')}</div>`, `Read the objectives as performance expectations and connect them to ${lesson.outcomes.join(', ')}.`);
  add('Decision bridge', 'cream', `<div class="header-row"><h2>The decision starts before the formula</h2><span class="eyebrow">Bridge</span></div><div class="rule"></div><div class="visual-split"><div class="lead">${esc(lesson.bridge)}</div>${flowGraphic(lesson.parts.map((part) => part.title))}</div>`, lesson.bridge);

  lesson.parts.forEach((part, partIndex) => {
    add(part.title, 'dark section', `<div class="gradient-bar"></div><div class="eyebrow">Part ${partIndex + 1} of ${lesson.parts.length}</div><h2>${esc(part.title)}</h2><p>${esc(profile.lectureCase)} decision lens</p>`, `Introduce ${part.title}. Ask what evidence a CFO would need before acting.`);
    part.items.forEach((item, itemIndex) => add(item.title, 'cream', `<div class="header-row"><h2>${esc(item.title)}</h2><span class="eyebrow">${esc(profile.lectureCase)}</span></div><div class="rule"></div><div class="visual-split"><div><div class="lead">${esc(item.body)}</div><div class="decision-tag">Decision question · what changes the conclusion?</div></div>${conceptGraphic(item, itemIndex)}</div>`, item.note));
    if (partIndex === 1) {
      add('FactSet evidence', 'dark data-slide', `<div class="header-row"><h2>Evidence needs an audit trail</h2><span class="eyebrow">${variant === 'classroom' ? 'Private classroom view' : 'Public workflow mockup'}</span></div><div class="rule dark-rule"></div>${factsetMock(profile, captureUri)}`, `${profile.factsetView}. Record the field, definition, period, units, currency, supplier, and retrieval date. ${captureUri ? 'This private capture is instructor-only.' : 'This is an original workflow mockup, not a FactSet screenshot.'}`);
      add('Excel model', 'cream', `<div class="header-row"><h2>Build the model where assumptions stay visible</h2><span class="eyebrow">Lecture-only Excel</span></div><div class="rule"></div>${spreadsheetFrame(excelUri, lesson)}`, `Use the lecture-only workbook image. It is intentionally distinct from the student activity and private key.`);
      profile.calculationSteps.forEach((step, stepIndex) => add(`Calculation step ${stepIndex + 1}`, 'cream calculation-step', `<div class="step-index">${String(stepIndex + 1).padStart(2, '0')}</div><div class="step-copy"><div class="eyebrow">Calculation sequence</div><h2>${esc(step)}</h2><p>${esc(profile.evidenceLabel)}</p></div>`, `Calculation step ${stepIndex + 1}: ${step}. Pause and make students name the units, timing, and decision implication.`));
      add('Formula', 'dark formula-slide', `<div class="eyebrow">Excel syntax</div><h2>${esc(lesson.worked.title)}</h2><div class="formula-display">${esc(lesson.worked.excel)}</div><div class="manual-logic">${esc(lesson.worked.math)}</div>`, `${lesson.worked.note} Excel syntax: ${formulaSafe(lesson.worked.excel)}.`);
      add('Model result', 'cream result-slide', `<div class="header-row"><h2>The number is the start of the recommendation</h2><span class="eyebrow">Interpret</span></div><div class="rule"></div><div class="result-grid"><div class="big-result">${esc(lesson.worked.answer)}</div><div class="decision-panel"><span>Decision standard</span><strong>${esc(profile.decision)}</strong></div></div>`, `Expected result: ${lesson.worked.answer} Then ask what assumption is most likely to reverse the recommendation.`);
    }
  });

  add('Sensitivity', 'cream', `<div class="header-row"><h2>Stress the conclusion, not just the formula</h2><span class="eyebrow">Sensitivity</span></div><div class="rule"></div><div class="visual-split"><div><div class="lead">${esc(profile.evidenceLabel)}</div><div class="chart-unit">Illustrative ${esc(profile.chart.unit)} · lecture model</div></div>${chartGraphic(profile.chart)}</div>`, `Walk from the base case to the risk case. Explain which input drives the shape and where the decision changes.`);
  add('Discussion', 'cream', `<div class="header-row"><h2>Defend the decision</h2><span class="eyebrow">Discussion</span></div><div class="rule"></div><div class="question-grid">${lesson.discussion.map((question, index) => `<div class="card"><div class="n">0${index + 1}</div><p>${esc(question)}</p></div>`).join('')}</div>`, `Give pairs three minutes per question, then ask two groups to defend different answers. ${lesson.discussion.join(' | ')}`);
  add('Takeaways', 'cream', `<div class="header-row"><h2>Three takeaways</h2><span class="eyebrow">Close the loop</span></div><div class="rule"></div><div class="number-grid">${lesson.takeaways.map((takeaway, index) => `<div class="numbered"><div class="n">0${index + 1}</div><div class="n-body">${esc(takeaway)}</div></div>`).join('')}</div>`, `Ask students to restate each takeaway and name one input that could change the conclusion.`);
  add('Up next', 'dark teaser', `<img class="hero-image" src="${heroUri}" alt="${esc(hero.alt)}"><div class="hero-overlay stronger"></div><div class="teaser-copy"><div class="eyebrow">Up next</div><h2>${esc(lesson.next)}</h2></div>`, lesson.next);
  add('Questions', 'dark close', `<div class="gradient-bar"></div><div class="eyebrow">BUS311 · ${esc(profile.lectureCase)}</div><h2>Questions?</h2><p>Test the model. Explain the judgment.</p>`, `Close with an exit ticket: one calculation or definition, one decision implication, and one remaining uncertainty.`);

  const css = `
  :root{--ink:#0E1116;--paper:#FAF8F3;--paper-2:#F2EEE5;--white:#FFFFFF;--text:#1A1F2C;--text-soft:#4A5567;--muted:#7A8290;--border:#E5E1D6;--sage:#4A7C5E;--gold:#B8843D;--terra:#9C4A2B;--steel:#355773;--accent:var(--terra);--gradient:linear-gradient(90deg,var(--gold) 0%,var(--terra) 50%,var(--sage) 100%);--font-display:'Instrument Serif';--font-body:'Geist';--font-mono:'JetBrains Mono';--type-display:112px;--type-title:72px;--type-subtitle:44px;--type-lead:34px;--type-body:28px;--type-small:24px;--type-eyebrow:24px;--type-mono:24px;--type-stat:190px;--pad-x:128px;--pad-top:96px;--pad-bottom:88px}
  *{box-sizing:border-box}html,body{margin:0;background:var(--ink);overflow:hidden}.slide{width:1920px;height:1080px;overflow:hidden;flex-direction:column;padding:var(--pad-top) var(--pad-x) var(--pad-bottom);font-family:var(--font-body)}.slide.dark{background:var(--ink);color:var(--white)}.slide.cream{background:var(--paper);color:var(--text)}h1,h2,h3,p,figure{margin:0}h1{font:400 var(--type-display)/.93 var(--font-display);max-width:1450px}h2{font:400 var(--type-title)/1 var(--font-display)}.hero{padding:0}.hero-image{width:100%;height:100%;object-fit:cover}.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,17,22,.96) 0%,rgba(14,17,22,.72) 42%,rgba(14,17,22,.1) 78%)}.hero-overlay.stronger{background:linear-gradient(90deg,rgba(14,17,22,.98) 0%,rgba(14,17,22,.82) 58%,rgba(14,17,22,.45) 100%)}.hero-copy{position:absolute;left:128px;top:170px;max-width:1220px}.hero-copy h1{margin:52px 0 36px}.hero-copy p{font-size:var(--type-lead);color:var(--paper-2)}.hero-credit{position:absolute;right:36px;bottom:28px;font:500 var(--type-small)/1 var(--font-mono);color:rgba(255,255,255,.78)}.eyebrow{font:500 var(--type-eyebrow)/1.2 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}.dark .eyebrow{color:var(--gold)}.header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:64px}.header-row h2{max-width:1350px}.rule{height:1px;background:var(--border);margin:30px 0 46px}.dark-rule{background:rgba(255,255,255,.2)}.number-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}.numbered{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:36px 40px;display:flex;gap:28px;min-height:240px}.n{font:italic 400 56px/1 var(--font-display);color:var(--accent)}.n-body{font-size:var(--type-lead);line-height:1.2}.timing-strip{margin-top:36px;font:500 var(--type-small)/1.4 var(--font-mono);color:var(--muted)}.visual-split{display:grid;grid-template-columns:.88fr 1.12fr;gap:72px;align-items:center;flex:1}.lead{font-size:var(--type-subtitle);line-height:1.18}.decision-tag,.chart-unit{margin-top:40px;padding-top:24px;border-top:1px solid var(--border);font:500 var(--type-small)/1.4 var(--font-mono);color:var(--accent)}.diagram,.chart{width:100%;height:520px}.svg-card{fill:var(--white);stroke:var(--border);stroke-width:2}.svg-index{font:italic 400 52px var(--font-display);fill:var(--accent)}.svg-label,.chart-label,.chart-value{font:500 24px var(--font-body);fill:var(--text)}.svg-arrow{stroke:var(--accent);stroke-width:6}.concept-visual{height:560px;background:var(--ink);border-radius:24px;padding:54px;display:grid;grid-template-columns:1fr auto;grid-template-rows:1fr auto;color:var(--white);overflow:hidden}.concept-icon{font:400 210px/1 var(--font-display);color:var(--gold)}.concept-number{font:italic 400 96px/1 var(--font-display);color:var(--accent);align-self:end}.concept-axis{display:flex;align-items:flex-end;gap:24px}.concept-axis span{display:block;width:44px;background:var(--accent);border-radius:8px 8px 0 0}.concept-axis span:nth-child(1){height:90px}.concept-axis span:nth-child(2){height:180px}.concept-axis span:nth-child(3){height:130px}.concept-axis span:nth-child(4){height:245px}.concept-caption{font:500 var(--type-small)/1.35 var(--font-mono);color:var(--paper-2);max-width:420px;align-self:end}.section,.close{justify-content:center;gap:38px}.section h2,.close h2{max-width:1400px}.section p,.close p{font-size:var(--type-lead);color:var(--paper-2)}.gradient-bar{height:10px;background:var(--gradient);width:420px;border-radius:10px}.terminal-frame{border:1px solid rgba(255,255,255,.24);border-radius:20px;overflow:hidden;background:var(--ink)}.terminal-top{display:flex;justify-content:space-between;padding:22px 28px;background:var(--terra);font:500 var(--type-small)/1 var(--font-mono)}.terminal-body{display:grid;grid-template-columns:280px 1fr;min-height:540px}.terminal-nav{padding:32px;display:grid;align-content:start;gap:28px;border-right:1px solid rgba(255,255,255,.18);font-size:var(--type-body);color:var(--muted)}.terminal-nav strong{color:var(--gold)}.terminal-main{padding:42px}.terminal-kicker{font:500 var(--type-small)/1 var(--font-mono);color:var(--accent)}.terminal-main h3{font:400 52px/1.05 var(--font-display);margin:20px 0 48px}.terminal-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.terminal-grid div{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);padding:28px;border-radius:12px}.terminal-grid span{display:block;font:500 var(--type-small)/1 var(--font-mono);color:var(--muted);margin-bottom:14px}.terminal-grid strong{font-size:var(--type-body)}.screen-frame{display:grid;gap:18px}.screen-frame img{width:100%;height:600px;object-fit:contain;background:var(--paper)}.screen-frame figcaption{font:500 var(--type-small)/1.35 var(--font-mono);color:var(--gold)}.excel-frame{border:1px solid var(--border);background:var(--white);border-radius:18px;overflow:hidden}.excel-ribbon{display:grid;grid-template-columns:auto auto 1fr;gap:24px;align-items:center;padding:20px 28px;background:var(--ink);color:var(--white);font:500 var(--type-small)/1.2 var(--font-mono)}.excel-ribbon code{color:var(--gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.excel-frame img{width:100%;height:550px;object-fit:contain;background:var(--white)}.excel-caption{padding:18px 28px;font:500 var(--type-small)/1.3 var(--font-mono);color:var(--muted)}.calculation-step{display:grid;grid-template-columns:310px 1fr;align-items:center;gap:72px}.step-index{font:italic 400 var(--type-stat)/1 var(--font-display);color:var(--accent)}.step-copy h2{font-size:92px;margin:34px 0}.step-copy p{font-size:var(--type-lead);color:var(--text-soft)}.formula-slide{justify-content:center;gap:38px}.formula-display{font:500 42px/1.4 var(--font-mono);color:var(--gold);padding:40px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:14px}.manual-logic{font-size:var(--type-subtitle);color:var(--paper-2)}.result-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:stretch}.big-result{font:italic 400 94px/1.05 var(--font-display);padding:54px;background:var(--ink);color:var(--white);border-radius:18px}.decision-panel{padding:54px;background:var(--white);border:1px solid var(--border);border-radius:18px;display:grid;align-content:center;gap:24px}.decision-panel span{font:500 var(--type-small)/1 var(--font-mono);color:var(--accent)}.decision-panel strong{font:500 var(--type-lead)/1.28 var(--font-body)}.chart-axis{stroke:var(--muted);stroke-width:3}.chart-line{fill:none;stroke:var(--accent);stroke-width:8}.chart-dot{fill:var(--gold);stroke:var(--ink);stroke-width:3}.chart-bar{fill:var(--accent)}.chart-bar.negative{fill:var(--terra)}.question-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}.card{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:40px;min-height:340px}.card p{font-size:var(--type-lead);line-height:1.25;margin-top:32px}.teaser{padding:0}.teaser-copy{position:absolute;left:128px;top:250px;max-width:1250px}.teaser-copy h2{margin-top:38px;font-size:92px}.data-slide{padding-top:72px}
  `;

  const deckStage = deckRuntime();
  const titleSuffix = variant === 'classroom' ? ' · Classroom' : '';
  return { html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BUS311 · ${esc(displayModule)} — ${esc(lesson.title)}${titleSuffix}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><script type="application/json" id="speaker-notes">${JSON.stringify(notes).replaceAll('</', '<\\/')}</script><style>${css}</style></head><body><deck-stage width="1920" height="1080" no-rail>${slides.join('')}</deck-stage><script>${deckStage}</script></body></html>`, slideCount: slides.length, hasPrivateCapture: Boolean(captureUri), profile };
}

function buildTeachingKey(lesson, mapLesson, deckMeta) {
  const workbook = mapLesson.materials.find((material) => material.type === 'Starter Workbook');
  const publicLinks = mapLesson.materials.map((material) => `- ${material.type}: ${material.path || material.url}`).join('\n');
  const expected = lesson.parts.flatMap((part) => part.items.map((item) => `- **${item.title}:** ${item.note}`)).join('\n');
  const profile = deckMeta.profile;
  return `---
course: BUS311
lesson_id: ${lesson.id}
title: "${lesson.title} — Teaching Key"
outcomes: [${lesson.outcomes.join(', ')}]
status: draft
privacy: instructor-only
---

# ${lesson.title} — Instructor Teaching Key

## Lesson snapshot

- **Length:** 75 minutes
- **Slides:** ${deckMeta.slideCount}; variable by topic complexity, never a design target
- **Mode:** Presenter deck with speaker notes
- **Lecture case:** ${profile.lectureCase}
- **Practice case:** ${profile.practiceCase}
- **Outcome alignment:** ${lesson.outcomes.join(', ')}
- **FactSet:** Required
- **Private capture:** ${deckMeta.hasPrivateCapture ? 'Embedded in classroom deck' : 'Pending capture; classroom deck currently uses the public workflow mockup'}

## Public lesson files

${publicLinks}

## Private classroom file

- Classroom slides: bus311-${lesson.id}-classroom-slides.html

## Instructor preparation

- Open both slide variants and verify keyboard navigation and speaker notes with the **N** key.
- Confirm the private FactSet capture is current, redacted, attributed, and limited to the required screen.
- Confirm the FactSet workflow: ${profile.factsetView}.
- Review the lecture-only Excel example and independently confirm the expected result.
${workbook ? `- Open the private activity key: bus311-${lesson.id}-activity-key.xlsx.` : '- No workbook is assigned for this lesson.'}
- Keep the lecture Excel example distinct from the student activity answer key.

## Suggested 75-minute run of show

| Segment | Minutes | Teaching move |
|---|---:|---|
${Object.entries(profile.timing).map(([segment, minutes]) => `| ${segment} | ${minutes} | ${segment === 'model' ? 'FactSet evidence, Excel build, calculation, and interpretation' : 'Follow the matching visual sequence in the deck'} |`).join('\n')}
| **Total** | **${totalMinutes(profile)}** | **Includes discussion and exit ticket** |

## Visual sequence

- Corporate hero: ${profile.lectureCase}
- Decision framework: ${lesson.parts.map((part) => part.title).join(' → ')}
- FactSet evidence: ${profile.factsetView}
- Excel sequence: ${profile.calculationSteps.join(' → ')}
- Sensitivity evidence: ${profile.evidenceLabel}
- Decision standard: ${profile.decision}

## Worked example key

- **Excel syntax:** \`${lesson.worked.excel}\`
- **Manual logic:** ${lesson.worked.math}
- **Expected result:** ${lesson.worked.answer}
- **Teaching note:** ${lesson.worked.note}

## Expected explanations

${expected}

## Discussion prompts and expected responses

${lesson.discussion.map((item, index) => `${index + 1}. **${item}**\n   - A strong response uses the lesson model, identifies the main assumption, and connects the answer to risk, return, or value.`).join('\n')}

## Common misconceptions and interventions

- **Correct formula, wrong period:** Require labels for every period and rate.
- **Screenshot treated as evidence without definition:** Require field, period, units, currency, supplier, and retrieval date.
- **Accounting result treated as value:** Ask where timing, risk, and cash flow enter.
- **Recommendation without downside:** Ask what input would reverse the decision.

## Exit-ticket evidence

Students submit one calculation or definition, one decision implication, and one uncertainty to monitor.

## Accessibility and technology contingencies

- Read formulas aloud and describe every chart direction and cash-flow sign.
- Every meaningful image has alternative text; verbally describe the private FactSet capture.
- If FactSet is unavailable, use the public workflow mockup and lecture-model values.
- Do not distribute this teaching key, classroom deck, private capture, or activity key.

## Post-class revision notes

- Which slide sequence took longer than its segment budget?
- Which visual clarified the decision most effectively?
- Which FactSet field or workbook instruction needs clarification?
- What should change before the next offering?
`;
}

for (const lesson of lessonContent) {
  const mapLesson = mapById.get(lesson.id);
  if (!mapLesson) throw new Error(`Missing course-map lesson: ${lesson.id}`);
  const publicDir = moduleDir(root, lesson);
  const privateDir = moduleDir(privateRoot, lesson);
  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(privateDir, { recursive: true });
  let teachingMeta;
  if (requestedVariant === 'public' || requestedVariant === 'both') {
    if (approvedPublicDeckIds.has(lesson.id)) {
      console.log(`Preserved approved public deck for ${lesson.id}.`);
    } else {
      const deck = await buildDeck(lesson, 'public');
      await fs.writeFile(path.join(publicDir, `bus311-${lesson.id}-slides.html`), deck.html);
      teachingMeta = deck;
    }
  }
  if (requestedVariant === 'classroom' || requestedVariant === 'both') {
    const classroom = await buildDeck(lesson, 'classroom');
    await fs.writeFile(path.join(privateDir, `bus311-${lesson.id}-classroom-slides.html`), classroom.html);
    teachingMeta = classroom;
  }
  if (teachingMeta) await fs.writeFile(path.join(privateDir, `bus311-${lesson.id}-teaching-key.md`), buildTeachingKey(lesson, mapLesson, teachingMeta));
}

console.log(`Built ${lessonContent.length} variable-length public/classroom deck packages (${requestedVariant}).`);
