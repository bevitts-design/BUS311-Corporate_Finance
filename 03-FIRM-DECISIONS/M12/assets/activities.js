(function(){
  const riskItems = [...document.querySelectorAll('[data-interactive="risk-sort"] article')];
  riskItems.forEach((item) => {
    item.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        item.querySelectorAll('button').forEach((peer) => peer.classList.remove('selected'));
        button.classList.add('selected');
        item.classList.remove('correct', 'incorrect');
      });
    });
  });

  document.querySelector('[data-action="check-risk-sort"]')?.addEventListener('click', () => {
    let correct = 0;
    riskItems.forEach((item) => {
      const selected = item.querySelector('button.selected')?.dataset.choice;
      const matches = selected === item.dataset.answer;
      item.classList.toggle('correct', matches);
      item.classList.toggle('incorrect', Boolean(selected) && !matches);
      if(matches) correct += 1;
    });
    const feedback = document.getElementById('risk-sort-feedback');
    feedback.textContent = correct === riskItems.length
      ? 'All four are correct: unique shocks diversify; common shocks remain.'
      : correct + ' of ' + riskItems.length + ' classifications are correct.';
  });

  const betaSlider = document.getElementById('beta-slider');
  const updateBetaLab = () => {
    if(!betaSlider) return;
    const beta = Number(betaSlider.value);
    const required = 4 + beta * 6;
    document.getElementById('beta-value').textContent = beta.toFixed(2);
    document.getElementById('required-return').textContent = required.toFixed(1) + '%';
    const position = 10 + ((required - 4) / 12) * 80;
    document.getElementById('return-marker').style.left = 'calc(' + position.toFixed(2) + '% - 21px)';
    const interpretation = document.getElementById('return-interpretation');
    if(beta < 1) interpretation.textContent = 'Below-market beta requires a below-market return.';
    else if(beta > 1) interpretation.textContent = 'Above-market beta requires an above-market return.';
    else interpretation.textContent = 'At beta 1, required return equals the market return.';
  };
  betaSlider?.addEventListener('input', updateBetaLab);
  updateBetaLab();

  document.querySelectorAll('[data-interactive="sml-choice"] button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-interactive="sml-choice"] button').forEach((peer) => peer.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  const projectButtons = [...document.querySelectorAll('[data-interactive="project-beta"] button')];
  projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      projectButtons.forEach((peer) => peer.classList.remove('selected', 'correct', 'incorrect'));
      button.classList.add('selected');
      document.getElementById('project-beta-feedback').textContent = 'Now calculate the CAPM hurdle and compare it with the 11.0% project IRR.';
    });
  });
  document.querySelector('[data-action="check-project-beta"]')?.addEventListener('click', () => {
    const selected = projectButtons.find((button) => button.classList.contains('selected'));
    if(!selected){
      document.getElementById('project-beta-feedback').textContent = 'Choose a beta first, then check the decision.';
      return;
    }
    const correct = selected.dataset.beta === '0.80';
    selected.classList.toggle('correct', correct);
    selected.classList.toggle('incorrect', !correct);
    document.getElementById('project-beta-feedback').textContent = correct
      ? 'Project beta 0.80 → 8.8% hurdle → 11.0% IRR clears the hurdle.'
      : 'Company beta 1.50 gives 13.0%, but it mismatches this project’s risk.';
  });

  const exitPrompts = {
    firm: 'Firm beta works only when the project matches the firm’s existing asset risk.',
    project: 'Correct: match beta to project risk, then document the comparables and estimation choices.',
    lowest: 'The lowest beta is not automatically correct; use the beta supported by comparable project risk.'
  };
  document.querySelectorAll('[data-exit]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-exit]').forEach((peer) => peer.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('exit-feedback').textContent = exitPrompts[button.dataset.exit];
    });
  });
})();
