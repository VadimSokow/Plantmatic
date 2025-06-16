import type { Device, DeviceModel } from '@/types/device.ts'
import { apiClient } from '@/api/client.ts'
import { getPaged } from '@/api/helper.ts'

type ResponseData = {
  devices: Device[]
  models: DeviceModel[]
}

export const fetchDevices = async (): Promise<Device[] | undefined> => {
  return await getPaged<ResponseData, Device[]>('/devices', {},
    (store, _, data) => {
      const models = data.models as DeviceModel[]
      const getModelById = (id: string): DeviceModel | undefined => {
        return models.find(device => device.id === id)
      }

      const devices = (data['devices'] as Array<Record<string, any>>).map(device => {
        const model = getModelById(device.modelId)
        if (!model) {
          console.error(`Model ${device.id} not found for device ${device.id}`)
        }
        return {
          ...device,
          model,
        } as Device
      })
      return Array.of(...store, ...devices)
    },
    [])
}

export const fetchDevice = async (deviceId: string): Promise<Device | null> => {
  const result = await apiClient.get(`/devices/${deviceId}`)
  if (!result) {
    return null
  }
  const data = result.data as Record<string, any>
  const device = data.device as Record<string, any>
  device['modelId'] = undefined
  device['model'] = data.model
  return device as Device | null
}
