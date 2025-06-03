<template>
  <v-container>
    <v-row>
      <v-col v-for="combi in devicesWithPlants" :key="combi.device.id" cols="12" md="4">
        <DeviceCard :data="combi" />
      </v-col>
    </v-row>

    <LoadAndError
      :error="error"
      :is-loading="isLoading"
      @error-cleared="clearError()"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { useDevicesWithPlants } from '@/composition/devicesWithPlants.ts'

const {
  devicesWithPlants,
  isLoading,
  error,
  loadAllData,
  clearError,
} = useDevicesWithPlants()

const loaded = ref(false)

onMounted(() => {
  loadAllData()
})
</script>
