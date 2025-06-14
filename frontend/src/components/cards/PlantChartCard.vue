<template>
  <v-card>
    <v-col>
      <TimeRangeSelector @update:time-range="handleTimeRangeUpdate" />

      <GenericLineChart v-if="!isLoading && measurementValue && sensor" :data="measurementValue" :sensor="sensor" />
      <p v-else>measurement is undefined!</p>
    </v-col>
  </v-card>
  <LoadAndError
    :error="error"
    :is-loading="isLoading"
    @error-cleared="clearError()"
  />
</template>

<script setup lang="ts">
  import type { DeviceModelSensorConfig } from '@/types/device.ts'
  import type { MeasuredPlant } from '@/types/measurement.ts'
  import type { Plant } from '@/types/plant.ts'
  import { usePlantMeasurement } from '@/composition/measurements.ts'

  const selectedStartTime = ref<Date | null>(null)
  const selectedEndTime = ref<Date | null>(null)

  const timeSelection = computed<{ start: Date, end: Date }>(() => {
    return {
      start: selectedStartTime.value || new Date(new Date().setDate(new Date().getDate() - 1)),
      end: selectedEndTime.value || new Date(),
    }
  })

  const measurementValue = computed<MeasuredPlant | undefined>(() => {
    if (!measurement.value) {
      return undefined
    }
    return {
      ...measurement.value,
      values: measurement.value.values.filter(m => {
        const timestamp = new Date(m.timestamp)
        return timestamp >= timeSelection.value.start && timestamp <= timeSelection.value.end
      }),
    }
  })

  const handleTimeRangeUpdate = ({ start, end }: { start: string | null, end: string | null }) => {
    selectedStartTime.value = start ? new Date(start) : null
    selectedEndTime.value = end ? new Date(end) : null

    const time = timeSelection.value
    loadAllData(false, time.start, time.end).then(() => {
      console.log(measurement.value)
    })
  }

  const props = defineProps<{
    plant: Plant
    sensors: DeviceModelSensorConfig[]
    fieldName: string
  }>()

  const sensor = props.sensors.find(s => s.fieldName === props.fieldName)

  const { measurement, isLoading, error, loadAllData, clearError }
    = usePlantMeasurement(props.plant.id, props.fieldName)

  onMounted(() => {
    const time = timeSelection.value
    loadAllData(false, time.start, time.end).then(() => {
      console.log(measurement.value)
    })
  })
</script>
