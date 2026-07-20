(() => {
  class ImageSlot extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      const img = document.createElement('img');
      img.src = this.getAttribute('src') || '';
      img.alt = this.getAttribute('alt') || '';
      img.loading = this.hasAttribute('eager') ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.style.objectFit = this.getAttribute('fit') || 'cover';
      img.addEventListener('error', () => this.classList.add('is-missing'));
      this.appendChild(img);
    }
  }
  customElements.define('image-slot', ImageSlot);
})();
