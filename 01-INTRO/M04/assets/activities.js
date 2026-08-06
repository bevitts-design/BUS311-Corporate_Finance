(function(){
  function setPressed(button, group){
    group.querySelectorAll('button[data-correct]').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
  }

  document.querySelectorAll('[data-interactive] button[data-correct]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      setPressed(button, button.closest('[data-interactive]'));
    });
  });

  document.querySelectorAll('[data-action="check-choice"]').forEach((check) => check.addEventListener('click', (event) => {
    event.stopPropagation();
    const group = check.closest('[data-interactive]');
    const selected = group.querySelector('button[data-correct][aria-pressed="true"]');
    const output = group.querySelector('output');
    group.querySelectorAll('button[data-correct]').forEach((button) => button.classList.remove('correct','incorrect'));
    if(!selected){ output.textContent = 'Choose one response before checking.'; return; }
    const correct = selected.dataset.correct === 'true';
    selected.classList.add(correct ? 'correct' : 'incorrect');
    const answer = group.querySelector('button[data-correct="true"]');
    if(correct){
      output.textContent = group.dataset.interactive === 'denominator'
        ? 'Correct: a period flow should be compared with average beginning and ending equity.'
        : 'Correct: test debt service and the leverage driver before treating growth or ROE as proof.';
    }else{
      answer.classList.add('correct');
      output.textContent = group.dataset.interactive === 'denominator'
        ? 'Recheck the time alignment: net income covers a period, so equity should represent that period.'
        : 'Recheck the constraint: coverage below 1.0× means operating profit does not cover interest.';
    }
  }));

  const margin = document.getElementById('margin-slider');
  const turnover = document.getElementById('turnover-slider');
  const leverage = document.getElementById('leverage-slider');
  const updateDupont = () => {
    if(!margin || !turnover || !leverage) return;
    const m = Number(margin.value); const t = Number(turnover.value); const l = Number(leverage.value);
    document.getElementById('margin-value').textContent = m.toFixed(0) + '%';
    document.getElementById('turnover-value').textContent = t.toFixed(1) + '×';
    document.getElementById('leverage-value').textContent = l.toFixed(1) + '×';
    document.getElementById('roe-output').textContent = (m * t * l).toFixed(1) + '%';
    const drivers = [m / 10, t / 1.5, l / 2.7];
    const labels = ['margin','asset turnover','leverage'];
    const leader = labels[drivers.indexOf(Math.max(...drivers))];
    document.getElementById('roe-driver').textContent = 'Largest relative driver: ' + leader + '.';
  };
  [margin,turnover,leverage].forEach((input) => input && input.addEventListener('input', updateDupont));
  updateDupont();

  const exitFeedback = document.getElementById('exit-feedback');
  document.querySelectorAll('[data-exit]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelectorAll('[data-exit]').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
    if(exitFeedback) exitFeedback.textContent = 'Now complete the four-part sentence and name the evidence you would verify next.';
  }));
})();
