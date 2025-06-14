import { useMeasurementsStore } from '@/stores/measurements.ts'
import { usePlantStore } from '@/stores/plant.ts'

export const usePlantMeasurement = (plantId: string, fieldName: string) => {
  const plantStore = usePlantStore()
  const measurementStorage = useMeasurementsStore()

  const isLoading = computed(() => measurementStorage.loading || plantStore.loading)
  const error = computed(() => measurementStorage.error || plantStore.error)

  const plant = computed(() => plantStore.getPlantById(plantId))
  const measurement = computed(() => measurementStorage.getMeasuredPlant(plantId, fieldName))

  const loadAllData = async (forceRefresh = false, start: Date | number, end: Date | number) => {
    await plantStore.fetchPlants(forceRefresh)

    // convert start and end to timestamps if they are Date objects
    const startTime = start instanceof Date ? start.getTime() : start
    const endTime = end instanceof Date ? end.getTime() : end
    await measurementStorage.load(plantId, fieldName, startTime, endTime)
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
