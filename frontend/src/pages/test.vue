<template>
  <v-container v-if="!isLoading && plant && measurement">
    <GenericLineChart :data="measurement" />
  </v-container>
  <p v-else>Loading...</p>

  <LoadAndError :error="error" :is-loading="isLoading" />
</template>

<script setup lang="ts">
  import { usePlantMeasurement } from '@/composition/measurements.ts'

  const {
    plant,
    measurement,
    isLoading,
    error,
    loadAllData,
    clearError,
  } = usePlantMeasurement('1', 'air_temp')

  onMounted(() => {
    loadAllData()
  })
</script>
