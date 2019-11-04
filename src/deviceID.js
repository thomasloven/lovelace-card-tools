function _deviceID() {
  const ID_STORAGE_KEY = 'lovelace-player-device-id';
  if(window['fully'] && typeof fully.getDeviceId === "function")
    return fully.getDeviceId();
  if(!localStorage[ID_STORAGE_KEY])
  {
    const s4 = () => {
      return Math.floor((1+Math.random())*100000).toString(16).substring(1);
    }
    localStorage[ID_STORAGE_KEY] = `${s4()}${s4()}-${s4()}${s4()}`;
  }
  return localStorage[ID_STORAGE_KEY];
};

export let deviceID = _deviceID();
