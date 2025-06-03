import type { Measurement } from '@/types/measurement.ts'

const timestep = 1000 * 60 * 5

function generateDataSet(
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
      id: Math.random().toString(),
      plantId: plantId,
      fieldName: fieldName,
      timestamp: new Date(time),
      value: Math.random() * 20,
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
  maxCount: number,
  pageIndex: number,
): Promise<Measurement[] | null> => {
  return generateDataSet(plantId, fieldName, startTime, endTime, maxCount, pageIndex)
}
