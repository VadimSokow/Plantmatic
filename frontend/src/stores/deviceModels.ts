import { defineStore } from 'pinia'
import { type DeviceModel } from '@/types/device.ts';

const internalDeviceModels: DeviceModel[] = [
  {
    id: '1',
    name: 'Aqualeaf Quad Lite',
    slot_count: 4,
    sensors: [
      {
        id: 'temp1',
        type: 'device',
        sensorDefinitionId: 'temperature_sensor_basic',
        fieldName: 'temperature',
      },
      { id: 'soil1', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 1 },
      { id: 'soil2', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 2 },
      { id: 'soil3', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 3 },
      { id: 'soil4', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 4 },
    ],
    actuators: [
      {
        id: 'pump1',
        actuatorDefinitionId: 'pump_basic',
        purpose: 'water_plants',
        fieldName: 'water_pump',
        plantSlots: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Aqualeaf Duo Lite',
    slot_count: 2,
    sensors: [
      {
        id: 'temp1',
        type: 'device',
        sensorDefinitionId: 'temperature_sensor_basic',
        fieldName: 'temperature',
      },
      { id: 'soil1', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 1 },
      { id: 'soil2', type: 'plant', sensorDefinitionId: 'soil_moisture_basic', fieldName: 'soil_moisture', plantSlot: 2 },
    ],
    actuators: [
      {
        id: 'pump2',
        actuatorDefinitionId: 'pump_basic',
        purpose: 'water_plants',
        fieldName: 'water_pump',
        plantSlots: [],
      },
    ],
  },
];


export const useDeviceModelStore = defineStore('device_models', {
  state: () => ({
    devices: new Map<string, DeviceModel>(),
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getAllDeviceModels: state => state.devices,
    getDeviceModelById: state => (id: string) => state.devices.get(id) as DeviceModel | undefined,
    getLoading: state => state.isLoading,
  },

  actions: {
    async fetchDeviceModel (id: string): Promise<DeviceModel | undefined> {
      this.isLoading = true;
      this.error = null;

      try {
        // Simulate fetching a device model from an API
        const fetchedModel = internalDeviceModels.find(model => model.id === id);
        if (fetchedModel) {
          this.devices.set(fetchedModel.id, fetchedModel);
          return fetchedModel;
        } else {
          throw new Error('Device model not found');
        }
      } catch (error) {
        this.error = 'Failed to fetch device model';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
      return undefined;
    },
    async fetchDeviceModels (ids: string[]) {
      this.isLoading = true;
      this.error = null;

      try {
        // Simulate fetching device models from an API
        const fetchedModels = internalDeviceModels.filter(model => ids.includes(model.id));

        fetchedModels.forEach(model => {
          this.devices.set(model.id, model);
        });
      } catch (error) {
        this.error = 'Failed to fetch device models';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
