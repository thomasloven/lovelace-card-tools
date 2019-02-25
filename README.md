card-tools version 0.4
==========

This is a collection of tools to simplify creating custom cards for [Home Assistant](https://home-assistant.io)

# IMPORTANT
`card-tools` v. 0.4  and any plugins that require it works only with Home Assistant 0.87 or later.

## Installation instructions

If you see "Can't find card-tools. [...]" in your Home Assistant UI, follow these instructions.

To install `card-tools` follow [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

The recommended type of this plugin is: `js`


### For [custom\_updater](https://github.com/custom-components/custom_updater)
```yaml
resources:
- url: /customcards/github/thomasloven/card-tools.js?track=true
  type: js
```


## User instructions

That's all. You don't need to do anything else.

## Developer instructions

*BREAKING CHANGES IN VERSION 0.3* Please read changelog below

`card-tools` defines a global object `cardTools` which contains some helpful functions and stuff.

To make sure `card-tools` is installed, add the following line to the start of the `setConfig()` function of your custom card:

To make sure `card-tools` is loaded before your plugin, wait for `customElements.whenDefined("card-tools")` to resolve.

Example:
```js
customElements.whenDefined('card-tools').then(() => {
  var cardTools = customElements.get('card-tools');
  // YOUR CODE GOES IN HERE

  class MyPlugin extends cardTools.LitElement {
    setConfig(config) {
      this.name = config.name;
    }

    render() {
      return cardTools.LitHtml`
        ${this.name}
      `;
    }
  }

  customElements.define("my-plugin", MyPlugin);
}); // END OF .then(() => {

setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('my-plugin', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
```

The `setTimeout` block at the end will make your element display an error message if `card-tools` is not found. Make sure the element name is the same in both `customElements.define()` calls.

The following functions are defined:

| Name | v >= | Description |
| --- | --- | --- |
| `cardTools.version` | 0.4 | Current `card-tools` version |
| `cardTools.checkVersion(v)` | 0.1 | Check that the current `card-tools` version is at least `v` |
| `cardTools.hass` | 0.4 | Returns A `hass` state object. Useful for plugins that are *not* custom cards. If you need it, you'll know it |
| `cardTool.fireEvent(event, detail)` | 0.1 | Fire lovelace event `event` with options `detail` |
| `cardTools.LitElement` | 0.4 | A reference to the LitElement base class. |
| `cardTools.LitHtml` | 0.4 | A reference to the litHtml template function (requires Home Assistant 0.84 or later) |
| `cardTools.createCard(config)` | 0.1 | Creates and sets up a lovelace card based on `config` |
| `cardTools.createElement(config)` | 0.1 | Creates and sets up a `picture-elements` element based on `config` |
| `cardTools.createEntityRow(config)` | 0.1 | Creates and sets up an `entities` row based on `config` |
| `cardTools.deviceID` | 0.4 | Kind of unique and kind of persistent identifier for the browser viewing the page |
| `cardTools.moreInfo(entity)` | 0.1 | Brings up the `more-info` dialog for the specified `entity` id |
| `cardTools.longPress(element)` | 0.1 | Bind `element` to the long-press handler of lovelace |
| `cardTools.hasTemplate(text)` | 0.2 | Check if `text` contains a simple state template |
| `cardTools.parseTemplate(text, [error])` | 0.2 | Parse a simple state template and return results |
| `cardTools.args(script)` | 0.3 | Returns URL parameters of the script from `resources:` |
| `cardTools.localize(key)` | 0.3 | Returns translations of certains strings to the users language |
| `cardTools.lovelace`| 0.4 | A reference to a structure containing some information about the users lovelace configuration |
| `cardTools.popup(title, message, large)` | 0.4 | Open a popup window (simmilar to the more-info dialog) |
| `cardTools.closePopUp()` | 0.4 | Closes a popup window or more-info dialog |
| `cardTools.logger(message, script)` | 0.4 | Write a debug message to the browser console |

> Another way to use the `card-tools` is to just copy the function you want, and paste it into your card. It requires a bit of more work, but may be more user friendly.


### version and checkVersion

Those functions are just there to make sure the user has the right version of `card-tools`. I may add more functions later, and then you can make sure that those are supported by the version the user has.
I recommend adding a check as soon as possible, such as in the `setConfig()` function of a custom card/element/entity row.

```js
setConfig(config) {
  cardTools.checkVersion(0.1);
  ...
```

> For information: I plan to increase the version number when I add functions. Not for bug fixes.

### hass

This is provided for plugins that *aren't* cards, elements or entity rows. For those three kinds, the hass object is kindly provided to you by the whatever loads your element, but if you wish to write something that doesn't have a representation in the DOM, this can give you access to all of Home Assistants power anyway.

```js
  ...
  greeting.innerHTML = `Hi there, ${cardTools.hass.user.name}`;
  cardTools.hass.connection.subscribeEvents((event) => {console.log("A service was called in Home Assistant")}, 'call-service');
```

### lovelace

This object contains information about the users lovelace configuration. As a bonus `cardTools.lovelace.current_view` contains the index of the currently displayed view.

### fireEvent

This is mainly used as a helper for some other functions of `cardTools`, but it could be useful to fire a lovelace event sometime, such as `"config-refresh"` perhaps? Explore!

### LitElement, LitHtml and LitCSS

Currently, the Home Assistant frontend is being converted to LitElement based elements, rather than Polymer based, since those are faster and easier to use. If you wish to make your element LitElement based, those may help.

### createCard, createElement, createEntityRow

Currently, custom elements can be used in three places in Lovelace; as cards, as elements in a `picture-elements` card or as rows in an `entities` card.

Those functions creates a card, element or row safely and cleanly from a config object. They handle custom elements and automatically picks the most suitable row for an entity. In short, it's mainly based on - and works very similar to - how Lovelace handles those things natively.

```js
const myElement = cardTools.createElement({
  type: "state-icon",
  entity: "light.bed_light",
  hold_action: {action: "toggle"},
});
```

> There's also a `cardTools.createThing(thing, config)` which is a helper function for those three. You'll probably never need to access it directly, but it might be good to know that it's there...

### deviceID

This can be used to uniquely identify the device connected to Lovelace. Or actually, the device-browser combination.

It generates a random number, and stores it in the browsers local storage. That means it will stay around for quite a while.

It's kind of hard to explain, but as an example I use this to make browsers usable as media players in [lovelace-player](https://githb.com/thomasloven/lovelace-player). In short, a `media`-`deviceID` pair is sent to every browser currently viewing the lovelace UI, but only if the `deviceId` matches `cardTools.deviceID()` is the `media` played. That way, I can make a sound play only on my ipad, even if I have the same page open on my computer.

I'm sure this can have lots of uses.

The device ID is stored in a key called `lovelace-player-device-id` (for historical reasons).

### moreInfo

This can be used to open the more-info dialog for an entity.

```js
render() {
  return cardTools.LitHtml`
  <paper-button
  @click="${cardTools.moreInfo("light.bed_light");}"
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
  return cardTools.LitHtml`
  <paper-button
  @click="${cardTools.moreInfo("light.bed_light");}"
  @ha-click="${console.log('I was clicked')}"
  @ha-hold="${console.log('I was held')}"
  >
  Click or hold me!
  </paper-button>
  `;
}

firstUpdated() {
  cardTools.longpress(this.shadowRoot.querySelector('paper-button'));
}
```

### hasTemplate and parseTemplate

`cardTools.parseTemplate` lets you parse a user specified template like `[[ light.bed_light.state ]]` and return the result.

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

`cardTools.hasTemplate` just checks if a string contains a simple state template.

### args
Lovelace plugins are imported by placing a script URL in the `resources` section of `ui-lovelace.yaml` or the Raw editor. This URL can be followed by query parameters.

```
resources:
  - url: /local/my-plugin.js?height=5&flag&width=10&
    type: js
```

If called from `my-plugin.js` `cardTools.args()` will return the javascript object `{height: 5, flag: undefined, width: 10}`.

If called from a callback function, `cardTools.args` requires the parameter `script` in order to determine the current script. It should have the value of `document.currentScript`, but must be defined outside of the callback scope.

### localize
Returns the translation of certain strings (defined by string keys) to the users language.

Examples of keys:
- `"state.light.on"`
- `"state.binary_sensor.garage_door.off"`
- `"domain.fan"`
- `"attribute.weather.humidity"`

More can be found by exploring `cardTools.hass().resources`.

### popup
This function opens a dialog similar to the more-info dialog but with the title and message specified. Set `large` to `true` to attempt to open a wider dialog

### closePopUp
This function closes a popup or more-info dialog.

### logger
This function allows the user to enable a debug mode by adding `?debug` to the `url:` in their `resources` when importing your card. Messages printed with `cardTools.logger()` will only be shown if the debug mode is active.

The `script` parameter is required if `cardTools.logger` is called from within a callback function. See the description of `cardTools.args` for more information.

## Changelog

*0.2*
- Added `parseTemplate()` function

*0.3*
- `LitElement` renamed to `litElement`
- `cardTools.litElement()`, `cardTools.litHtml` and `cardtools.deviceID()` are now functions
- Updated recommendation for how to check if `card-tools` exists
- Added `hasTemplate()` to documentation
- Added `args()` function
- Added `localize()` function

*0.4*
- `cardTools.LitElement` reintroduced. It is not a function
- `cardTools.LitHtml` introduced. It is not a function
- `cardTools.v()` removed and replaced with `cardTools.version` (kind of breaking, but I don't think anyone uses it...)
- `cardTools.deviceID()` removed and replaced with `cardTools.deviceID` (kind of breaking, but I don't think anyone uses it...)
- `cardTools.hass()` deprecated and replaced with `cardTools.hass`
- `cardTools.LitCSS` added
- `cardTools.lovelace` added
- `cardTools.popup()` added
- `cardTools.closePopUp()` added
- `cardTools.logger()` added
- Added `script` parameter to `cardTools.args`

---
