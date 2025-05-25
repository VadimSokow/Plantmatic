import { defineStore } from 'pinia'
import { type Device } from '@/types/device.ts';

const internalDevices: Device[] = [
  {
    id: '1',
    name: 'Device 1',
    userId: 'Owner 1',
    modelId: '1',
    location: 'Location 1',
    plantSlots: [
      { slotNumber: 1, plantId: '1' },
      { slotNumber: 2, plantId: '2' },
      { slotNumber: 3, plantId: '8' },
      { slotNumber: 4, plantId: '9' },
    ],
  },
  {
    id: '2',
    name: 'Device 2',
    userId: 'Owner 1',
    modelId: '1',
    location: 'Location 2',
    plantSlots: [
      { slotNumber: 2, plantId: '3' },
    ],
  },
  {
    id: '3',
    name: 'Device 3',
    userId: 'Owner 1',
    modelId: '2',
    location: 'Location 3',
    plantSlots: [
      { slotNumber: 1, plantId: '4' },
      { slotNumber: 2, plantId: '5' },
    ],
  },
];

export const useDeviceStore = defineStore('devices', {
  state: () => ({
    devices: new Map<string, Device>(),
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllDevices: state => state.devices,
    getDeviceById: state => (id: string) => state.devices.get(id) as Device | undefined,
    getLoading: state => state.isLoading,
    getAllPlantIds: state => {
      const plantIds: string[] = [];
      state.devices.forEach(device => {
        device.plantSlots.forEach(slot => {
          const plantId = slot.plantId;
          if (plantId && !plantIds.includes(plantId)) {
            plantIds.push(plantId);
          }
        });
      });
      return plantIds;
    },
  },

  actions: {
    async fetchDevices () {
      console.log('fetchDevices');
      this.devices.clear();
      internalDevices.forEach(device => {
        this.devices.set(device.id, device as Device);
      })
    },
    async fetchDevice (id: string): Promise<Device | null> {
      const result = internalDevices.find(device => device.id === id);
      if (result) {
        this.devices.set(result.id, result as Device);
        return result as Device;
      } else {
        return null;
      }
    },
    async resolveDeviceById (id: string): Promise<Device | null> {
      const result = this.devices.get(id);
      if (result) return result;
      return this.fetchDevice(id);
    },
  },
})
