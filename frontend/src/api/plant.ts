import type { Plant, PlantType, PlantTypeBase } from '@/types/plant.ts'
import { apiClient } from '@/api/client.ts'
import { getPaged } from '@/api/helper.ts'

type ResponseData = {
  plants: Array<Record<string, any>>
  types: PlantType[]
}

export const fetchPlants = async (): Promise<Plant[] | undefined> => {
  return await getPaged<ResponseData, Plant[]>('/plants', {},
    (store, _, data) => {
      const types: PlantType[] = data.types || []
      const getPlantTypeById = (latName: string): PlantType | undefined => {
        return types.find(type => type.latName === latName)
      }

      const plants = (data.plants || [] as Array<Record<string, any>>).map(plant => {
        const type = getPlantTypeById(plant.latName)
        if (!type) {
          console.warn(`type ${plant.latName} not found for ${plant.id}`)
        }
        return {
          ...plant,
          type,
        } as Plant
      })
      return Array.of(...store, ...plants)
    },
    [])
}

export const fetchPlantTypeBases = async (): Promise<PlantTypeBase[] | undefined> => {
  return await getPaged<PlantTypeBase[], PlantTypeBase[]>('/plantTypes/searchData', {},
    (store, _, data) => Array.of(...store, ...data),
    [])
}

export const createPlant = async (
  deviceId: string,
  slotNumber: number,
  plantLatName: string,
  newPlantName: string,
): Promise<Plant | string> => {
  const body = {
    deviceId,
    slotNumber,
    latName: plantLatName,
    name: newPlantName,
  }
  const result = await apiClient.post('/plants', body)
  if (result.status < 200 && result.status >= 300) {
    console.error(`Can not create Plant: ${result.status}`)
    return 'can not create Plant'
  }

  // TODO: extract plant
  const plant: Plant = result.data as Plant
  return plant
}
