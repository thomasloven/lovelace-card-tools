import {lovelace_view} from "./hass";

const yamlPromise = new Promise(resolve => {
    document.querySelector("home-assistant").addEventListener("show-dialog", async(ev) => {
      ev.detail.dialogImport().then(() => {
        const dialog = document.querySelector("home-assistant").shadowRoot.querySelector("hui-dialog-edit-card");
        dialog.updateComplete.then(() =>{
          dialog._close()
          resolve();
        });
      });
    }, {once: true});
    lovelace_view()._addCard();
  });

export async function yaml2json(yaml) {
    await yamlPromise;
    const el = document.createElement("hui-card-editor");
    el.yaml = yaml;
    return el.value;
}
