(function(){
  document.querySelectorAll('.choice-check').forEach((group)=>{
    const choices=[...group.querySelectorAll('button[data-correct]')];
    const check=group.querySelector('[data-action="check-choice"]');
    const output=group.querySelector('output');
    choices.forEach((button)=>button.addEventListener('click',()=>{
      choices.forEach((choice)=>choice.classList.remove('selected','correct','incorrect'));
      button.classList.add('selected');
      if(output)output.textContent='Selection recorded. Check when the group has committed.';
    }));
    check?.addEventListener('click',()=>{
      const selected=choices.find((choice)=>choice.classList.contains('selected'));
      if(!selected){if(output)output.textContent='Choose one response before checking.';return;}
      choices.forEach((choice)=>choice.classList.add(choice.dataset.correct==='true'?'correct':'incorrect'));
      if(output)output.textContent=selected.dataset.correct==='true'
        ? 'Correct. The answer follows the timing and audit trail.'
        : 'Recheck the timing, evidence, and assumption trail.';
    });
  });

  const requiredReturn=document.getElementById('required-return-slider');
  const growth=document.getElementById('growth-slider');
  const returnValue=document.getElementById('required-return-value');
  const growthValue=document.getElementById('growth-value');
  const valueOutput=document.getElementById('gordon-output');
  const spreadOutput=document.getElementById('spread-output');
  const updateSensitivity=()=>{
    if(!requiredReturn||!growth)return;
    const r=Number(requiredReturn.value)/100;
    const g=Number(growth.value)/100;
    const spread=r-g;
    const value=2.12/spread;
    returnValue.textContent=(r*100).toFixed(1)+'%';
    growthValue.textContent=(g*100).toFixed(1)+'%';
    valueOutput.textContent='$'+value.toFixed(2);
    spreadOutput.textContent='r − g = '+(spread*100).toFixed(1)+' percentage points';
  };
  requiredReturn?.addEventListener('input',updateSensitivity);
  growth?.addEventListener('input',updateSensitivity);
  updateSensitivity();

  const exitButtons=[...document.querySelectorAll('[data-exit]')];
  const exitFeedback=document.getElementById('exit-feedback');
  exitButtons.forEach((button)=>button.addEventListener('click',()=>{
    exitButtons.forEach((item)=>item.classList.remove('selected'));
    button.classList.add('selected');
    if(exitFeedback)exitFeedback.textContent='Now name one evidence request that would strengthen or reverse your conclusion.';
  }));
})();
