import type { Device, DeviceModel } from '@/types/device.ts'
import { apiClient } from '@/api/client.ts'

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    const response = await apiClient.get('/devices')
    const data = response.data

    const models = data.models as DeviceModel[]
    const getModelById = (id: string): DeviceModel | undefined => {
      return models.find(device => device.id === id)
    }

    const devices: Array<Record<string, any>> = data['devices']
    return devices.map(device => {
      const model = getModelById(device.modelId)
      if (!model) {
        console.error(`Model ${device.id} not found for device ${device.id}`)
      }
      return {
        ...device,
        model,
      } as Device
    })
  } catch (error: unknown) {
    console.error('Fehler beim Laden der Geräte:', error)
    throw error
  }
}
