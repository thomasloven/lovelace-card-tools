import { hass } from "./hass";

const _hass = hass();

export async function getData() {
    // getData is lazy loaded for backwards compatibility
    if (window.cardToolsData) return window.cardToolsData;
    const areaData = _hass.callWS({type: "config/area_registry/list"});
    const deviceData = _hass.callWS({type: "config/device_registry/list"});
    const entityData = _hass.callWS({type: "config/entity_registry/list"});
    window.cardToolsData = {
        areas: await areaData,
        devices: await deviceData,
        entities: await entityData,
    }
    return window.cardToolsData;
}

export function areaByName(name) {
    const hass = _hass;
    const lowerName = name.toLowerCase();
    const areaRegistry = hass.areas;

    for(const area of Object.values(areaRegistry)) {
        if(area.name.toLowerCase() === lowerName)
            return area;
    }
    return null;
}

export function areaDevices(area) {
    const hass = _hass;
    const deviceRegistry = hass.devices;

    let devices = [];
    if(!area) return devices;
    for(const device of Object.values(deviceRegistry)) {
        if(device.area_id === area.area_id) {
            devices.push(device);
        }
    }
    return devices;
}

export function deviceByName(name) {
    const hass = _hass;
    const lowerName = name.toLowerCase();
    const deviceRegistry = hass.devices;
    for(const device of Object.values(deviceRegistry)) {
        if(device.name.toLowerCase() === lowerName)
            return device;
    }
    return null;
}

export function deviceEntities(device) {
    const hass = _hass;
    const entityRegistryForDisplay = hass.entities;

    let entities = [];
    if(!device) return entities;
    for(const entity of Object.values(entityRegistryForDisplay)) {
        if(entity.device_id === device.id) {
            entities.push(entity.entity_id);
        }
    }
    return entities;
}
