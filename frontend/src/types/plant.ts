export interface PlantConfigFieldDefinition {
  fieldName: string;
  unit: string;
  description: string;
  defaultValue: number | string | boolean;
}

export interface PlantType {
  latName: string;
  commonName: string;
  description: string;
  plantConfigFieldsDefinition: PlantConfigFieldDefinition[];
}

export interface Plant {
  id: string;
  userId: string;
  deviceId: string;
  name: string;
  plantTypeId: string;
  currentSensorData?: {
    [fieldName: string]: number;
    timestamp: number;
  };
}
