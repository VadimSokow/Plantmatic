import type { PlantTypeBase } from '@/types/plant.ts'
import { fetchPlantTypeBases } from '@/api/plant.ts'

export const usePlantTypeSearchStore = defineStore('plant_type_search', {
  state: () => ({
    types: [] as PlantTypeBase[],
    loading: false,
    error: null as string | null,
    lastFetchTimestamp: 0,
    cacheDuration: 5 * 60 * 1000,
  }),

  getters: {
    searchByName: state => (query: string) => {
      // search by common name or latin name and return the top 5 results
      const lowerQuery = query.toLowerCase()
      return state.types
        .filter(type => type.commonName.toLowerCase().includes(lowerQuery) || type.latName.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
    },
  },

  actions: {
    async fetchTypes () {
      const now = Date.now()
      // Wenn der Cache noch gültig ist und kein Neuladen erzwungen wird
      if (now - this.lastFetchTimestamp < this.cacheDuration && this.types.length > 0) {
        console.log('Using cached plant types')
        return
      }

      this.loading = true
      this.error = null
      try {
        const types = await fetchPlantTypeBases()
        if (!types) {
          this.loading = false
          this.error = 'No plant types found'
          return
        }
        this.types = types
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch plant types'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
})
