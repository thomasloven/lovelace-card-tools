import { LitElement, html } from "./lit-element.js";
import { createCard, createEntityRow, createElement } from "./lovelace-element.js";
import { provideHass } from "./hass.js";

class ThingMaker extends LitElement {
  static get properties() {
    return {
      'hass': {},
      'config': {},
      'noHass': {type: Boolean },
    };
  }
  setConfig(config) {
    this._config = config;
    if(!this.el)
      this.el = this.create(config);
    else
      this.el.setConfig(config);
    if(this._hass) this.el.hass = this._hass;
    if(this.noHass) provideHass(this);
  }
  set config(config) {
    this.setConfig(config);
  }
  set hass(hass) {
    this._hass = hass;
    if(this.el) this.el.hass = hass;
  }

  createRenderRoot() {
    return this;
  }
  render() {
    return html`${this.el}`;
  }
}

if(!customElements.get("card-maker")) {
  class CardMaker extends ThingMaker {
    create(config) {
      return createCard(config);
    }
    getCardSize() {
      if(this.firstElementChild && this.firstElementChild.getCardSize)
        return this.firstElementChild.getCardSize();
      return 1;
    }
  }
  customElements.define("card-maker", CardMaker);
}

if(!customElements.get("element-maker")) {
  class ElementMaker extends ThingMaker {
    create(config) {
      return createElement(config);
    }
  }
  customElements.define("element-maker", ElementMaker);
}

if(!customElements.get("entity-row-maker")) {
  class EntityRowMaker extends ThingMaker {
    create(config) {
      return createEntityRow(config);
    }
  }
  customElements.define("entity-row-maker", EntityRowMaker);
}
