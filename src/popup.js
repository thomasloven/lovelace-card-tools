import { fireEvent } from "./event";
import { provideHass } from "./hass";
import { createCard } from "./lovelace-element";
import "./lovelace-element";

export function closePopUp() {
  const root = document.querySelector("hc-main") || document.querySelector("home-assistant");
  const moreInfoEl = root && root._moreInfoEl;
  if(moreInfoEl)
    moreInfoEl.close();
}

export function popUp(title, card, large=false, style=null, fullscreen=false) {
  const root = document.querySelector("hc-main") || document.querySelector("home-assistant");
  // Force _moreInfoEl to be loaded
  fireEvent("hass-more-info", {entityId: null}, root);
  const moreInfoEl = root._moreInfoEl;
  // Close and reopen to clear any previous styling
  // Necessary for popups from popups
  moreInfoEl.close();
  moreInfoEl.open();

  const oldContent = moreInfoEl.shadowRoot.querySelector("more-info-controls");
  if(oldContent) oldContent.style['display'] = 'none';

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
  <style>
    app-toolbar {
      color: var(--more-info-header-color);
      background-color: var(--more-info-header-background);
    }
    .scrollable {
      overflow: auto;
      max-width: 100% !important;
    }
  </style>
  ${fullscreen
    ? ``
    : `
      <app-toolbar>
        <paper-icon-button
          icon="hass:close"
          dialog-dismiss=""
        ></paper-icon-button>
        <div class="main-title" main-title="">
          ${title}
        </div>
      </app-toolbar>
      `
    }
    <div class="scrollable">
    </div>
  `;

  const scroll = wrapper.querySelector(".scrollable");
  const content = createCard(card);
  provideHass(content);
  scroll.appendChild(content);

  content.addEventListener(
    "ll-rebuild",
    (ev) => {
      ev.stopPropagation();
      const newContent = createCard(card);
      provideHass(newContent);
      scroll.replaceChild(newContent, content);
    },
    { once: true}
  );

  moreInfoEl.sizingTarget = scroll;
  moreInfoEl.large = large;
  moreInfoEl._page = "none"; // Display nothing by default
  moreInfoEl.shadowRoot.appendChild(wrapper);

  let oldStyle = {};
  if(style) {
    moreInfoEl.resetFit(); // Reset positioning to enable setting it via css
    for (var k in style) {
      oldStyle[k] = moreInfoEl.style[k];
      moreInfoEl.style.setProperty(k, style[k]);
    }
  }

  moreInfoEl._dialogOpenChanged = function(newVal) {
    if (!newVal) {
      if(this.stateObj)
        this.fire("hass-more-info", {entityId: null});

      if (this.shadowRoot == wrapper.parentNode) {
        this._page = null;
        this.shadowRoot.removeChild(wrapper);

        const oldContent = this.shadowRoot.querySelector("more-info-controls");
        if(oldContent) oldContent.style['display'] = "inline";

        if(style) {
          moreInfoEl.resetFit();
          for (var k in oldStyle)
            if (oldStyle[k])
              moreInfoEl.style.setProperty(k, oldStyle[k]);
            else
              moreInfoEl.style.removeProperty(k);
        }
      }
    }
  }

  return moreInfoEl;
}
