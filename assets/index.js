const search = document.querySelector('[data-search]');
const track = document.querySelector('[data-track-filter]');
const clearSearch = document.querySelector('[data-clear-search]');
const resetFilters = document.querySelector('[data-reset-filters]');
const status = document.querySelector('[data-results-status]');
const noResults = document.querySelector('[data-no-results]');
const searchTools = document.querySelector('[data-search-tools]');
const viewButtons = [...document.querySelectorAll('[data-lesson-view]')];
const cards = [...document.querySelectorAll('[data-lesson-card]')];
const sections = [...document.querySelectorAll('[data-track-section]')];
const capstoneSnapshot = document.querySelector('[data-capstone-milestones]');
let lessonView = 'this-week';

function applyFilters({ announce = true } = {}) {
  const query = (search?.value || '').trim().toLowerCase();
  const selectedTrack = track?.value || 'all';

  cards.forEach((card) => {
    const matchesView = lessonView === 'all' || card.dataset.current === 'true';
    const matchesText = lessonView !== 'all' || !query || card.dataset.searchText.includes(query);
    const matchesTrack = lessonView !== 'all' || selectedTrack === 'all' || card.dataset.track === selectedTrack;
    card.classList.toggle('hidden', !(matchesView && matchesText && matchesTrack));
  });

  sections.forEach((section) => {
    const hasVisibleLesson = [...section.querySelectorAll('[data-lesson-card]')]
      .some((card) => !card.classList.contains('hidden'));
    section.classList.toggle('hidden', !hasVisibleLesson);
  });

  const visibleCount = cards.filter((card) => !card.classList.contains('hidden')).length;
  const filtering = lessonView === 'all' && (Boolean(query) || selectedTrack !== 'all');
  if (clearSearch) clearSearch.hidden = !query;
  if (noResults) noResults.hidden = visibleCount !== 0;
  if (status) {
    if (lessonView === 'this-week') {
      status.textContent = visibleCount === 1 ? 'Showing the current lesson' : 'No current lesson is available';
    } else {
      status.textContent = filtering
        ? `${visibleCount} lesson${visibleCount === 1 ? '' : 's'} found`
        : `${cards.length} lessons in the course pathway`;
    }
    if (!announce) status.setAttribute('aria-live', 'off');
    else status.setAttribute('aria-live', 'polite');
  }
}

function setLessonView(nextView, { announce = true } = {}) {
  lessonView = nextView === 'all' ? 'all' : 'this-week';
  viewButtons.forEach((button) => {
    const selected = button.dataset.lessonView === lessonView;
    button.setAttribute('aria-pressed', String(selected));
  });
  if (searchTools) searchTools.hidden = lessonView !== 'all';
  applyFilters({ announce });
}

function showAllLessons({ focusSearch = false } = {}) {
  if (search) search.value = '';
  if (track) track.value = 'all';
  setLessonView('all');
  if (focusSearch) search?.focus();
}

function updateCapstoneMilestone() {
  if (!capstoneSnapshot) return;
  try {
    const milestones = JSON.parse(capstoneSnapshot.dataset.capstoneMilestones || '[]');
    if (!milestones.length) return;
    const now = Date.now();
    const milestone = milestones.find((item) => Date.parse(item.due) >= now) || milestones[milestones.length - 1];
    const title = capstoneSnapshot.querySelector('[data-capstone-milestone-title]');
    const date = capstoneSnapshot.querySelector('[data-capstone-milestone-date]');
    if (title) title.textContent = milestone.title;
    if (date) {
      date.textContent = `Due ${milestone.dateLabel}`;
      date.setAttribute('datetime', milestone.due);
    }
  } catch {
    // Keep the source-rendered first milestone if structured data is unavailable.
  }
}

viewButtons.forEach((button) => {
  button.addEventListener('click', () => setLessonView(button.dataset.lessonView));
});
search?.addEventListener('input', () => applyFilters());
track?.addEventListener('change', () => applyFilters());
clearSearch?.addEventListener('click', () => {
  if (search) search.value = '';
  applyFilters();
  search?.focus();
});
resetFilters?.addEventListener('click', () => showAllLessons({ focusSearch: true }));
document.querySelectorAll('[data-open-view="all"], a[href^="#track-"]').forEach((link) => {
  link.addEventListener('click', () => setLessonView('all', { announce: false }));
});

setLessonView(window.location.hash.startsWith('#track-') ? 'all' : 'this-week', { announce: false });
updateCapstoneMilestone();
