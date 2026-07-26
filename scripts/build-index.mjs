import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const requestedTerm = process.argv.includes('--term')
  ? process.argv[process.argv.indexOf('--term') + 1]
  : process.env.BUS311_TERM || 'fall-2026';
const courseMap = JSON.parse(await fs.readFile(path.join(root, 'course-map.json'), 'utf8'));
const term = JSON.parse(await fs.readFile(path.join(root, 'terms', `${requestedTerm}.json`), 'utf8'));
const schedule = new Map(term.schedule.map((item) => [item.lessonId, item]));
const outcomes = new Map(courseMap.learningOutcomes.map((item) => [item.id, item.text]));
const tracks = [...courseMap.tracks].sort((a, b) => a.displayOrder - b.displayOrder);
const lessons = [...courseMap.lessons].sort((a, b) => a.displayOrder - b.displayOrder);
const current = lessons.find((lesson) => lesson.id === term.currentLessonId) || lessons[0];
const siteAssetVersion = '20260726';

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function renderInline(value) {
  const codeTokens = [];
  const protectedValue = String(value).replace(/`([^`]+)`/g, (_, code) => {
    const token = `CODETOKEN${codeTokens.length}ENDTOKEN`;
    codeTokens.push(`<code>${esc(code)}</code>`);
    return token;
  });
  return esc(protectedValue)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/CODETOKEN(\d+)ENDTOKEN/g, (_, index) => codeTokens[Number(index)]);
}

function renderMarkdown(markdown) {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = body.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];
  let listType = 'ul';

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) html.push(`<${listType}>${list.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${listType}>`);
    list = [];
    listType = 'ul';
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('# ')) continue;
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      html.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      html.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      if (list.length && listType !== 'ul') flushList();
      listType = 'ul';
      list.push(line.slice(2));
      continue;
    }
    const orderedItem = line.match(/^\d+\.\s+(.+)/);
    if (orderedItem) {
      flushParagraph();
      if (list.length && listType !== 'ol') flushList();
      listType = 'ol';
      list.push(orderedItem[1]);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return html.join('\n');
}

function lessonDirectory(lesson) {
  const slide = lesson.materials.find((material) => material.type === 'Slides');
  return path.dirname(slide.path);
}

function lessonHref(lesson) {
  return `${lessonDirectory(lesson)}/`;
}

function materialHref(material, fromLessonPage = false) {
  return `${fromLessonPage ? '../../' : ''}${material.path || material.url}`;
}

function materialLink(material, lesson, fromLessonPage = false) {
  const localDownload = material.path && /\.(xlsx|docx|pdf)$/i.test(material.path);
  return `<a class="material-link material-${esc(material.stage.toLowerCase())}" href="${esc(materialHref(material, fromLessonPage))}"${localDownload ? ' download' : ''} aria-label="${esc(`${material.label} for ${lesson.title}`)}">
    <span>${esc(material.stage)}</span>
    <strong>${esc(material.label)}</strong>
    <small>${esc(material.description)}</small>
  </a>`;
}

function outcomeChips(lesson) {
  return lesson.outcomes.map((id) => `<span class="outcome-chip" title="${esc(outcomes.get(id))}">${esc(id)}</span>`).join('');
}

function lessonCard(lesson) {
  const termInfo = schedule.get(lesson.id) || { week: '—', dateLabel: 'Schedule in Canvas', releaseState: 'Available' };
  const track = tracks.find((item) => item.id === lesson.track);
  const isCurrent = lesson.id === current.id;
  const searchText = [
    lesson.title,
    lesson.summary,
    lesson.caseStudy,
    ...lesson.outcomes,
    ...lesson.outcomes.map((id) => outcomes.get(id)),
    ...lesson.skillFocus,
  ].join(' ').toLowerCase();
  return `<article class="lesson-card track-${esc(lesson.track)}${isCurrent ? ' current-card' : ''}" data-lesson-card data-track="${esc(lesson.track)}" data-search-text="${esc(searchText)}">
    <div class="lesson-meta">
      <span>Week ${esc(termInfo.week)} · ${esc(lesson.displayModule)}</span>
      <span class="availability">${isCurrent ? 'Current lesson' : esc(termInfo.releaseState)}</span>
    </div>
    <p class="lesson-date">${esc(termInfo.dateLabel)}</p>
    <h3><a href="${esc(lessonHref(lesson))}">${esc(lesson.title)}</a></h3>
    <p class="case-study">Case: ${esc(lesson.caseStudy)}</p>
    <p class="lesson-summary">${esc(lesson.summary)}</p>
    <div class="outcome-row" aria-label="Learning outcomes">${outcomeChips(lesson)}</div>
    <div class="lesson-actions">
      <a class="primary-action" href="${esc(lessonHref(lesson))}">Open lesson</a>
      <span>${lesson.materials.length} resource${lesson.materials.length === 1 ? '' : 's'}</span>
    </div>
  </article>`;
}

function trackSection(track) {
  const trackLessons = lessons.filter((lesson) => lesson.track === track.id);
  return `<section class="track-section" id="track-${esc(track.id)}" data-track-section>
    <div class="section-heading">
      <div><p class="section-kicker">${esc(track.shortLabel)}</p><h2>${esc(track.label)}</h2></div>
      <p>${esc(track.description)}</p>
    </div>
    <p class="track-question">${esc(track.studentQuestion)}</p>
    <div class="lesson-grid">${trackLessons.map(lessonCard).join('')}</div>
  </section>`;
}

function currentMaterial(type) {
  return current.materials.find((material) => material.type === type);
}

const currentInfo = schedule.get(current.id);
const currentSlides = currentMaterial('Slides');
const filterOptions = tracks.map((track) => `<option value="${esc(track.id)}">${esc(track.shortLabel)}</option>`).join('');
const outcomeCards = courseMap.learningOutcomes.map((outcome) => `<article><span>${esc(outcome.id)}</span><p>${esc(outcome.text)}</p></article>`).join('');
const assessmentItems = term.assessmentWeeks.map((item) => `<li><strong>Week ${esc(item.week)}</strong><span>${esc(item.label)}</span></li>`).join('');

const homeHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(courseMap.course.tagline)}"><title>${esc(courseMap.course.code)} · ${esc(courseMap.course.title)} · ${esc(term.label)}</title>
<link rel="icon" href="data:,"><link rel="stylesheet" href="assets/index.css?v=${siteAssetVersion}"></head>
<body><a class="skip-link" href="#main-content">Skip to course content</a>
<header class="site-header">
  <div class="header-bar"><a class="course-mark" href="./">${esc(courseMap.course.code)}</a><nav aria-label="Course navigation"><a href="#this-week">This week</a><a href="#course-pathway">Course pathway</a><a href="#resources">Resources</a></nav></div>
  <div class="hero-grid">
    <div class="hero-copy"><p class="eyebrow">${esc(term.label)} · ${esc(term.meetingPattern)}</p><h1>${esc(courseMap.course.title)}</h1><p class="hero-tagline">${esc(courseMap.course.tagline)}</p><p class="hero-promise">${esc(courseMap.course.studentPromise)}</p></div>
    <aside class="current-panel" id="this-week" aria-labelledby="current-title"><p class="panel-kicker">Start here · Week ${esc(currentInfo.week)}</p><h2 id="current-title">${esc(current.title)}</h2><p>${esc(current.summary)}</p><div class="current-meta"><span>${esc(current.displayModule)}</span><span>${esc(currentInfo.dateLabel)}</span><span>${esc(current.estimatedMinutes)} minutes</span></div><div class="current-actions"><a class="primary-action light" href="${esc(lessonHref(current))}">Open current lesson</a>${currentSlides ? `<a class="secondary-action" href="${esc(currentSlides.path)}">View slides</a>` : ''}</div></aside>
  </div>
</header>
<main id="main-content">
  <section class="start-section" aria-labelledby="start-title"><div class="section-heading compact"><div><p class="section-kicker">How to use this hub</p><h2 id="start-title">Prepare, practice, then apply</h2></div><p>Each module follows the same learning rhythm so you always know what to do next.</p></div>
    <div class="start-grid"><article><span>Prepare</span><h3>Read the lesson briefing</h3><p>Preview the decision, vocabulary, and evidence you will need before class.</p></article><article><span>Practice</span><h3>Build the model</h3><p>Use the slides and starter workbook to make the financial logic auditable.</p></article><article><span>Apply</span><h3>Defend a recommendation</h3><p>Use the case activity to connect the calculation to a management decision.</p></article></div>
  </section>
  <section class="pathway-section" id="course-pathway" aria-labelledby="pathway-title">
    <div class="section-heading"><div><p class="section-kicker">Eleven lessons · three decisions</p><h2 id="pathway-title">Course pathway</h2></div><p>M01–M04 build the evidence base, M05–M08 develop valuation, and M12–M14 turn analysis into firm decisions. M09–M11 are intentionally reserved for review and assessment.</p></div>
    <div class="pathway-strip" aria-label="Course learning arc">${tracks.map((track) => `<a href="#track-${esc(track.id)}"><span>${esc(track.shortLabel)}</span><strong>${esc(track.label)}</strong></a>`).join('')}</div>
    <div class="filter-panel" aria-labelledby="filter-title"><div><h3 id="filter-title">Find a lesson</h3><p>Search by topic, company, skill, or learning outcome.</p></div><div class="filter-fields"><label for="lesson-search">Search lessons<input id="lesson-search" type="search" data-search placeholder="Try WACC, Apple, or LO4" autocomplete="off"></label><label for="track-filter">Course section<select id="track-filter" data-track-filter><option value="all">All sections</option>${filterOptions}</select></label><button class="clear-search" type="button" data-clear-search hidden>Clear search</button></div><p class="results-status" data-results-status role="status" aria-live="polite"></p></div>
    <div data-course-results>${tracks.map(trackSection).join('')}</div>
    <div class="no-results" data-no-results hidden><h3>No lessons match that search</h3><p>Try a broader topic, company name, module number, or learning outcome.</p><button type="button" data-reset-filters>Show all lessons</button></div>
  </section>
  <section class="outcomes-section" aria-labelledby="outcomes-title"><div class="section-heading compact"><div><p class="section-kicker">What you will be able to do</p><h2 id="outcomes-title">Course learning outcomes</h2></div><p>Every lesson names the outcomes it develops; open a lesson to see the complete connection.</p></div><div class="outcome-grid">${outcomeCards}</div></section>
  <section class="resources-section" id="resources" aria-labelledby="resources-title"><div class="section-heading compact"><div><p class="section-kicker">Course essentials</p><h2 id="resources-title">Resources and key dates</h2></div><p>Canvas remains the authority for submissions and exact due dates.</p></div><div class="resource-layout"><div class="resource-cards"><a href="${esc(term.syllabusPath)}" download><span>Course document</span><strong>Download the Fall 2026 syllabus</strong><small>Policies, grading, learning outcomes, and the complete schedule.</small></a>${term.canvasUrl ? `<a href="${esc(term.canvasUrl)}"><span>Course system</span><strong>Open Canvas</strong><small>Assignments, submissions, announcements, and due dates.</small></a>` : ''}<article><span>Required tools</span><strong>${courseMap.course.requiredTools.map(esc).join(' · ')}</strong><small>Bring your laptop and confirm access before the lesson begins.</small></article></div><div class="assessment-panel"><h3>Assessment weeks</h3><ul>${assessmentItems}</ul></div></div></section>
</main>
<footer><strong>${esc(courseMap.course.code)} · ${esc(courseMap.course.title)}</strong><span>${esc(term.location)}</span><span>Use Canvas for exact assignments and due dates</span></footer>
<script src="assets/index.js?v=${siteAssetVersion}"></script></body></html>`;

await fs.writeFile(path.join(root, 'index.html'), homeHtml);

for (const [index, lesson] of lessons.entries()) {
  const termInfo = schedule.get(lesson.id);
  const track = tracks.find((item) => item.id === lesson.track);
  const readingSource = await fs.readFile(path.join(root, lesson.readingPath), 'utf8');
  const readingHtml = renderMarkdown(readingSource);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const lessonOutcomes = lesson.outcomes.map((id) => `<li><strong>${esc(id)}</strong><span>${esc(outcomes.get(id))}</span></li>`).join('');
  const lessonMaterials = lesson.materials.map((material) => materialLink(material, lesson, true)).join('');
  const lessonHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(lesson.summary)}"><title>${esc(courseMap.course.code)} · ${esc(lesson.displayModule)} · ${esc(lesson.title)}</title><link rel="icon" href="data:,"><link rel="stylesheet" href="../../assets/index.css?v=${siteAssetVersion}"></head>
<body class="lesson-page"><a class="skip-link" href="#lesson-content">Skip to lesson content</a><header class="lesson-header"><nav aria-label="Breadcrumb"><a href="../../">${esc(courseMap.course.code)} course home</a><span aria-hidden="true">/</span><a href="../../#track-${esc(track.id)}">${esc(track.shortLabel)}</a><span aria-hidden="true">/</span><span>${esc(lesson.displayModule)}</span></nav><div class="lesson-hero"><div><p class="eyebrow">Week ${esc(termInfo.week)} · ${esc(termInfo.dateLabel)} · ${esc(track.label)}</p><h1>${esc(lesson.title)}</h1><p>${esc(lesson.summary)}</p><div class="lesson-hero-meta"><span>Case: ${esc(lesson.caseStudy)}</span><span>${esc(lesson.estimatedMinutes)} minutes</span><span>${esc(termInfo.releaseState)}</span></div></div><aside><span>Required output</span><strong>${esc(lesson.deliverable)}</strong></aside></div></header>
<main id="lesson-content" class="lesson-shell"><section class="learning-plan" aria-labelledby="learning-plan-title"><div class="section-heading compact"><div><p class="section-kicker">Learning plan</p><h2 id="learning-plan-title">What to do</h2></div><p>Complete the stages in order unless your instructor gives different directions in Canvas.</p></div><div class="learning-plan-grid"><article><span>Prepare</span><p>${esc(lesson.prepare)}</p></article><article><span>Practice</span><p>${esc(lesson.practice)}</p></article><article><span>Apply</span><p>${esc(lesson.apply)}</p></article></div></section>
<section class="lesson-resources" aria-labelledby="lesson-resources-title"><div class="section-heading compact"><div><p class="section-kicker">Lesson files</p><h2 id="lesson-resources-title">Resources</h2></div><p>Download workbook files before class so you are ready to model, interpret, and decide.</p></div><div class="material-grid">${lessonMaterials}</div></section>
<div class="lesson-content-grid"><article class="reading-content"><p class="section-kicker">Pre-class briefing</p>${readingHtml}</article><aside class="outcome-panel"><h2>Learning outcomes</h2><ul>${lessonOutcomes}</ul><p><strong>Case:</strong> ${esc(lesson.caseStudy)}</p><p><strong>Skills:</strong> ${lesson.skillFocus.map(esc).join(' · ')}</p></aside></div>
<nav class="lesson-pagination" aria-label="Lesson sequence">${previous ? `<a href="../../${esc(lessonHref(previous))}"><span>Previous lesson</span><strong>${esc(previous.displayModule)} · ${esc(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a class="next" href="../../${esc(lessonHref(next))}"><span>Next lesson</span><strong>${esc(next.displayModule)} · ${esc(next.title)}</strong></a>` : '<a class="next" href="../../"><span>Course complete</span><strong>Return to the course pathway</strong></a>'}</nav></main>
<footer><strong>${esc(courseMap.course.code)} · ${esc(lesson.displayModule)}</strong><a href="../../">Course home</a><span>Canvas is the authority for submission instructions and due dates</span></footer></body></html>`;
  const destination = path.join(root, lessonDirectory(lesson), 'index.html');
  await fs.writeFile(destination, lessonHtml);
}

console.log(`Built index.html and ${lessons.length} lesson pages for ${term.label}.`);
