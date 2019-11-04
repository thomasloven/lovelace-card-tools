import { fireEvent } from "./event.js";

export function moreInfo(entity, large=false) {
  fireEvent("hass-more-info", {entityId: entity}, document.querySelector("home-assistant"));
  const el = document.querySelector("home-assistant")._moreInfoEl;
  el.large = large;
  return el;
}
