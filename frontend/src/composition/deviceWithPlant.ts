import { useDeviceStore } from '@/stores/device.ts'
import { usePlantStore } from '@/stores/plant.ts'

export function useDeviceWithPlant(plantId: string) {
  const deviceStore = useDeviceStore()
  const plantStore = usePlantStore()

  // lookup device id
  const deviceId = deviceStore.getDeviceByPlantId(plantId)?.id ?? ""
  if (deviceId === "") throw new Error('No device found for plant')

  const isLoading = computed(() => deviceStore.loading || plantStore.loading)
  const error = computed(() => deviceStore.error || plantStore.error)

  const device = computed(() => deviceStore.getDeviceById(deviceId))
  const plant = computed(() => plantStore.getPlantById(plantId))
  const slotNumber = computed(() => {
    const d = device.value
    const slot = d.plantSlots.find(s => s.plantId === plantId)
    return slot?.slotNumber ?? -1
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

  const clearError = () => {
    deviceStore.error = null
    plantStore.error = null
  }

  return {
    device,
    plant,
    slotNumber,
    isLoading,
    error,
    loadAllData,
    clearError,
  }
}
