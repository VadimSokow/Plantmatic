// stores/deviceStore.ts
import type { Device } from '@/types/device'
import { defineStore } from 'pinia'
import { fetchDevices } from '@/api/device.ts'

export const useDeviceStore = defineStore('devices', {
  state: () => ({
    devices: {} as Record<string, Device>,
    loading: false,
    error: null as string | null,
    lastFetchTimestamp: 0,
    cacheDuration: 5 * 60 * 1000,
  }),

  getters: {
    getDeviceById: state => (id: string) => state.devices[id],
    getDeviceByPlantId: state => (plantId: string) => Object.values(state.devices)
      .find(dev => dev.plantSlots.find(slot => slot.plantId === plantId)),
  },

  actions: {
    async loadDevice (deviceId: string): Promise<Device | null> {
      try {
        await this.fetchDevices()
        return this.devices[deviceId]
      } catch (error: any) {
        this.error = error.message || 'Failed to load device'
        console.error(error)
        return null
      }
    },
    async loadDevices (forceRefresh = false): Promise<Device[] | null> {
      try {
        await this.fetchDevices(forceRefresh)
        return Object.values(this.devices)
      } catch (error: any) {
        this.error = error.message || 'Failed to load devices'
        console.error(error)
        return null
      }
    },
    async fetchDevices (forceRefresh = false) {
      const now = Date.now()
      // Wenn der Cache noch gültig ist und kein Neuladen erzwungen wird
      if (!forceRefresh && (now - this.lastFetchTimestamp < this.cacheDuration) && Object.values(this.devices).length > 0) {
        console.log('Using cached devices')
        return // Cache ist gültig, keine erneute Anfrage
      }

      this.loading = true
      this.error = null
      try {
        const fetchedDevices = await fetchDevices()
        this.devices = fetchedDevices.reduce((acc, device) => {
          acc[device.id] = device
          return acc
        }, {} as Record<string, Device>)
        this.lastFetchTimestamp = now
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch devices'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    // async updateDevice (deviceId: string, updatedData: Partial<Device>) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const updatedDevice = await deviceService.updateDevice(deviceId, updatedData)
    //     this.devices.set(updatedDevice.id, updatedDevice)
    //     this.lastFetchTimestamp = Date.now() // Cache aktualisieren
    //   } catch (error: any) {
    //     this.error = error.message || 'Failed to update device'
    //   } finally {
    //     this.loading = false
    //   }
    // },
  },
})
