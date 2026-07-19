const search = document.querySelector('[data-search]');
const track = document.querySelector('[data-track-filter]');

function applyFilters() {
  const query = (search?.value || '').trim().toLowerCase();
  const selectedTrack = track?.value || 'all';
  document.querySelectorAll('[data-lesson-card]').forEach((card) => {
    const matchesText = !query || card.dataset.searchText.includes(query);
    const matchesTrack = selectedTrack === 'all' || card.dataset.track === selectedTrack;
    card.classList.toggle('hidden', !(matchesText && matchesTrack));
  });
  document.querySelectorAll('[data-track-section]').forEach((section) => {
    const hasVisible = [...section.querySelectorAll('[data-lesson-card]')].some((card) => !card.classList.contains('hidden'));
    section.classList.toggle('hidden', !hasVisible);
  });
}

search?.addEventListener('input', applyFilters);
track?.addEventListener('change', applyFilters);
