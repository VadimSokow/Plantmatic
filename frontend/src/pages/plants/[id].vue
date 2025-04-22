<template>
  <v-container>
    <h1>{{ plant.name }}</h1>
    <p>Details für Pflanze mit ID: {{ id }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref<string | string[]>(route.params.id);
const plant = ref<{ name: string; details: string }>({ name: '', details: '' });

onMounted(() => {
  // Hier würdest du die Details für die Pflanze mit der ID vom Backend abrufen
  console.log('Abrufen der Details für Pflanze:', id.value);
  // Beispiel-Daten:
  plant.value = { name: `Pflanze ${id.value}`, details: 'Weitere Informationen...' };
});
</script>
