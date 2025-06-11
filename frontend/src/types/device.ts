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
  actuators: DeviceModelActuatorConfig[]
}

export interface DeviceModelSensorConfig {
  id: string
  name: string
  type: 'device' | 'plant'
  sensorDefinitionId: string
  fieldName: string
  plantSlot?: number
  unit: string
}

export interface DeviceModelActuatorConfig {
  id: string
  actuatorDefinitionId: string
  purpose: string
  fieldName: string
  plantSlots: number[]
}

export interface DeviceWithPlant {
  device: Device
  plant: Plant
}

export interface DeviceWithPlants {
  device: Device
  plants: Plant[]
}
