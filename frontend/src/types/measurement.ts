export interface Measurement {
  id: string;
  plantId: string;
  timestamp: Date;
  //sensorDefinitionId: string;
  fieldName: string;
  //sensorType: string;
  value: number;
}

export interface MeasuredPlant {
  plantId: string
  fieldName: string
  values: MeasuredValues
}

export type MeasuredValues = {
  timestamp: number; // Unix-Timestamp in MILLISEKUNDEN
  value: number;
}[];
