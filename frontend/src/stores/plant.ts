import type { Plant } from '@/types/plant.ts'
import { defineStore } from 'pinia'
import { createPlant, deletePlant, fetchPlants } from '@/api/plant.ts'

export const usePlantStore = defineStore('plants', {
  state: () => ({
    plants: {} as Record<string, Plant>,
    loading: false,
    error: null as string | null,
    lastFetchTimestamp: 0,
    cacheDuration: 5 * 60 * 1000,
  }),

  getters: {
    getPlantById: state => (id: string) => state.plants[id],
  },

  actions: {
    async deletePlant (plantId: string): Promise<number | undefined> {
      this.loading = true
      this.error = null
      try {
        const result = await deletePlant(plantId)
        if (result < 200 || result >= 300) {
          this.error = `Failed to delete plant with ID ${plantId} | Status: ${result} (${statusCodeToString(result)})`
          return undefined
        }
        // remove plant from store
        delete this.plants[plantId]
        return result
      } catch (error: any) {
        this.error = error.message || 'Failed to delete plant'
        console.error(error)
        return undefined
      } finally {
        this.loading = false
      }
    },
    async loadPlants (forceRefresh = false): Promise<Plant[] | null> {
      try {
        await this.fetchPlants(forceRefresh)
        return Object.values(this.plants)
      } catch (error: any) {
        this.error = error.message || 'Failed to load plants'
        console.error(error)
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchPlants (forceRefresh = false) {
      const now = Date.now()
      // Wenn der Cache noch gültig ist und kein Neuladen erzwungen wird
      if (!forceRefresh && (now - this.lastFetchTimestamp < this.cacheDuration) && Object.values(this.plants).length > 0) {
        console.log('Using cached plants')
        return
      }

      this.loading = true
      this.error = null
      try {
        const fetchedPlants = await fetchPlants()
        if (!fetchedPlants) {
          this.loading = false
          this.error = 'No plants found'
          return
        }
        this.plants = fetchedPlants.reduce((acc, plant) => {
          acc[plant.id] = plant
          return acc
        }, {} as Record<string, Plant>)
        this.lastFetchTimestamp = now
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch plants'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async createPlant (deviceId: string, slot: number, latName: string, name: string): Promise<Plant | undefined> {
      this.loading = true
      this.error = null
      try {
        const createResult: Plant | string = await createPlant(deviceId, slot, latName, name)
        if (typeof createResult === 'string') {
          // error
          this.loading = false
          this.error = createResult as string
          return undefined
        }

        // add plant to plant store
        this.plants[createResult.id] = createResult
      } catch (error: any) {
        this.error = error.message || 'Failed to create plant'
      } finally {
        this.loading = false
      }
    },
  },
})

function statusCodeToString (status: number): string {
  switch (status) {
    case 200: {
      return 'OK'
    }
    case 201: {
      return 'Created'
    }
    case 400: {
      return 'Bad Request'
    }
    case 401: {
      return 'Unauthorized'
    }
    case 403: {
      return 'Forbidden'
    }
    case 404: {
      return 'Not Found'
    }
    case 500: {
      return 'Internal Server Error'
    }
    default: {
      return `Unknown Status: ${status}`
    }
  }
}
