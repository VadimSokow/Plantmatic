import type { Plant } from '@/types/plant.ts'

export interface Device {
  id: string
  name: string
  userId: string
  model: DeviceModel
  location: string
  plantSlots: {
    slotNumber: number
    plantId: string | null
  }[]
  config: Record<string, any>
}

export interface DeviceModel {
  id: string
  name: string
  slotCount: number
  sensors: { [key: string]: DeviceModelSensorConfig }
}

export interface DeviceModelSensorConfig {
  name: string
  fieldName: string
  description: string
  slot: number
  type: string
  unit: string
  accuracy: number
  min: number
  max: number
}

export interface DeviceWithPlants {
  device: Device
  plants: Plant[]
}
