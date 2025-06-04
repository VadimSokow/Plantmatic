import type { MeasuredPlant, MeasuredValue } from '@/types/measurement.ts'
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
    async load (plantId: string, fieldName: string) {
      const result = await fetchMeasurements(
        plantId,
        fieldName,
        Date.now() - 1000 * 60 * 60 * 24,
        Date.now(),
        1_000_000,
        0,
      )
      if (!result) {
        return
      }
      if (!this.measurements[plantId]) {
        this.measurements[plantId] = {}
      }
      this.measurements[plantId][fieldName] = {
        deviceId: result[0].deviceId,
        plantId,
        fieldName,
        values: result.map(({ timestamp, value }) => {
          return {
            timestamp,
            value,
          } as MeasuredValue
        }),
      }
    },
  },
})
