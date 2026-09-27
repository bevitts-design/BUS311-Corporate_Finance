(function () {
  document.querySelectorAll('[data-reveal]').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(`answer-${button.dataset.reveal}`);
      if (!answer) return;
      const show = answer.hidden;
      answer.hidden = !show;
      button.setAttribute('aria-expanded', String(show));
      button.textContent = show ? 'Hide result' : 'Reveal result';
    });
  });
})();
