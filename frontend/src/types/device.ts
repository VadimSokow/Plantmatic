export interface Device {
  id: string;
  name: string;
  userId: string;
  modelId: string;
  location: string;
  plantSlots: {
    slotNumber: number;
    plantId: string | null;
  }[];
  config?: object;
}

export interface ModelSensorConfig {
  id: string;
  type: 'device' | 'plant';
  sensorDefinitionId: string;
  fieldName: string;
  plantSlot?: number;
}

export interface ModelActuatorConfig {
  id: string;
  actuatorDefinitionId: string;
  purpose: string;
  fieldName: string;
  plantSlots?: number[];
}

export interface DeviceModel {
  id: string;
  name: string;
  slot_count: number;
  sensors: ModelSensorConfig[];
  actuators: ModelActuatorConfig[];
}
