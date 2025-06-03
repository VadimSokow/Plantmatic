import type { Device, DeviceModel, DeviceModelSensorConfig } from '@/types/device.ts'
import { apiClient } from '@/api/client.ts'

const exampleSensors: DeviceModelSensorConfig[] = [
  {
    id: 'temp1',
    name: 'temperature',
    type: 'device',
    sensorDefinitionId: 'tempSensor',
    fieldName: 'temp_air',
    unit: 'celsius',
  },
  {
    id: 'hum1',
    name: 'humidity',
    type: 'device',
    sensorDefinitionId: 'humSensor',
    fieldName: 'hum_air',
    unit: 'percent'
  },
  {
    id: 'light1',
    name: 'light',
    type: 'device',
    sensorDefinitionId: 'lightSensor',
    fieldName: 'light',
    unit: 'lux',
  },
  {
    id: 'soil1',
    name: 'soil moisture',
    type: 'plant',
    sensorDefinitionId: 'soilHumSensor',
    fieldName: 'soil_hum',
    plantSlot: 1,
    unit: 'percent',
  },
]

const deviceData: Device[] = [
  {
    'id': '2',
    'name': 'Badpflanze',
    'userId': 'u38079@hs-harz.de',
    'location': 'Bad',
    'model': {
      'id': '1',
      'name': 'Potted Plant',
      'slotCount': 3,
      sensors: exampleSensors,
      actuators: [],
    },
    'plantSlots': [
      {
        'plantId': '1',
        'slotNumber': 1,
      },
    ],
    'config': {
      'measureIngint': '60s',
    },
  },
  {
    'id': '1',
    'name': 'Wohnzimmerpflanze',
    'userId': 'u38079@hs-harz.de',
    'location': 'Wohnzimmer',
    'model': {
      'id': '1',
      'name': 'Potted Plant',
      'slotCount': 3,
      sensors: exampleSensors,
      actuators: [],
    },
    'plantSlots': [
      {
        'plantId': '2',
        'slotNumber': 1,
      },
    ],
    'config': {
      'measureInterval': '120s',
    },
  },
]

export const fetchDevices = async () => {
  try {
    // const response = await apiClient.get<Device[]>('/devices')
    // const data = response.data
    // return data
    return deviceData
    // return data.map(d => {
    //   const dev = d['device'] as Device
    //   dev.model = d['model'] as DeviceModel
    //   return dev
    // })
  } catch (error: unknown) {
    console.error('Fehler beim Laden der Geräte:', error)
    throw error
  }
}
