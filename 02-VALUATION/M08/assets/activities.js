(function(){
  const money = (value) => (value >= 0 ? '+' : '−') + '$' + Math.abs(value).toFixed(2) + 'M';

  const cashflowButtons = [...document.querySelectorAll('[data-interactive="cashflow"] button')];
  cashflowButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      button.classList.remove('correct', 'incorrect');
    });
  });
  document.querySelector('[data-action="check-cashflows"]')?.addEventListener('click', () => {
    let correct = 0;
    cashflowButtons.forEach((button) => {
      const shouldSelect = button.dataset.correct === 'true';
      const selected = button.classList.contains('selected');
      const matches = selected === shouldSelect;
      button.classList.toggle('correct', matches);
      button.classList.toggle('incorrect', !matches);
      if(matches) correct += 1;
    });
    const feedback = document.getElementById('cashflow-feedback');
    feedback.textContent = correct === cashflowButtons.length
      ? 'Exactly right: include caused cash flows; exclude sunk and financing costs.'
      : correct + ' of ' + cashflowButtons.length + ' choices are classified correctly.';
  });

  const rateSlider = document.getElementById('rate-slider');
  const cashFlows = [0.95, 1.05, 1.15, 1.20, 1.60];
  const updateRateLab = () => {
    if(!rateSlider) return;
    const rate = Number(rateSlider.value) / 100;
    const npv = -3.6 + cashFlows.reduce((sum, cashFlow, index) => sum + cashFlow / Math.pow(1 + rate, index + 1), 0);
    document.getElementById('rate-value').textContent = Math.round(rate * 100) + '%';
    document.getElementById('npv-value').textContent = money(npv);
    document.getElementById('npv-decision').textContent = npv >= 0 ? 'Positive NPV · fund' : 'Negative NPV · reject';
    const bar = document.getElementById('npv-bar');
    const width = Math.min(44, Math.max(2, Math.abs(npv) / 1.45 * 44));
    bar.style.width = width + '%';
    bar.style.background = npv >= 0 ? 'var(--teal)' : 'var(--terra)';
    bar.style.left = npv >= 0 ? '50%' : (50 - width) + '%';
    bar.style.borderRadius = npv >= 0 ? '0 18px 18px 0' : '18px 0 0 18px';
  };
  rateSlider?.addEventListener('input', updateRateLab);
  updateRateLab();

  const allocatorButtons = [...document.querySelectorAll('[data-interactive="allocator"] button')];
  const updateAllocator = () => {
    const selected = allocatorButtons.filter((button) => button.classList.contains('selected'));
    const cost = selected.reduce((sum, button) => sum + Number(button.dataset.cost), 0);
    const npv = selected.reduce((sum, button) => sum + Number(button.dataset.npv), 0);
    document.getElementById('allocator-cost').textContent = '$' + cost.toFixed(2) + 'M';
    document.getElementById('allocator-npv').textContent = '$' + npv.toFixed(2) + 'M';
    const feedback = document.getElementById('allocator-feedback');
    if(cost > 6){
      feedback.textContent = 'Over budget by $' + (cost - 6).toFixed(2) + 'M.';
      feedback.style.color = 'var(--terra)';
    }else if(cost === 6 && Math.abs(npv - 1.67) < 0.01){
      feedback.textContent = 'Best feasible portfolio: $1.67M total NPV.';
      feedback.style.color = 'var(--teal)';
    }else{
      feedback.textContent = 'Feasible. Can another combination create more NPV?';
      feedback.style.color = 'var(--navy)';
    }
  };
  allocatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      updateAllocator();
    });
  });
  updateAllocator();

  const riskPrompts = {
    utilization: 'Test the ramp: what if capacity takes two extra years to fill?',
    labor: 'Separate eliminated cost from reassigned labor and implementation support.',
    downtime: 'Model maintenance, outages, spare parts, and service contracts explicitly.',
    rollout: 'Delay benefits without delaying every cost; timing can erase NPV quickly.'
  };
  document.querySelectorAll('[data-risk]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-risk]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('risk-prompt').textContent = riskPrompts[button.dataset.risk];
    });
  });

  const exitPrompts = {
    fund: 'Fund: cite +$0.93M NPV and the assumption you would monitor.',
    wait: 'Wait: explain what information is worth buying before committing capital.',
    reject: 'Reject: identify the assumption that makes the base-case cash flows unreliable.'
  };
  document.querySelectorAll('[data-exit]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-exit]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('exit-feedback').textContent = exitPrompts[button.dataset.exit];
    });
  });
})();
