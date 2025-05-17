import { defineStore } from 'pinia'

interface Device {
  id: string
  name: string
  owner: string
  location: string
  connection_state: 'online' | 'offline',
  plant_ids: string[],
}

export const useDeviceStore = defineStore('devices', {
  state: () => ({
    devices: [] as Device[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllDevices: state => state.devices,
    getDeviceById: state => (id: string) => state.devices.find(device => device.id === id),
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
      this.devices = [
        {
          id: '1',
          name: 'Device 1',
          owner: 'Owner 1',
          location: 'Location 1',
          connection_state: 'online',
          plant_ids: ['1', '2'],
        },
        {
          id: '2',
          name: 'Device 2',
          owner: 'Owner 1',
          location: 'Location 2',
          connection_state: 'offline',
          plant_ids: ['3'],
        },
        {
          id: '3',
          name: 'Device 3',
          owner: 'Owner 1',
          location: 'Location 3',
          connection_state: 'online',
          plant_ids: ['4', '5'],
        },
      ];
    },
  },
})
