<template>
  <v-card v-if="device" class="device-card" :to="`/devices/${device.id}`" variant="outlined">
    <v-card-title class="text-h5">{{ device.name }}</v-card-title>
    <v-card-subtitle>Geräte ID: {{ device.id }}</v-card-subtitle>
    <v-card-text>
      <p>Standort: {{ device.location }}</p>
      <p>Slots: {{ plants.length }} / {{ device.model.slotCount }}</p>
      <div v-if="plants.length > 0" class="plants-section">
        <p class="text-subtitle-1">Pflanzen:</p>
        <ul class="plant-list">
          <li v-for="(plant, index) in plants" :key="index">
            {{ plant.name }}
          </li>
        </ul>
      </div>
      <div v-else class="plants-section">
        <p class="text-subtitle-1">Pflanzen:</p>
        <p>Keine Pflanzen zugewiesen.</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { DeviceWithPlants } from '@/types/device.ts'

  const props = defineProps<{ data: DeviceWithPlants }>()

  const { device, plants } = props.data
</script>

<style scoped>
.plant-list {
  padding-left: 20px;
}
</style>
