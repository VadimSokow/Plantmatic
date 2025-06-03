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
import type { Plant } from '@/types/plant.ts'
import { plantFieldWithDataToStrings } from '@/helper/plant.ts'
import type { DeviceModelSensorConfig } from '@/types/device.ts'

const props = defineProps<{
  plant: Plant,
  slotNumber: number | null,
  sensors: DeviceModelSensorConfig[]
}>()

const measuredValues = {
  temp_air: '23',
  hum_air: '43',
  light: '100',
  soil_hum: '60',
}

const fields = computed(() => {
  if (!props.slotNumber) {
    console.warn('No slot number provided.')
    return []
  }
  return plantFieldWithDataToStrings(
    props.sensors,
    props.slotNumber,
    measuredValues,
  )
})
</script>
