import type { Plant, PlantType } from '@/types/plant.ts'
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
