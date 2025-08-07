import type { Device, DeviceWithPlants } from '@/types/device.ts'
import type { Plant } from '@/types/plant.ts'
import { useDeviceStore } from '@/stores/device.ts'
import { usePlantStore } from '@/stores/plant.ts'

export function useDeviceWithPlants (deviceId: string) {
  const deviceStore = useDeviceStore()
  const plantStore = usePlantStore()

  const isLoading = computed(() => deviceStore.loading || plantStore.loading)
  const error = computed(() => deviceStore.error || plantStore.error)

  const device = computed(() => deviceStore.getDeviceById(deviceId))
  const plants = computed(() => {
    const d = device.value as Device
    const plants: Plant[] = []
    for (const slot of d.plantSlots) {
      if (!slot.plantId) {
        continue
      }
      const plant = plantStore.getPlantById(slot.plantId)
      if (plant) {
        plants.push(plant)
      }
    }
    return plants
  })

  const combined: ComputedRef<DeviceWithPlants> = computed(() => {
    return { device: device.value, plants: plants.value } as DeviceWithPlants
  })

  const loadAllData = async (forceRefresh = false) => {
    try {
      await Promise.all([
        deviceStore.fetchDevices(forceRefresh),
        plantStore.fetchPlants(forceRefresh),
      ])
      console.log('Data loaded')
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const createPlant = async (slot: number, latName: string, name: string): Promise<Plant | undefined> => {
    if (!device.value) {
      return
    }

    const result = await plantStore.createPlant(device.value.id, slot, latName, name)
    if (!result) {
      return undefined
    }

    // load the updated device
    await deviceStore.loadDevice(device.value.id)

    return result
  }

  const clearError = () => {
    deviceStore.error = null
    plantStore.error = null
  }

  return {
    device,
    plants,
    isLoading,
    error,
    combined,
    loadAllData,
    createPlant,
    clearError,
  }
}
