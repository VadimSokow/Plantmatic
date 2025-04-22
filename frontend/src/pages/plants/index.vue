<template>
  <v-container>
    <h1>Meine Pflanzen</h1>
    <p>Hier siehst du eine Übersicht deiner verbundenen Pflanzen.</p>
    <v-list>
      <v-list-item v-for="plant in plants" :key="plant.id" :to="`/plants/${plant.id}`">
        <v-list-item-title>{{ plant.name }}</v-list-item-title>
        <v-list-item-subtitle>Letzte Messung: {{ plant.lastMeasurement }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Importiere deinen Pinia Store, falls du ihn für die Pflanzenliste nutzt
// import { usePlantStore } from '@/stores/plant';

interface Plant {
  id: number;
  name: string;
  lastMeasurement: string;
}

const plants = ref<Plant[]>([]);
// const plantStore = usePlantStore();

onMounted(() => {
  // Hier würdest du deine Pflanzen vom Backend abrufen
  // plants.value = plantStore.fetchUserPlants(); // Wenn du Pinia nutzt
  // Beispiel-Daten:
  plants.value = [
    { id: 1, name: 'Tomate #1', lastMeasurement: 'Gestern' },
    { id: 2, name: 'Basilikum', lastMeasurement: 'Heute Morgen' },
  ];
});
</script>
