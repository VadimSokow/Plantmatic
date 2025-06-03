import type { Plant, PlantType } from '@/types/plant.ts'
import { apiClient } from '@/api/client.ts'

const plants: Plant[] = [
  {
    id: '1',
    name: 'Badpflanze',
    userId: 'u38079@hs-harz.de',
    deviceId: '1',
    type: {
      'latName': 'Euphorbia leuconeura',
      'commonName': 'Spuckpalme',
      'description': 'Eine spuckende Palme im Bad',
      'configFields': [],
    },
  },
  {
    id: '2',
    name: 'Wohnzimmerpflanze',
    userId: 'u38079@hs-harz.de',
    deviceId: '2',
    type: {
      'latName': 'Echeveria ssp',
      'commonName': 'Echeveria',
      'description': 'Eine Echeveria Palme im Wohnzimmer',
      'configFields': [],
    },
  },
]

export const fetchPlants = async (): Promise<Plant[]> => {
  try {
    // const response = await apiClient.get<Plant[]>('/plants')
    // const data = response.data
    // return data
    return plants
    // return data.map(d => {
    //   const plant = d['plant'] as Plant
    //   plant.type = d['model'] as PlantType
    //   return plant
    // })
  } catch (error: unknown) {
    console.error('Fehler beim Laden der Geräte:', error)
    throw error
  }
}
