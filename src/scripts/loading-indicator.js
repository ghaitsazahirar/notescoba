class LoadingIndicator extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div class="loading-indicator">
        <div class="indicator"></div>
      </div>
    `;
  }
}

window.customElements.define("loading-indicator", LoadingIndicator);