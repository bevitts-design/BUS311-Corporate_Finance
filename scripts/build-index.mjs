import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const requestedTerm = process.argv.includes('--term')
  ? process.argv[process.argv.indexOf('--term') + 1]
  : process.env.BUS311_TERM || 'fall-2026';
const courseMap = JSON.parse(await fs.readFile(path.join(root, 'course-map.json'), 'utf8'));
const capstone = JSON.parse(await fs.readFile(path.join(root, courseMap.capstoneSource), 'utf8'));
const term = JSON.parse(await fs.readFile(path.join(root, 'terms', `${requestedTerm}.json`), 'utf8'));
const schedule = new Map(term.schedule.map((item) => [item.lessonId, item]));
const outcomes = new Map(courseMap.learningOutcomes.map((item) => [item.id, item.text]));
const tracks = [...courseMap.tracks].sort((a, b) => a.displayOrder - b.displayOrder);
const lessons = [...courseMap.lessons].sort((a, b) => a.displayOrder - b.displayOrder);
const current = lessons.find((lesson) => lesson.id === term.currentLessonId) || lessons[0];
const siteAssetVersion = '20260811a';

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

function lessonCard(lesson) {
  const termInfo = schedule.get(lesson.id) || { week: '—', dateLabel: 'Schedule in Canvas', releaseState: 'Available' };
  const isCurrent = lesson.id === current.id;
  const isAvailable = termInfo.releaseState === 'Available';
  const cardMaterial = lesson.materials.find((material) => material.cardLabel);
  const cardMaterialButton = isAvailable && cardMaterial
    ? `<a class="card-resource-action" href="${esc(materialHref(cardMaterial))}" download aria-label="${esc(`${cardMaterial.cardLabel} for ${lesson.title}`)}">${esc(cardMaterial.cardLabel)}</a>`
    : '';
  const cardContent = isAvailable
    ? `<p class="case-study">Case: ${esc(lesson.caseStudy)}</p>
    <p class="lesson-summary">${esc(lesson.summary)}</p>`
    : `<details class="locked-preview"><summary>Preview lesson</summary><div><p class="case-study">Case: ${esc(lesson.caseStudy)}</p><p class="lesson-summary">${esc(lesson.summary)}</p></div></details>`;
  return `<article class="lesson-card track-${esc(lesson.track)}${isCurrent ? ' current-card' : ''}${isAvailable ? '' : ' locked-card'}" data-lesson-card data-current="${isCurrent ? 'true' : 'false'}">
    <div class="lesson-meta">
      <span>Week ${esc(termInfo.week)} · ${esc(lesson.displayModule)}</span>
      <span class="availability">${isCurrent ? 'Current lesson' : esc(termInfo.releaseState)}</span>
    </div>
    <p class="lesson-date">${esc(termInfo.dateLabel)}</p>
    <h3>${isAvailable ? `<a href="${esc(lessonHref(lesson))}">${esc(lesson.title)}</a>` : esc(lesson.title)}</h3>
    ${cardContent}
    <div class="lesson-actions">
      ${isAvailable ? `<a class="primary-action" href="${esc(lessonHref(lesson))}">Open lesson</a>` : '<span class="locked-action" aria-label="Lesson materials are locked until released">🔒 Locked until released</span>'}
      <span>${lesson.materials.length} resource${lesson.materials.length === 1 ? '' : 's'}</span>
    </div>${cardMaterialButton ? `\n    ${cardMaterialButton}` : ''}
  </article>`;
}

function trackIcon(trackId) {
  const icons = {
    intro: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect x="10" y="8" width="28" height="32" rx="4"/><path d="M16 16h16M16 23h10M16 30h16"/><circle cx="31" cy="23" r="2"/></svg>',
    valuation: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M8 24h32M12 18v12M24 15v18M36 18v12"/><circle cx="12" cy="24" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="36" cy="24" r="4"/></svg>',
    decisions: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M12 7h20l5 5v29H12zM32 7v7h5"/><path d="m18 26 4 4 9-10M18 35h13"/></svg>',
  };
  return icons[trackId] || '';
}

function trackSection(track) {
  const trackLessons = lessons.filter((lesson) => lesson.track === track.id);
  return `<section class="track-section track-${esc(track.id)}" id="track-${esc(track.id)}" data-course-unit>
    <div class="section-heading">
      <div class="track-heading"><span class="track-icon">${trackIcon(track.id)}</span><div><p class="section-kicker">${esc(track.shortLabel)}</p><h2>${esc(track.label)}</h2></div></div>
      <p>${esc(track.description)}</p>
    </div>
    <p class="track-question">${esc(track.studentQuestion)}</p>
    <div class="lesson-grid">${trackLessons.map(lessonCard).join('')}</div>
  </section>`;
}

