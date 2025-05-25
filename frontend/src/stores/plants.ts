import { defineStore } from 'pinia'
import type { Plant } from '@/types/plant.ts';

const internalPlants: Plant[] = [
  {
    id: '1',
    name: 'Plant 1',
    userId: '1',
    deviceId: '1',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 22.5,
      soil_moisture: 45,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '2',
    name: 'Plant 2',
    userId: '1',
    deviceId: '1',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 23.0,
      soil_moisture: 50,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '3',
    name: 'Plant 3',
    userId: '1',
    deviceId: '2',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 21.0,
      soil_moisture: 40,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '4',
    name: 'Plant 4',
    userId: '1',
    deviceId: '3',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 21.0,
      soil_moisture: 40,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '5',
    name: 'Plant 5',
    userId: '1',
    deviceId: '3',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 21.0,
      soil_moisture: 40,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '8',
    name: 'Plant 8',
    userId: '1',
    deviceId: '1',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 24.0,
      soil_moisture: 55,
      timestamp: new Date().getTime(),
    },
  },
  {
    id: '9',
    name: 'Plant 9',
    userId: '1',
    deviceId: '1',
    plantTypeId: 'Ocidium basilicum',
    currentSensorData: {
      temperature: 22.0,
      soil_moisture: 48,
      timestamp: new Date().getTime(),
    },
  },
]

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
