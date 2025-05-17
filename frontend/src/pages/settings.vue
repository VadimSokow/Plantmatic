<script setup lang="ts">
  const soilMoistureData = ref([20, 25, 22, 30, 28, 35, 40, 38]);
  const timeLabels = ref(['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']);
</script>

<template>
  <h1>Settings</h1>
  <v-container max-height="200px" max-width="400px">
    <LineChart
      :chart-data="soilMoistureData"
      :chart-labels="timeLabels"
      chart-title="Bodenfeuchtigkeit (%)"
      x-axis-title="Uhrzeit"
      y-axis-title="Feuchtigkeit (%)"
    />
  </v-container>
</template>

<style scoped lang="sass">

</style>