const assessmentItems = term.assessmentWeeks.map((item) => `<li><strong>Week ${esc(item.week)}</strong><span>${esc(item.label)}</span></li>`).join('');
const termMilestoneDates = new Map((term.capstone?.milestones || []).map((item) => [item.milestoneId, item.dateLabel]));
const capstoneMilestones = [
  ...capstone.milestones.map((item) => ({
    title: item.title,
    due: item.due,
    dateLabel: termMilestoneDates.get(item.milestoneId) || item.due,
  })),
  {
    title: 'PowerPoint submission and Oral Presentation',
    due: capstone.finalSubmission.deadline,
    dateLabel: capstone.finalSubmission.deadlineLabel,
  },
];
const initialCapstoneMilestone = capstoneMilestones[0];
const capstoneProgressStages = [capstone.hub.stages[0], capstone.hub.stages[2], capstone.hub.stages[4]];
const capstoneAssignment = capstone.materials.find((item) => item.materialId === 'ASSIGNMENT');

const capstoneSnapshotHome = `<article class="capstone-snapshot" id="company-capstone" aria-labelledby="capstone-title" data-capstone-milestones="${esc(JSON.stringify(capstoneMilestones))}">
  <div class="capstone-copy"><p class="section-kicker">Capstone snapshot</p><h3 id="capstone-title">Company Capstone</h3><p>Build an auditable company model and defend one evidence-backed CFO recommendation to the Board.</p><ol class="capstone-progress" aria-label="Capstone progress">${capstoneProgressStages.map((stage) => `<li>${esc(stage.title)}</li>`).join('')}</ol><div class="capstone-actions"><a class="primary-action" href="CAPSTONE/">Open capstone hub</a><a class="secondary-text-link" href="${esc(capstoneAssignment.path)}" download>Download project brief</a></div></div>
  <aside class="capstone-milestone" aria-live="polite"><span>Current milestone</span><strong data-capstone-milestone-title>${esc(initialCapstoneMilestone.title)}</strong><time datetime="${esc(initialCapstoneMilestone.due)}" data-capstone-milestone-date>Due ${esc(initialCapstoneMilestone.dateLabel)}</time></aside>
</article>`;

const courseUnitsHome = `<section class="course-units-section" id="course-units" aria-labelledby="course-units-title">
  <div class="section-heading"><div><p class="section-kicker">Three course units · eleven lessons</p><h2 id="course-units-title">Build from evidence to a finance decision</h2></div><p>Scan the full course pathway now. The current lesson is highlighted and actionable; later lessons stay visible but locked until release.</p></div>
  <div class="course-unit-stack">${tracks.map(trackSection).join('')}</div>
</section>`;

const courseGuideHome = `<section class="course-guide-section" id="course-guide" aria-labelledby="course-guide-title">
  <div class="section-heading compact"><div><p class="section-kicker">Course essentials</p><h2 id="course-guide-title">Course guide and resources</h2></div><p>Open these supporting sections when you need the learning rhythm, course arc, capstone, or key dates.</p></div>
  <div class="course-guide-list">
    <details class="guide-panel" id="how-to-use"><summary><span><small>How to use this hub</small><strong>Prepare, practice, then apply</strong></span><span class="guide-action" aria-hidden="true">View</span></summary><div class="guide-detail"><p class="guide-intro">Each module follows the same learning rhythm so you always know what to do next.</p><div class="start-grid"><article><span>Prepare</span><h3>Read the lesson briefing</h3><p>Preview the decision, vocabulary, and evidence you will need before class.</p></article><article><span>Practice</span><h3>Build the model</h3><p>Use the slides and starter workbook to make the financial logic auditable.</p></article><article><span>Apply</span><h3>Defend a recommendation</h3><p>Use the case activity to connect the calculation to a management decision.</p></article></div></div></details>
    <details class="guide-panel" id="course-pathway"><summary><span><small>Eleven lessons · three decisions</small><strong>Course pathway</strong></span><span class="guide-action" aria-hidden="true">View</span></summary><div class="guide-detail"><p class="guide-intro">M01–M04 build the evidence base, M05–M08 develop valuation, and M12–M14 turn analysis into firm decisions. M09–M11 are intentionally reserved for review and assessment.</p><div class="pathway-strip" aria-label="Course learning arc">${tracks.map((track) => `<a href="#track-${esc(track.id)}"><span>${esc(track.shortLabel)}</span><strong>${esc(track.label)}</strong></a>`).join('')}</div></div></details>
    ${capstoneSnapshotHome}
    <details class="guide-panel" id="resources"><summary><span><small>Course essentials</small><strong>Resources and key dates</strong></span><span class="guide-action" aria-hidden="true">View</span></summary><div class="guide-detail"><p class="guide-intro">Canvas remains the authority for submissions and exact due dates.</p><div class="resource-layout"><div class="resource-cards"><a href="${esc(term.syllabusPath)}" download><span>Course document</span><strong>Download the Fall 2026 syllabus</strong><small>Policies, grading, learning outcomes, and the complete schedule.</small></a>${term.canvasUrl ? `<a href="${esc(term.canvasUrl)}"><span>Course system</span><strong>Open Canvas</strong><small>Assignments, submissions, announcements, and due dates.</small></a>` : ''}<article><span>Required tools</span><strong>${courseMap.course.requiredTools.map(esc).join(' · ')}</strong><small>Bring your laptop and confirm access before the lesson begins.</small></article></div><div class="assessment-panel"><h3>Assessment weeks</h3><ul>${assessmentItems}</ul></div></div></div></details>
  </div>
</section>`;

const homeHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(courseMap.course.tagline)}"><title>${esc(courseMap.course.code)} · ${esc(courseMap.course.title)} · ${esc(term.label)}</title>
<link rel="icon" href="data:,"><link rel="stylesheet" href="assets/index.css?v=${siteAssetVersion}"></head>
<body><a class="skip-link" href="#main-content">Skip to course content</a>
<header class="site-header">
  <div class="header-bar"><a class="course-mark" href="./">${esc(courseMap.course.code)}</a><nav aria-label="Course navigation"><a href="#course-units">Course units</a><a href="#course-guide">Course guide</a></nav></div>
  <div class="hero-grid">
    <div class="hero-copy"><img class="hero-illustration" src="assets/bus311-finance-judgment-hero.jpg" alt="Financial statements and an Excel-style worksheet feed a cash-flow line into a CFO and Board recommendation." width="1200" height="800" decoding="async"><div class="hero-copy-content"><p class="eyebrow">${esc(term.label)} · ${esc(term.meetingPattern)}</p><h1>${esc(courseMap.course.title)}</h1><p class="hero-tagline">${esc(courseMap.course.tagline)}</p><p class="hero-promise">${esc(courseMap.course.studentPromise)}</p><div class="hero-actions"><a class="lessons-jump" href="#course-units">Explore the course units <span aria-hidden="true">↓</span></a></div></div></div>
  </div>
</header>
<main id="main-content">
  ${courseUnitsHome}
  ${courseGuideHome}
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
<main id="lesson-content" class="lesson-shell">${lesson.module === "M01" ? `<section class="learning-plan" aria-labelledby="learning-plan-title"><div class="section-heading compact"><div><p class="section-kicker">Learning plan</p><h2 id="learning-plan-title">What to do</h2></div><p>Complete the stages in order unless your instructor gives different directions in Canvas.</p></div><div class="learning-plan-grid"><article><span>Prepare</span><p>${esc(lesson.prepare)}</p></article><article><span>Practice</span><p>${esc(lesson.practice)}</p></article><article><span>Apply</span><p>${esc(lesson.apply)}</p></article></div></section>` : ""}
<section class="lesson-resources" aria-labelledby="lesson-resources-title"><div class="section-heading compact"><div><p class="section-kicker">Lesson files</p><h2 id="lesson-resources-title">Resources</h2></div><p>Download workbook files before class so you are ready to model, interpret, and decide.</p></div><div class="material-grid">${lessonMaterials}</div></section>
<div class="lesson-content-grid"><article class="reading-content"><p class="section-kicker">Pre-class briefing</p>${readingHtml}</article><aside class="outcome-panel"><h2>Learning outcomes</h2><ul>${lessonOutcomes}</ul><p><strong>Case:</strong> ${esc(lesson.caseStudy)}</p><p><strong>Skills:</strong> ${lesson.skillFocus.map(esc).join(' · ')}</p></aside></div>
<nav class="lesson-pagination" aria-label="Lesson sequence">${previous ? `<a href="../../${esc(lessonHref(previous))}"><span>Previous lesson</span><strong>${esc(previous.displayModule)} · ${esc(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a class="next" href="../../${esc(lessonHref(next))}"><span>Next lesson</span><strong>${esc(next.displayModule)} · ${esc(next.title)}</strong></a>` : '<a class="next" href="../../"><span>Course complete</span><strong>Return to the course pathway</strong></a>'}</nav></main>
<footer><strong>${esc(courseMap.course.code)} · ${esc(lesson.displayModule)}</strong><a href="../../">${esc(courseMap.course.code)} course home</a><span>Canvas is the authority for submission instructions and due dates</span></footer></body></html>`;
  const destination = path.join(root, lessonDirectory(lesson), 'index.html');
  await fs.writeFile(destination, lessonHtml);
}

console.log(`Built index.html and ${lessons.length} lesson pages for ${term.label}.`);
