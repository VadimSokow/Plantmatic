import {defineStore} from 'pinia'

const internalDeviceMeasurements: DeviceMeasurement[] = [
  {
    deviceId: '1',
    name: 'temperature',
    fieldName: 'temperature',
    sensorDefinitionId: 'temp1',
    unit: 'celsius',
    values: generateMeasValues(30, (1000 * 60 * 5)),
  }
];

const internalPlantMeasurements: PlantMeasurement[] = [
  {
    plantId: '1',
    name: 'soil moisture',
    plantTypeId: 'Ocidium basilicum',
    fieldName: 'soil_moisture',
    sensorDefinitionId: 'soil_moisture_basic',
    unit: 'percent',
    values: generateMeasValues(30, (1000 * 60 * 5)),
  }
];

type MeasuredValues = {
  timestamp: number,
  value: number,
}[]

export type DeviceMeasurement = {
  deviceId: string,
  name: string,
  fieldName: string,
  sensorDefinitionId: string,
  unit: string,
  values: MeasuredValues,
}

export type PlantMeasurement = {
  plantId: string,
  name: string,
  plantTypeId: string,
  fieldName: string,
  sensorDefinitionId: string,
  unit: string,
  values: MeasuredValues,
}

interface Measurements {
  device: Map<string, Map<string, DeviceMeasurement>>
  plant: Map<string, Map<string, PlantMeasurement>>
}

export const useMeasurementsStore = defineStore('measurements', {
  state: () => ({
    measurements: {device: new Map(), plant: new Map()} as Measurements,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllMeasurements: state => state.measurements,
    getDeviceMeasurements: state => (deviceId: string, sensorDefinitionId: string) =>
      state.measurements.device.get(deviceId)?.get(sensorDefinitionId) as DeviceMeasurement | undefined,
    getPlantMeasurements: state => (plantId: string, sensorDefinitionId: string) =>
      state.measurements.plant.get(plantId)?.get(sensorDefinitionId) as PlantMeasurement | undefined,
    getLoading: state => state.isLoading,
  },

  actions: {
    async load() {
      this.measurements.device.clear();
      this.measurements.plant.clear();
      internalDeviceMeasurements.forEach(measurement => {
        if (!this.measurements.device.has(measurement.deviceId)) {
          this.measurements.device.set(measurement.deviceId, new Map());
        }
        this.measurements.device.get(measurement.deviceId)?.set(measurement.sensorDefinitionId, measurement);
      })

      internalPlantMeasurements.forEach(measurement => {
        if (!this.measurements.plant.has(measurement.plantId)) {
          this.measurements.plant.set(measurement.plantId, new Map());
        }
        this.measurements.plant.get(measurement.plantId)?.set(measurement.sensorDefinitionId, measurement);
      })

      console.log(this.measurements.plant.get('1')?.get('soil_moisture_basic')?.values);
    }
    // async fetchMeasurement(id: string) {
    //   this.isLoading = true;
    //   this.error = null;
    //
    //   try {
    //     // TODO: Implement actual measurement fetching
    //     return this.measurements.get(id);
    //   } catch (error) {
    //     this.error = 'Failed to fetch measurement';
    //     console.error(error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    //   return null;
    // },
  },
})

function generateMeasValues(count: number, step: number): MeasuredValues {
  const values: MeasuredValues = [];
  const now = new Date().getTime() - (1000 * 60 * 60 * 24 * 30);
  for (let i = 0; i < count; i++) {
    values.push({
      timestamp: now + i * step,
      value: Math.random() * 100,
    });
  }
  return values;
}
