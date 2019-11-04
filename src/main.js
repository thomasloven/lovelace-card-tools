import "./card-maker.js"
import { deviceID } from "./deviceID.js";
import { fireEvent } from "./event.js";
import { hass, provideHass, lovelace, lovelace_view } from "./hass.js";
import { LitElement, html, css } from "./lit-element.js";
import { bindActionHandler } from "./action.js";
import { createCard, createElement, createEntityRow } from "./lovelace-element.js";
import { moreInfo } from "./more-info.js";
import { popUp, closePopUp } from "./popup.js";
import { parseTemplate, subscribeRenderTemplate } from "./templates.js";
import { hasOldTemplate, parseOldTemplate } from "./old-templates.js";


class CardTools {

  static checkVersion(v) {
  }

  static get deviceID() { return deviceID; }

  static get fireEvent() { return fireEvent; }

  static get hass() { return hass(); }
  static get lovelace() { return lovelace(); }
  static get lovelace_view() { return lovelace_view; }
  static get provideHass() { return provideHass; }

  static get LitElement() { return LitElement; }
  static get LitHtml() { return html; }
  static get LitCSS() { return css; }

  static get longpress() { return bindActionHandler; }

  static get createCard() { return createCard; }
  static get createElement() { return createElement; }
  static get createEntityRow() { return createEntityRow; }

  static get moreInfo() { return moreInfo; }

  static get popUp() { return popUp; }
  static get closePopUp() { return closePopUp; }

  static get hasTemplate() { return hasOldTemplate; }
  static parseTemplate(hass, str, specialData = {}) {
    if (typeof(hass) === "string")
      return parseOldTemplate(hass, str);
    return parseTemplate(hass, str, specialData);
  }
  static get subscribeRenderTemplate() { return subscribeRenderTemplate; }

}

if(!customElements.get("card-tools")) {
  customElements.define("card-tools", CardTools);
  window.cardTools = customElements.get('card-tools');
  console.info(`%cCARD-TOOLS 2 IS INSTALLED
  %cDeviceID: ${customElements.get('card-tools').deviceID}`,
  "color: green; font-weight: bold",
  "");
}


