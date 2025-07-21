import { useDeviceStore } from '@/stores/device.ts'
import { useMeasurementsStore } from '@/stores/measurements.ts'
import { usePlantStore } from '@/stores/plant.ts'
import { usePlantTypeSearchStore } from '@/stores/plantTypeSearch.ts'

/**
 * A composition function that provides a unified way to check loading states and errors across multiple data stores.
 * It combines the loading and error states of device, plant, measurements, and plant type search stores.
 * It also provides a method to clear errors from all stores.
 */
export function useLoadAndError (): {
  isLoading: globalThis.ComputedRef<boolean>
  error: globalThis.ComputedRef<string | null>
  clearError: () => void
} {
  const deviceStore = useDeviceStore()
  const plantStore = usePlantStore()
  const measurementsStore = useMeasurementsStore()
  const plantTypeSearchStore = usePlantTypeSearchStore()

  const isLoading = computed(() => deviceStore.loading
    || plantStore.loading
    || measurementsStore.loading
    || plantTypeSearchStore.loading,
  )

  const error = computed(() => deviceStore.error
    || plantStore.error
    || measurementsStore.error
    || plantTypeSearchStore.error,
  )

  const clearError = () => {
    deviceStore.error = null
    plantStore.error = null
    measurementsStore.error = null
    plantTypeSearchStore.error = null
  }

  return {
    isLoading,
    error,
    clearError,
  }
}
