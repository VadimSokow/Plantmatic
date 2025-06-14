import type { MeasuredPlant } from '@/types/measurement.ts'
import { defineStore } from 'pinia'
import { th } from 'vuetify/locale'
import { fetchMeasurements, fetchNewestMeasurements } from '@/api/measurement.ts'

export const useMeasurementsStore = defineStore('measurements', {
  state: () => ({
    // [plantId][fieldName]: MeasuredPlant
    measurements: {} as Record<string, Record<string, MeasuredPlant>>,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getMeasuredPlant: state => (plantId: string, fieldName: string) =>
      state.measurements[plantId]?.[fieldName] as MeasuredPlant | undefined,
  },

  actions: {
    async load (plantId: string, fieldName: string, startTime: number, endTime: number) {
      this.loading = true
      const result = await fetchMeasurements(
        plantId,
        fieldName,
        startTime,
        endTime,
      )
      if (!result) {
        this.loading = false
        return
      }
      if (!this.measurements[plantId]) {
        this.measurements[plantId] = {}
      }
      this.measurements[plantId][fieldName] = result
      this.loading = false
    },
    async loadLatestMeasurementsIfRequired (plantId: string, fieldNames: string[], maxAgeSeconds = 300) {
      const now = Date.now()
      const measurements = this.measurements[plantId]
      if (!measurements) {
        await this.loadLatestMeasurements(plantId, fieldNames)
        return
      }

      const hasToLoad = Object.values(measurements)
        .filter(m => m.fieldName in fieldNames)
        .every(m => m.latest && m.latest.timestamp.getTime() > now - maxAgeSeconds * 1000)
      return hasToLoad ? this.loadLatestMeasurements(plantId, fieldNames) : undefined
    },
    async loadLatestMeasurements (plantId: string, fieldNames: string[]) {
      this.loading = true
      this.error = null

      try {
        const result = await fetchNewestMeasurements(plantId, fieldNames)
        if (!result) {
          this.error = 'No measurements found'
          this.loading = false
          return
        }

        if (!this.measurements[plantId]) {
          this.measurements[plantId] = {}
        }

        // insert all latest measurements into the store
        for (const key of Object.keys(result)) {
          const value = result[key]
          if (!value) {
            if (this.measurements[plantId][key]) {
              this.measurements[plantId][key].latest = undefined
            }
            continue
          }

          if (!this.measurements[plantId][key]) {
            this.measurements[plantId][key] = {
              deviceId: value.deviceId,
              plantId: value.plantId,
              fieldName: value.fieldName,
              latest: undefined,
              values: [],
            }
          }
          this.measurements[plantId][key].latest = {
            timestamp: value.timestamp,
            value: value.value,
          }
        }
      } catch (error) {
        this.error = `Failed to load latest measurements: ${error instanceof Error ? error.message : String(error)}`
        console.error(this.error)
      } finally {
        this.loading = false
      }
    },
  },
})
