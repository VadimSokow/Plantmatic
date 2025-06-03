import { useMeasurementsStore } from '@/stores/measurements.ts'
import { usePlantStore } from '@/stores/plant.ts'

export const usePlantMeasurement = (plantId: string, fieldName: string) => {
  const plantStore = usePlantStore()
  const measurementStorage = useMeasurementsStore()

  const isLoading = computed(() => measurementStorage.loading || plantStore.loading)
  const error = computed(() => measurementStorage.error || plantStore.error)

  const plant = computed(() => plantStore.getPlantById(plantId))
  const measurement = computed(() => measurementStorage.getMeasuredPlant(plantId, fieldName))

  const loadAllData = async (forceRefresh = false) => {
    await plantStore.fetchPlants(forceRefresh)
    await measurementStorage.load(plantId, fieldName)
  }

  const clearError = () => {
    plantStore.error = null
    measurementStorage.error = null
  }

  return {
    plant,
    measurement,
    isLoading,
    error,
    loadAllData,
    clearError,
  }
}
