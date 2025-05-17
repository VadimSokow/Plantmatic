<template>
  <v-card class="device-card" :to="`/devices/${deviceId}`" variant="outlined">
    <v-card-title class="text-h5">{{ name }}</v-card-title>
    <v-card-subtitle>Geräte ID: {{ deviceId }}</v-card-subtitle>
    <v-card-text>
      <p>Verbindung: {{ connection }}</p>
      <p>Standort: {{ location }}</p>
      <div v-if="plantNames.length > 0" class="plants-section">
        <p class="text-subtitle-1">Pflanzen:</p>
        <ul class="plant-list">
          <li v-for="(plantName, index) in plantNames" :key="index">
            {{ plantName }}
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
  import { usePlantStore } from '@/stores/plants.ts';

  const plantStore = usePlantStore();

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    connection: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    plantIds: {
      type: Array<string>,
      default: () => [],
    },
  });

  const plantNames = computed(() => {
    return props.plantIds.map(plantId => {
      const plant = plantStore.getPlantById(plantId);
      return plant ? plant.name : 'Unbekannte Pflanze';
    });
  });
</script>

<style scoped>
.device-card {
  margin-bottom: 16px;
  max-width: 400px;
}

.plant-list {
  padding-left: 24px;
  margin-left: 0;
}

.plant-list li {
  margin-bottom: 4px;
}

.plants-section {
  margin-top: 16px;
}
</style>
