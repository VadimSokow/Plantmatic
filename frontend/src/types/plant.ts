export interface Plant {
  id: string
  type: PlantType
  userId: string
  deviceId: string
  name: string
}

export interface PlantType {
  latName: string
  commonName: string
  description: string
  configFields: PlantConfigField[]
}

export interface PlantConfigField {
  fieldName: string
  unit: string
  description: string
  defaultValue: number | string | boolean
}
