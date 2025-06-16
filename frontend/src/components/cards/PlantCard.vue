<template>
  <v-card :to="`/plants/${plant.id}`" variant="outlined">
    <v-card-title>
      <v-icon icon="mdi-leaf" />
      {{ plant.name }}
    </v-card-title>
    <v-card-text>
      <p v-if="plant.type">Art: {{ plant.type.commonName }}</p>
      <div v-for="line in fields" :key="line">
        <p>{{ line }}</p>
      </div>
    </v-card-text>
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
  import { useLatestPlantMeasurement } from '@/composition/plantMeasurements.ts'
  import { plantFieldWithDataToStrings } from '@/helper/plant.ts'

  const props = defineProps<{
    plant: Plant
    slotNumber: number | null
    sensors: Record<string, DeviceModelSensorConfig>
  }>()

  const {
    latestMeasurements,
    isLoading,
    error,
    loadLatestMeasurements,
    clearError,
  } = useLatestPlantMeasurement(props.plant.id, Object.values(props.sensors).map(s => s.fieldName))

  const fields = computed(() => {
    if (!props.slotNumber) {
      return []
    }
    const values: Record<string, string> = {}
    for (const sensor of Object.values(props.sensors)) {
      const latest = latestMeasurements.value[sensor.fieldName]
      if (!latest) {
        values[sensor.fieldName] = 'N/A'
        continue
      }
      values[sensor.fieldName] = latest.value.toFixed(0)
    }
    return plantFieldWithDataToStrings(
      props.sensors,
      props.slotNumber,
      values,
    )
  })

  onMounted(() => {
    loadLatestMeasurements()
  })
</script>
