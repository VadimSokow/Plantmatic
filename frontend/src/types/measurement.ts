export interface Measurement {
  deviceId: string
  plantId: string
  fieldName: string
  timestamp: Date
  value: number
}

export interface MeasuredPlant {
  deviceId: string
  plantId: string
  fieldName: string
  values: MeasuredValue[]
}

export interface MeasuredValue {
  timestamp: Date
  value: number
}
