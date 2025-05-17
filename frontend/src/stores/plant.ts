interface PlantState {
  plants: Plant[];
  selectedPlant: Plant | null;
  loading: boolean;
  error: string | null;
}

interface Plant {
  id: string;
  name: string;
  lastMeasurement: PlantMeasurement | null;
}

interface PlantMeasurement {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  light: number;
  timestamp: number;
}

export const usePlantStore = defineStore('plant', {
  state: (): PlantState => ({
    plants: [],
    selectedPlant: null,
    loading: false,
    error: null,
  }),

  actions: {},
});
