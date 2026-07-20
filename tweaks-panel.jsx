(() => {
  const panel = document.createElement('aside');
  panel.className = 'tweaks-panel no-advance';
  panel.setAttribute('aria-label', 'Presentation tools');
  panel.innerHTML = `
    <button class="tweaks-toggle" type="button" aria-expanded="false">Tools</button>
    <div class="tweaks-menu" hidden>
      <button type="button" data-tweak="grid">Toggle grid</button>
      <button type="button" data-tweak="contrast">High contrast</button>
      <button type="button" data-tweak="print">Print / PDF</button>
    </div>`;
  document.body.appendChild(panel);
  const toggle = panel.querySelector('.tweaks-toggle');
  const menu = panel.querySelector('.tweaks-menu');
  toggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  panel.addEventListener('click', (event) => {
    const tweak = event.target.dataset.tweak;
    if (tweak === 'grid') document.body.classList.toggle('show-grid');
    if (tweak === 'contrast') document.body.classList.toggle('high-contrast');
    if (tweak === 'print') window.print();
  });
})();
