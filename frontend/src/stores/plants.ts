import { defineStore } from 'pinia'

const internalPlants = [
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
  {
    id: '8',
    name: 'Plant 8',
    slot: 8,
    type: {
      lat_name: 'Lat Name 8',
      common_name: 'Common Name 8',
    },
  },
  {
    id: '9',
    name: 'Plant 9',
    slot: 9,
    type: {
      lat_name: 'Lat Name 9',
      common_name: 'Common Name 9',
    },
  },
]

export interface Plant {
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
    plants: new Map<string, Plant>(),
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllPlants: state => state.plants,
    getPlantById: state => (id: string) => state.plants.get(id) as Plant | undefined,
    getLoading: state => state.isLoading,
  },

  actions: {
    async fetchPlants (ids: string[]): Promise<Plant[]> {
      const result = internalPlants.filter(p => ids.includes(p.id))
      result.forEach(p => this.plants.set(p.id, p as Plant));
      return result;
    },
    async resolvePlant (id: string) {
      const result = this.plants.get(id);
      if (result) return result;
      const fetched = await this.fetchPlants([id]);
      if (fetched.length === 0) return null;
      else if (fetched.length > 1) {
        this.error = 'Multiple plants found with the same id';
        return null;
      }
      return fetched[0];
    },
  },
})
