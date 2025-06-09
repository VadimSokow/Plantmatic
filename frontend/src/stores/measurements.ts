import type { MeasuredPlant } from '@/types/measurement.ts'
import { defineStore } from 'pinia'
import { fetchMeasurements } from '@/api/measurement.ts'

export const useMeasurementsStore = defineStore('measurements', {
  state: () => ({
    measurements: {} as Record<string, Record<string, MeasuredPlant>>,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getMeasuredPlant: state => (plantId: string, fieldName: string) =>
      state.measurements[plantId]?.[fieldName] as MeasuredPlant | undefined,
  },

  actions: {
    async load (plantId: string, fieldName: string, startTime = 1_672_531_343_744, endTime = 1_672_609_412_225) {
      const result = await fetchMeasurements(
        plantId,
        fieldName,
        startTime,
        endTime,
      )
      if (!result) {
        return
      }
      if (!this.measurements[plantId]) {
        this.measurements[plantId] = {}
      }
      this.measurements[plantId][fieldName] = result
    },
  },
})
