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

const timestep = 1000 * 60 * 5

function generateDataSet (
  plantId: string,
  fieldName: string,
  startTime: number,
  endTime: number,
  maxCount: number,
  pageIndex: number,
) {
  const measurements: Measurement[] = []
  let time = startTime
  while (time < endTime) {
    const measurement: Measurement = {
      deviceId: '1',
      plantId,
      fieldName,
      timestamp: new Date(time),
      value: Math.random() * 30,
    }
    measurements.push(measurement)

    time += timestep
  }
  return measurements
}

export const fetchMeasurements = async (
  plantId: string,
  fieldName: string,
  startTime: number,
  endTime: number,
  pageSize = 100,
): Promise<MeasuredPlant | null> => {
  if (startTime >= endTime) {
    return null
  }

  const result: MeasuredPlant = {
    deviceId: 'unknown',
    plantId,
    fieldName,
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

// export const fetchMeasurementsOld = async (
//   plantId: string,
//   fieldName: string,
//   startTime: number,
//   endTime: number,
//   maxCount: number,
//   pageIndex: number,
// ): Promise<Measurement[] | null> => {
//   // return generateDataSet(
//   //   plantId,
//   //   fieldName,
//   //   startTime,
//   //   endTime,
//   //   maxCount,
//   //   pageIndex,
//   // )
//   return null
// }
