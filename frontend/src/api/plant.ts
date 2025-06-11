import type { Plant, PlantType } from '@/types/plant.ts'
import { apiClient } from '@/api/client.ts'

const plants: Plant[] = [
  {
    id: '1',
    name: 'Badpflanze',
    userId: 'u38079@hs-harz.de',
    deviceId: '1',
    type: {
      latName: 'Euphorbia leuconeura',
      commonName: 'Spuckpalme',
      description: 'Eine spuckende Palme im Bad',
      configFields: [],
    },
  },
  {
    id: '2',
    name: 'Wohnzimmerpflanze',
    userId: 'u38079@hs-harz.de',
    deviceId: '2',
    type: {
      latName: 'Echeveria ssp',
      commonName: 'Echeveria',
      description: 'Eine Echeveria Palme im Wohnzimmer',
      configFields: [],
    },
  },
]

export const fetchPlants = async (): Promise<Plant[]> => {
  try {
    const response = await apiClient('/plants')
    console.log('Plants', response)

    const types: PlantType[] = response.data['types']
    const getPlantTypeById = (latName: string): PlantType | undefined => {
      return types.find(type => type.latName === latName)
    }

    const plants: Array<Record<string, any>> = response.data['plants']
    return plants.map(plant => {
      const type = getPlantTypeById(plant.latName)
      if (!type) {
        console.warn(`type ${plant.latName} not found for ${plant.id}`)
      }
      return {
        ...plant,
        type,
      } as Plant
    })
  } catch (error: unknown) {
    console.error('Fehler beim Laden der Geräte:', error)
    throw error
  }
}
