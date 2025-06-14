import type { MeasuredValue } from '@/types/measurement.ts'
import { useMeasurementsStore } from '@/stores/measurements.ts'

export const useLatestPlantMeasurement = (plantId: string, fieldNames: Array<string>) => {
  const measurementStore = useMeasurementsStore()

  const latestMeasurements = computed(() => {
    return fieldNames.reduce((acc, fieldName) => {
      const measuredPlant = measurementStore.getMeasuredPlant(plantId, fieldName)
      if (measuredPlant && measuredPlant.latest) {
        acc[fieldName] = measuredPlant.latest
      }
      return acc
    }, {} as Record<string, MeasuredValue>)
  })

  const isLoading = computed(() => measurementStore.loading)
  const error = computed(() => measurementStore.error)

  const loadLatestMeasurements = async () => {
    await measurementStore.loadLatestMeasurementsIfRequired(plantId, fieldNames)
  }

  const clearError = () => {
    measurementStore.error = null
  }

  return {
    latestMeasurements,
    isLoading,
    error,
    loadLatestMeasurements,
    clearError,
  }
}
