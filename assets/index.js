const search = document.querySelector('[data-search]');
const track = document.querySelector('[data-track-filter]');
const clearSearch = document.querySelector('[data-clear-search]');
const resetFilters = document.querySelector('[data-reset-filters]');
const status = document.querySelector('[data-results-status]');
const noResults = document.querySelector('[data-no-results]');
const searchTools = document.querySelector('[data-search-tools]');
const viewButtons = [...document.querySelectorAll('[data-lesson-view]')];
const entries = [...document.querySelectorAll('[data-directory-entry]')];
const groups = [...document.querySelectorAll('[data-directory-group]')];
const capstoneSnapshot = document.querySelector('[data-capstone-milestones]');
let lessonView = 'this-week';

function applyFilters({ announce = true } = {}) {
  const query = (search?.value || '').trim().toLowerCase();
  const selectedTrack = track?.value || 'all';

  entries.forEach((entry) => {
    const matchesView = lessonView === 'all' || entry.dataset.directoryCurrent === 'true';
    const matchesText = lessonView !== 'all' || !query || entry.dataset.searchText.includes(query);
    const matchesTrack = lessonView !== 'all' || selectedTrack === 'all' || entry.dataset.track === selectedTrack;
    entry.classList.toggle('hidden', !(matchesView && matchesText && matchesTrack));
  });

  groups.forEach((group) => {
    const hasVisibleLesson = [...group.querySelectorAll('[data-directory-entry]')]
      .some((entry) => !entry.classList.contains('hidden'));
    group.classList.toggle('hidden', !hasVisibleLesson);
  });

  const visibleCount = entries.filter((entry) => !entry.classList.contains('hidden')).length;
  const filtering = lessonView === 'all' && (Boolean(query) || selectedTrack !== 'all');
  if (clearSearch) clearSearch.hidden = !query;
  if (noResults) noResults.hidden = visibleCount !== 0;
  if (status) {
    if (lessonView === 'this-week') {
      status.textContent = visibleCount === 1 ? 'Showing the current lesson' : 'No current lesson is available';
    } else {
      status.textContent = filtering
        ? `${visibleCount} lesson${visibleCount === 1 ? '' : 's'} found`
        : `${entries.length} lessons in the course pathway`;
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
document.querySelectorAll('[data-open-view="all"]').forEach((link) => {
  link.addEventListener('click', () => setLessonView('all', { announce: false }));
});

setLessonView(window.location.hash === '#find-a-lesson' ? 'all' : 'this-week', { announce: false });
updateCapstoneMilestone();
