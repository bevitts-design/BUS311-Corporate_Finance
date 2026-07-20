(() => {
  class DeckStage extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      this.slides = Array.from(this.querySelectorAll(':scope > .slide'));
      this.index = this.initialIndex();
      this.setAttribute('role', 'region');
      this.setAttribute('aria-label', 'Presentation');
      this.installControls();
      this.installEvents();
      this.resize();
      this.show(this.index, false);
    }

    initialIndex() {
      const match = location.hash.match(/slide=(\d+)/);
      return match ? Math.max(0, Math.min(this.slides.length - 1, Number(match[1]) - 1)) : 0;
    }

    installControls() {
      const controls = document.createElement('nav');
      controls.className = 'deck-controls';
      controls.setAttribute('aria-label', 'Slide controls');
      controls.innerHTML = `
        <button type="button" data-action="prev" aria-label="Previous slide">←</button>
        <span class="deck-count" aria-live="polite"></span>
        <button type="button" data-action="next" aria-label="Next slide">→</button>
        <button type="button" data-action="full" aria-label="Toggle full screen">⛶</button>`;
      document.body.appendChild(controls);
      this.controls = controls;
      this.counter = controls.querySelector('.deck-count');
    }

    installEvents() {
      this.controls.addEventListener('click', (event) => {
        const action = event.target.closest('button')?.dataset.action;
        if (action === 'prev') this.show(this.index - 1);
        if (action === 'next') this.show(this.index + 1);
        if (action === 'full') this.toggleFullscreen();
      });
      addEventListener('keydown', (event) => {
        if (event.target.matches('input, textarea, select, button')) return;
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
          event.preventDefault(); this.show(this.index + 1);
        }
        if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
          event.preventDefault(); this.show(this.index - 1);
        }
        if (event.key === 'Home') this.show(0);
        if (event.key === 'End') this.show(this.slides.length - 1);
        if (event.key.toLowerCase() === 'f') this.toggleFullscreen();
      });
      addEventListener('resize', () => this.resize());
      addEventListener('hashchange', () => this.show(this.initialIndex(), false));
      this.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, textarea, select, .no-advance')) return;
        if (event.clientX > innerWidth * 0.72) this.show(this.index + 1);
      });
    }

    resize() {
      const width = Number(this.getAttribute('width')) || 1920;
      const height = Number(this.getAttribute('height')) || 1080;
      const scale = Math.min(innerWidth / width, innerHeight / height);
      document.documentElement.style.setProperty('--deck-scale', String(scale));
    }

    show(next, updateHash = true) {
      if (!this.slides.length) return;
      this.index = Math.max(0, Math.min(this.slides.length - 1, next));
      this.slides.forEach((slide, i) => {
        const active = i === this.index;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      this.counter.textContent = `${this.index + 1} / ${this.slides.length}`;
      document.title = `${this.slides[this.index].dataset.label || 'Slide'} — BUS311`;
      if (updateHash) history.replaceState(null, '', `#slide=${this.index + 1}`);
      this.dispatchEvent(new CustomEvent('slidechange', { detail: { index: this.index } }));
    }

    toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.();
    }
  }

  customElements.define('deck-stage', DeckStage);
})();
