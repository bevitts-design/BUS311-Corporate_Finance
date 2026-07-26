(function(){
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const setPressed = (button, group) => {
    group.forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
  };

  const pecking = all('[data-interactive="pecking"] [data-choice]');
  pecking.forEach((button) => button.addEventListener('click', () => setPressed(button, pecking)));
  one('[data-action="check-pecking"]')?.addEventListener('click', () => {
    const selected = pecking.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.choice;
    const feedback = one('#pecking-feedback');
    if(!selected) feedback.textContent = 'Choose a financing source first.';
    else if(selected === 'internal') feedback.textContent = 'Likely first choice: internal funds. Now name the liquidity or capacity constraint that could change it.';
    else feedback.textContent = 'Defensible only with a constraint. Explain why internal cash is less attractive in this situation.';
  });

  const cycleDirection = (button) => {
    const next = button.dataset.state === 'unset' ? 'up' : button.dataset.state === 'up' ? 'down' : 'unset';
    button.dataset.state = next;
    button.querySelector('strong').textContent = next === 'up' ? 'Increases' : next === 'down' ? 'Decreases' : 'Choose ↑ or ↓';
  };
  const buybackButtons = all('[data-interactive="buyback"] [data-metric]');
  buybackButtons.forEach((button) => button.addEventListener('click', () => cycleDirection(button)));
  one('[data-action="check-buyback"]')?.addEventListener('click', () => {
    const expected = {cash:'down',equity:'down',shares:'down'};
    const complete = buybackButtons.every((button) => button.dataset.state !== 'unset');
    const correct = buybackButtons.every((button) => button.dataset.state === expected[button.dataset.metric]);
    one('#buyback-feedback').textContent = !complete ? 'Set all three directions.' : correct ? 'Correct: cash, total equity, and outstanding shares all decrease.' : 'Recheck the exchange: the company pays cash to remove investor claims.';
  });

  const voteShares = one('#vote-shares');
  const voteSeats = one('#vote-seats');
  const renderVoteThreshold = () => {
    const shares = Math.max(1, Math.floor(Number(voteShares.value) || 1));
    const seats = Math.max(1, Math.floor(Number(voteSeats.value) || 1));
    const threshold = Math.floor(shares / (seats + 1)) + 1;
    one('#vote-cell-b4').textContent = shares.toLocaleString();
    one('#vote-cell-b5').textContent = seats.toLocaleString();
    one('#vote-cell-b6').textContent = threshold.toLocaleString();
    one('#vote-result').textContent = threshold.toLocaleString() + ' shares';
  };
  one('[data-action="calculate-votes"]')?.addEventListener('click', renderVoteThreshold);
  [voteShares,voteSeats].filter(Boolean).forEach((input) => input.addEventListener('input', renderVoteThreshold));
  if(voteShares && voteSeats) renderVoteThreshold();

  const featureExpected = {call:'up',convertible:'down',sinking:'down',pledge:'down',junior:'up',private:'up'};
  const featureButtons = all('[data-interactive="features"] [data-feature]');
  featureButtons.forEach((button) => button.addEventListener('click', () => cycleDirection(button)));
  one('[data-action="check-features"]')?.addEventListener('click', () => {
    const complete = featureButtons.every((button) => button.dataset.state !== 'unset');
    const score = featureButtons.filter((button) => button.dataset.state === featureExpected[button.dataset.feature]).length;
    one('#feature-feedback').textContent = !complete ? 'Classify all six features.' : score === 6 ? 'All six are correct. Explain one answer as a transfer of risk or optionality.' : score + ' of 6 correct. Recheck which party receives the option or protection.';
  });

  const predictionButtons = all('[data-interactive="factset-prediction"] [data-prediction]');
  predictionButtons.forEach((button) => button.addEventListener('click', () => {
    const next = button.dataset.state === 'unset' ? 'up' : button.dataset.state === 'up' ? 'down' : button.dataset.state === 'down' ? 'unknown' : 'unset';
    button.dataset.state = next;
    button.querySelector('strong').textContent = next === 'up'
      ? 'Increase ↑'
      : next === 'down'
        ? 'Decrease ↓'
        : next === 'unknown'
          ? 'Not determined'
          : 'Choose a direction';
  }));
})();
