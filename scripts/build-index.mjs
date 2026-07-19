import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const termArg = process.argv.includes('--term') ? process.argv[process.argv.indexOf('--term') + 1] : 'reusable-core';
const courseMap = JSON.parse(await fs.readFile(path.join(root, 'course-map.json'), 'utf8'));
const term = JSON.parse(await fs.readFile(path.join(root, 'terms', `${termArg}.json`), 'utf8'));
const schedule = new Map(term.schedule.map((item) => [item.lessonId, item]));
const tracks = [...courseMap.tracks].sort((a, b) => a.displayOrder - b.displayOrder);
const lessons = [...courseMap.lessons].sort((a, b) => a.displayOrder - b.displayOrder);

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const href = (material) => material.path || material.url;
const current = lessons.find((lesson) => lesson.id === term.currentLessonId);

const trackHtml = tracks.map((track) => {
  const cards = lessons.filter((lesson) => lesson.track === track.id).map((lesson) => {
    const termInfo = schedule.get(lesson.id) || {week: '—', releaseState: 'Unscheduled'};
    const searchText = [lesson.title, lesson.caseStudy, ...lesson.outcomes, ...lesson.skillFocus].join(' ').toLowerCase();
    const materials = lesson.materials.map((item) => `<a href="${esc(href(item))}">${esc(item.label || item.type)}</a>`).join('');
    return `<article class="lesson ${lesson.id === term.currentLessonId ? 'current-card' : ''}" data-lesson-card data-track="${esc(track.id)}" data-search-text="${esc(searchText)}">
      <div class="meta"><span>Week ${esc(termInfo.week)} · ${esc(lesson.module)} ${esc(lesson.lesson)}</span><span class="state">${esc(termInfo.releaseState)}</span></div>
      <h3>${esc(lesson.title)}</h3>
      <div class="outcomes">${lesson.outcomes.map((item) => `<span class="tag">${esc(item)}</span>`).join('')}</div>
      <div class="skills">${lesson.skillFocus.map((item) => `<span class="tag">${esc(item)}</span>`).join('')}</div>
      <div class="materials">${materials}</div>
    </article>`;
  }).join('');
  return `<section class="track" data-track-section><h2>${esc(track.label)}</h2><p class="track-intro">Reusable BUS311 lesson materials aligned to the official course outcomes.</p><div class="grid">${cards}</div></section>`;
}).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(courseMap.course.code)} · ${esc(courseMap.course.title)}</title>
<link rel="stylesheet" href="assets/index.css"></head>
<body><header class="hero"><div class="eyebrow">${esc(courseMap.course.code)} · ${esc(term.label)}</div>
<h1>${esc(courseMap.course.title)}</h1><p>Build financial judgment with FactSet, Excel, valuation models, and decision-focused corporate finance practice.</p>
${current ? `<div class="current"><span>Current lesson</span><strong>${esc(current.title)}</strong></div>` : ''}</header>
<main><div class="controls"><input type="search" data-search placeholder="Search lessons, skills, companies, or outcomes" aria-label="Search lessons">
<select data-track-filter aria-label="Filter by track"><option value="all">All tracks</option>${tracks.map((item) => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join('')}</select></div>
${trackHtml}</main><footer>BUS311 · Corporate Finance · Student materials hub</footer><script src="assets/index.js"></script></body></html>`;

await fs.writeFile(path.join(root, 'index.html'), html);
console.log(`Built index.html for ${term.label} with ${lessons.length} lessons.`);
