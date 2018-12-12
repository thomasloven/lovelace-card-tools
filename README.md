card-tools
==========

This is a collection of tools to simplify creating custom cards for [Home Assistant](https://home-assistant.io)

## Installation instructions

If you see "Can't find card-tools. [...]" in your Home Assistant UI, follow these instructions.

1. Download [card-tools.js](https://github.com/thomasloven/lovelace-card-tools/raw/master/card-tools.js) and place in `<home assistant config root>/www/card-tools.js`.

2. Add the following lines to `<home assistant config root>/ui-lovelace.yaml`

```yaml
resources:
  - url: /local/card-tools.js
    type: js
```

## User instructions

That's all. You don't need to do anything else.

> However, if you wish to update `card-tools` automatically using the [custom updater](https://github.com/custom-components/custom_updater), you should add `?v=0` to the end of the `url:` in your `resources:` section.


## Developer instructions

`card-tools` defines a global object `window.cardTools` which contains some helpful functions and stuff.

To make sure `card-tools` is installed, add the following line to the start of the `setConfig()` function of your custom card:

```js
    if(!window.cardTools) throw new Error(`Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools`);
```

The following functions and variables are defined:

| Name | v >= | Description |
| --- | --- | --- |
| `window.cardTools.v` | 0.1 | Current `card-tools` version |
| `window.cardTools.checkVersion(v)` | 0.1 | Check that the current `card-tools` version is at least `v` |
| `window.cardTools.hass()` | 0.1 | Returns A `hass` state object. Useful for plugins that are *not* custom cards. If you need it, you'll know it |
| `window.cardTool.fireEvent(event, detail)` | 0.1 | Fire lovelace event `event` with options `detail` |
| `window.cardTools.LitElement` | 0.1 | A reference to the LitElement base class. |
| `window.cardTools.litHtml` | 0.1 | A reference to the litHtml template function (requires Home Assistant 0.84 or later) |
| `window.cardTools.createCard(config)` | 0.1 | Creates and sets up a lovelace card based on `config` |
| `window.cardTools.createElement(config)` | 0.1 | Creates and sets up a `picture-elements` element based on `config` |
| `window.cardTools.createEntityRow(config)` | 0.1 | Creates and sets up an `entities` row based on `config` |
| `window.cardTools.deviceID` | 0.1 | Kind of unique and kind of persistent identifier for the browser viewing the page |
| `window.cardTools.moreInfo(entity)` | 0.1 | Brings up the `more-info` dialog for the specified `entity` id |
| `window.cardTools.longPress(element)` | 0.1 | Bind `element` to the long-press handler of lovelace |
| `window.cardTools.parseTemplate(text, [error])` | 0.2 | Parse a simple state template and return results |

> Another way to use the `card-tools` is to just copy the function you want, and paste it into your card. It requires a bit of more work, but may be more user friendly.

### v and checkVersion

This variable and function are just there to make sure the user has the right version of `card-tools`. I may add more functions later, and then you can make sure that those are supported by the version the user has.
I recommend adding a check as soon as possible, such as in the `setConfig()` function of a custom card/element/entity row.

```js
setConfig(config) {
  if(!window.cardTools) throw new Error(`Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools`);
  window.cardTools.checkVersion(0.1);
  ...
```

> For information: I plan to increase the version number when I add functions. Not for bug fixes.

### hass

This is provided for plugins that *aren't* cards, elements or entity rows. For those three kinds, the hass object is kindly provided to you by the whatever loads your element, but if you wish to write something that doesn't have a representation in the DOM, this can give you access to all of Home Assistants power anyway.

```js
  ...
  greeting.innerHTML = `Hi there, ${window.cardTools.hass().user.name}`;
  window.cardTools.hass().connection.subscribeEvents((event) => {console.log("A service was called in Home Assistant")}, 'call-service');
```

### fireEvent

This is mainly used as a helper for some other functions of `cardTools`, but it could be useful to fire a lovelace event sometime, such as `"config-refresh"` perhaps? Explore!

### LitElement and litHtml

Currently, the Home Assistant frontend is being converted to LitElement based elements, rather than Polymer based, since those are faster and easier to use. If you wish to make your element LitElement based, those may help.

**Important!** Since `card-tools` may be loaded after your element, it's not advisable to make your card class extend `window.cardTools.LitElement`.

Instead, a reference to `LitElement` must be extracted from somewhere else:

```js
var LitElement = LitElement || Object.getPrototypeOf(customElements.get('hui-error-entity-row'));
class LitCard extends LitElement {
  ...
}

customelements.define('lit-card', LitCard);
```

Unfortunately, this method may break if the definition of `hui-error-entity-row` changes in the future, but should - in that case - only need minor modifications.

`litHtml` can be used safely, though:

```js
render() {
  return window.cardTools.litHtml`
  <ha-card .header="${this._config.title}">
  Hello, world!
  </ha-card>
  `;
```

### createCard, createElement, createEntityRow

Currently, custom elements can be used in three places in Lovelace; as cards, as elements in a `picture-elements` card or as rows in an `entities` card.

Those functions creates a card, element or row safely and cleanly from a config object. They handle custom elements and automatically picks the most suitable row for an entity. In short, it's mainly based on - and works very similar to - how Lovelace handles those things natively.

```js
const myElement = window.cardTools.createElement({
  type: "state-icon",
  entity: "light.bed_light",
  hold_action: {action: "toggle"},
});
```

> There's also a `window.cardTools.createThing(thing, config)` which is a helper function for those three. You'll probably never need to access it directly, but it might be good to know that it's there...

### deviceID

This can be used to uniquely identify the device connected to Lovelace. Or actually, the device-browser combination.

It generates a random number, and stores it in the browsers local storage. That means it will stay around for quite a while.

It's kind of hard to explain, but as an example I use this to make browsers usable as media players in [lovelace-player](https://githb.com/thomasloven/lovelace-player). In short, a `media`-`deviceID` pair is sent to every browser currently viewing the lovelace UI, but only if the `deviceId` matches `window.cardTools.deviceID` is the `media` played. That way, I can make a sound play only on my ipad, even if I have the same page open on my computer.

I'm sure this can have lots of uses.

The device ID is stored in a key called `lovelace-player-device-id` (for historical reasons).

### moreInfo

This can be used to open the more-info dialog for an entity.

```js
render() {
  return window.cardTools.litHtml`
  <paper-button
  @click="${window.cardTools.moreInfo("light.bed_light");}"
  >
  Click me!
  </paper-button>
  `;
}
```

### longpress

Some elements in Lovelace can perform two different actions when they are clicked and clicked-and-held. This lets you give this capability to any element.

Once an element has been bound to longpress, it will be able to receive `ha-click` and `ha-hold` events.

```js
render() {
  return window.cardTools.litHtml`
  <paper-button
  @click="${window.cardTools.moreInfo("light.bed_light");}"
  @ha-click="${console.log('I was clicked')}"
  @ha-hold="${console.log('I was held')}"
  >
  Click or hold me!
  </paper-button>
  `;
}

firstUpdated() {
  window.cardTools.longpress(this.shadowRoot.querySelector('paper-button'));
}
```

### parseTemplate

This lets you parse a user specified template like `[[ light.bed_light.state ]]` and return the result.

Two things are important:

- Template must start with `[[<space>` and end with `<space>]]`
- This is not in any way the same kind of template as used in the Home Assistant configuration

The templates are parsed by reading one step at a time from the `hass.states` object.
Thus, the first part must be an entity with domain and id, e.g. `light.bed_light`, `media_player.bedroom` etc.
Next is one of:

- `entity_id`
- `state`
- `attributes.<attribute>`
- `last_changed`
- `last_updated`

The function replaces any template found in the supplied string with the requested value, or an error message on failure.

The optional argument `error` is a string that replaces the default error message.
