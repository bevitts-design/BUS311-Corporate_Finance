const search = document.querySelector('[data-search]');
const track = document.querySelector('[data-track-filter]');
const clearSearch = document.querySelector('[data-clear-search]');
const resetFilters = document.querySelector('[data-reset-filters]');
const status = document.querySelector('[data-results-status]');
const noResults = document.querySelector('[data-no-results]');
const cards = [...document.querySelectorAll('[data-lesson-card]')];
const sections = [...document.querySelectorAll('[data-track-section]')];

function applyFilters({ announce = true } = {}) {
  const query = (search?.value || '').trim().toLowerCase();
  const selectedTrack = track?.value || 'all';

  cards.forEach((card) => {
    const matchesText = !query || card.dataset.searchText.includes(query);
    const matchesTrack = selectedTrack === 'all' || card.dataset.track === selectedTrack;
    card.classList.toggle('hidden', !(matchesText && matchesTrack));
  });

  sections.forEach((section) => {
    const hasVisibleLesson = [...section.querySelectorAll('[data-lesson-card]')]
      .some((card) => !card.classList.contains('hidden'));
    section.classList.toggle('hidden', !hasVisibleLesson);
  });

  const visibleCount = cards.filter((card) => !card.classList.contains('hidden')).length;
  const filtering = Boolean(query) || selectedTrack !== 'all';
  if (clearSearch) clearSearch.hidden = !query;
  if (noResults) noResults.hidden = visibleCount !== 0;
  if (status) {
    status.textContent = filtering
      ? `${visibleCount} lesson${visibleCount === 1 ? '' : 's'} found`
      : `${cards.length} lessons in the course pathway`;
    if (!announce) status.setAttribute('aria-live', 'off');
    else status.setAttribute('aria-live', 'polite');
  }
}

function showAllLessons({ focusSearch = false } = {}) {
  if (search) search.value = '';
  if (track) track.value = 'all';
  applyFilters();
  if (focusSearch) search?.focus();
}

search?.addEventListener('input', () => applyFilters());
track?.addEventListener('change', () => applyFilters());
clearSearch?.addEventListener('click', () => {
  if (search) search.value = '';
  applyFilters();
  search?.focus();
});
resetFilters?.addEventListener('click', () => showAllLessons({ focusSearch: true }));

applyFilters({ announce: false });
