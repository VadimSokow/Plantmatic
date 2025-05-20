import { defineStore } from 'pinia'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const internalDeviceModells: DeviceModell[] = [{
  name: 'AquaLeaf',
  configStructure: [{
    name: 'send-interval',
    unit: 'duration',
    min: '1m',
    max: '3h',
    default: '30m',
  }],
  slot: new Map<number, DeviceModellSlot>([[
    1, {
      sensors: [{
        name: 'Temperatur',
        fieldName: 'temperature',
        unit: 'c',
        minValue: '-20',
        maxValue: '50',
      }],
    },
  ]]
  ),
}];

interface DeviceModellSlot {
  sensors: [{
    name: string
    fieldName: string
    unit: string
    minValue: string
    maxValue: string
  }]
}

export interface DeviceModell {
  name: string
  configStructure: [{
    name: string
    unit: string
    min: string
    max: string
    default: string
  }]
  // Map < slot-number, slot specific definition >
  slot: Map<number, DeviceModellSlot>
}

export const useDeviceModellStore = defineStore('device_modells', {
  state: () => ({
    devices: new Map<string, DeviceModell>(),
    isLoading: false,
    error: null as string | null,
  }),
});
