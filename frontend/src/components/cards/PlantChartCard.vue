<template>
  <v-card>
    <p> {{ plant.name }} </p>
    <!--    <p v-if="measurement"> {{ measurement.values }} </p>-->
    <!--    <p v-else> No measurement </p>-->
    <MeasuredLineChart v-if="!isLoading && measurement"
                       :title="'Lufttemperatur'"
                       :data="measurement.values"
                       :labels="'Temperaturen'"
    />
  </v-card>
  <LoadAndError
    :error="error"
    :is-loading="isLoading"
    @error-cleared="clearError()"
  />
</template>

<script setup lang="ts">
import type { Plant } from '@/types/plant.ts'
import type { DeviceModelSensorConfig } from '@/types/device.ts'
import { usePlantMeasurement } from '@/composition/measurements.ts'

const props = defineProps<{
  plant: Plant,
  sensors: DeviceModelSensorConfig[],
  fieldName: string,
}>()

const {
  measurement,
  isLoading,
  error,
  loadAllData,
  clearError,
} = usePlantMeasurement(props.plant.id, props.fieldName)

onMounted(() => {
  loadAllData()
})
</script>
