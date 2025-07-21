<template>
  <v-container>
    <v-row>
      <v-col v-for="data in devicesWithPlants" :key="data.device.id" cols="12" md="4">
        <DeviceCard :data="data" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useDevicesWithPlants } from '@/composition/devicesWithPlants.ts'

  const {
    devicesWithPlants,
    loadAllData,
  } = useDevicesWithPlants()

  onMounted(() => {
    loadAllData()
  })
</script>
