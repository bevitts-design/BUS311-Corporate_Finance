(function(){
  const projectButtons = [...document.querySelectorAll('[data-interactive="project-fit"] button')];
  projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      projectButtons.forEach((item) => {
        item.classList.remove('selected', 'correct', 'incorrect');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
    });
  });
  document.querySelector('[data-action="check-project"]')?.addEventListener('click', () => {
    const selected = projectButtons.find((button) => button.classList.contains('selected'));
    projectButtons.forEach((button) => {
      const isCorrect = button.dataset.project === 'core';
      button.classList.toggle('correct', isCorrect);
      button.classList.toggle('incorrect', Boolean(selected) && button === selected && !isCorrect);
    });
    const feedback = document.getElementById('project-feedback');
    if(!selected){
      feedback.textContent = 'Choose one project before checking.';
    }else if(selected.dataset.project === 'core'){
      feedback.textContent = 'Correct: the core retail project matches the company-risk assumption.';
    }else{
      feedback.textContent = 'Not yet: the lending venture needs a risk-matched hurdle rate.';
    }
  });

  const explicitCashFlows = [55.4, 70.3, 80.2, 83.2];
  const enterpriseValue = (wacc, growth) => {
    const presentForecast = explicitCashFlows.reduce(
      (sum, cashFlow, index) => sum + cashFlow / Math.pow(1 + wacc, index + 1),
      0
    );
    const horizon = explicitCashFlows.at(-1) * (1 + growth) / (wacc - growth);
    return presentForecast + horizon / Math.pow(1 + wacc, explicitCashFlows.length);
  };
  const waccSlider = document.getElementById('wacc-slider');
  const growthSlider = document.getElementById('growth-slider');
  const updateDcf = () => {
    if(!waccSlider || !growthSlider) return;
    const wacc = Number(waccSlider.value) / 100;
    const growth = Number(growthSlider.value) / 100;
    const spread = wacc - growth;
    document.getElementById('wacc-value').textContent = (wacc * 100).toFixed(1) + '%';
    document.getElementById('growth-value').textContent = (growth * 100).toFixed(1) + '%';
    document.getElementById('enterprise-value').textContent = '$' + enterpriseValue(wacc, growth).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'M';
    document.getElementById('valuation-warning').textContent = 'WACC − g = ' + (spread * 100).toFixed(1) + ' percentage points';
  };
  waccSlider?.addEventListener('input', updateDcf);
  growthSlider?.addEventListener('input', updateDcf);
  updateDcf();

  const auditButtons = [...document.querySelectorAll('[data-interactive="audit"] button')];
  auditButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      button.classList.remove('correct', 'incorrect');
      button.setAttribute('aria-pressed', button.classList.contains('selected') ? 'true' : 'false');
    });
  });
  document.querySelector('[data-action="check-audit"]')?.addEventListener('click', () => {
    let selectedCount = 0;
    auditButtons.forEach((button) => {
      const selected = button.classList.contains('selected');
      selectedCount += selected ? 1 : 0;
      button.classList.toggle('correct', selected);
      button.classList.toggle('incorrect', !selected);
    });
    const feedback = document.getElementById('audit-feedback');
    feedback.textContent = selectedCount === auditButtons.length
      ? 'Complete: all four checks are required before using the result.'
      : selectedCount + ' of ' + auditButtons.length + ' required checks selected.';
  });

  const exitPrompts = {
    build: 'Write the weighted-return formula and identify the debt-only tax factor.',
    match: 'State when company WACC fits and name evidence for a different-risk rate.',
    value: 'Bridge unlevered FCF to enterprise value, then to equity value per share.'
  };
  document.querySelectorAll('[data-exit]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-exit]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('exit-feedback').textContent = exitPrompts[button.dataset.exit];
    });
  });
})();
