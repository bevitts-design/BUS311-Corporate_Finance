(function(){
  const singleChoice = (selector) => {
    const buttons = [...document.querySelectorAll(selector)];
    buttons.forEach((button) => button.addEventListener('click', () => {
      buttons.forEach((item) => {
        item.classList.remove('selected','correct','incorrect');
        item.setAttribute('aria-pressed','false');
      });
      button.classList.add('selected');
      button.setAttribute('aria-pressed','true');
    }));
    return buttons;
  };

  const signButtons = singleChoice('[data-interactive="signs"] button');
  document.querySelector('[data-action="check-signs"]')?.addEventListener('click', () => {
    const selected = signButtons.find((button) => button.classList.contains('selected'));
    const feedback = document.getElementById('sign-feedback');
    if(!selected){ feedback.textContent = 'Choose a formula before checking.'; return; }
    const correct = selected.dataset.correct === 'true';
    selected.classList.add(correct ? 'correct' : 'incorrect');
    feedback.textContent = correct
      ? 'Correct: the present value is negative because $10,000 leaves today.'
      : 'Recheck the cash-flow direction and the FV argument order.';
  });

  const rateButtons = singleChoice('[data-interactive="rates"] button');
  document.querySelector('[data-action="check-rates"]')?.addEventListener('click', () => {
    const selected = rateButtons.find((button) => button.classList.contains('selected'));
    const feedback = document.getElementById('rate-feedback');
    if(!selected){ feedback.textContent = 'Choose a rate-and-period pair before checking.'; return; }
    const correct = selected.dataset.correct === 'true';
    selected.classList.add(correct ? 'correct' : 'incorrect');
    feedback.textContent = correct
      ? 'Correct: 1% per month and 24 monthly periods use matching units.'
      : 'Not yet: convert the nominal APR to a monthly rate and keep n in months.';
  });

  const rateSlider = document.getElementById('fv-rate');
  const updateFutureValue = () => {
    if(!rateSlider) return;
    const rate = Number(rateSlider.value) / 100;
    const value = 10000 * Math.pow(1 + rate, 5);
    document.getElementById('fv-rate-value').textContent = rateSlider.value + '%';
    document.getElementById('fv-output').textContent = value.toLocaleString('en-US',{style:'currency',currency:'USD'});
    document.getElementById('fv-decision').textContent = value >= 16000
      ? 'Clears the $16,000 threshold'
      : 'Below the $16,000 threshold';
  };
  rateSlider?.addEventListener('input', updateFutureValue);
  updateFutureValue();

  const patternCards = [...document.querySelectorAll('[data-interactive="patterns"] button')];
  let activePatternCard = null;
  patternCards.forEach((card) => card.addEventListener('click', () => {
    patternCards.forEach((item) => item.classList.remove('selected','correct','incorrect'));
    card.classList.add('selected');
    activePatternCard = card;
  }));
  document.querySelectorAll('[data-pattern]').forEach((button) => button.addEventListener('click', () => {
    if(!activePatternCard){
      document.getElementById('pattern-feedback').textContent = 'Select a business scenario first.';
      return;
    }
    activePatternCard.dataset.choice = button.dataset.pattern;
    activePatternCard.querySelector('small').textContent = 'Assigned: ' + button.textContent;
    activePatternCard.classList.remove('correct','incorrect');
  }));
  document.querySelector('[data-action="check-patterns"]')?.addEventListener('click', () => {
    let correct = 0;
    let assigned = 0;
    patternCards.forEach((card) => {
      if(!card.dataset.choice) return;
      assigned += 1;
      const match = card.dataset.choice === card.dataset.correct;
      card.classList.toggle('correct',match);
      card.classList.toggle('incorrect',!match);
      if(match) correct += 1;
    });
    document.getElementById('pattern-feedback').textContent = assigned < patternCards.length
      ? 'Assign all three scenarios before checking.'
      : correct === patternCards.length
        ? 'All three match the cash-flow shape.'
        : correct + ' of 3 are correct. Check whether the stream has an end date.';
  });

  const exitPrompts = {
    timeline:'Use a quick sketch to label t=0, each payment date, and cash-flow direction.',
    excel:'Read the FV or PV arguments aloud and attach a unit to rate and n.',
    decision:'State amount, value date, required return, and the assumption to stress-test.'
  };
  document.querySelectorAll('[data-exit]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-exit]').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    document.getElementById('exit-feedback').textContent = exitPrompts[button.dataset.exit];
  }));
})();
