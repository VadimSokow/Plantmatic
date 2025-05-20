import { defineStore } from 'pinia'

const internalDevices = [
  {
    id: '1',
    name: 'Device 1',
    owner: 'Owner 1',
    modell: '1',
    location: 'Location 1',
    connection_state: 'online',
    plant_ids: ['1', '2', '8', '9'],
  },
  {
    id: '2',
    name: 'Device 2',
    owner: 'Owner 1',
    modell: '1',
    location: 'Location 2',
    connection_state: 'offline',
    plant_ids: ['3'],
  },
  {
    id: '3',
    name: 'Device 3',
    owner: 'Owner 1',
    modell: '1',
    location: 'Location 3',
    connection_state: 'online',
    plant_ids: ['4', '5'],
  },
];

export interface Device {
  id: string
  name: string
  owner: string
  modell: string
  location: string
  connection_state: 'online' | 'offline'
  plant_ids: string[]
}

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
        device.plant_ids.forEach(plantId => {
          if (!plantIds.includes(plantId)) {
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
