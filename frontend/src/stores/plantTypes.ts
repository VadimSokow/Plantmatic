import { defineStore } from 'pinia';
import type { PlantType } from '@/types/plant.ts';

const internalPlantTypes: PlantType[] = [
  {
    latName: 'Ocidium basilicum',
    commonName: 'Basilikum',
    description: 'A popular herb used in cooking.',
    plantConfigFieldsDefinition: [
      {
        fieldName: 'min_humidity',
        unit: 'percentage',
        description: 'Minimum humidity level in percentage.',
        defaultValue: 50,
      },
      {
        fieldName: 'light_requirement',
        unit: 'hours',
        description: 'Daily light requirement in hours.',
        defaultValue: 12,
      },
    ],
  },
  {
    latName: 'Solanum lycopersicum',
    commonName: 'Tomato',
    description: 'A widely cultivated fruit.',
    plantConfigFieldsDefinition: [
      {
        fieldName: 'min_humidity',
        unit: 'percentage',
        description: 'Minimum humidity level in percentage.',
        defaultValue: 50,
      },
      {
        fieldName: 'light_requirement',
        unit: 'hours',
        description: 'Daily light requirement in hours.',
        defaultValue: 14,
      },
    ],
  },
];

export const usePlantTypesStore = defineStore('plant_types', {
  state: () => ({
    plantTypes: new Map<string, PlantType>(),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allPlantTypes: state => state.plantTypes,
    getPlantTypeById: state => (id: string) => state.plantTypes.get(id) as PlantType | undefined,
    isLoading: state => state.loading,
    hasError: state => state.error,
  },

  actions: {
    async fetchPlantType (id: string): Promise<PlantType | undefined> {
      this.loading = true;
      this.error = null;
      try {
        // Simulate fetching a plant type from an API
        const plantType = internalPlantTypes.find(pt => pt.latName === id);
        if (plantType) {
          this.plantTypes.set(plantType.latName, plantType);
          return plantType;
        } else {
          throw new Error('Plant type not found');
        }
      } catch (error) {
        this.error = 'Failed to fetch plant type';
        console.error(error);
        return undefined;
      } finally {
        this.loading = false;
      }
    },
    async fetchPlantTypes () {
      this.loading = true;
      this.error = null;
      try {
        // Simulate fetching plant types from an API
        internalPlantTypes.forEach(plantType => {
          this.plantTypes.set(plantType.latName, plantType);
        });
      } catch (error) {
        this.error = 'Failed to fetch plant types';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
