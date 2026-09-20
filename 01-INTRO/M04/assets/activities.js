(function(){
  document.querySelectorAll('[data-teach]').forEach((panel) => {
    const next = panel.querySelector('[data-teach-next]');
    const labels = panel.dataset.teach === 'factors'
      ? ['Reveal net margin','Reveal asset turnover','Reveal equity multiplier','All factors revealed']
      : ['Cancel revenue','Cancel average assets','Show the matching ROE','Identity complete'];
    const messages = panel.dataset.teach === 'factors'
      ? ['Use the workbook inputs to predict each factor before revealing.','Net margin: the profitability measure from the previous slide.','Asset turnover: the E7 result you already calculated.','Equity multiplier: the new factor. Next, explain why their product is ROE.']
      : ['Which terms appear once above and once below a fraction line?','Revenue cancels. Which other terms cancel?','Average assets cancels. Net income ÷ average equity remains.','Same inputs, same 40% ROE. Now investigate the drivers.'];
    function show(stage){
      panel.dataset.stage = String(stage);
      panel.querySelectorAll('[data-reveal]').forEach(el => el.hidden = Number(el.dataset.reveal) > stage);
      next.textContent = labels[stage]; next.disabled = stage === 3;
      panel.querySelector('output').textContent = messages[stage];
    }
    next.addEventListener('click',event => {event.stopPropagation();show(Math.min(3,Number(panel.dataset.stage)+1));});
    panel.querySelector('[data-teach-reset]').addEventListener('click',event => {event.stopPropagation();show(0);});
    show(0);
  });
  function setPressed(button, group){
    group.querySelectorAll('button[data-correct]').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
  }

  document.querySelectorAll('[data-interactive] button[data-correct]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const group = button.closest('[data-interactive]');
      setPressed(button, group);
      if(group.dataset.interactive === 'denominator'){
        group.querySelectorAll('button[data-correct]').forEach((item) => item.classList.remove('correct','incorrect'));
        group.querySelector('output').textContent = 'Selected: ' + button.textContent.trim() + '. Click Check answer.';
      }
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
    document.getElementById('leverage-value').textContent = l.toFixed(2) + '×';
    document.getElementById('roe-output').textContent = (m * t * l).toFixed(1) + '%';
    const drivers = [m / 10, t / 1.5, l / (80000 / 30000)];
    const labels = ['margin','asset turnover','leverage'];
    const leader = labels[drivers.indexOf(Math.max(...drivers))];
    document.getElementById('roe-driver').textContent = drivers.every(value => Math.abs(value - 1) < 1e-10)
      ? 'Class example: 10% × 1.50 × (80,000 / 30,000).'
      : 'Largest relative driver versus class example: ' + leader + '.';
  };
  [margin,turnover,leverage].forEach((input) => input && input.addEventListener('input', updateDupont));
  document.getElementById('reset-dupont')?.addEventListener('click', () => {
    margin.value = '10'; turnover.value = '1.5'; leverage.value = String(80000 / 30000);
    updateDupont();
  });
  updateDupont();

  const exitFeedback = document.getElementById('exit-feedback');
  document.querySelectorAll('[data-exit]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelectorAll('[data-exit]').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
    if(exitFeedback) exitFeedback.textContent = button.dataset.exit === 'financing'
      ? 'Yes: the equity multiplier changed. Explain one financing risk to check.'
      : 'Trace the factor that changed: margin and turnover stayed fixed. Revise your choice and explain the risk.';
  }));
})();
