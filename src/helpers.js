async function _selectTree(root, path) {
  let el = root;
  const parts = path.split("$");
  for(let i = 0; i < parts.length; i++) {
    if(!el) return null;
    if(el.localName.includes("-"))
      await customElements.whenDefined(el.localName);
    if(el.updateComplete)
      await el.updateComplete;
    if(i > 0)
      el = el.shadowRoot;
    if(!el) return null;
    if(parts[i].trim() !== "." && parts[i].trim() !== "")
      el = el.querySelector(parts[i].trim());
  }
  return el;
}

export async function selectTree(root, path, timeout=10000) {
  return Promise.race([
    _selectTree(root, path),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]).catch((err) => {
    return null;
  });
}
