<template>
  <v-container>
    <v-col>
      <h2>{{ plant.name }}</h2>
      <p>Art: {{ plant.type.commonName }}</p>
      <div v-for="line in fields" :key="line">
        <p>{{ line }}</p>
      </div>
    </v-col>
  </v-container>
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
    loadLatestMeasurements,
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
