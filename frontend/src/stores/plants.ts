import { defineStore } from 'pinia'

interface Plant {
  id: string,
  name: string,
  slot: number,
  type: {
    lat_name: string,
    common_name: string,
  },
}

export const usePlantStore = defineStore('plants', {
  state: () => ({
    plants: [] as Plant[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllPlants: state => state.plants,
    getPlantById: state => (id: string) => state.plants.find(plant => plant.id === id),
    getLoading: state => state.isLoading,
  },

  actions: {
    async fetchPlants (ids: string[]) {
      console.log('fetchPlants', ids);
      this.plants = [
        {
          id: '1',
          name: 'Plant 1',
          slot: 1,
          type: {
            lat_name: 'Lat Name 1',
            common_name: 'Common Name 1',
          },
        },
        {
          id: '2',
          name: 'Plant 2',
          slot: 2,
          type: {
            lat_name: 'Lat Name 2',
            common_name: 'Common Name 2',
          },
        },
        {
          id: '3',
          name: 'Plant 3',
          slot: 3,
          type: {
            lat_name: 'Lat Name 3',
            common_name: 'Common Name 3',
          },
        },
      ];
    },
  },
})
