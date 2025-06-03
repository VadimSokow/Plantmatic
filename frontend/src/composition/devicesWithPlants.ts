import { useDeviceStore } from '@/stores/device.ts'
import { usePlantStore } from '@/stores/plant.ts'
import type { Device, DeviceWithPlants } from '@/types/device.ts'

export function useDevicesWithPlants() {
  const deviceStore = useDeviceStore()
  const plantStore = usePlantStore()

  const isLoading = computed(() => deviceStore.loading || plantStore.loading)
  const error = computed(() => deviceStore.error || plantStore.error)

  const devices = computed(() => deviceStore.devices)
  const plants = computed(() => plantStore.plants)

  const devicesWithPlants: ComputedRef<DeviceWithPlants[]> = computed(() => {
    const devs = Object.values(devices.value)
    const plnts = Object.values(plants.value)

    if (!devs.length || !plnts.length) {
      return []
    }

    const combined: DeviceWithPlants[] = []
    for (const value of devs) {
      const deviceWithPlants: DeviceWithPlants = { device: value, plants: [] }
      if (!value.plantSlots) continue
      value.plantSlots.forEach(slot => {
        if (!slot.plantId) return

        const plant = plants.value[slot.plantId]
        if (plant) {
          deviceWithPlants.plants.push(plant)
        }
      })
      combined.push(deviceWithPlants)
    }
    return combined
  })

  const loadAllData = async (forceRefresh = false) => {
    try {
      await Promise.all([
        deviceStore.fetchDevices(forceRefresh),
        plantStore.fetchPlants(forceRefresh),
      ])
      console.log('Data loaded', devices.value, plants.value)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const clearError = () => {
    deviceStore.error = null
    plantStore.error = null
  }

  return {
    devices,
    plants,
    isLoading,
    error,
    devicesWithPlants,
    loadAllData,
    clearError,
  }
}
