(function(){
  const feedbackCopy = {
    'price-class': {
      correct: 'Correct: 5% coupon < 6% YTM, so $925.61 is a discount price.',
      incorrect: 'Recheck the fixed coupon against the market-required yield.'
    },
    'ytm-formula': {
      correct: 'Correct: RATE solves the periodic return; × B5 annualizes the quoted YTM.',
      incorrect: 'Look for the function that solves an unknown periodic return from price and cash flows.'
    },
    'duration-choice': {
      correct: 'Correct: the 20-year, 3% coupon bond concentrates value later and has higher duration.',
      incorrect: 'Compare when the value arrives: long maturity and low coupon amplify sensitivity.'
    },
    'cfo-choice': {
      correct: 'Strongest formative choice: resize and stage; no full-size scenario clears both leverage guardrails.',
      incorrect: 'Compare “best among the scenarios” with “acceptable against the benchmarks.”'
    }
  };

  document.querySelectorAll('[data-prediction] button').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('[data-prediction]').querySelectorAll('button').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  document.querySelectorAll('[data-choice-group]').forEach((group) => {
    group.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((item) => {
          item.classList.remove('selected', 'correct', 'incorrect');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
      });
    });
  });

  document.querySelectorAll('[data-check]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.check;
      const group = document.querySelector(`[data-choice-group="${name}"]`);
      const selected = group?.querySelector('button.selected');
      const output = document.getElementById(`${name}-feedback`);
      if(!selected){
        output.textContent = 'Choose an answer before checking.';
        return;
      }
      const isCorrect = selected.dataset.correct === 'true';
      selected.classList.add(isCorrect ? 'correct' : 'incorrect');
      output.textContent = feedbackCopy[name][isCorrect ? 'correct' : 'incorrect'];
    });
  });

  document.querySelectorAll('[data-reset]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.reset;
      const group = document.querySelector(`[data-choice-group="${name}"]`);
      group?.querySelectorAll('button').forEach((item) => {
        item.classList.remove('selected', 'correct', 'incorrect');
        item.setAttribute('aria-pressed', 'false');
      });
      document.getElementById(`${name}-feedback`).textContent = 'Choose before checking.';
    });
  });

  const bondPrice = (annualYield) => {
    const rate = annualYield / 2;
    const periods = 20;
    const coupon = 25;
    return coupon * (1 - Math.pow(1 + rate, -periods)) / rate + 1000 * Math.pow(1 + rate, -periods);
  };
  const yieldSlider = document.getElementById('yield-slider');
  const updateYield = () => {
    if(!yieldSlider) return;
    const annualYield = Number(yieldSlider.value) / 100;
    const price = bondPrice(annualYield);
    const difference = price - 1000;
    document.getElementById('yield-value').textContent = (annualYield * 100).toFixed(1) + '%';
    document.getElementById('yield-price').textContent = '$' + price.toFixed(2);
    const priceClass = Math.abs(difference) < 0.01 ? 'Par' : difference > 0 ? 'Premium' : 'Discount';
    document.getElementById('yield-class').textContent = priceClass + ' · ' + (difference >= 0 ? '$' : '−$') + Math.abs(difference).toFixed(2) + (Math.abs(difference) < 0.01 ? ' from par' : difference > 0 ? ' above par' : ' below par');
    const left = 15 + (price - 796.1451048254846) / (1081.7571667229856 - 796.1451048254846) * 70;
    const marker = document.getElementById('price-marker');
    marker.style.left = Math.max(15, Math.min(85, left)) + '%';
    marker.style.background = difference >= 0 ? 'var(--teal)' : 'var(--terra)';
  };
  yieldSlider?.addEventListener('input', updateYield);
  document.querySelector('[data-reset-yield]')?.addEventListener('click', () => {
    yieldSlider.value = '6';
    updateYield();
  });
  updateYield();

  const exitCopy = {
    resize: 'cite $977.48 price, a breached leverage ratio, and the trigger you would monitor',
    proceed: 'defend the full-size issue with $977.48 price, two ratios, and a risk trigger'
  };
  document.querySelectorAll('[data-exit]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-exit]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('exit-evidence').textContent = exitCopy[button.dataset.exit];
    });
  });
})();
