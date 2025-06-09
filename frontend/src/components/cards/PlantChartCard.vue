<template>
  <v-card>
    <v-col>
      <p>{{ plant.name }}</p>
      <GenericLineChart v-if="measurement" :data="measurement" />
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
  import type { Plant } from '@/types/plant.ts'
  import { usePlantMeasurement } from '@/composition/measurements.ts'

  const props = defineProps<{
    plant: Plant
    sensors: DeviceModelSensorConfig[]
    fieldName: string
  }>()

  const { measurement, isLoading, error, loadAllData, clearError }
    = usePlantMeasurement(props.plant.id, props.fieldName)

  onMounted(() => {
    loadAllData()
  })
</script>
