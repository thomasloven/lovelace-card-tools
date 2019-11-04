export function fireEvent(ev, detail, entity=null) {
  ev = new Event(ev, {
    bubbles: true,
    cancelable: false,
    composed: true,
  });
  ev.detail = detail || {};
  if(entity) {
    entity.dispatchEvent(ev);
  } else {
    var root = document.querySelector("home-assistant");
    root = root && root.shadowRoot;
    root = root && root.querySelector("home-assistant-main");
    root = root && root.shadowRoot;
    root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
    root = root && root.shadowRoot || root;
    root = root && root.querySelector("ha-panel-lovelace");
    root = root && root.shadowRoot;
    root = root && root.querySelector("hui-root");
    root = root && root.shadowRoot;
    root = root && root.querySelector("ha-app-layout #view");
    root = root && root.firstElementChild;
    if (root) root.dispatchEvent(ev);
  }
}
