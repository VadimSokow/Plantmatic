export interface Plant {
  id: string
  type: PlantType
  userId: string
  deviceId: string
  name: string
}

export interface PlantTypeBase {
  latName: string
  commonName: string
}

export interface PlantType extends PlantTypeBase {
  description: string
  configFields: PlantConfigField[]
}

export interface PlantConfigField {
  fieldName: string
  unit: string
  description: string
  defaultValue: number | string | boolean
}
