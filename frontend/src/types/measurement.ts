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
  latest: MeasuredValue | undefined
  values: MeasuredValue[]
}

export interface MeasuredValue {
  timestamp: Date
  value: number
}
