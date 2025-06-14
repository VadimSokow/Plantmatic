import type {
  MeasuredPlant,
  MeasuredValue,
  Measurement,
} from '@/types/measurement.ts'
import { apiClient } from '@/api/client.ts'

type MeasurementResult = {
  measurements: Array<{
    deviceId: string
    plantId: string
    fieldName: string
    timestamp: string
    value: number
  }>
  pagination: {
    page: number
    pageSize: number
    isEnd: boolean
  }
}

type ServerMeasurement = {
  deviceId: string
  plantId: string
  fieldName: string
  timestamp: Date
  value: number
}

export const fetchMeasurements = async (
  plantId: string,
  fieldName: string,
  startTime: number,
  endTime: number,
  pageSize = 100,
): Promise<MeasuredPlant | null> => {
  console.log(`Fetching measurements for plant ${plantId}`)

  if (startTime >= endTime) {
    return null
  }

  const result: MeasuredPlant = {
    deviceId: 'unknown',
    plantId,
    fieldName,
    latest: undefined,
    values: [],
  }

  let pageCount = 0

  while (true) {
    // fetch data from API
    const response = await apiClient.get<MeasurementResult>('/measurements', {
      params: {
        plantId,
        fieldName,
        startTime,
        endTime,
        pageSize,
        page: pageCount,
      },
    })

    const data = response.data
    if (!data) {
      break
    }

    const measurements = data.measurements
    if (measurements.length === 0) {
      return result
    }
    result.deviceId = measurements[0].deviceId
    const values = measurements.map(({ timestamp, value }) => {
      return {
        timestamp: new Date(timestamp),
        value,
      } as MeasuredValue
    })
    result.values.push(...values)

    // check if we reached the end of the data
    if (data.pagination.isEnd) {
      break
    }
    // increment page count for next iteration
    pageCount++
  }
  return result
}

export const fetchNewestMeasurements = async (plantId: string, fieldNames: string[]): Promise<Record<string, Measurement | null> | null> => {
  const response = await apiClient.get<Record<string, ServerMeasurement>>('/measurements/newest', {
    params: {
      plantId,
      fieldNames,
    },
  })

  const data = response.data
  if (!data) {
    return null
  }

  const measurements: Record<string, Measurement> = {}
  for (const fieldName of fieldNames) {
    const measurement = data[fieldName]
    if (measurement) {
      measurements[fieldName] = {
        deviceId: measurement.deviceId,
        plantId: measurement.plantId,
        fieldName: measurement.fieldName,
        timestamp: measurement.timestamp,
        value: measurement.value,
      }
    }
  }
  if (Object.keys(measurements).length > 0) {
    return measurements
  }

  return null
}
